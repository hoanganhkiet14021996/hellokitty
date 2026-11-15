import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { AppState, ISODate, Period } from './types'

export const toISO = (d: Date): ISODate => format(d, 'yyyy-MM-dd')
export const fromISO = (s: ISODate): Date => parseISO(s)
export const addDaysISO = (s: ISODate, n: number): ISODate => toISO(addDays(fromISO(s), n))
export const diffDays = (a: ISODate, b: ISODate): number =>
  differenceInCalendarDays(fromISO(a), fromISO(b))
export const todayISO = (): ISODate => toISO(new Date())

const MIN_CYCLE = 15
const MAX_CYCLE = 60
const HISTORY = 6

const avg = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length)

export function sortPeriods(periods: Period[]): Period[] {
  return [...periods].sort((a, b) => a.start.localeCompare(b.start))
}

/** Ngày kết thúc thực tế/ước tính của 1 kì (tính cả 2 đầu). */
export function periodEnd(p: Period, avgPeriod: number): ISODate {
  return p.end ?? addDaysISO(p.start, avgPeriod - 1)
}

/** Độ dài các chu kỳ đã hoàn thành (từ ngày bắt đầu kì này tới kì sau). */
export function cycleLengths(periods: Period[]): number[] {
  const s = sortPeriods(periods)
  const out: number[] = []
  for (let i = 1; i < s.length; i++) out.push(diffDays(s[i].start, s[i - 1].start))
  return out
}

export function avgCycleLength(state: AppState): number {
  const valid = cycleLengths(state.periods).filter((n) => n >= MIN_CYCLE && n <= MAX_CYCLE)
  return valid.length ? avg(valid.slice(-HISTORY)) : state.profile.avgCycle
}

export function avgPeriodLength(state: AppState): number {
  const valid = sortPeriods(state.periods)
    .filter((p) => p.end)
    .map((p) => diffDays(p.end!, p.start) + 1)
    .filter((n) => n >= 1 && n <= 12)
  return valid.length ? avg(valid.slice(-HISTORY)) : state.profile.avgPeriod
}

export type Phase = 'none' | 'period' | 'follicular' | 'fertile' | 'ovulation' | 'luteal'

export interface CycleSummary {
  phase: Phase
  avgCycle: number
  avgPeriod: number
  lastStart?: ISODate
  cycleDay?: number // ngày thứ mấy của chu kỳ
  periodDay?: number // ngày thứ mấy của kì (nếu đang có kinh)
  nextStart?: ISODate // ngày dự kiến kì tới (đã đẩy về hôm nay nếu trễ)
  daysUntilNext?: number
  lateDays: number
  ovulation?: ISODate
  fertileStart?: ISODate
  fertileEnd?: ISODate
  ongoingPeriod?: Period // kì đang diễn ra (chứa hôm nay)
}

export function summarize(state: AppState, today: ISODate = todayISO()): CycleSummary {
  const avgCycle = avgCycleLength(state)
  const avgPeriod = avgPeriodLength(state)
  const periods = sortPeriods(state.periods).filter((p) => p.start <= today)
  const last = periods[periods.length - 1]
  if (!last) return { phase: 'none', avgCycle, avgPeriod, lateDays: 0 }

  const lastStart = last.start
  const cycleDay = diffDays(today, lastStart) + 1
  const end = periodEnd(last, avgPeriod)
  const inPeriod = today <= end

  const rawNext = addDaysISO(lastStart, avgCycle)
  const lateDays = Math.max(0, diffDays(today, rawNext))
  const nextStart = lateDays > 0 ? today : rawNext
  const daysUntilNext = diffDays(nextStart, today)

  const ovulation = addDaysISO(rawNext, -state.profile.lutealLength)
  const fertileStart = addDaysISO(ovulation, -5)
  const fertileEnd = addDaysISO(ovulation, 1)

  let phase: Phase
  if (inPeriod) phase = 'period'
  else if (today === ovulation) phase = 'ovulation'
  else if (today >= fertileStart && today <= fertileEnd) phase = 'fertile'
  else if (today < fertileStart) phase = 'follicular'
  else phase = 'luteal'

  return {
    phase,
    avgCycle,
    avgPeriod,
    lastStart,
    cycleDay,
    periodDay: inPeriod ? cycleDay : undefined,
    nextStart,
    daysUntilNext,
    lateDays,
    ovulation,
    fertileStart,
    fertileEnd,
    ongoingPeriod: inPeriod ? last : undefined,
  }
}

export interface DayMark {
  period?: boolean // ngày có kinh đã ghi nhận
  predicted?: boolean // ngày kinh dự đoán
  fertile?: boolean
  ovulation?: boolean
}

/** Tạo bản đồ đánh dấu cho lịch: kì đã ghi + dự đoán N chu kỳ tới. */
export function buildDayMarks(
  state: AppState,
  today: ISODate = todayISO(),
  futureCycles = 4,
): Map<ISODate, DayMark> {
  const marks = new Map<ISODate, DayMark>()
  const get = (d: ISODate) => {
    let m = marks.get(d)
    if (!m) marks.set(d, (m = {}))
    return m
  }
  const sum = summarize(state, today)
  const { avgPeriod, avgCycle } = sum

  for (const p of state.periods) {
    const end = periodEnd(p, avgPeriod)
    for (let d = p.start; d <= end; d = addDaysISO(d, 1)) {
      // phần ước tính trong tương lai của kì đang diễn ra -> dự đoán
      if (!p.end && d > today) get(d).predicted = true
      else get(d).period = true
    }
  }

  if (!sum.nextStart || !sum.lastStart) return marks

  const luteal = state.profile.lutealLength
  const markFertile = (cycleNextStart: ISODate) => {
    const ov = addDaysISO(cycleNextStart, -luteal)
    for (let i = -5; i <= 1; i++) {
      const d = addDaysISO(ov, i)
      const m = get(d)
      if (m.period || m.predicted) continue
      m.fertile = true
      if (i === 0) m.ovulation = true
    }
  }

  // chu kỳ hiện tại
  markFertile(addDaysISO(sum.lastStart, avgCycle))

  for (let k = 0; k < futureCycles; k++) {
    const start = addDaysISO(sum.nextStart, k * avgCycle)
    for (let i = 0; i < avgPeriod; i++) {
      const d = addDaysISO(start, i)
      const m = get(d)
      if (!m.period) m.predicted = true
    }
    markFertile(addDaysISO(start, avgCycle))
  }
  return marks
}

/** Bật/tắt 1 ngày có kinh, tự gộp/kéo dài/cắt ngắn kì cho hợp lý. */
export function togglePeriodDay(state: AppState, date: ISODate): Period[] {
  const avgPeriod = avgPeriodLength(state)
  const periods = sortPeriods(state.periods)
  const idx = periods.findIndex((p) => date >= p.start && date <= periodEnd(p, avgPeriod))

  if (idx >= 0) {
    const p = periods[idx]
    const end = periodEnd(p, avgPeriod)
    if (p.start === end) return periods.filter((_, i) => i !== idx)
    if (date === p.start) {
      periods[idx] = { start: addDaysISO(date, 1), end }
    } else {
      periods[idx] = { start: p.start, end: addDaysISO(date, -1) }
    }
    return periods
  }

  // ngay sau 1 kì -> kéo dài
  const before = periods.findIndex((p) => addDaysISO(periodEnd(p, avgPeriod), 1) === date)
  // ngay trước 1 kì -> lùi ngày bắt đầu
  const after = periods.findIndex((p) => addDaysISO(p.start, -1) === date)

  if (before >= 0 && after >= 0) {
    const merged: Period = { start: periods[before].start, end: periodEnd(periods[after], avgPeriod) }
    return sortPeriods([...periods.filter((_, i) => i !== before && i !== after), merged])
  }
  if (before >= 0) {
    periods[before] = { start: periods[before].start, end: date }
    return periods
  }
  if (after >= 0) {
    periods[after] = { start: date, end: periodEnd(periods[after], avgPeriod) }
    return periods
  }
  return sortPeriods([...periods, { start: date, end: date }])
}

/** Bấm "Kì bắt đầu hôm nay". */
export function startPeriod(state: AppState, date: ISODate): Period[] {
  const periods = sortPeriods(state.periods).filter((p) => p.start !== date)
  return sortPeriods([...periods, { start: date }])
}

/** Bấm "Kì đã kết thúc" (ngày date là ngày cuối có kinh). */
export function endPeriod(state: AppState, date: ISODate): Period[] {
  const periods = sortPeriods(state.periods)
  const i = periods.map((p) => p.start <= date).lastIndexOf(true)
  if (i < 0) return periods
  periods[i] = { ...periods[i], end: date }
  return periods
}

export interface CycleRow {
  start: ISODate
  periodLength: number
  cycleLength?: number // undefined = chu kỳ hiện tại
}

export function cycleHistory(state: AppState): CycleRow[] {
  const avgPeriod = avgPeriodLength(state)
  const s = sortPeriods(state.periods)
  return s
    .map((p, i) => ({
      start: p.start,
      periodLength: diffDays(periodEnd(p, avgPeriod), p.start) + 1,
      cycleLength: s[i + 1] ? diffDays(s[i + 1].start, p.start) : undefined,
    }))
    .reverse()
}

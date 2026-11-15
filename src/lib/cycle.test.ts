import { describe, expect, it } from 'vitest'
import {
  avgCycleLength,
  avgPeriodLength,
  buildDayMarks,
  cycleHistory,
  endPeriod,
  startPeriod,
  summarize,
  togglePeriodDay,
} from './cycle'
import { EMPTY_STATE, type AppState, type Period } from './types'

const make = (periods: Period[], over: Partial<AppState['profile']> = {}): AppState => ({
  ...EMPTY_STATE,
  onboarded: true,
  profile: { ...EMPTY_STATE.profile, name: 'Test', ...over },
  periods,
})

describe('summarize', () => {
  it('không có dữ liệu -> phase none', () => {
    expect(summarize(make([]), '2026-11-15').phase).toBe('none')
  })

  it('1 kì: dùng mặc định 28/5', () => {
    const s = summarize(make([{ start: '2026-11-01' }]), '2026-11-15')
    expect(s.nextStart).toBe('2026-11-29')
    expect(s.daysUntilNext).toBe(14)
    expect(s.cycleDay).toBe(15)
    expect(s.ovulation).toBe('2026-11-15')
    expect(s.phase).toBe('ovulation')
  })

  it('đang trong kì', () => {
    const s = summarize(make([{ start: '2026-11-14' }]), '2026-11-15')
    expect(s.phase).toBe('period')
    expect(s.periodDay).toBe(2)
  })

  it('trễ kì', () => {
    const s = summarize(make([{ start: '2026-10-10', end: '2026-10-14' }]), '2026-11-15')
    expect(s.lateDays).toBe(8)
    expect(s.nextStart).toBe('2026-11-15')
    expect(s.daysUntilNext).toBe(0)
  })

  it('pha nang noãn và hoàng thể', () => {
    const st = make([{ start: '2026-11-01', end: '2026-11-05' }])
    expect(summarize(st, '2026-11-07').phase).toBe('follicular')
    expect(summarize(st, '2026-11-12').phase).toBe('fertile')
    expect(summarize(st, '2026-11-20').phase).toBe('luteal')
  })
})

describe('trung bình', () => {
  it('tính chu kỳ TB từ lịch sử, bỏ chu kỳ bất thường', () => {
    const st = make([
      { start: '2026-07-01', end: '2026-07-04' },
      { start: '2026-07-31', end: '2026-08-03' }, // 30
      { start: '2026-08-02', end: '2026-08-03' }, // 2 -> bỏ
      { start: '2026-08-30', end: '2026-09-03' }, // 28
    ])
    expect(avgCycleLength(st)).toBe(29)
    expect(avgPeriodLength(st)).toBe(4)
  })
})

describe('togglePeriodDay', () => {
  it('tạo kì mới 1 ngày', () => {
    expect(togglePeriodDay(make([]), '2026-11-10')).toEqual([{ start: '2026-11-10', end: '2026-11-10' }])
  })
  it('kéo dài kì khi chọn ngày ngay sau', () => {
    const st = make([{ start: '2026-11-01', end: '2026-11-03' }])
    expect(togglePeriodDay(st, '2026-11-04')).toEqual([{ start: '2026-11-01', end: '2026-11-04' }])
  })
  it('lùi ngày bắt đầu', () => {
    const st = make([{ start: '2026-11-02', end: '2026-11-03' }])
    expect(togglePeriodDay(st, '2026-11-01')).toEqual([{ start: '2026-11-01', end: '2026-11-03' }])
  })
  it('gộp 2 kì sát nhau', () => {
    const st = make([
      { start: '2026-11-01', end: '2026-11-02' },
      { start: '2026-11-04', end: '2026-11-05' },
    ])
    expect(togglePeriodDay(st, '2026-11-03')).toEqual([{ start: '2026-11-01', end: '2026-11-05' }])
  })
  it('bỏ ngày cuối / ngày đầu / xoá kì 1 ngày', () => {
    const st = make([{ start: '2026-11-01', end: '2026-11-03' }])
    expect(togglePeriodDay(st, '2026-11-03')).toEqual([{ start: '2026-11-01', end: '2026-11-02' }])
    expect(togglePeriodDay(st, '2026-11-01')).toEqual([{ start: '2026-11-02', end: '2026-11-03' }])
    expect(togglePeriodDay(make([{ start: '2026-11-01', end: '2026-11-01' }]), '2026-11-01')).toEqual([])
  })
})

describe('start/end period', () => {
  it('bắt đầu rồi kết thúc', () => {
    let st = make([])
    st = { ...st, periods: startPeriod(st, '2026-11-10') }
    expect(st.periods).toEqual([{ start: '2026-11-10' }])
    st = { ...st, periods: endPeriod(st, '2026-11-13') }
    expect(st.periods).toEqual([{ start: '2026-11-10', end: '2026-11-13' }])
  })
})

describe('buildDayMarks & history', () => {
  it('đánh dấu kì, dự đoán, rụng trứng', () => {
    const m = buildDayMarks(make([{ start: '2026-11-01', end: '2026-11-05' }]), '2026-11-08')
    expect(m.get('2026-11-03')?.period).toBe(true)
    expect(m.get('2026-11-15')?.ovulation).toBe(true)
    expect(m.get('2026-11-29')?.predicted).toBe(true)
    expect(m.get('2026-12-27')?.predicted).toBe(true)
  })
  it('lịch sử chu kỳ mới nhất trước', () => {
    const h = cycleHistory(make([
      { start: '2026-10-01', end: '2026-10-05' },
      { start: '2026-10-29', end: '2026-11-02' },
    ]))
    expect(h[0]).toEqual({ start: '2026-10-29', periodLength: 5, cycleLength: undefined })
    expect(h[1]).toEqual({ start: '2026-10-01', periodLength: 5, cycleLength: 28 })
  })
})

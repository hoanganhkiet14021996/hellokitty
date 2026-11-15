import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { addMonths, endOfMonth, getDay, startOfMonth } from 'date-fns'
import { useStore } from '../store/AppStore'
import { addDaysISO, buildDayMarks, summarize, toISO, todayISO, type DayMark } from '../lib/cycle'
import { fmtMonth, fmtShort } from '../lib/format'
import { ChevronIcon, StarIcon } from '../components/icons'
import type { ISODate } from '../lib/types'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export default function CalendarView({ onOpenDay }: { onOpenDay: (d: ISODate) => void }) {
  const { state } = useStore()
  const today = todayISO()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [dir, setDir] = useState(0)
  const marks = useMemo(() => buildDayMarks(state, today, 6), [state, today])
  const sum = useMemo(() => summarize(state, today), [state, today])

  const go = (n: number) => {
    setDir(n)
    setMonth((m) => addMonths(m, n))
  }

  // tạo lưới ngày, tuần bắt đầu thứ Hai
  const first = startOfMonth(month)
  const lead = (getDay(first) + 6) % 7
  const total = endOfMonth(month).getDate()
  const cells: (ISODate | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: total }, (_, i) => addDaysISO(toISO(first), i)),
  ]
  while (cells.length % 7) cells.push(null)

  const isCurrentMonth = month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear()

  return (
    <div className="space-y-4 pt-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-rose">Lịch của mình</h1>
        {!isCurrentMonth && (
          <button
            className="btn-soft px-4 py-1.5 text-sm"
            onClick={() => {
              setDir(0)
              setMonth(startOfMonth(new Date()))
            }}
          >
            Hôm nay
          </button>
        )}
      </header>

      <section className="card overflow-hidden p-4">
        <div className="mb-3 flex items-center justify-between">
          <button className="grid h-11 w-11 place-items-center rounded-full bg-blush text-rose" onClick={() => go(-1)} aria-label="Tháng trước">
            <ChevronIcon dir="left" size={20} />
          </button>
          <span className="text-lg font-bold">{fmtMonth(month)}</span>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-blush text-rose" onClick={() => go(1)} aria-label="Tháng sau">
            <ChevronIcon size={20} />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 text-center text-xs text-ink-soft">
          {WEEKDAYS.map((w) => (
            <span key={w} className={w === 'CN' ? 'text-pink' : ''}>
              {w}
            </span>
          ))}
        </div>

        <motion.div
          key={toISO(month)}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1)
            else if (info.offset.x > 60) go(-1)
          }}
          className="grid grid-cols-7 gap-y-1.5"
        >
          {cells.map((d, i) =>
            d ? (
              <DayCell key={d} date={d} mark={marks.get(d)} isToday={d === today} hasLog={!!state.logs[d]} onClick={() => onOpenDay(d)} />
            ) : (
              <span key={`e${i}`} />
            ),
          )}
        </motion.div>
      </section>

      <section className="card grid grid-cols-2 gap-x-3 gap-y-2.5 p-4 text-sm">
        <Legend swatch={<span className="h-5 w-5 rounded-full bg-pink" />} label="Ngày có kinh" />
        <Legend swatch={<span className="day-predicted h-5 w-5 rounded-full" />} label="Dự đoán kì tới" />
        <Legend swatch={<span className="h-5 w-5 rounded-full bg-lav-soft" />} label="Dễ thụ thai" />
        <Legend
          swatch={
            <span className="grid h-5 w-5 place-items-center rounded-full bg-lav text-white">
              <StarIcon size={12} />
            </span>
          }
          label="Rụng trứng"
        />
        <Legend swatch={<span className="h-5 w-5 rounded-full border-2 border-rose" />} label="Hôm nay" />
        <Legend
          swatch={
            <span className="grid h-5 w-5 place-items-end justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-rose" />
            </span>
          }
          label="Có nhật ký"
        />
      </section>

      {sum.nextStart && (
        <section className="card p-4 text-sm">
          <p className="font-bold text-rose">Sắp tới</p>
          <p className="mt-1">
            🩸 Kì tới dự kiến: <b>{fmtShort(sum.nextStart)} – {fmtShort(addDaysISO(sum.nextStart, sum.avgPeriod - 1))}</b>
          </p>
          {sum.fertileStart && sum.fertileEnd && sum.fertileEnd >= today && (
            <p className="mt-1">
              💜 Dễ thụ thai: <b>{fmtShort(sum.fertileStart)} – {fmtShort(sum.fertileEnd)}</b>
            </p>
          )}
          <p className="mt-2 text-xs text-ink-soft">Chạm vào một ngày để đánh dấu có kinh hoặc ghi nhật ký nha.</p>
        </section>
      )}
    </div>
  )
}

function DayCell({
  date,
  mark,
  isToday,
  hasLog,
  onClick,
}: {
  date: ISODate
  mark?: DayMark
  isToday: boolean
  hasLog: boolean
  onClick: () => void
}) {
  let cls = 'text-ink'
  if (mark?.period) cls = 'bg-pink text-white'
  else if (mark?.predicted) cls = 'day-predicted text-rose'
  else if (mark?.ovulation) cls = 'bg-lav text-white'
  else if (mark?.fertile) cls = 'bg-lav-soft text-[#8B5CF6]'

  return (
    <button onClick={onClick} className="flex flex-col items-center" aria-label={date}>
      <span
        className={`relative grid h-10 w-10 place-items-center rounded-full text-[15px] font-bold transition-transform active:scale-90 ${cls} ${
          isToday ? 'ring-2 ring-rose ring-offset-2' : ''
        }`}
      >
        {Number(date.slice(8))}
        {mark?.ovulation && !mark.period && (
          <span className="absolute -right-1 -top-1 text-[#8B5CF6]">
            <StarIcon size={13} />
          </span>
        )}
      </span>
      <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${hasLog ? 'bg-rose' : 'bg-transparent'}`} />
    </button>
  )
}

function Legend({ swatch, label }: { swatch: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2">
      {swatch}
      {label}
    </span>
  )
}

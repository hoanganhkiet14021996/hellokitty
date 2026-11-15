import { useMemo, type ReactNode } from 'react'
import { useStore } from '../store/AppStore'
import { diffDays, summarize, todayISO } from '../lib/cycle'
import { MOODS, PHASES, SYMPTOMS, pickTip } from '../lib/content'
import { fmtLong, fmtShort } from '../lib/format'
import Mascot from '../components/Mascot'
import CycleRing from '../components/CycleRing'
import InstallHint from '../components/InstallHint'
import { DropIcon, FlowerIcon, SparkleIcon, StarIcon } from '../components/icons'
import type { ISODate } from '../lib/types'

export default function Today({ onOpenDay }: { onOpenDay: (d: ISODate) => void }) {
  const { state, startPeriodOn, endPeriodOn } = useStore()
  const today = todayISO()
  const sum = useMemo(() => summarize(state, today), [state, today])
  const info = PHASES[sum.phase]
  const log = state.logs[today]
  const name = state.profile.name

  // nội dung trong vòng tròn
  let ring: { top: string; big: string; bottom: string; progress: number }
  if (sum.phase === 'none') {
    ring = { top: 'Bắt đầu', big: '🌸', bottom: 'đánh dấu kì đầu tiên', progress: 0 }
  } else if (sum.periodDay) {
    ring = { top: 'Ngày', big: String(sum.periodDay), bottom: 'của kì kinh', progress: sum.periodDay / sum.avgPeriod }
  } else if (sum.lateDays > 0) {
    ring = { top: 'Đã trễ', big: String(sum.lateDays), bottom: 'ngày', progress: 1 }
  } else if (sum.daysUntilNext === 0) {
    ring = { top: 'Hôm nay', big: '🩸', bottom: 'có thể tới kì', progress: 1 }
  } else {
    ring = {
      top: 'Còn',
      big: String(sum.daysUntilNext),
      bottom: 'ngày nữa tới kì',
      progress: (sum.cycleDay ?? 0) / sum.avgCycle,
    }
  }

  // banner nhắc
  let banner: string | null = null
  if (sum.lateDays > 0)
    banner = `Kì đến trễ ${sum.lateDays} ngày rồi. Đừng lo quá nha, căng thẳng hay thay đổi sinh hoạt cũng có thể làm trễ đó.`
  else if (sum.phase !== 'period' && sum.daysUntilNext !== undefined && sum.daysUntilNext <= 3)
    banner =
      sum.daysUntilNext === 0
        ? 'Hôm nay có thể tới kì đó, nhớ mang theo băng vệ sinh nha! 🌸'
        : `Còn ${sum.daysUntilNext} ngày nữa là tới kì rồi, chuẩn bị sẵn đồ dùng nha! 🌸`

  const inPeriod = !!sum.ongoingPeriod
  const daySeed = sum.cycleDay ?? diffDays(today, '2026-01-01')

  return (
    <div className="space-y-4 pt-2">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm text-ink-soft">{fmtLong(today)}</p>
          <h1 className="text-2xl font-bold text-rose">Chào {name || 'bạn'} 🌸</h1>
        </div>
        {sum.cycleDay && (
          <span className="rounded-full bg-white px-3 py-1 text-xs text-ink-soft shadow-sm">
            Ngày {sum.cycleDay} chu kỳ
          </span>
        )}
      </header>

      <InstallHint />

      {banner && (
        <div className="card animate-pop flex items-start gap-3 border-2 border-blush p-4">
          <span className="mt-0.5 text-pink">
            <SparkleIcon size={22} />
          </span>
          <p className="text-sm leading-relaxed">{banner}</p>
        </div>
      )}

      <section className="card flex flex-col items-center px-4 pb-6 pt-4" style={{ background: `linear-gradient(180deg, ${info.soft}, #fff 70%)` }}>
        <Mascot mood={info.mood} size={110} float className="-mb-3" />
        <CycleRing progress={ring.progress} color={info.color}>
          <span className="text-ink-soft">{ring.top}</span>
          <span className="text-6xl font-bold leading-tight" style={{ color: info.color }}>
            {ring.big}
          </span>
          <span className="text-ink-soft">{ring.bottom}</span>
        </CycleRing>
        <span className="mt-3 rounded-full px-4 py-1.5 text-sm font-bold text-white" style={{ background: info.color }}>
          {info.label}
        </span>

        <button
          className="btn-primary mt-5 w-full py-4 text-lg"
          onClick={() => (inPeriod ? endPeriodOn(today) : startPeriodOn(today))}
        >
          {inPeriod ? 'Kì đã kết thúc hôm nay ✨' : 'Kì bắt đầu hôm nay 🩸'}
        </button>
        <p className="mt-2 text-xs text-ink-soft">Nhầm ngày? Vào tab Lịch để chỉnh lại nha.</p>
      </section>

      {sum.nextStart && (
        <section className="grid grid-cols-3 gap-3">
          <MiniCard icon={<DropIcon size={20} />} color="#E85A8A" label="Kì tới" value={fmtShort(sum.nextStart)} />
          <MiniCard
            icon={<StarIcon size={20} />}
            color="#8B5CF6"
            label="Rụng trứng"
            value={sum.ovulation && sum.ovulation >= today ? fmtShort(sum.ovulation) : '—'}
          />
          <MiniCard icon={<FlowerIcon size={20} />} color="#5FC79A" label="Chu kỳ TB" value={`${sum.avgCycle} ngày`} />
        </section>
      )}

      <section className="card flex items-center gap-3 p-4">
        <Mascot mood="happy" size={52} />
        <div>
          <p className="text-xs font-bold text-pink">Mèo nhắn nhỏ</p>
          <p className="text-sm leading-relaxed">{pickTip(info.tips, daySeed)}</p>
        </div>
      </section>

      <button className="card flex w-full items-center justify-between p-4 text-left active:scale-[0.98] transition-transform" onClick={() => onOpenDay(today)}>
        <div>
          <p className="font-bold">Hôm nay bạn thấy thế nào?</p>
          <p className="mt-1 text-sm text-ink-soft">
            {log
              ? [
                  ...log.moods.map((id) => MOODS.find((m) => m.id === id)?.emoji),
                  ...log.symptoms.map((id) => SYMPTOMS.find((s) => s.id === id)?.emoji),
                ].join(' ') || 'Đã ghi chú 📝'
              : 'Ghi lại tâm trạng & triệu chứng'}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-xl text-rose">+</span>
      </button>

      <p className="px-2 text-center text-[11px] leading-relaxed text-ink-soft">
        Dự đoán chỉ mang tính tham khảo, không dùng để tránh thai hay thay thế tư vấn của bác sĩ.
      </p>
    </div>
  )
}

function MiniCard({ icon, color, label, value }: { icon: ReactNode; color: string; label: string; value: string }) {
  return (
    <div className="card flex flex-col items-center gap-1 p-3 text-center">
      <span style={{ color }}>{icon}</span>
      <span className="text-[11px] text-ink-soft">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}

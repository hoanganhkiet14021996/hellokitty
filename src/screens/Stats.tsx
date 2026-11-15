import { useMemo, useState } from 'react'
import { useStore } from '../store/AppStore'
import { avgCycleLength, avgPeriodLength, cycleHistory } from '../lib/cycle'
import { SYMPTOMS, MOODS } from '../lib/content'
import { fmtShort } from '../lib/format'
import Mascot from '../components/Mascot'

export default function Stats() {
  const { state } = useStore()
  const history = useMemo(() => cycleHistory(state), [state])
  const avgCycle = avgCycleLength(state)
  const avgPeriod = avgPeriodLength(state)
  const completed = history.filter((h) => h.cycleLength).slice(0, 8).reverse()

  const topCounts = (key: 'symptoms' | 'moods', dict: { id: string; emoji: string; label: string }[]) => {
    const count = new Map<string, number>()
    for (const l of Object.values(state.logs)) for (const id of l[key]) count.set(id, (count.get(id) ?? 0) + 1)
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, n]) => ({ ...dict.find((d) => d.id === id)!, n }))
      .filter((x) => x.label)
  }
  const topSymptoms = topCounts('symptoms', SYMPTOMS)
  const topMoods = topCounts('moods', MOODS)

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-2xl font-bold text-rose">Thống kê</h1>

      <section className="grid grid-cols-3 gap-3">
        <Tile label="Chu kỳ TB" value={avgCycle} unit="ngày" />
        <Tile label="Kì kinh TB" value={avgPeriod} unit="ngày" />
        <Tile label="Đã ghi" value={history.length} unit="kì" />
      </section>

      <section className="card p-4">
        <h2 className="font-bold">Độ dài các chu kỳ gần đây</h2>
        <p className="mt-0.5 text-xs text-ink-soft">Chạm vào cột để xem số ngày · đường chấm = trung bình {avgCycle} ngày</p>
        {completed.length >= 1 ? (
          <BarChart rows={completed.map((r) => ({ label: fmtShort(r.start), value: r.cycleLength! }))} avg={avgCycle} />
        ) : (
          <Empty text="Ghi ít nhất 2 kì để Mèo vẽ biểu đồ cho bạn nha." />
        )}
      </section>

      {(topSymptoms.length > 0 || topMoods.length > 0) && (
        <section className="card p-4">
          <h2 className="font-bold">Hay gặp nhất</h2>
          <div className="mt-3 space-y-2">
            {[...topSymptoms, ...topMoods].map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className="w-6 text-center text-lg">{s.emoji}</span>
                <span className="w-24 shrink-0">{s.label}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#FFF0F5]">
                  <span
                    className="block h-full rounded-full bg-pink"
                    style={{ width: `${(s.n / Math.max(...[...topSymptoms, ...topMoods].map((x) => x.n))) * 100}%` }}
                  />
                </span>
                <span className="w-8 text-right text-ink-soft">{s.n}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card p-4">
        <h2 className="font-bold">Lịch sử các kì</h2>
        {history.length ? (
          <ul className="mt-2 divide-y divide-blush">
            {history.map((h) => (
              <li key={h.start} className="flex items-center justify-between py-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink" />
                  Bắt đầu {fmtShort(h.start)}
                </span>
                <span className="text-ink-soft">
                  {h.periodLength} ngày kinh · {h.cycleLength ? `chu kỳ ${h.cycleLength} ngày` : 'đang diễn ra'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty text="Chưa có kì nào được ghi lại." />
        )}
      </section>
    </div>
  )
}

function Tile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="card flex flex-col items-center p-3 text-center">
      <span className="text-[11px] text-ink-soft">{label}</span>
      <span className="text-3xl font-bold text-rose">{value}</span>
      <span className="text-xs text-ink-soft">{unit}</span>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center py-4 text-center text-sm text-ink-soft">
      <Mascot mood="sleepy" size={80} />
      <p className="mt-2">{text}</p>
    </div>
  )
}

/** Biểu đồ cột 1 chuỗi: chạm vào cột để xem số ngày, đường chấm = trung bình. */
function BarChart({ rows, avg }: { rows: { label: string; value: number }[]; avg: number }) {
  const [active, setActive] = useState<number | null>(rows.length - 1)
  const W = 320
  const H = 170
  const top = 22
  const bottom = 26
  const left = 8
  const max = Math.max(...rows.map((r) => r.value), avg) + 4
  const min = Math.max(0, Math.min(...rows.map((r) => r.value), avg) - 8)
  const y = (v: number) => top + (1 - (v - min) / (max - min)) * (H - top - bottom)
  const slot = (W - left * 2) / rows.length
  const bw = Math.min(30, slot - 8)
  const base = H - bottom

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="Biểu đồ độ dài chu kỳ">
      <line x1={left} x2={W - left} y1={base} y2={base} stroke="#F3D9E3" strokeWidth="1" />
      <line x1={left} x2={W - left} y1={y(avg)} y2={y(avg)} stroke="#9B7A8A" strokeWidth="1.2" strokeDasharray="4 4" />
      {rows.map((r, i) => {
        const cx = left + slot * i + slot / 2
        const yy = y(r.value)
        const isActive = active === i
        return (
          <g key={i} onClick={() => setActive(i)} style={{ cursor: 'pointer' }}>
            {/* vùng chạm rộng hơn cột */}
            <rect x={cx - slot / 2} y={top - 10} width={slot} height={H - top} fill="transparent" />
            <path
              d={`M${cx - bw / 2} ${base} V${yy + 4} Q${cx - bw / 2} ${yy} ${cx - bw / 2 + 4} ${yy} H${cx + bw / 2 - 4} Q${cx + bw / 2} ${yy} ${cx + bw / 2} ${yy + 4} V${base} Z`}
              fill={isActive ? '#E85A8A' : '#FFB3C9'}
              style={{ transition: 'fill .2s' }}
            />
            {isActive && (
              <text x={cx} y={yy - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#5A3A4A">
                {r.value}
              </text>
            )}
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="#9B7A8A">
              {r.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

import { useMemo, type ReactNode } from 'react'
import { Drawer } from 'vaul'
import { useStore } from '../store/AppStore'
import { buildDayMarks, todayISO } from '../lib/cycle'
import { FLOWS, MOODS, SYMPTOMS } from '../lib/content'
import { fmtLong } from '../lib/format'
import { DropIcon } from './icons'
import type { DayLog, Flow, ISODate } from '../lib/types'

const EMPTY: DayLog = { moods: [], symptoms: [] }

export default function DaySheet({ date, onClose }: { date: ISODate | null; onClose: () => void }) {
  return (
    <Drawer.Root open={!!date} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-30 bg-[#5A3A4A]/30" />
        <Drawer.Content className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto flex max-h-[90dvh] max-w-md flex-col rounded-t-[32px] bg-bg outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-blush" />
          {date && <SheetBody date={date} onClose={onClose} />}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function SheetBody({ date, onClose }: { date: ISODate; onClose: () => void }) {
  const { state, togglePeriod, setLog } = useStore()
  const today = todayISO()
  const isFuture = date > today
  const mark = useMemo(() => buildDayMarks(state, today, 6).get(date), [state, today, date])
  const log = state.logs[date] ?? EMPTY
  const isPeriod = !!mark?.period

  const update = (patch: Partial<DayLog>) => setLog(date, { ...log, ...patch })
  const toggleIn = (key: 'moods' | 'symptoms', id: string) =>
    update({ [key]: log[key].includes(id) ? log[key].filter((x) => x !== id) : [...log[key], id] })

  let status = ''
  if (mark?.period) status = '🩸 Ngày có kinh'
  else if (mark?.predicted) status = '🌸 Dự đoán có kinh'
  else if (mark?.ovulation) status = '⭐ Ngày rụng trứng dự đoán'
  else if (mark?.fertile) status = '💜 Ngày dễ thụ thai'

  return (
    <div className="overflow-y-auto px-5 pb-4 pt-3">
      <Drawer.Title className="text-xl font-bold text-rose">{fmtLong(date)}</Drawer.Title>
      <Drawer.Description className="mt-0.5 text-sm text-ink-soft">{status || 'Ngày bình thường'}</Drawer.Description>

      {isFuture ? (
        <div className="card mt-5 p-5 text-center text-ink-soft">Ngày này chưa tới, quay lại ghi sau nha 🌷</div>
      ) : (
        <>
          <button
            onClick={() => togglePeriod(date)}
            className={`card mt-5 flex w-full items-center justify-between p-4 transition-colors ${isPeriod ? '!bg-pink text-white' : ''}`}
          >
            <span className="flex items-center gap-2 font-bold">
              <DropIcon size={22} className={isPeriod ? 'text-white' : 'text-pink'} />
              Có kinh ngày này
            </span>
            <span className={`relative h-7 w-12 rounded-full transition-colors ${isPeriod ? 'bg-white/40' : 'bg-blush'}`}>
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${isPeriod ? 'left-6' : 'left-1'}`}
              />
            </span>
          </button>

          {isPeriod && (
            <Section title="Lượng kinh">
              <div className="grid grid-cols-3 gap-2">
                {FLOWS.map((f) => {
                  const active = log.flow === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => update({ flow: active ? undefined : (f.id as Flow) })}
                      className={`card flex flex-col items-center gap-1 border-2 py-3 transition-all ${active ? 'border-pink !bg-[#FFF0F5]' : 'border-transparent'}`}
                    >
                      <span className="flex text-pink">
                        {Array.from({ length: f.drops }, (_, i) => (
                          <DropIcon key={i} size={18} />
                        ))}
                      </span>
                      <span className="text-sm">{f.label}</span>
                    </button>
                  )
                })}
              </div>
            </Section>
          )}

          <Section title="Tâm trạng">
            <Chips items={MOODS} selected={log.moods} onToggle={(id) => toggleIn('moods', id)} />
          </Section>

          <Section title="Triệu chứng">
            <Chips items={SYMPTOMS} selected={log.symptoms} onToggle={(id) => toggleIn('symptoms', id)} />
          </Section>

          <Section title="Ghi chú">
            <textarea
              value={log.note ?? ''}
              onChange={(e) => update({ note: e.target.value })}
              rows={3}
              placeholder="Hôm nay có gì muốn nhớ không nè..."
              className="card w-full resize-none p-4 outline-none focus:ring-2 focus:ring-pink"
            />
          </Section>
        </>
      )}

      <button className="btn-primary mt-5 w-full py-3.5 text-lg" onClick={onClose}>
        Xong rồi 💗
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-sm font-bold text-ink-soft">{title}</h3>
      {children}
    </section>
  )
}

function Chips({
  items,
  selected,
  onToggle,
}: {
  items: { id: string; emoji: string; label: string }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const active = selected.includes(it.id)
        return (
          <button
            key={it.id}
            onClick={() => onToggle(it.id)}
            className={`flex min-h-[44px] items-center gap-1.5 rounded-full border-2 px-3.5 text-sm transition-all active:scale-95 ${
              active ? 'border-pink bg-pink text-white' : 'border-blush bg-white'
            }`}
          >
            <span className="text-base">{it.emoji}</span>
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

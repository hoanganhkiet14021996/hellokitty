import type { ComponentType } from 'react'
import { CalendarIcon, CatHeadIcon, ChartIcon, PawIcon } from './icons'

export type Tab = 'today' | 'calendar' | 'stats' | 'settings'

const TABS: { id: Tab; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { id: 'today', label: 'Hôm nay', Icon: CatHeadIcon },
  { id: 'calendar', label: 'Lịch', Icon: CalendarIcon },
  { id: 'stats', label: 'Thống kê', Icon: ChartIcon },
  { id: 'settings', label: 'Cài đặt', Icon: PawIcon },
]

export default function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md px-3">
      <div className="card flex items-stretch justify-around rounded-[30px] px-2 py-1.5">
        {TABS.map(({ id, label, Icon }) => {
          const active = id === tab
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex min-h-[54px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[22px] text-[11px] transition-colors ${
                active ? 'bg-blush text-rose' : 'text-ink-soft'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className={active ? 'animate-pop' : ''}>
                <Icon size={24} />
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

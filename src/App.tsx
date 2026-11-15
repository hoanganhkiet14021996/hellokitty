import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from './store/AppStore'
import Onboarding from './screens/Onboarding'
import Today from './screens/Today'
import CalendarView from './screens/CalendarView'
import Stats from './screens/Stats'
import Settings from './screens/Settings'
import DaySheet from './components/DaySheet'
import TabBar, { type Tab } from './components/TabBar'
import Mascot from './components/Mascot'
import type { ISODate } from './lib/types'

export default function App() {
  const { ready, state } = useStore()
  const [tab, setTab] = useState<Tab>('today')
  const [sheetDate, setSheetDate] = useState<ISODate | null>(null)

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Mascot mood="happy" size={120} float />
      </div>
    )
  }

  if (!state.onboarded) return <Onboarding />

  return (
    <div className="mx-auto min-h-dvh max-w-md">
      <main className="pt-safe px-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'today' && <Today onOpenDay={setSheetDate} />}
            {tab === 'calendar' && <CalendarView onOpenDay={setSheetDate} />}
            {tab === 'stats' && <Stats />}
            {tab === 'settings' && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>
      <TabBar tab={tab} onChange={setTab} />
      <DaySheet date={sheetDate} onClose={() => setSheetDate(null)} />
    </div>
  )
}

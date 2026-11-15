import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { endPeriod, startPeriod, togglePeriodDay } from '../lib/cycle'
import { clearState, loadState, requestPersist, saveState } from '../lib/storage'
import { EMPTY_STATE, type AppState, type DayLog, type ISODate, type Period, type Profile } from '../lib/types'

interface Store {
  state: AppState
  ready: boolean
  completeOnboarding: (profile: Profile, lastStart?: ISODate) => void
  updateProfile: (p: Partial<Profile>) => void
  togglePeriod: (date: ISODate) => void
  startPeriodOn: (date: ISODate) => void
  endPeriodOn: (date: ISODate) => void
  setLog: (date: ISODate, log: DayLog) => void
  replaceAll: (s: AppState) => void
  resetAll: () => Promise<void>
}

const Ctx = createContext<Store | null>(null)

const isEmptyLog = (l: DayLog) => !l.flow && !l.moods.length && !l.symptoms.length && !l.note?.trim()

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE)
  const [ready, setReady] = useState(false)
  const loaded = useRef(false)

  useEffect(() => {
    requestPersist()
    loadState().then((s) => {
      setState(s)
      loaded.current = true
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (loaded.current) saveState(state)
  }, [state])

  const setPeriods = useCallback((fn: (s: AppState) => Period[]) => {
    setState((s) => ({ ...s, periods: fn(s) }))
  }, [])

  const store = useMemo<Store>(
    () => ({
      state,
      ready,
      completeOnboarding: (profile, lastStart) =>
        setState((s) => ({
          ...s,
          onboarded: true,
          profile,
          periods: lastStart ? [{ start: lastStart }] : s.periods,
        })),
      updateProfile: (p) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })),
      togglePeriod: (date) => setPeriods((s) => togglePeriodDay(s, date)),
      startPeriodOn: (date) => setPeriods((s) => startPeriod(s, date)),
      endPeriodOn: (date) => setPeriods((s) => endPeriod(s, date)),
      setLog: (date, log) =>
        setState((s) => {
          const logs = { ...s.logs }
          if (isEmptyLog(log)) delete logs[date]
          else logs[date] = log
          return { ...s, logs }
        }),
      replaceAll: (s) => setState(s),
      resetAll: async () => {
        await clearState()
        setState(EMPTY_STATE)
      },
    }),
    [state, ready, setPeriods],
  )

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore phải nằm trong AppStoreProvider')
  return s
}

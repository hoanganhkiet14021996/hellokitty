export type ISODate = string // 'YYYY-MM-DD'

export interface Profile {
  name: string
  avgCycle: number // độ dài chu kỳ mặc định (ngày)
  avgPeriod: number // số ngày hành kinh mặc định
  lutealLength: number // pha hoàng thể, thường 14
}

export interface Period {
  start: ISODate
  end?: ISODate // không có = đang diễn ra / tự tính theo avgPeriod
}

export type Flow = 'light' | 'medium' | 'heavy'

export interface DayLog {
  flow?: Flow
  moods: string[]
  symptoms: string[]
  note?: string
}

export interface AppState {
  version: 1
  onboarded: boolean
  profile: Profile
  periods: Period[]
  logs: Record<ISODate, DayLog>
}

export const DEFAULT_PROFILE: Profile = {
  name: '',
  avgCycle: 28,
  avgPeriod: 5,
  lutealLength: 14,
}

export const EMPTY_STATE: AppState = {
  version: 1,
  onboarded: false,
  profile: DEFAULT_PROFILE,
  periods: [],
  logs: {},
}

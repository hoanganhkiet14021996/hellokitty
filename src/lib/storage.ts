import { get, set, del } from 'idb-keyval'
import { EMPTY_STATE, type AppState } from './types'

const KEY = 'meo-sakura-state'

function safeLocalGet(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** IndexedDB trên một số trình duyệt iOS (Chrome, Zalo...) có thể treo không trả lời -> giới hạn thời gian chờ. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([p, new Promise<undefined>((r) => setTimeout(() => r(undefined), ms))])
}

let idbBroken = false

/** Đọc dữ liệu: ưu tiên IndexedDB, dự phòng localStorage. */
export async function loadState(): Promise<AppState> {
  try {
    const fromIdb = await withTimeout(get<AppState>(KEY), 1500)
    if (fromIdb) return normalize(fromIdb)
  } catch {
    idbBroken = true
  }
  const raw = safeLocalGet()
  if (raw) {
    try {
      return normalize(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }
  return EMPTY_STATE
}

/** Ghi vào cả IndexedDB và localStorage để chắc chắn không mất. */
export async function saveState(state: AppState): Promise<void> {
  const json = JSON.stringify(state)
  try {
    localStorage.setItem(KEY, json)
  } catch {
    /* ignore */
  }
  if (idbBroken) return
  try {
    await withTimeout(set(KEY, state), 1500)
  } catch {
    idbBroken = true
  }
}

export async function clearState(): Promise<void> {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  try {
    await del(KEY)
  } catch {
    /* ignore */
  }
}

/** Xin trình duyệt giữ dữ liệu lâu dài (iOS cần gọi mỗi lần mở). */
export async function requestPersist(): Promise<void> {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist()
    }
  } catch {
    /* ignore */
  }
}

/** Kiểm tra + chuẩn hoá dữ liệu (dùng cho cả file khôi phục). */
export function normalize(input: unknown): AppState {
  if (!input || typeof input !== 'object') throw new Error('Dữ liệu không hợp lệ')
  const o = input as Partial<AppState>
  const isDate = (s: unknown) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
  if (!Array.isArray(o.periods)) throw new Error('Thiếu danh sách kì kinh')
  const periods = o.periods
    .filter((p) => p && isDate(p.start))
    .map((p) => (isDate(p.end) ? { start: p.start, end: p.end } : { start: p.start }))
  const logs: AppState['logs'] = {}
  for (const [k, v] of Object.entries(o.logs ?? {})) {
    if (!isDate(k) || !v) continue
    logs[k] = {
      flow: v.flow,
      moods: Array.isArray(v.moods) ? v.moods : [],
      symptoms: Array.isArray(v.symptoms) ? v.symptoms : [],
      note: typeof v.note === 'string' ? v.note : undefined,
    }
  }
  return {
    version: 1,
    onboarded: o.onboarded ?? periods.length > 0,
    profile: { ...EMPTY_STATE.profile, ...(o.profile ?? {}) },
    periods,
    logs,
  }
}

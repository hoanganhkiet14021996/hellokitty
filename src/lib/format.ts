import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { fromISO } from './cycle'
import type { ISODate } from './types'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "Chủ nhật, 15 tháng 11" */
export const fmtLong = (d: ISODate) => cap(format(fromISO(d), "EEEE, d 'tháng' M", { locale: vi }))
/** "15/11" */
export const fmtShort = (d: ISODate) => format(fromISO(d), 'd/M')
/** "Tháng 11, 2026" */
export const fmtMonth = (d: Date) => `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`

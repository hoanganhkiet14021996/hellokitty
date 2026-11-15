import { addDaysISO } from './cycle'
import type { ISODate } from './types'

const compact = (d: ISODate) => d.replaceAll('-', '')

/** Tạo file .ics các kì dự đoán, kèm nhắc trước 1 ngày lúc 9h sáng. */
export function buildIcs(starts: ISODate[], periodLength: number): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const events = starts.map((s, i) =>
    [
      'BEGIN:VEVENT',
      `UID:meo-sakura-${compact(s)}-${i}@local`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(s)}`,
      `DTEND;VALUE=DATE:${compact(addDaysISO(s, periodLength))}`,
      'SUMMARY:🌸 Kì kinh dự kiến',
      'DESCRIPTION:Dự đoán từ app Hello Kitty. Nhớ mang theo đồ dùng cần thiết nha!',
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Ngày mai có thể tới kì rồi đó 🌸',
      'TRIGGER:-PT15H',
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n'),
  )
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hello Kitty Cycle//VI',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}

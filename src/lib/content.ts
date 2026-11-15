import type { MascotMood } from '../components/Mascot'
import type { Phase } from './cycle'

export interface PhaseInfo {
  label: string
  color: string // màu chủ đạo
  soft: string // màu nền nhạt
  mood: MascotMood
  tips: string[]
}

export const PHASES: Record<Phase, PhaseInfo> = {
  none: {
    label: 'Chưa có dữ liệu',
    color: '#FF8FB1',
    soft: '#FFF0F5',
    mood: 'wave',
    tips: ['Đánh dấu ngày bắt đầu kì gần nhất để Mèo dự đoán giúp bạn nha!'],
  },
  period: {
    label: 'Đang trong kì',
    color: '#E85A8A',
    soft: '#FFE3EC',
    mood: 'period',
    tips: [
      'Uống nước ấm và chườm bụng sẽ giúp dễ chịu hơn đó.',
      'Nghỉ ngơi nhiều hơn một chút cũng không sao đâu nha.',
      'Ăn thêm rau xanh, thịt đỏ để bổ sung sắt nhé.',
      'Thay băng vệ sinh 4–6 tiếng một lần nha.',
    ],
  },
  follicular: {
    label: 'Giai đoạn tràn năng lượng',
    color: '#5FC79A',
    soft: '#E3F8EE',
    mood: 'happy',
    tips: [
      'Năng lượng đang lên, rất hợp để tập thể dục nè!',
      'Da thường đẹp hơn vào giai đoạn này đó.',
      'Thử bắt đầu một việc mới đi, bạn làm được mà!',
    ],
  },
  fertile: {
    label: 'Cửa sổ thụ thai',
    color: '#A07BE8',
    soft: '#EFE6FF',
    mood: 'love',
    tips: [
      'Đây là những ngày dễ thụ thai nhất trong chu kỳ.',
      'Có thể thấy dịch tiết trong và dai hơn, là bình thường nha.',
    ],
  },
  ovulation: {
    label: 'Ngày rụng trứng (dự đoán)',
    color: '#8B5CF6',
    soft: '#EFE6FF',
    mood: 'love',
    tips: ['Hôm nay là ngày rụng trứng dự đoán, khả năng thụ thai cao nhất.'],
  },
  luteal: {
    label: 'Giai đoạn trước kì',
    color: '#F2A65A',
    soft: '#FFF1E2',
    mood: 'sleepy',
    tips: [
      'Có thể dễ mệt, dễ cáu hoặc thèm ngọt, thương bản thân nhiều hơn nha.',
      'Ngủ đủ giấc và hạn chế đồ mặn giúp bớt đầy hơi đó.',
      'Chuẩn bị sẵn băng vệ sinh trong túi cho chắc nhé.',
    ],
  },
}

export const MOODS = [
  { id: 'vui', emoji: '😊', label: 'Vui' },
  { id: 'binhthuong', emoji: '😌', label: 'Bình thường' },
  { id: 'buon', emoji: '😢', label: 'Buồn' },
  { id: 'cau', emoji: '😤', label: 'Cáu' },
  { id: 'met', emoji: '😴', label: 'Mệt' },
  { id: 'yeu', emoji: '🥰', label: 'Yêu đời' },
  { id: 'lo', emoji: '😰', label: 'Lo lắng' },
]

export const SYMPTOMS = [
  { id: 'daubung', emoji: '🌀', label: 'Đau bụng' },
  { id: 'daudau', emoji: '🤕', label: 'Đau đầu' },
  { id: 'mun', emoji: '🔴', label: 'Nổi mụn' },
  { id: 'dayhoi', emoji: '🎈', label: 'Đầy hơi' },
  { id: 'cangnguc', emoji: '💗', label: 'Căng ngực' },
  { id: 'daulung', emoji: '🦴', label: 'Đau lưng' },
  { id: 'themngot', emoji: '🍰', label: 'Thèm ngọt' },
  { id: 'khongu', emoji: '🌙', label: 'Khó ngủ' },
  { id: 'buonnon', emoji: '🤢', label: 'Buồn nôn' },
]

export const FLOWS = [
  { id: 'light', label: 'Ít', drops: 1 },
  { id: 'medium', label: 'Vừa', drops: 2 },
  { id: 'heavy', label: 'Nhiều', drops: 3 },
] as const

/** Chọn tip theo ngày để không đổi liên tục mỗi lần render. */
export const pickTip = (tips: string[], seed: number) => tips[Math.abs(seed) % tips.length]

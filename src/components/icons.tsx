import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const DropIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3 C 8 8 5.5 11.5 5.5 14.5 a 6.5 6.5 0 0 0 13 0 C 18.5 11.5 16 8 12 3 Z" fill="currentColor" />
    <ellipse cx="9.5" cy="14" rx="1.4" ry="2.2" fill="#fff" opacity=".7" />
  </svg>
)

export const HeartIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 20 C 4 15 3 9.5 6 7 C 8.5 5 11 6.5 12 8.5 C 13 6.5 15.5 5 18 7 C 21 9.5 20 15 12 20 Z" fill="currentColor" />
  </svg>
)

export const FlowerIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    {[0, 72, 144, 216, 288].map((r) => (
      <ellipse key={r} cx="12" cy="7" rx="3.3" ry="4.4" fill="currentColor" transform={`rotate(${r} 12 12)`} />
    ))}
    <circle cx="12" cy="12" r="2.6" fill="#FFE27A" />
  </svg>
)

export const StarIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5 l2.5 5.2 5.6.7-4.1 3.9 1 5.6L12 16.2 7 18.9l1-5.6L3.9 9.4l5.6-.7Z" fill="currentColor" />
  </svg>
)

export const CalendarIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={2} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="4" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
    <circle cx="12" cy="15" r="1.6" fill="currentColor" stroke="none" />
  </svg>
)

export const ChartIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={2.2} {...p}>
    <path d="M6 19v-6M12 19V6M18 19v-9" />
  </svg>
)

export const PawIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <ellipse cx="12" cy="16" rx="5" ry="4" fill="currentColor" />
    <ellipse cx="6" cy="10.5" rx="2" ry="2.5" fill="currentColor" />
    <ellipse cx="9.5" cy="6.5" rx="2" ry="2.6" fill="currentColor" />
    <ellipse cx="14.5" cy="6.5" rx="2" ry="2.6" fill="currentColor" />
    <ellipse cx="18" cy="10.5" rx="2" ry="2.5" fill="currentColor" />
  </svg>
)

export const CatHeadIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3.5 4 L8.5 7.6 Q12 6.4 15.5 7.6 L20.5 4 L20.5 12.5 A8.5 7.5 0 0 1 3.5 12.5 Z" fill="currentColor" />
    <circle cx="9" cy="12" r="1.2" fill="#fff" />
    <circle cx="15" cy="12" r="1.2" fill="#fff" />
  </svg>
)

export const ChevronIcon = ({ size, dir = 'right', ...p }: P & { dir?: 'left' | 'right' }) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={2.5} {...p}>
    <path d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
  </svg>
)

export const ShareIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
    <path d="M6 11H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 20h14a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 19 11h-1" />
  </svg>
)

export const SparkleIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 2 C 12.8 8 16 11.2 22 12 C 16 12.8 12.8 16 12 22 C 11.2 16 8 12.8 2 12 C 8 11.2 11.2 8 12 2Z" fill="currentColor" />
  </svg>
)

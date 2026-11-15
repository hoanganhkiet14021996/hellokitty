import type { ReactNode } from 'react'

interface Props {
  progress: number // 0..1
  color: string
  size?: number
  children: ReactNode
}

/** Vòng tròn tiến độ chu kỳ, có chấm tròn ở đầu vòng. */
export default function CycleRing({ progress, color, size = 240, children }: Props) {
  const stroke = 18
  const r = (size - stroke) / 2 - 4
  const c = 2 * Math.PI * r
  const p = Math.min(1, Math.max(0, progress))
  const angle = p * 2 * Math.PI - Math.PI / 2
  const dotX = size / 2 + r * Math.cos(angle)
  const dotY = size / 2 + r * Math.sin(angle)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FFE3EC" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * p} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
        <circle cx={dotX} cy={dotY} r={stroke / 2 + 3} fill="#fff" stroke={color} strokeWidth={4} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

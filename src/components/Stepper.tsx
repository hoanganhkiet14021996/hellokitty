interface Props {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  unit?: string
}

export default function Stepper({ value, min, max, onChange, unit = 'ngày' }: Props) {
  const btn =
    'grid h-11 w-11 place-items-center rounded-full bg-blush text-2xl leading-none text-rose active:scale-90 transition-transform disabled:opacity-40'
  return (
    <div className="flex items-center gap-4">
      <button className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Giảm">
        −
      </button>
      <div className="min-w-[72px] text-center">
        <span className="text-3xl font-bold text-rose">{value}</span>
        <span className="ml-1 text-sm text-ink-soft">{unit}</span>
      </div>
      <button className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Tăng">
        +
      </button>
    </div>
  )
}

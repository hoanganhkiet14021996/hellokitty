export type MascotMood = 'happy' | 'normal' | 'sleepy' | 'period' | 'love' | 'wave'

const LINE = '#6B4A5A'
const PINK = '#FFB3C9'
const PINK_DEEP = '#FF8FB1'

function Sakura({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((r) => (
        <path
          key={r}
          transform={`rotate(${r})`}
          d="M0 0 C -9 -6 -9 -20 -3 -22 L 0 -18 L 3 -22 C 9 -20 9 -6 0 0 Z"
          fill="#FFC2D6"
          stroke={PINK_DEEP}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ))}
      <circle r="3.6" fill="#FFE27A" stroke="#F2B84B" strokeWidth="1.2" />
    </g>
  )
}

function Eyes({ mood }: { mood: MascotMood }) {
  const common = { stroke: LINE, strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none' }
  switch (mood) {
    case 'happy':
    case 'wave':
      return (
        <g {...common}>
          <path d="M62 101 Q71 90 80 101" />
          <path d="M120 101 Q129 90 138 101" />
        </g>
      )
    case 'sleepy':
      return (
        <g {...common}>
          <path d="M62 98 Q71 105 80 98" />
          <path d="M120 98 Q129 105 138 98" />
        </g>
      )
    case 'period':
      return (
        <g>
          <g {...common}>
            <path d="M62 99 Q71 106 80 99" />
            <path d="M120 99 Q129 106 138 99" />
          </g>
          {/* lông mày hơi chau */}
          <g stroke={LINE} strokeWidth="3" strokeLinecap="round">
            <path d="M64 86 L78 89" />
            <path d="M136 86 L122 89" />
          </g>
        </g>
      )
    case 'love':
      return (
        <g fill={PINK_DEEP} stroke={LINE} strokeWidth="2">
          <path d="M71 106 C 58 97 60 86 66 86 C 69 86 71 89 71 91 C 71 89 73 86 76 86 C 82 86 84 97 71 106 Z" />
          <path d="M129 106 C 116 97 118 86 124 86 C 127 86 129 89 129 91 C 129 89 131 86 134 86 C 140 86 142 97 129 106 Z" />
        </g>
      )
    default:
      return (
        <g>
          <ellipse cx="71" cy="98" rx="7" ry="9" fill={LINE} />
          <ellipse cx="129" cy="98" rx="7" ry="9" fill={LINE} />
          <circle cx="73.5" cy="94.5" r="2.6" fill="#fff" />
          <circle cx="131.5" cy="94.5" r="2.6" fill="#fff" />
        </g>
      )
  }
}

interface Props {
  mood?: MascotMood
  size?: number
  className?: string
  float?: boolean
}

/** Mèo Sakura – linh vật nguyên bản của app. */
export default function Mascot({ mood = 'normal', size = 160, className = '', float = false }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`${float ? 'animate-float' : ''} ${className}`}
      role="img"
      aria-label="Mèo Sakura"
    >
      {/* đuôi */}
      <path
        d="M140 168 C 172 170 178 140 166 130 C 160 125 152 132 160 138"
        fill="none"
        stroke={LINE}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M140 168 C 172 170 178 140 166 130 C 160 125 152 132 160 138"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* thân */}
      <ellipse cx="100" cy="160" rx="44" ry="33" fill="#fff" stroke={LINE} strokeWidth="4" />
      <ellipse cx="100" cy="166" rx="24" ry="18" fill="#FFF0F5" />

      {/* túi chườm khi tới kì */}
      {mood === 'period' && (
        <g>
          <rect x="80" y="146" width="40" height="32" rx="12" fill={PINK} stroke={LINE} strokeWidth="3" />
          <rect x="94" y="140" width="12" height="9" rx="3" fill="#fff" stroke={LINE} strokeWidth="2.5" />
          <path
            d="M100 170 C 92 164 93 157 97 157 C 99 157 100 159 100 160 C 100 159 101 157 103 157 C 107 157 108 164 100 170 Z"
            fill="#fff"
          />
        </g>
      )}
      {/* ôm tim khi love */}
      {mood === 'love' && (
        <path
          d="M100 182 C 80 170 80 152 90 151 C 95 150 99 154 100 157 C 101 154 105 150 110 151 C 120 152 120 170 100 182 Z"
          fill={PINK_DEEP}
          stroke={LINE}
          strokeWidth="3"
        />
      )}

      {/* chân trước */}
      <ellipse cx="80" cy="188" rx="12" ry="8" fill="#fff" stroke={LINE} strokeWidth="3.5" />
      <ellipse cx="120" cy="188" rx="12" ry="8" fill="#fff" stroke={LINE} strokeWidth="3.5" />

      {/* tay vẫy */}
      {mood === 'wave' && (
        <g className="origin-[150px_140px] animate-wave">
          <ellipse cx="156" cy="124" rx="11" ry="14" fill="#fff" stroke={LINE} strokeWidth="3.5" />
          <circle cx="156" cy="128" r="4" fill={PINK} />
        </g>
      )}

      {/* tai */}
      <path d="M40 78 C 30 40 44 22 52 26 C 62 30 76 46 82 52 Z" fill="#fff" stroke={LINE} strokeWidth="4" strokeLinejoin="round" />
      <path d="M48 66 C 44 46 50 36 54 38 C 60 42 66 48 70 54 Z" fill={PINK} />
      <path d="M160 78 C 170 40 156 22 148 26 C 138 30 124 46 118 52 Z" fill="#fff" stroke={LINE} strokeWidth="4" strokeLinejoin="round" />
      <path d="M152 66 C 156 46 150 36 146 38 C 140 42 134 48 130 54 Z" fill={PINK} />

      {/* đầu */}
      <ellipse cx="100" cy="98" rx="68" ry="54" fill="#fff" stroke={LINE} strokeWidth="4" />

      {/* vệt lông trên trán */}
      <g stroke={PINK} strokeWidth="3.5" strokeLinecap="round">
        <path d="M94 50 L95 60" />
        <path d="M106 50 L105 60" />
      </g>

      <Eyes mood={mood} />

      {/* má hồng */}
      <ellipse cx="54" cy="114" rx="11" ry="7" fill={PINK} opacity="0.8" />
      <ellipse cx="146" cy="114" rx="11" ry="7" fill={PINK} opacity="0.8" />

      {/* mũi + miệng ω */}
      <path d="M96 106 L104 106 L100 111 Z" fill={PINK_DEEP} stroke={PINK_DEEP} strokeWidth="2" strokeLinejoin="round" />
      <path d="M90 113 Q95 120 100 113 Q105 120 110 113" fill="none" stroke={LINE} strokeWidth="3.2" strokeLinecap="round" />

      {/* hoa sakura cài bên tai trái */}
      <Sakura x={50} y={52} s={1.05} />

      {mood === 'sleepy' && (
        <g fill={LINE} fontFamily="Quicksand, sans-serif" fontWeight="700">
          <text x="160" y="56" fontSize="18">z</text>
          <text x="172" y="40" fontSize="13">z</text>
        </g>
      )}
    </svg>
  )
}

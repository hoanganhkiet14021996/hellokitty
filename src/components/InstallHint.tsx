import { useState } from 'react'
import { ShareIcon } from './icons'

const KEY = 'meo-sakura-hide-install'

export const isStandalone = () =>
  (navigator as Navigator & { standalone?: boolean }).standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches

/** Nhắc cài app lên Màn hình chính (iOS sẽ không xoá dữ liệu khi đã cài). */
export default function InstallHint() {
  const [hidden, setHidden] = useState(() => {
    try {
      return isStandalone() || localStorage.getItem(KEY) === '1'
    } catch {
      return isStandalone()
    }
  })
  if (hidden) return null

  const hide = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    setHidden(true)
  }

  return (
    <div className="card relative bg-cream p-4 pr-10">
      <button onClick={hide} className="absolute right-2 top-2 p-2 text-ink-soft" aria-label="Đóng">
        ✕
      </button>
      <p className="font-bold text-rose">📲 Thêm Mèo vào Màn hình chính nha!</p>
      <p className="mt-1 text-sm leading-relaxed">
        Trong Safari, bấm nút <ShareIcon size={16} className="inline -mt-1 text-[#3478F6]" /> Chia sẻ → chọn{' '}
        <b>“Thêm vào MH chính”</b>. Mở app từ biểu tượng đó để dữ liệu được giữ an toàn, không bị iPhone tự xoá.
      </p>
    </div>
  )
}

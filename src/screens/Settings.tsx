import { useRef, useState, type ReactNode } from 'react'
import { useStore } from '../store/AppStore'
import { addDaysISO, summarize, todayISO } from '../lib/cycle'
import { buildIcs } from '../lib/ics'
import { shareOrDownload } from '../lib/share'
import { normalize } from '../lib/storage'
import Stepper from '../components/Stepper'
import Mascot from '../components/Mascot'
import { isStandalone } from '../components/InstallHint'
import { ShareIcon } from '../components/icons'

export default function Settings() {
  const { state, updateProfile, replaceAll, resetAll } = useStore()
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const p = state.profile

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2800)
  }

  const exportBackup = async () => {
    const json = JSON.stringify(state, null, 2)
    await shareOrDownload(`hellokitty-saoluu-${todayISO()}.json`, json, 'application/json')
  }

  const importBackup = async (file: File) => {
    try {
      const data = normalize(JSON.parse(await file.text()))
      if (!confirm('Khôi phục sẽ thay toàn bộ dữ liệu hiện tại bằng dữ liệu trong file. Tiếp tục nha?')) return
      replaceAll({ ...data, onboarded: true })
      flash('Đã khôi phục dữ liệu thành công 🎉')
    } catch {
      flash('File không đúng định dạng sao lưu của app Hello Kitty 😿')
    }
  }

  const exportIcs = async () => {
    const sum = summarize(state)
    if (!sum.nextStart) return flash('Cần đánh dấu ít nhất 1 kì trước đã nha.')
    const starts = [0, 1, 2, 3, 4, 5].map((k) => addDaysISO(sum.nextStart!, k * sum.avgCycle))
    await shareOrDownload('hellokitty-lich.ics', buildIcs(starts, sum.avgPeriod), 'text/calendar')
  }

  const reset = async () => {
    if (!confirm('Xoá toàn bộ dữ liệu? Hành động này không thể hoàn tác.')) return
    if (!confirm('Chắc chắn thật chưa? Nên sao lưu trước khi xoá đó 🥺')) return
    await resetAll()
  }

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-2xl font-bold text-rose">Cài đặt</h1>

      <Card title="Thông tin của bạn">
        <label className="block text-sm text-ink-soft">
          Tên gọi
          <input
            value={p.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            maxLength={24}
            className="mt-1 w-full rounded-2xl border-2 border-blush bg-white px-4 py-3 text-ink outline-none focus:border-pink"
          />
        </label>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm">Chu kỳ mặc định</span>
          <Stepper value={p.avgCycle} min={18} max={50} onChange={(n) => updateProfile({ avgCycle: n })} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm">Số ngày kinh</span>
          <Stepper value={p.avgPeriod} min={2} max={10} onChange={(n) => updateProfile({ avgPeriod: n })} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          Khi đã ghi từ 2 kì trở lên, Mèo sẽ tự tính trung bình từ dữ liệu thật của bạn.
        </p>
      </Card>

      <Card title="Nhắc nhở">
        <p className="text-sm leading-relaxed">
          Thêm các ngày dự kiến vào app <b>Lịch</b> của iPhone, sẽ có thông báo nhắc trước 1 ngày.
        </p>
        <button className="btn-soft mt-3 w-full py-3" onClick={exportIcs}>
          📅 Thêm vào Lịch iPhone
        </button>
        <p className="mt-2 text-xs text-ink-soft">Mở file vừa tạo → chọn “Thêm tất cả”. Nên làm lại sau vài kì để cập nhật dự đoán.</p>
      </Card>

      <Card title="Sao lưu dữ liệu">
        <p className="text-sm leading-relaxed">
          Dữ liệu chỉ nằm trên máy này. Thỉnh thoảng hãy sao lưu ra file (lưu vào Tệp, iCloud Drive hoặc gửi Zalo cho mình) để không bị mất khi đổi máy nha.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="btn-primary py-3" onClick={exportBackup}>
            💾 Sao lưu
          </button>
          <button className="btn-soft py-3" onClick={() => fileRef.current?.click()}>
            📂 Khôi phục
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) importBackup(f)
            e.target.value = ''
          }}
        />
      </Card>

      {!isStandalone() && (
        <Card title="Cài lên Màn hình chính">
          <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed">
            <li>Mở trang này bằng <b>Safari</b></li>
            <li>
              Bấm nút Chia sẻ <ShareIcon size={16} className="inline -mt-1 text-[#3478F6]" />
            </li>
            <li>Chọn <b>“Thêm vào MH chính”</b> → <b>Thêm</b></li>
          </ol>
        </Card>
      )}

      <Card title="Vùng nguy hiểm">
        <button className="w-full rounded-full border-2 border-[#F5B5C5] py-3 font-bold text-[#D0436F]" onClick={reset}>
          Xoá toàn bộ dữ liệu
        </button>
      </Card>

      <div className="flex flex-col items-center pt-2 text-center text-xs text-ink-soft">
        <Mascot mood="love" size={70} />
        <p className="mt-1">Hello Kitty · dữ liệu chỉ lưu trên máy bạn 💗</p>
      </div>

      {msg && (
        <div className="fixed inset-x-4 bottom-28 z-50 mx-auto max-w-sm animate-pop rounded-2xl bg-ink px-4 py-3 text-center text-sm text-white shadow-lg">
          {msg}
        </div>
      )}
    </div>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card p-4">
      <h2 className="mb-3 font-bold text-rose">{title}</h2>
      {children}
    </section>
  )
}

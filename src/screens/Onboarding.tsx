import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Mascot, { type MascotMood } from '../components/Mascot'
import Stepper from '../components/Stepper'
import { useStore } from '../store/AppStore'
import { DEFAULT_PROFILE } from '../lib/types'
import { addDaysISO, todayISO } from '../lib/cycle'

export default function Onboarding() {
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [lastStart, setLastStart] = useState<string>('')
  const [cycle, setCycle] = useState(DEFAULT_PROFILE.avgCycle)
  const [period, setPeriod] = useState(DEFAULT_PROFILE.avgPeriod)
  const today = todayISO()

  const finish = (useDefaults = false) =>
    completeOnboarding(
      {
        ...DEFAULT_PROFILE,
        name: name.trim(),
        avgCycle: useDefaults ? DEFAULT_PROFILE.avgCycle : cycle,
        avgPeriod: useDefaults ? DEFAULT_PROFILE.avgPeriod : period,
      },
      lastStart || undefined,
    )

  const moods: MascotMood[] = ['wave', 'normal', 'happy']

  return (
    <div className="pt-safe pb-safe relative mx-auto flex min-h-dvh max-w-md flex-col px-6">
      <div className="mt-4 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-2.5 rounded-full transition-all ${i === step ? 'w-8 bg-pink' : 'w-2.5 bg-blush'}`}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Mascot mood={moods[step]} size={170} float />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 flex-col"
        >
          {step === 0 && (
            <>
              <h1 className="mt-4 text-center text-2xl font-bold text-rose">Chào bạn! Mình là Mèo Sakura của app Hello Kitty 🌸</h1>
              <p className="mt-2 text-center text-ink-soft">
                Mình sẽ giúp bạn theo dõi chu kỳ thật dễ dàng. Mọi dữ liệu chỉ nằm trên điện thoại của bạn thôi nha.
              </p>
              <label className="mt-8 block text-center">
                <span className="text-ink">Mình nên gọi bạn là gì nè?</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên của bạn"
                  maxLength={24}
                  className="card mt-3 w-full px-5 py-4 text-center text-lg outline-none ring-pink focus:ring-2"
                />
              </label>
              <div className="flex-1" />
              <button className="btn-primary mb-4 py-4 text-lg" onClick={() => setStep(1)}>
                Tiếp tục
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="mt-4 text-center text-2xl font-bold text-rose">
                Kì gần nhất của {name.trim() || 'bạn'} bắt đầu ngày nào?
              </h1>
              <p className="mt-2 text-center text-ink-soft">Ngày đầu tiên có kinh của lần gần đây nhất.</p>
              <input
                type="date"
                value={lastStart}
                max={today}
                min={addDaysISO(today, -90)}
                onChange={(e) => setLastStart(e.target.value)}
                className="card mx-auto mt-8 block w-full px-5 py-4 text-center text-lg outline-none"
              />
              <div className="flex-1" />
              <button className="btn-primary py-4 text-lg disabled:opacity-50" disabled={!lastStart} onClick={() => setStep(2)}>
                Tiếp tục
              </button>
              <button
                className="mb-4 mt-3 py-2 text-ink-soft underline"
                onClick={() => {
                  setLastStart('')
                  setStep(2)
                }}
              >
                Mình không nhớ, để sau
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="mt-4 text-center text-2xl font-bold text-rose">Chu kỳ của bạn thường thế nào?</h1>
              <p className="mt-2 text-center text-ink-soft">Ước chừng thôi, Mèo sẽ tự học dần theo dữ liệu của bạn.</p>
              <div className="card mt-6 flex flex-col items-center gap-2 p-5">
                <span>Một chu kỳ dài khoảng</span>
                <Stepper value={cycle} min={18} max={50} onChange={setCycle} />
              </div>
              <div className="card mt-4 flex flex-col items-center gap-2 p-5">
                <span>Mỗi lần có kinh khoảng</span>
                <Stepper value={period} min={2} max={10} onChange={setPeriod} />
              </div>
              <div className="flex-1" />
              <button className="btn-primary mt-6 py-4 text-lg" onClick={() => finish()}>
                Bắt đầu thôi! 💗
              </button>
              <button className="mb-4 mt-3 py-2 text-ink-soft underline" onClick={() => finish(true)}>
                Mình không rõ, dùng mặc định (28 / 5 ngày)
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button className="absolute left-4 top-[max(env(safe-area-inset-top),12px)] p-2 text-ink-soft" onClick={() => setStep(step - 1)}>
          ‹ Quay lại
        </button>
      )}
    </div>
  )
}

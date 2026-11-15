import { Component, type ReactNode } from 'react'

interface State {
  error: Error | null
}

/** Nếu app gặp lỗi, hiện thông báo dễ thương + chi tiết lỗi để gửi cho người làm app. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-5xl">😿</p>
        <h1 className="text-xl font-bold text-rose">Ôi, Mèo bị vấp rồi!</h1>
        <p className="text-sm text-ink-soft">Bạn thử tải lại trang. Nếu vẫn lỗi, chụp màn hình này gửi cho người làm app nha.</p>
        <pre className="max-w-full overflow-auto rounded-2xl bg-white p-3 text-left text-xs">
          {this.state.error.message}
          {'\n'}
          {navigator.userAgent}
        </pre>
        <button className="btn-primary px-8 py-3" onClick={() => location.reload()}>
          Tải lại
        </button>
      </div>
    )
  }
}

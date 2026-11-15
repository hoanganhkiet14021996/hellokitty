/** Chia sẻ/lưu file: trên iPhone dùng bảng Chia sẻ (Lưu vào Tệp, AirDrop...), máy khác thì tải xuống. */
export async function shareOrDownload(filename: string, content: string, mime: string): Promise<void> {
  const file = new File([content], filename, { type: mime })
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: filename })
      return
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
    }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

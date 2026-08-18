import { useEffect, useRef, type RefObject } from 'react'

type Props = {
  analyserRef: RefObject<AnalyserNode | null>
  active: boolean
  barCount?: number
  height?: number
  className?: string
}

export function AudioVisualizer({
  analyserRef,
  active,
  barCount = 40,
  height = 80,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      sizeRef.current = { width: rect.width, height: rect.height, dpr }
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const data = new Uint8Array(bufferLength)
    let raf = 0

    function drawIdle() {
      const { width, height: h, dpr } = sizeRef.current
      if (!width || !h) return

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, width, h)

      const barWidth = width / barCount
      for (let i = 0; i < barCount; i++) {
        const idleHeight = 4 + Math.sin(i * 0.45) * 2
        ctx!.fillStyle = 'rgba(56, 189, 248, 0.12)'
        ctx!.fillRect(i * barWidth + 1, h - idleHeight, barWidth - 2, idleHeight)
      }
    }

    function drawLive() {
      raf = requestAnimationFrame(drawLive)
      analyser!.getByteFrequencyData(data)

      const { width, height: h, dpr } = sizeRef.current
      if (!width || !h) return

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, width, h)

      const barWidth = width / barCount
      const step = Math.max(1, Math.floor(bufferLength / barCount))

      for (let i = 0; i < barCount; i++) {
        let sum = 0
        const start = i * step
        for (let j = 0; j < step; j++) sum += data[start + j] ?? 0
        const average = sum / step / 255
        const barHeight = Math.max(3, average * h * 0.92)

        const gradient = ctx!.createLinearGradient(0, h, 0, h - barHeight)
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)')
        gradient.addColorStop(0.55, 'rgba(56, 189, 248, 0.85)')
        gradient.addColorStop(1, 'rgba(186, 230, 253, 1)')

        ctx!.fillStyle = gradient
        ctx!.fillRect(i * barWidth + 1, h - barHeight, barWidth - 2, barHeight)
      }
    }

    if (active) {
      drawLive()
    } else {
      drawIdle()
    }

    return () => cancelAnimationFrame(raf)
  }, [active, analyserRef, barCount])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
    />
  )
}

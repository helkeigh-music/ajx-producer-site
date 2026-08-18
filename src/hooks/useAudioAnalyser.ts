import { useEffect, useRef, type RefObject } from 'react'

const FFT_SIZE = 256

type AudioGraph = {
  context: AudioContext
  analyser: AnalyserNode
  source: MediaElementAudioSourceNode
}

const graphByElement = new WeakMap<HTMLMediaElement, AudioGraph>()

function getOrCreateGraph(audio: HTMLMediaElement): AudioGraph {
  const existing = graphByElement.get(audio)
  if (existing) return existing

  audio.crossOrigin = 'anonymous'

  const context = new AudioContext()
  const analyser = context.createAnalyser()
  analyser.fftSize = FFT_SIZE
  analyser.smoothingTimeConstant = 0.82
  analyser.minDecibels = -90
  analyser.maxDecibels = -10

  const source = context.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(context.destination)

  const graph = { context, analyser, source }
  graphByElement.set(audio, graph)
  return graph
}

export function useAudioAnalyser(
  audioRef: RefObject<HTMLMediaElement | null>,
  sourceId?: string,
) {
  const analyserRef = useRef<AnalyserNode | null>(null)
  const contextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      analyserRef.current = null
      contextRef.current = null
      return
    }

    const graph = getOrCreateGraph(audio)
    analyserRef.current = graph.analyser
    contextRef.current = graph.context

    async function resumeOnPlay() {
      if (graph.context.state === 'suspended') {
        await graph.context.resume()
      }
    }

    audio.addEventListener('play', resumeOnPlay)
    return () => {
      audio.removeEventListener('play', resumeOnPlay)
    }
  }, [audioRef, sourceId])

  return analyserRef
}

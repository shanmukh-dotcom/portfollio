import { useEffect } from 'react'
import FrameSequence from './components/FrameSequence'
import UI from './components/UI'

export default function App() {
  useEffect(() => {
    const playMusic = () => {
      const audio = document.getElementById('bg-music')
      if (audio && audio.paused) {
        audio.volume = 0.5 // Background ambient volume
        audio.play().catch(e => console.log("Waiting for interaction..."))
      }
    }

    window.addEventListener('keydown', playMusic)
    window.addEventListener('click', playMusic)

    return () => {
      window.removeEventListener('keydown', playMusic)
      window.removeEventListener('click', playMusic)
    }
  }, [])

  return (
    <>
      <FrameSequence />
      <UI />
    </>
  )
}

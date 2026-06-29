import { useEffect, useRef, useState } from 'react'
import useStore from '../store/useStore'

export default function FrameSequence() {
  const canvasRef = useRef(null)
  const [loadedFrames, setLoadedFrames] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const imagesRef = useRef(new Map())
  const requestRef = useRef()
  
  const { setTargetFrame, setCurrentFrame, totalFrames, setIntroPlaying } = useStore()
  
  // Smoothing & Playback configuration
  const easing = 0.05 // Lower = buttery smooth but takes longer to decelerate
  const playbackSpeed = 0.4 // Slowed down from 1.5! (0.4 means a smooth 24 frames-per-second when holding W/S)
  const introPlaybackSpeed = 0.25 // Slowed down from 0.5! (0.25 means exactly 15 frames-per-second cinematic speed)

  // Key tracking
  const keys = useRef({ forward: false, backward: false })

  useEffect(() => {
    // Preload images into memory
    let loaded = 0
    let hasStarted = false

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image()
      
      // Intelligent Routing: Frames 1-600 load from f 1.1, frames 601-1200 load from f 2.1
      const folder = i <= 600 ? '/f 1.1/' : '/f 2.1/'
      const localIndex = i <= 600 ? i : i - 600
      const frameStr = String(localIndex).padStart(3, '0') // e.g., "001"
      
      img.src = `${folder}frame_${frameStr}.webp`
      
      const onImageReady = () => {
        loaded++
        setLoadedFrames(loaded)
        
        // Start the experience as soon as we have enough frames for the intro (120 frames)
        if (loaded >= 120 && !hasStarted) {
          hasStarted = true
          setIsReady(true)
          setIntroPlaying(true)
        }
      }

      img.onload = () => {
        imagesRef.current.set(i, img)
        onImageReady()
      }
      
      img.onerror = () => {
        // Fallback placeholder to prevent crashes
        const canvas = document.createElement('canvas')
        canvas.width = 1920
        canvas.height = 1080
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#0f0f15'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#6366f1'
        ctx.font = '80px Inter'
        ctx.fillText(`Frame ${i} missing`, canvas.width / 2 - 200, canvas.height / 2)
        
        const dummyImg = new Image()
        dummyImg.src = canvas.toDataURL()
        imagesRef.current.set(i, dummyImg)
        onImageReady()
      }
    }
  }, [totalFrames, setIntroPlaying])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.current.forward = true
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.current.backward = true
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.current.forward = false
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.current.backward = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // The Butter-Smooth Render Loop
  const renderLoop = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const state = useStore.getState()

    // 1. Handle Input & Auto-Play Logic
    if (state.introPlaying) {
      if (state.targetFrame < 119) {
        setTargetFrame(state.targetFrame + introPlaybackSpeed)
      } else if (state.currentFrame >= 118.5) {
        // Intro finished! Hand controls over to the user.
        useStore.getState().setIntroPlaying(false)
      }
    } else {
      // Normal Interactive Mode
      if (keys.current.forward) {
        setTargetFrame(state.targetFrame + playbackSpeed)
      }
      if (keys.current.backward) {
        setTargetFrame(state.targetFrame - playbackSpeed)
      }
    }

    // 2. Apply Momentum / Inertia (Lerp towards target)
    const currentTFrame = useStore.getState().targetFrame
    let newCurrent = useStore.getState().currentFrame
    
    newCurrent += (currentTFrame - newCurrent) * easing
    setCurrentFrame(newCurrent)

    // 3. Draw to canvas
    const drawFrameInt = Math.round(newCurrent)
    const img = imagesRef.current.get(drawFrameInt)
    
    if (img) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      const canvasAspect = canvas.width / canvas.height
      const imgAspect = img.width / img.height
      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasAspect > imgAspect) {
        drawWidth = canvas.width
        drawHeight = canvas.width / imgAspect
        offsetX = 0
        offsetY = (canvas.height - drawHeight) / 2
      } else {
        drawWidth = canvas.height * imgAspect
        drawHeight = canvas.height
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = 0
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    requestRef.current = requestAnimationFrame(renderLoop)
  }

  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1
        canvasRef.current.width = window.innerWidth * dpr
        canvasRef.current.height = window.innerHeight * dpr
      }
    }
    window.addEventListener('resize', resize)
    resize()

    requestRef.current = requestAnimationFrame(renderLoop)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(requestRef.current)
    }
  }, [])

  const loadPercent = Math.round((loadedFrames / totalFrames) * 100)

  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
          filter: 'contrast(1.05) saturate(1.1) brightness(0.95)' 
        }}
      />
      
      {/* Subtle Film Grain Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 2, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
      }}></div>
      
      {!isReady && (
        <div className="loader-overlay" style={{
          position: 'absolute', zIndex: 100, top: 0, left: 0, width: '100vw', height: '100vh',
          background: '#0a0a0f', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'Inter', fontSize: '24px', fontWeight: 'bold'
        }}>
          <div>Preparing Cinematic Sequence...</div>
          <div style={{
            width: '300px', height: '10px', background: 'rgba(255,255,255,0.1)',
            borderRadius: '5px', marginTop: '20px', overflow: 'hidden'
          }}>
             <div style={{ width: `${Math.min((loadedFrames / 120) * 100, 100)}%`, height: '100%', background: '#6366f1', transition: 'width 0.2s' }} />
          </div>
        </div>
      )}
    </>
  )
}

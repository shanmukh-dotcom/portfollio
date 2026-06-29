import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'

const images = [
  '/images/1.1.png',
  '/images/1.2.png',
  '/images/1.3.png',
  '/images/1.4.png'
]

export default function BlacksmithUI() {
  const { collectFragment, closeUI } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      collectFragment('blacksmith')
    }
  }

  return (
    <motion.div 
      className="ui-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'radial-gradient(circle at center, rgba(30,10,0,0.8) 0%, rgba(0,0,0,0.95) 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, pointerEvents: 'auto', perspective: '1000px'
      }}
    >
      <h2 style={{ color: '#ffaa00', fontFamily: 'Inter', letterSpacing: '4px', textShadow: '0 0 20px #ffaa00', marginBottom: '10px' }}>
        THE FORGE
      </h2>
      <p style={{ color: '#aaa', marginBottom: '30px' }}>"These are the artifacts I have forged."</p>

      <div style={{ position: 'relative', width: '80%', maxWidth: '900px', height: '60vh' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, type: 'spring' }}
            style={{
              position: 'absolute', width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src={images[currentIndex]} 
              alt="Forged Artifact" 
              style={{ 
                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', 
                borderRadius: '15px', boxShadow: '0 20px 50px rgba(255, 170, 0, 0.4)' 
              }} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <button 
          onClick={handleNext}
          style={{
            padding: '12px 30px', background: '#ffaa00', color: '#000',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          {currentIndex < images.length - 1 ? 'Inspect Next Artifact' : 'Take Fragment & Leave'}
        </button>
        <button onClick={closeUI} style={{ padding: '12px 30px', background: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }}>
          Step Away
        </button>
      </div>
    </motion.div>
  )
}

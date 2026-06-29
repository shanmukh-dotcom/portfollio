import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

export default function FinalLetter() {
  const { closeUI } = useStore()

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.9)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, pointerEvents: 'auto'
      }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 1, duration: 2, ease: "easeOut" }}
        style={{
          width: '80%', maxWidth: '600px', background: '#fef3c7', padding: '60px',
          borderRadius: '5px', boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 50px rgba(217, 119, 6, 0.2)',
          color: '#451a03', fontFamily: 'serif', fontSize: '18px', lineHeight: '2'
        }}
      >
        <p>To whoever discovers this world,</p>
        <p>These roads were built from curiosity.</p>
        <p>These creations were forged through persistence.</p>
        <p>These skills were learned through countless experiments.</p>
        <p>These achievements were earned through challenges.</p>
        <p>And this journey is only beginning.</p>
        <p style={{ marginTop: '40px' }}>Thank you for exploring my world.</p>
        <p style={{ marginTop: '20px', fontStyle: 'italic', textAlign: 'right' }}>— Shanmukh</p>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}
        onClick={closeUI}
        style={{
          marginTop: '40px', background: 'transparent', color: '#888', border: '1px solid #444',
          padding: '10px 30px', borderRadius: '30px', cursor: 'pointer', letterSpacing: '2px'
        }}
      >
        Return to the Village
      </motion.button>
    </motion.div>
  )
}

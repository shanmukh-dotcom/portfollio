import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

export default function InventorUI() {
  const { collectFragment, closeUI } = useStore()

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'radial-gradient(circle at center, rgba(10,20,40,0.95) 0%, rgba(0,0,0,0.95) 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, pointerEvents: 'auto'
      }}
    >
      <h2 style={{ color: '#38bdf8', fontFamily: 'Inter', letterSpacing: '4px', textShadow: '0 0 20px #0284c7', marginBottom: '20px' }}>
        THE BLUEPRINT TABLE
      </h2>

      <motion.img 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
        src="/images/5.1.png"
        alt="Inventor Future Vision"
        style={{
          width: '80%', maxWidth: '1000px', height: 'auto', maxHeight: '65vh',
          objectFit: 'contain', borderRadius: '10px',
          boxShadow: '0 20px 50px rgba(56, 189, 248, 0.4)'
        }}
      />

      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <button 
          onClick={() => collectFragment('inventor')}
          style={{
            padding: '12px 30px', background: '#0ea5e9', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          Extract Data Fragment
        </button>
        <button onClick={closeUI} style={{ padding: '12px 30px', background: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }}>
          Leave Workshop
        </button>
      </div>
    </motion.div>
  )
}

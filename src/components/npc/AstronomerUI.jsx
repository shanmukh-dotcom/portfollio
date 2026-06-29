import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

export default function AstronomerUI() {
  const { collectFragment, closeUI } = useStore()

  const stars = [
    { label: 'GitHub', x: -150, y: -100, link: 'https://github.com/shanmukh-dotcom' },
    { label: 'LinkedIn', x: 50, y: -200, link: 'https://www.linkedin.com/in/shanmukha-chennuboina-7a61073a9/' },
    { label: 'chennuboinashanmukh@gmail.com', x: 150, y: -50, link: 'mailto:chennuboinashanmukh@gmail.com' },
    { label: '+91 6301 688 507', x: 100, y: 120, link: 'tel:+916301688507' },
    { label: 'Resume', x: -120, y: 100, link: '/resume.pdf' }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'radial-gradient(circle at center, rgba(15,23,42,0.95) 0%, rgba(0,0,0,0.98) 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, pointerEvents: 'auto'
      }}
    >
      <h2 style={{ color: '#e2e8f0', fontFamily: 'Inter', letterSpacing: '8px', textShadow: '0 0 20px #ffffff', marginBottom: '10px' }}>
        THE STAR ATLAS
      </h2>
      <p style={{ color: '#94a3b8', marginBottom: '60px' }}>"Every star is a connection. Click the stars to reveal their secrets."</p>

      <div style={{ position: 'relative', width: '600px', height: '400px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Constellation Lines */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 2, ease: 'easeInOut' }}
            d={`M ${300 + stars[0].x} ${200 + stars[0].y} L ${300 + stars[1].x} ${200 + stars[1].y} L ${300 + stars[2].x} ${200 + stars[2].y} L ${300 + stars[3].x} ${200 + stars[3].y} L ${300 + stars[4].x} ${200 + stars[4].y} Z`}
            stroke="#ffffff" strokeWidth="2" fill="none"
          />
        </svg>

        {/* Stars */}
        {stars.map((star, i) => (
          <motion.a 
            key={i} href={star.link} target="_blank" rel="noreferrer"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.3 + 1 }}
            style={{
              position: 'absolute', left: `calc(50% + ${star.x}px)`, top: `calc(50% + ${star.y}px)`,
              textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
              transform: 'translate(-50%, -50%)', cursor: 'pointer'
            }}
            whileHover={{ scale: 1.2 }}
          >
            <div style={{
              width: '15px', height: '15px', background: '#fff', borderRadius: '50%',
              boxShadow: '0 0 20px 5px rgba(255,255,255,0.8)'
            }}></div>
            <span style={{ color: '#f8fafc', marginTop: '10px', fontSize: '14px', letterSpacing: '2px', whiteSpace: 'nowrap' }}>{star.label}</span>
          </motion.a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <button 
          onClick={() => collectFragment('astronomer')}
          style={{
            padding: '12px 30px', background: '#f8fafc', color: '#0f172a',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
            boxShadow: '0 0 20px rgba(255,255,255,0.5)'
          }}
        >
          Take Final Fragment
        </button>
        <button onClick={closeUI} style={{ padding: '12px 30px', background: 'transparent', color: '#666', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }}>
          Leave Observatory
        </button>
      </div>
    </motion.div>
  )
}

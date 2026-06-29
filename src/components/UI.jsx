import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

// Import NPC UI Components
import BlacksmithUI from './npc/BlacksmithUI'
import WizardUI from './npc/WizardUI'
import ScholarUI from './npc/ScholarUI'
import ChampionUI from './npc/ChampionUI'
import InventorUI from './npc/InventorUI'
import AstronomerUI from './npc/AstronomerUI'
import FinalLetter from './npc/FinalLetter'

const TypewriterText = ({ text, delay = 0 }) => {
  const letters = Array.from(text);
  return (
    <motion.span
      variants={{
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } }
      }}
      initial="hidden" animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span key={index} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function UI() {
  const { fragmentsCollected, letterUnlocked, activeNPC, setActiveNPC, introPlaying } = useStore()
  
  const currentFrame = useStore(state => state.currentFrame)
  const isEnd = currentFrame >= 1198

  // Efficient subscription: determine the active "zone" based on currentFrame
  const zone = useStore(state => {
    if (state.currentFrame < 20) return 'welcome'
    if (state.currentFrame >= 248 && state.currentFrame <= 300) return 'blacksmith'
    if (state.currentFrame >= 411 && state.currentFrame <= 450) return 'wizard'
    if (state.currentFrame >= 550 && state.currentFrame <= 601) return 'scholar'
    if (state.currentFrame >= 710 && state.currentFrame <= 750) return 'champion'
    if (state.currentFrame >= 844 && state.currentFrame <= 910) return 'inventor'
    if (state.currentFrame >= 1020 && state.currentFrame <= 1050) return 'astronomer'
    return 'travel'
  })

  // Fakes world-space tracking by interpolating coordinates between the start and end of a zone
  const trackHead = (startFrame, endFrame, startTop, endTop, startLeft, endLeft) => {
    const progress = Math.max(0, Math.min(1, (currentFrame - startFrame) / (endFrame - startFrame)))
    const currentTop = startTop + (endTop - startTop) * progress
    const currentLeft = startLeft + (endLeft - startLeft) * progress
    return { top: `${currentTop}%`, left: `${currentLeft}%` }
  }

  // Helper to render the Storybook Talk Bubble
  const renderTalkBubble = (npcId, label, startFrame, endFrame, startTop, endTop, startLeft, endLeft) => {
    const { top, left } = trackHead(startFrame, endFrame, startTop, endTop, startLeft, endLeft)
    
    return (
      <motion.div 
        className="chat-bubble"
        initial={{ opacity: 0, scale: 0.9, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ 
          opacity: { duration: 0.3 }, 
          scale: { duration: 0.3, type: "spring", bounce: 0.4 }, 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
        }}
        onClick={() => setActiveNPC(npcId)}
        style={{
          position: 'absolute', top, left, 
          background: '#fef3c7', // Parchment white
          border: '2px solid #b45309', // Leather/storybook border
          padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', transform: 'translateX(-50%)',
          color: '#78350f', fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4), inset 0 0 15px rgba(180, 83, 9, 0.1)',
          display: 'flex', alignItems: 'center', pointerEvents: 'auto',
          transition: 'top 0.1s linear, left 0.1s linear' // Smooth tracking interpolated frames
        }}
        whileHover={{ scale: 1.05, background: '#fffbeb', boxShadow: '0 15px 30px rgba(0,0,0,0.5)' }}
      >
        {label}
        {/* Outer triangle tip */}
        <div style={{
          position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
          borderWidth: '10px 10px 0', borderStyle: 'solid', borderColor: '#b45309 transparent transparent transparent'
        }}></div>
        {/* Inner triangle for parchment fill */}
        <div style={{
          position: 'absolute', bottom: '-7px', left: '50%', transform: 'translateX(-50%)',
          borderWidth: '8px 8px 0', borderStyle: 'solid', borderColor: '#fef3c7 transparent transparent transparent',
          zIndex: 2
        }}></div>
      </motion.div>
    )
  }

  return (
    <div className="ui-layer">
      
      {/* Top Left: Welcome Tracker */}
      <AnimatePresence>
        {!introPlaying && !activeNPC && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ position: 'absolute', top: 30, left: 40, display: 'flex', alignItems: 'center', gap: '15px' }}
          >
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(10,10,10,0.6)', border: '1px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '14px', letterSpacing: '1px' }}>Welcome, Traveler</span>
              <span style={{ color: '#aaa', fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontStyle: 'italic' }}>Your journey begins.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Right: Quest/Fragment Tracker */}
      <AnimatePresence>
        {!introPlaying && !activeNPC && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            style={{ position: 'absolute', top: 30, right: 40, display: 'flex', alignItems: 'center', gap: '15px', textAlign: 'right' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '14px', letterSpacing: '1px' }}>{letterUnlocked ? 'The Final Letter' : 'The Fragments'}</span>
              <span style={{ color: '#d4af37', fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontStyle: 'italic' }}>
                {letterUnlocked ? 'Your journey is complete.' : `You have gathered ${fragmentsCollected} of 6.`}
              </span>
            </div>
            <div style={{ color: '#d4af37', fontSize: '24px', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }}>✦</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Left: Satchel Letter */}
      <AnimatePresence>
        {!introPlaying && !activeNPC && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'absolute', bottom: 40, left: 40, display: 'flex', alignItems: 'flex-end', gap: '30px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', width: '60px', height: '40px', background: '#f5deb3', border: '1px solid #d2b48c', borderRadius: '4px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 {/* Wax Seal */}
                 <div style={{ width: '16px', height: '16px', background: '#8b0000', borderRadius: '50%', boxShadow: 'inset 0 0 5px #4a0000', border: '1px solid #3e0000' }}></div>
                 {/* Fold Lines */}
                 <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}><path d="M0,0 L30,20 L60,0" fill="none" stroke="#d2b48c" strokeWidth="1"/></svg>
              </div>
              <span style={{ color: '#aaa', fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                A letter in your satchel...
              </span>
            </div>
            
            {/* Hidden Auto-Play Audio Element */}
            <audio id="bg-music" loop>
              <source src="/music.mp3" type="audio/mpeg" />
            </audio>
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Center: Instruction */}
      <AnimatePresence>
        {!introPlaying && !activeNPC && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '15px' }}
          >
            <span style={{ color: '#d4af37', fontSize: '12px' }}>◆</span>
            <span style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '14px', letterSpacing: '4px', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
              {currentFrame < 150 ? "HOLD [ W ] OR [ ↑ ] TO EXPLORE" : "EXPLORE. DISCOVER. EXPERIENCE."}
            </span>
            <span style={{ color: '#d4af37', fontSize: '12px' }}>◆</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEBUG: Frame Counter */}
      {/* 
      <div style={{
        position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.8)', color: '#0f0', 
        fontFamily: 'monospace', padding: '5px 10px', borderRadius: '4px', border: '1px solid #0f0', zIndex: 100
      }}>
        FRAME: {currentFrame}
      </div> 
      */}

      {/* Dynamic Main Title */}
      <AnimatePresence>
        {!activeNPC && (
          <motion.div 
            className="main-title"
            initial={false}
            animate={{ 
              top: introPlaying ? '50%' : '40px',
              y: introPlaying ? '-50%' : '0%',
              scale: introPlaying ? 1.5 : 1
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ 
              position: 'absolute', left: '50%', x: '-50%',
              textAlign: 'center', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
          >
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', color: '#f8fafc', letterSpacing: '3px', marginBottom: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              THE WORLD OF
            </div>
            <div style={{ 
              fontFamily: 'Cinzel, serif', fontSize: '56px', fontWeight: '700', 
              background: 'linear-gradient(to bottom, #FFDF73 0%, #B8860B 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '6px', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))', lineHeight: '1.1' 
            }}>
              SHANMUKH
            </div>
            <div style={{ color: '#d4af37', fontSize: '12px', margin: '4px 0', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
              ◆
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontStyle: 'italic', color: '#e2e8f0', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              A journey through creation
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Talk Bubbles */}
      <AnimatePresence>
        {/* Note: To track an NPC exactly over the video, adjust the 4 tracking coordinates 
            (startTop, endTop, startLeft, endLeft) so the bubble slides with their head! */}
        {zone === 'blacksmith' && !activeNPC && renderTalkBubble('blacksmith', "⚒ Projects", 248, 300, 40, 40, 75, 75)}
        {zone === 'wizard' && !activeNPC && renderTalkBubble('wizard', "📖 Skills & Technologies", 411, 450, 45, 45, 30, 30)}
        {zone === 'scholar' && !activeNPC && renderTalkBubble('scholar', "🎓 Education", 550, 601, 40, 40, 70, 70)}
        {zone === 'champion' && !activeNPC && renderTalkBubble('champion', "🏆 Achievements", 710, 750, 50, 50, 35, 35)}
        {zone === 'inventor' && !activeNPC && renderTalkBubble('inventor', "⚙ Future Vision", 844, 910, 35, 35, 65, 65)}
        {zone === 'astronomer' && !activeNPC && !letterUnlocked && renderTalkBubble('astronomer', "✦ Contact Info", 1020, 1050, 20, 20, 50, 50)}
        
        {!activeNPC && letterUnlocked && !isEnd && (
          <motion.button 
             initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
             onClick={() => setActiveNPC('finalLetter')}
             style={{ 
                position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', 
                padding: '15px 40px', background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', 
                color: '#111', border: '1px solid #fff', borderRadius: '4px', fontFamily: 'Cinzel', 
                letterSpacing: '3px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', 
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)', pointerEvents: 'auto' 
             }}
          >
             ✦ OPEN SEALED LETTER ✦
          </motion.button>
        )}
      </AnimatePresence>

      {/* End of Journey Quotation */}
      <AnimatePresence>
        {isEnd && !activeNPC && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 40, pointerEvents: 'none',
              background: 'rgba(0,0,0,0.4)', padding: '40px 60px', borderRadius: '20px', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', textAlign: 'center', lineHeight: '1.6' }}>
              <TypewriterText text="Engineer in Progress" delay={0.5} />
              <br />
              <TypewriterText text="Building What the Future Needs" delay={1.8} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NPC Custom UIs */}
      <AnimatePresence>
        {activeNPC === 'blacksmith' && <BlacksmithUI />}
        {activeNPC === 'wizard' && <WizardUI />}
        {activeNPC === 'scholar' && <ScholarUI />}
        {activeNPC === 'champion' && <ChampionUI />}
        {activeNPC === 'inventor' && <InventorUI />}
        {activeNPC === 'astronomer' && <AstronomerUI />}
        {activeNPC === 'finalLetter' && <FinalLetter />}
      </AnimatePresence>
    </div>
  )
}

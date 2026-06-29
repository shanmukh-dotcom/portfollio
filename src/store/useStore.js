import { create } from 'zustand'

const useStore = create((set, get) => ({
  targetFrame: 1,
  currentFrame: 1,
  totalFrames: 1200,
  introPlaying: false,
  activeNPC: null, // Track which NPC's UI is open (e.g., 'blacksmith', 'wizard')
  fragmentsCollected: 0,
  collectedFromNPCs: [],
  letterUnlocked: false,
  
  setTargetFrame: (frame) => {
    const clamped = Math.max(1, Math.min(frame, get().totalFrames))
    set({ targetFrame: clamped })
  },
  
  setCurrentFrame: (frame) => {
    set({ currentFrame: frame })
  },

  setIntroPlaying: (isPlaying) => set({ introPlaying: isPlaying }),

  setActiveNPC: (npcId) => set({ activeNPC: npcId }),
  
  collectFragment: (npcId) => set((state) => {
    if (!state.collectedFromNPCs.includes(npcId)) {
      const newCount = state.fragmentsCollected + 1
      return {
        fragmentsCollected: newCount,
        collectedFromNPCs: [...state.collectedFromNPCs, npcId],
        letterUnlocked: newCount >= 6,
        activeNPC: null
      }
    }
    return { activeNPC: null }
  }),
  
  closeUI: () => set({ activeNPC: null })
}))

export default useStore

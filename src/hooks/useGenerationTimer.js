import { useEffect, useReducer, useRef } from 'react'

// Approximate durations per stage in ms
const STAGE_DURATIONS = [45000, 60000, 60000]

const STAGES = [
  { label: 'Designing your influencer', hint: 'Crafting a unique persona for your brand...' },
  { label: 'Building character reference', hint: 'Creating consistent visual identity...' },
  { label: 'Creating UGC photo', hint: 'Generating your final influencer photo...' },
]

function timerReducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      const elapsed = state.elapsed + action.delta
      let stageElapsed = elapsed
      let stage = 0
      for (let i = 0; i < STAGE_DURATIONS.length; i++) {
        if (stageElapsed < STAGE_DURATIONS[i]) {
          return {
            ...state,
            elapsed,
            currentStage: i,
            stageProgress: Math.min(stageElapsed / STAGE_DURATIONS[i], 0.99),
          }
        }
        stageElapsed -= STAGE_DURATIONS[i]
        stage = i + 1
      }
      // All stages timed out — stay at last stage spinning
      return {
        ...state,
        elapsed,
        currentStage: STAGE_DURATIONS.length - 1,
        stageProgress: 0.99,
      }
    }
    default:
      return state
  }
}

export function useGenerationTimer(active) {
  const [state, dispatch] = useReducer(timerReducer, {
    elapsed: 0,
    currentStage: 0,
    stageProgress: 0,
  })

  const lastTickRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!active) return

    lastTickRef.current = performance.now()

    function tick(now) {
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      dispatch({ type: 'TICK', delta })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  return { ...state, stages: STAGES }
}

import { useState, useEffect } from 'react'
import { useGenerationTimer } from '../hooks/useGenerationTimer.js'

const TIPS = [
  'UGC content gets 4x more engagement than branded ads.',
  'AI-generated UGC can cut content production costs by 80%.',
  'Authentic-looking photos build trust faster than polished ads.',
  'Your influencer is being crafted to match your product vibe.',
  'The best UGC content tells a story — ours will too.',
  'Studies show UGC increases purchase intent by 76%.',
]

export default function GeneratingScreen({ state }) {
  const { currentStage, stageProgress, stages } = useGenerationTimer(true)
  const [tipIndex, setTipIndex] = useState(0)
  const [tipVisible, setTipVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTipVisible(false)
      setTimeout(() => {
        setTipIndex((i) => (i + 1) % TIPS.length)
        setTipVisible(true)
      }, 400)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* Product thumbnail */}
        {state.productUrl && (
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={state.productUrl}
                alt="Product"
                className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm"
              />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                <Spinner size={10} className="text-white" />
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-1">Creating your UGC photo</h2>
        <p className="text-gray-500 text-sm mb-8">This takes about 2-4 minutes. Hang tight!</p>

        {/* Stepper */}
        <div className="text-left mb-8 space-y-4">
          {stages.map((stage, i) => {
            const isCompleted = i < currentStage
            const isActive = i === currentStage
            const isFuture = i > currentStage

            return (
              <div key={i} className="flex items-start gap-3">
                {/* Step indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Spinner size={12} className="text-indigo-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Label + progress */}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isFuture ? 'text-gray-400' : 'text-gray-800'}`}>
                    {stage.label}
                  </p>
                  {isActive && (
                    <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${stageProgress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Rotating tip */}
        <div
          className="text-xs text-gray-400 italic transition-opacity duration-400"
          style={{ opacity: tipVisible ? 1 : 0 }}
        >
          {TIPS[tipIndex]}
        </div>
      </div>
    </div>
  )
}

function Spinner({ size = 16, className = '' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      style={{ width: size, height: size }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

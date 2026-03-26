const STYLES = [
  {
    id: 'auto',
    name: 'Auto-detect',
    description: 'Let AI pick the best match',
    icon: '✨',
  },
  {
    id: 'gen-z',
    name: 'Gen-Z lifestyle',
    description: 'Trendy, casual, social-first',
    icon: '📱',
  },
  {
    id: 'fitness',
    name: 'Fitness & wellness',
    description: 'Athletic, health-focused',
    icon: '💪',
  },
  {
    id: 'tech',
    name: 'Tech reviewer',
    description: 'Gadget-savvy, analytical',
    icon: '🖥️',
  },
  {
    id: 'luxury',
    name: 'Luxury & premium',
    description: 'Refined, aspirational',
    icon: '💎',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate, trustworthy',
    icon: '👔',
  },
]

export default function ConfigScreen({ state, dispatch, onGenerate }) {
  const { influencerStyle, productUrl } = state

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Back */}
        <button
          onClick={() => dispatch({ type: 'GO_TO_IDLE' })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Choose influencer style</h2>
          <p className="text-gray-500 text-sm mt-1">Select the vibe that best fits your brand.</p>
        </div>

        {/* Product reminder thumbnail */}
        {productUrl && (
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
            <img
              src={productUrl}
              alt="Product"
              className="w-12 h-12 object-cover rounded-lg border border-gray-100"
            />
            <p className="text-sm text-gray-600 truncate">{state.productDescription || 'Your product'}</p>
          </div>
        )}

        {/* Style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {STYLES.map((s) => {
            const selected = influencerStyle === s.id
            return (
              <button
                key={s.id}
                onClick={() => dispatch({ type: 'SET_STYLE', style: s.id })}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-semibold text-sm text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
              </button>
            )
          })}
        </div>

        <button
          onClick={onGenerate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          Generate UGC photo →
        </button>
      </div>
    </div>
  )
}

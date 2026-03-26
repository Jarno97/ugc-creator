import { useState } from 'react'

export default function ResultScreen({ state, dispatch, onRegenerate }) {
  const { result, generationDuration } = state
  const [heroUrl, setHeroUrl] = useState(result?.ugcImage)
  const [downloading, setDownloading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const thumbnails = [
    { url: result?.ugcImage, label: 'UGC Photo' },
    { url: result?.characterImage, label: 'Character' },
    { url: result?.characterSheet, label: 'Sheet' },
  ].filter((t) => t.url)

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch(heroUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ugc-photo.jpg'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: open in new tab
      window.open(heroUrl, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  const duration = generationDuration ? `${Math.round(generationDuration / 1000)}s` : null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Ready!
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your UGC photo is ready</h2>
          {duration && (
            <p className="text-gray-400 text-xs mt-1">Generated in {duration}</p>
          )}
        </div>

        {/* Hero image */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 cursor-zoom-in"
          style={{ animation: 'scaleIn 0.4s ease-out' }}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={heroUrl}
            alt="Generated UGC photo"
            className="w-full object-cover"
            style={{ maxHeight: '540px' }}
          />
        </div>

        {/* Thumbnails */}
        {thumbnails.length > 1 && (
          <div className="flex gap-2 mb-5 justify-center">
            {thumbnails.map((t) => (
              <button
                key={t.url}
                onClick={() => setHeroUrl(t.url)}
                className={`rounded-xl overflow-hidden border-2 transition-all ${
                  heroUrl === t.url ? 'border-indigo-500' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img src={t.url} alt={t.label} className="w-20 h-20 object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {downloading ? (
              <Spinner size={14} className="text-white" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            Download
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm border border-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            Start over
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={heroUrl}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
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

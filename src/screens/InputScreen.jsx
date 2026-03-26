import { useState, useRef, useCallback } from 'react'
import { uploadToImgbb } from '../api/webhook.js'

export default function InputScreen({ state, dispatch }) {
  const { productUrl, productDescription } = state
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const canContinue = productUrl.trim() && productDescription.trim() && imageLoaded && !uploading

  function handleUrlChange(e) {
    dispatch({ type: 'SET_INPUT', field: 'productUrl', value: e.target.value })
    setImageLoaded(false)
    setImageError(false)
  }

  const handleFile = useCallback(async (file) => {
    if (!file?.type.startsWith('image/')) return
    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadToImgbb(file)
      dispatch({ type: 'SET_INPUT', field: 'productUrl', value: url })
      setImageLoaded(false)
      setImageError(false)
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [dispatch])

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const showPreview = productUrl.trim() && !imageError

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">UGC Creator</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your UGC photo</h1>
          <p className="text-gray-500 text-sm mt-1">AI-generated influencer photos with your product in seconds.</p>
        </div>

        {/* Product URL */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Product image URL
          </label>
          <input
            type="url"
            value={productUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/product-image.jpg"
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />

          {/* Drag & Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
                <Spinner size={14} />
                Uploading image...
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                or <span className="text-indigo-600 font-medium">drag & drop</span> / <span className="text-indigo-600 font-medium">click to upload</span> an image
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
        </div>

        {/* Image Preview */}
        {showPreview && (
          <div className="mb-5">
            <img
              src={productUrl}
              alt="Product preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-100 shadow-sm"
              onLoad={() => { setImageLoaded(true); setImageError(false) }}
              onError={() => { setImageError(true); setImageLoaded(false) }}
            />
          </div>
        )}
        {imageError && (
          <p className="text-red-500 text-xs mb-4 -mt-2">Could not load image from that URL.</p>
        )}

        {/* Description */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Product description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => dispatch({ type: 'SET_INPUT', field: 'productDescription', value: e.target.value.slice(0, 500) })}
            rows={4}
            placeholder="Describe your product — what it is, who it's for, key features or vibe..."
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            <span className={productDescription.length > 450 ? 'text-amber-500' : ''}>
              {productDescription.length}
            </span>/500
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => dispatch({ type: 'GO_TO_CONFIG' })}
          disabled={!canContinue}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

function Spinner({ size = 16 }) {
  return (
    <svg
      className="animate-spin text-current"
      style={{ width: size, height: size }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

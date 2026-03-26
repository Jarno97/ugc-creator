export default function ErrorScreen({ state, dispatch, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Generation failed</h2>
        <p className="text-gray-500 text-sm mb-8">
          {state.error || 'Something went wrong. Please try again.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={onRetry}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm border border-gray-200 transition-colors"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  )
}

import { useReducer, useRef, useCallback } from 'react'
import { reducer, initialState } from './reducer.js'
import { callWebhook } from './api/webhook.js'
import InputScreen from './screens/InputScreen.jsx'
import ConfigScreen from './screens/ConfigScreen.jsx'
import GeneratingScreen from './screens/GeneratingScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import ErrorScreen from './screens/ErrorScreen.jsx'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const abortRef = useRef(null)

  const handleGenerate = useCallback(async () => {
    // Abort any in-progress request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    // 5-minute hard timeout — aborts fetch if n8n never responds
    const timeout = setTimeout(() => controller.abort(), 10 * 60 * 1000)

    const startedAt = Date.now()
    dispatch({ type: 'START_GENERATION' })

    try {
      const result = await callWebhook(
        {
          productUrl: state.productUrl,
          productDescription: state.productDescription,
          influencerStyle: state.influencerStyle,
        },
        controller.signal,
      )
      clearTimeout(timeout)
      dispatch({
        type: 'GENERATION_COMPLETE',
        result,
        duration: Date.now() - startedAt,
      })
    } catch (err) {
      clearTimeout(timeout)
      if (err.name === 'AbortError') {
        dispatch({ type: 'GENERATION_ERROR', error: 'Generation timed out after 10 minutes. Please try again.' })
        return
      }
      dispatch({
        type: 'GENERATION_ERROR',
        error: err.message || 'Something went wrong',
      })
    }
  }, [state.productUrl, state.productDescription, state.influencerStyle])

  const handleRegenerate = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  const handleRetry = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  switch (state.screen) {
    case 'idle':
      return <InputScreen state={state} dispatch={dispatch} />
    case 'configuring':
      return <ConfigScreen state={state} dispatch={dispatch} onGenerate={handleGenerate} />
    case 'generating':
      return <GeneratingScreen state={state} />
    case 'complete':
      return <ResultScreen state={state} dispatch={dispatch} onRegenerate={handleRegenerate} />
    case 'error':
      return <ErrorScreen state={state} dispatch={dispatch} onRetry={handleRetry} />
    default:
      return null
  }
}

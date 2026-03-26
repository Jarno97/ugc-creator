export const initialState = {
  screen: 'idle', // idle | configuring | generating | complete | error
  productUrl: '',
  productDescription: '',
  influencerStyle: 'auto',
  result: null,
  error: null,
  generationStartedAt: null,
  generationDuration: null,
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, [action.field]: action.value }

    case 'GO_TO_CONFIG':
      return { ...state, screen: 'configuring' }

    case 'GO_TO_IDLE':
      return { ...state, screen: 'idle' }

    case 'SET_STYLE':
      return { ...state, influencerStyle: action.style }

    case 'START_GENERATION':
      return {
        ...state,
        screen: 'generating',
        result: null,
        error: null,
        generationStartedAt: Date.now(),
        generationDuration: null,
      }

    case 'GENERATION_COMPLETE':
      return {
        ...state,
        screen: 'complete',
        result: action.result,
        generationDuration: action.duration,
        error: null,
      }

    case 'GENERATION_ERROR':
      return {
        ...state,
        screen: 'error',
        error: action.error,
      }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}

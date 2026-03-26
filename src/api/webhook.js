const MOCK_DELAY = 8000

const MOCK_RESULT = {
  success: true,
  ugcImage: 'https://picsum.photos/seed/ugc/800/1000',
  characterImage: 'https://picsum.photos/seed/char/600/800',
  characterSheet: 'https://picsum.photos/seed/sheet/800/600',
}

export async function callWebhook({ productUrl, productDescription, influencerStyle }, signal) {
  if (import.meta.env.VITE_MOCK_MODE === 'true') {
    await new Promise((resolve, reject) => {
      const t = setTimeout(resolve, MOCK_DELAY)
      signal?.addEventListener('abort', () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
    return MOCK_RESULT
  }

  const url = import.meta.env.VITE_N8N_WEBHOOK_URL
  if (!url) throw new Error('VITE_N8N_WEBHOOK_URL is not configured')

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productUrl, productDescription, influencerStyle }),
    signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed (${res.status})`)
  }

  const data = await res.json()

  // Debug: log what n8n actually returned
  console.log('[webhook] response:', data)

  // n8n "Respond immediately" mode returns { executionId } instead of the final result.
  // Fix: in your n8n Webhook node → "Respond" → set to "When last node finishes".
  if (data.executionId && !data.success) {
    throw new Error(
      `n8n responded immediately with executionId "${data.executionId}" instead of the final result. ` +
      `Open your n8n Webhook node, set "Respond" to "When last node finishes", then re-test.`
    )
  }

  if (!data.success) throw new Error(data.error || `Unexpected response: ${JSON.stringify(data)}`)
  return data
}

export async function uploadToImgbb(file) {
  const key = import.meta.env.VITE_IMGBB_API_KEY
  if (!key) throw new Error('VITE_IMGBB_API_KEY is not configured')

  const base64 = await fileToBase64(file)
  const form = new FormData()
  form.append('image', base64.split(',')[1])

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body: form,
  })

  const data = await res.json()
  if (!data.success) throw new Error(data.error?.message || 'Upload failed')
  return data.data.url
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

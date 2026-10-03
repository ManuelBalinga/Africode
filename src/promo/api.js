import { PROMO } from '../config'

// Talks to the Apps Script web app (promo-setup/Code.gs).
// POSTs use text/plain so the browser skips the CORS preflight, which Apps
// Script cannot answer.

// In `next dev` with no SCRIPT_URL we fake the backend so the page can be
// tested. In production a missing URL is an error — never silently drop a lead.
const DEV_FAKE = !PROMO.SCRIPT_URL && process.env.NODE_ENV !== 'production'

async function post(payload) {
  const res = await fetch(PROMO.SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function getStatus() {
  if (DEV_FAKE) return { ok: true, total: PROMO.TOTAL_SLOTS, used: 0, taken: [] }
  if (!PROMO.SCRIPT_URL) return { ok: false, error: 'not-configured' }
  try {
    const res = await fetch(`${PROMO.SCRIPT_URL}?action=status`)
    return await res.json()
  } catch {
    return { ok: false, error: 'network' }
  }
}

export async function submitIntake(fields) {
  if (DEV_FAKE) {
    console.info('[promo dev] submit', fields)
    return { ok: true, id: 'DEV-0001' }
  }
  if (!PROMO.SCRIPT_URL) return { ok: false, error: 'not-configured' }
  try {
    return await post({ action: 'submit', ...fields })
  } catch {
    return { ok: false, error: 'network' }
  }
}

export async function uploadPhoto(id, kind, photo) {
  if (DEV_FAKE) return { ok: true }
  try {
    return await post({ action: 'photo', id, kind, name: photo.name, mime: photo.mime, data: photo.data })
  } catch {
    return { ok: false, error: 'network' }
  }
}

// Shrink a photo in the browser before upload: longest side 1600px, JPEG 0.82.
// Phone photos are 3–8 MB; this brings them to roughly 200–400 KB.
export async function compressImage(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
  const data = await new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(blob)
  })
  return { name: file.name.replace(/\.[^.]+$/, '') + '.jpg', mime: 'image/jpeg', data, bytes: blob.size }
}

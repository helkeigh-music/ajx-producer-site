import { put } from '@vercel/blob'
import { readCatalog, slugify, verifyAdminPassword, writeCatalog, type StoredBeat, type LicenseTier } from '../lib/beatsStore'

const VALID_TIERS: LicenseTier[] = ['basic', 'premium', 'exclusive']

function parsePrices(form: FormData): StoredBeat['prices'] {
  const prices: NonNullable<StoredBeat['prices']> = {}
  for (const tier of VALID_TIERS) {
    const raw = String(form.get(`price_${tier}`) ?? '').trim()
    const value = Number(raw)
    if (Number.isFinite(value) && value > 0) prices[tier] = value
  }
  return Object.keys(prices).length ? prices : undefined
}

export async function POST(req: Request) {
  const form = await req.formData()
  const password = String(form.get('password') ?? '')

  if (!verifyAdminPassword(password)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: 'Blob storage not configured. Add BLOB_READ_WRITE_TOKEN for uploads.' },
      { status: 500 },
    )
  }

  const title = String(form.get('title') ?? '').trim()
  const bpm = Number(form.get('bpm'))
  const key = String(form.get('key') ?? '').trim()
  const priceGbp = Number(form.get('priceGbp'))
  const tagsRaw = String(form.get('tags') ?? '')
  const embedUrl = String(form.get('embedUrl') ?? '').trim()
  const previewFile = form.get('previewFile')
  const leaseFile = form.get('leaseFile')

  if (!title || !key || !Number.isFinite(bpm) || !Number.isFinite(priceGbp)) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const hasPreviewFile = previewFile instanceof File && previewFile.size > 0
  if (!embedUrl && !hasPreviewFile) {
    return Response.json({ error: 'Add a SoundCloud/YouTube link or upload an MP3 preview' }, { status: 400 })
  }

  if (hasPreviewFile && !previewFile.type.includes('audio') && !previewFile.name.toLowerCase().endsWith('.mp3')) {
    return Response.json({ error: 'Upload an MP3 preview file' }, { status: 400 })
  }

  const id = `${slugify(title)}-${Date.now().toString(36)}`
  let audioUrl: string | undefined

  if (hasPreviewFile) {
    const previewPath = `ajx/beats/${id}-preview.mp3`
    const uploadedPreview = await put(previewPath, previewFile, {
      access: 'public',
      contentType: 'audio/mpeg',
      addRandomSuffix: false,
    })
    audioUrl = uploadedPreview.url
  }

  const leaseFiles: NonNullable<StoredBeat['leaseFiles']> = {}
  if (leaseFile instanceof File && leaseFile.size > 0) {
    const ext = leaseFile.name.includes('.') ? leaseFile.name.split('.').pop() : 'zip'
    const leasePath = `ajx/leases/${id}/basic.${ext}`
    const uploadedLease = await put(leasePath, leaseFile, {
      access: 'public',
      contentType: leaseFile.type || 'application/octet-stream',
      addRandomSuffix: false,
    })
    leaseFiles.basic = uploadedLease.url
  }

  const beat: StoredBeat = {
    id,
    title,
    bpm,
    key,
    priceGbp,
    prices: parsePrices(form),
    tags: tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    embedUrl: embedUrl || undefined,
    audioUrl,
    leaseFiles: Object.keys(leaseFiles).length ? leaseFiles : undefined,
    createdAt: new Date().toISOString(),
  }

  const existing = await readCatalog()
  await writeCatalog([beat, ...existing])

  return Response.json({ ok: true, beat })
}

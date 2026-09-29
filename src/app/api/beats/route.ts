import { listBeats } from '@/lib/server/seedBeats'

export async function GET() {
  const beats = await listBeats()
  return Response.json({ beats })
}

import { listBeats } from './lib/seedBeats'

export async function GET() {
  const beats = await listBeats()
  return Response.json({ beats })
}

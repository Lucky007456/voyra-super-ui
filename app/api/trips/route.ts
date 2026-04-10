import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabaseServer'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('trips').select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return Response.json(data)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('trips').insert({
    user_id: userId, ...body
  }).select().single()
  if (error) return Response.json({ error }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const supabase = await createServerSupabaseClient()
  await supabase.from('trips').delete()
    .eq('id', id).eq('user_id', userId)
  return Response.json({ success: true })
}

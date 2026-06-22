import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceClient } from '@/lib/supabase'

async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const showArchived = searchParams.get('archived') === 'true'

    const supabase = getServiceClient()
    let query = supabase.from('employee_onboarding').select('*').order('created_at', { ascending: false })
    if (!showArchived) query = query.neq('archived', true)
    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions: data })
  } catch (err) {
    console.error('GET /api/submissions error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await request.json()
    const supabase = getServiceClient()

    const { error } = await supabase
      .from('employee_onboarding')
      .update({ status })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/submissions error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

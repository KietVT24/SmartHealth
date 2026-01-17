import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Find user with verification token
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('verificationToken', token)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Update user as verified
    const { error } = await supabase
      .from('users')
      .update({
        emailVerified: new Date().toISOString(),
        verificationToken: null,
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
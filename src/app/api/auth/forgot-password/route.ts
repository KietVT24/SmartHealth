import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user by email
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: 'If an account with this email exists, a reset link has been sent.' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Update user with reset token
    const { error } = await supabase
      .from('users')
      .update({
        resetToken,
        resetTokenExpiry: resetTokenExpiry.toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'Failed to generate reset token' }, { status: 500 })
    }

    // Send reset email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({ message: 'If an account with this email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
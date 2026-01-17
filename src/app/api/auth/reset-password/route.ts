import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    // Find user with valid reset token
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('resetToken', token)
      .gt('resetTokenExpiry', new Date().toISOString())

    const user = users && users.length > 0 ? users[0] : null

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear reset token
    const { error } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating password:', error)
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
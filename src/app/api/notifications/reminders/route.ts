import { NextRequest, NextResponse } from 'next/server';
import { createVaccinationReminders, createGrowthTrackingReminders } from '@/lib/notifications';

/**
 * API endpoint to trigger automated reminders
 * This should be called by a cron job or scheduler
 * 
 * Example usage:
 * POST /api/notifications/reminders
 * Headers: { "Authorization": "Bearer YOUR_CRON_SECRET" }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (optional but recommended for production)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create vaccination reminders
    const vaccinationCount = await createVaccinationReminders();

    // Create growth tracking reminders
    const growthTrackingCount = await createGrowthTrackingReminders();

    return NextResponse.json({
      success: true,
      message: 'Reminders created successfully',
      data: {
        vaccinationReminders: vaccinationCount,
        growthTrackingReminders: growthTrackingCount,
        total: vaccinationCount + growthTrackingCount,
      },
    });
  } catch (error) {
    console.error('Error creating reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

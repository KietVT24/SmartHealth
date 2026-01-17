import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get childId from query params
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID is required' },
        { status: 400 }
      );
    }

    // Verify that the child belongs to this user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: user.id,
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found or access denied' },
        { status: 404 }
      );
    }

    // Get all growth records for this child
    const growthRecords = await prisma.growthRecord.findMany({
      where: {
        childId: childId,
      },
      orderBy: {
        measuredAt: 'asc',
      },
    });

    return NextResponse.json(growthRecords);
  } catch (error) {
    console.error('Error fetching growth records:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { childId, height, weight, headCircumference, notes, measuredAt } = body;

    // Validate required fields
    if (!childId || !height || !weight) {
      return NextResponse.json(
        { error: 'Missing required fields (childId, height, weight)' },
        { status: 400 }
      );
    }

    // Verify that the child belongs to this user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: user.id,
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found or access denied' },
        { status: 404 }
      );
    }

    // Create new growth record
    const growthRecord = await prisma.growthRecord.create({
      data: {
        childId,
        height: parseFloat(height),
        weight: parseFloat(weight),
        headCircumference: headCircumference ? parseFloat(headCircumference) : null,
        notes,
        measuredAt: measuredAt ? new Date(measuredAt) : new Date(),
      },
    });

    // Send notification to user
    try {
      const { createNotification } = await import('@/lib/notifications');
      await createNotification({
        userId: user.id,
        type: 'GROWTH_TRACKING',
        title: 'Đã cập nhật số đo phát triển',
        message: `Bạn vừa cập nhật số đo cho bé ${child.name}: Chiều cao ${height}cm, Cân nặng ${weight}kg`,
        link: '/analytics',
      });
    } catch (notificationError) {
      // Don't fail the request if notification fails
      console.error('Error creating notification:', notificationError);
    }

    return NextResponse.json(growthRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating growth record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

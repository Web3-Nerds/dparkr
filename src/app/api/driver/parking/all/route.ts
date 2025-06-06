import { NextRequest, NextResponse } from 'next/server';

import db from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const parkings = await db.parking.findMany({
      where: {
        isActive: true,
      },
      include: {
        owner: {
          select: {
            name: true,
            avatar: true,
          },
        },
        bookings: {
          select: {
            startTime: true,
            endTime: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(parkings);
  } catch (error) {
    console.error('Error fetching parkings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parkings' },
      { status: 500 }
    );
  }
}

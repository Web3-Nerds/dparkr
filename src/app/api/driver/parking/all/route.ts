import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const parkings = await db.parking.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        owner: { select: { name: true, avatar: true } },
        bookings: { select: { startTime: true, endTime: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const res = NextResponse.json(parkings);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (error) {
    console.error('Error fetching parkings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parkings' },
      { status: 500 },
    );
  }
}

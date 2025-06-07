import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prismaClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get('ownerId');

  if (!ownerId) {
    return NextResponse.json({ error: 'Missing ownerId' }, { status: 400 });
  }

  const bookings = await db.booking.findMany({
    where: {
      parking: {
        ownerId,
      },
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
      parking: {
        select: { title: true, address: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(bookings);
}

export async function PATCH(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        parking: {
          select: { title: true, address: true },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error confirming booking:', error);
    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    );
  }
}

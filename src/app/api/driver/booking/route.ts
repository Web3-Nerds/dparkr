import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import db from '@/lib/prismaClient';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, parkingId, startTime, endTime, totalPrice } = body;

    if (!userId || !parkingId || !startTime || !endTime || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const parking = await db.parking.findUnique({
      where: { id: parkingId },
    });

    // if (!parking || !parking.isActive) {
    //   return NextResponse.json(
    //     { error: 'Parking space not available' },
    //     { status: 404 }
    //   );
    // }

    // const conflictingBookings = await prisma.booking.findMany({
    //   where: {
    //     parkingId,
    //     status: {
    //       in: ['PENDING', 'CONFIRMED'],
    //     },
    //     OR: [
    //       {
    //         AND: [
    //           { startTime: { lte: startTime } },
    //           { endTime: { gt: startTime } },
    //         ],
    //       },
    //       {
    //         AND: [
    //           { startTime: { lt: endTime } },
    //           { endTime: { gte: endTime } },
    //         ],
    //       },
    //       {
    //         AND: [
    //           { startTime: { gte: startTime } },
    //           { endTime: { lte: endTime } },
    //         ],
    //       },
    //     ],
    //   },
    // });

    // if (conflictingBookings.length > 0) {
    //   return NextResponse.json(
    //     { error: 'Parking space is already booked for this time slot' },
    //     { status: 409 }
    //   );
    // }

    const booking = await db.booking.create({
      data: {
        userId,
        parkingId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalPrice,
        status: 'PENDING',
      },
      include: {
        parking: {
          select: {
            title: true,
            address: true,
            pricePerHour: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const bookings = await db.booking.findMany({
    where: {
      userId,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
    include: {
      parking: {
        select: {
          title: true,
          address: true,
        },
      },
    },
    orderBy: {
      startTime: 'desc',
    },
  });

  return NextResponse.json(bookings);
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');
//
//     const whereClause = userId ? { userId } : {};
//
//     const bookings = await prisma.booking.findMany({
//       where: whereClause,
//       include: {
//         parking: {
//           select: {
//             title: true,
//             address: true,
//             latitude: true,
//             longitude: true,
//             pricePerHour: true,
//           },
//         },
//         user: {
//           select: {
//             name: true,
//             email: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//
//     return NextResponse.json(bookings);
//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch bookings' },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        parking: {
          select: {
            title: true,
            address: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

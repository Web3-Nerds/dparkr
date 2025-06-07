import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import db from '@/lib/prismaClient';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        walletAddress: true,
        createdAt: true, 
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userDataForClient = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.avatar || '', 
      provider: session.user.provider || 'google', 
      role: 'user',
      joinedAt: user.createdAt?.toISOString() || undefined, 
    };

    return NextResponse.json(userDataForClient);
  } catch (error) {
    console.error('Error fetching user data from DB:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

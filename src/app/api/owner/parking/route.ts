import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import db from '@/lib/prismaClient'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { parkings: true },
  })

  return NextResponse.json(user?.parkings || [])
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const newParking = await db.parking.create({
    data: {
      ownerId: user.id,
      title: data.title,
      description: data.description,
      longitude: data.longitude,
      latitude: data.latitude,
      address: data.address,
      pricePerHour: data.pricePerHour,
    },
  })

  return NextResponse.json(newParking)
}

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
    include: {
      parkings: {
        where: {
          deletedAt: null,    
        },
        orderBy: { createdAt: 'desc' },  
      },
    },
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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  const { searchParams } = new URL(req.url)
  const parkingId = searchParams.get('id')
  if (!parkingId) {
    return NextResponse.json({ error: 'Missing parking id' }, { status: 400 })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const existingParking = await db.parking.findFirst({
    where: {
      id: parkingId,
      ownerId: user.id,
    },
  })

  if (!existingParking) {
    return NextResponse.json(
      { error: 'Parking not found or you do not have permission to edit it' },
      { status: 404 }
    )
  }

  try {
    const updatedParking = await db.parking.update({
      where: { id: parkingId },
      data: {
        title: data.title,
        description: data.description,
        longitude: data.longitude,
        latitude: data.latitude,
        address: data.address,
        pricePerHour: data.pricePerHour,
      },
    })

    return NextResponse.json(updatedParking)
  } catch (error) {
    console.error('Error updating parking:', error)
    return NextResponse.json(
      { error: 'Failed to update parking' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const parkingId = searchParams.get('id')
  if (!parkingId) {
    return NextResponse.json({ error: 'Missing parking id' }, { status: 400 })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const existingParking = await db.parking.findFirst({
    where: {
      id: parkingId,
      ownerId: user.id,
      deletedAt: null,   
    },
  })
  if (!existingParking) {
    return NextResponse.json(
      { error: 'Parking not found or unauthorized' },
      { status: 404 }
    )
  }

  try {
    const softDeleted = await db.parking.update({
      where: { id: parkingId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    })
    return NextResponse.json({
      message: 'Parking deleted successfully',
      parking: softDeleted,
    })
  } catch (error) {
    console.error('Error soft-deleting parking:', error)
    return NextResponse.json(
      { error: 'Failed to delete parking' },
      { status: 500 }
    )
  }
}

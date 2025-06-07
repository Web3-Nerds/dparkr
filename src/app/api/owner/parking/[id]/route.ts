import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import db from '@/lib/prismaClient'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const parkingId = params.id

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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parkingId = params.id

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
      { error: 'Parking not found or you do not have permission to delete it' },
      { status: 404 }
    )
  }

  try {
    await db.parking.delete({
      where: { id: parkingId },
    })

    return NextResponse.json({ message: 'Parking deleted successfully' })
  } catch (error) {
    console.error('Error deleting parking:', error)
    return NextResponse.json(
      { error: 'Failed to delete parking' },
      { status: 500 }
    )
  }
}

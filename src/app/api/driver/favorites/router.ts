import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import db from '@/lib/prismaClient'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { favorites: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ favorites: user.favorites })
}

export async function PUT(
  req: Request,
  { params }: { params: { parkingId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { parkingId } = params

  // ensure parking exists
  const parking = await db.parking.findUnique({ where: { id: parkingId } })
  if (!parking) {
    return NextResponse.json({ error: 'Parking not found' }, { status: 404 })
  }

  // load current favorites
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, favorites: true },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // add if not already in favorites
  if (user.favorites.includes(parkingId)) {
    return NextResponse.json({ message: 'Already favorited' })
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      favorites: {
        push: parkingId,
      },
    },
    select: { favorites: true },
  })

  return NextResponse.json({ favorites: updated.favorites })
}

export async function DELETE(
  req: Request,
  { params }: { params: { parkingId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { parkingId } = params

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, favorites: true },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // remove the parkingId
  const newFavorites = user.favorites.filter((id) => id !== parkingId)

  const updated = await db.user.update({
    where: { id: user.id },
    data: { favorites: newFavorites },
    select: { favorites: true },
  })

  return NextResponse.json({ favorites: updated.favorites })
}

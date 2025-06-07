'use client'

import { useEffect, useState } from 'react'
import { Parking } from '@prisma/client'

export function useGetAllParkings() {
  const [parkings, setParkings] = useState<Parking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch('/api/owner/parking')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch parkings')
        return res.json()
      })
      .then((data) => setParkings(data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { parkings, loading, error }
}

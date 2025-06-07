'use client'

import { useEffect, useState } from 'react';

export interface Booking {
  id: string;
  parking: {
    title: string;
    address: string;
  };
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
}

export const useGetAllUserBookings = (userId: string | undefined) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBookings([]);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/driver/booking?userId=${userId}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  return { bookings, loading };
};

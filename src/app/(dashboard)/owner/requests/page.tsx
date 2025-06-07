'use client';
import React, { useEffect, useState } from 'react';
import { useGetUser } from '@/hooks/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Mail, DollarSign } from 'lucide-react';

interface OwnerBooking {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  bookingTxId?: string;
  user: {
    name: string | null;
    email: string;
  };
  parking: {
    title: string;
    address: string;
    pricePerHour: number;
  };
}

export default function BookingRequestsPage() {
  const { userData } = useGetUser();
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  const fetchBookings = async () => {
    if (!userData?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/owner/bookings?ownerId=${userData.id}`);
      const data: OwnerBooking[] = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching owner bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userData]);

  const handleConfirm = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await fetch('/api/owner/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action: 'CONFIRM' }),
      });
      await fetchBookings();
    } catch (err) {
      console.error('Error confirming booking', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await fetch('/api/owner/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action: 'CANCEL' }),
      });
      await fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      CONFIRMED: { variant: 'default' as const, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      CANCELLED: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge className={config.color}>
        {status}
      </Badge>
    );
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return hours;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'ALL' || booking.status === filter
  );

  const getFilterCounts = () => {
    return {
      ALL: bookings.length,
      PENDING: bookings.filter(b => b.status === 'PENDING').length,
      CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
      CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Requests</h1>
          <p className="text-muted-foreground">Loading your booking requests...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking Requests</h1>
        <p className="text-muted-foreground">
          Manage booking requests for your parking spaces.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {(['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'] as const).map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(filterOption)}
            className="flex items-center gap-2"
          >
            <span>{filterOption.charAt(0) + filterOption.slice(1).toLowerCase()}</span>
            <Badge variant="outline" className="text-xs">
              {counts[filterOption]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Booking Cards */}
      {filteredBookings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No booking requests</h3>
              <p>
                {filter === 'ALL' 
                  ? "You don't have any booking requests yet." 
                  : `No ${filter.toLowerCase()} bookings found.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const startDateTime = formatDateTime(booking.startTime);
            const endDateTime = formatDateTime(booking.endTime);
            const duration = calculateDuration(booking.startTime, booking.endTime);
            
            return (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">
                      {booking.parking.title}
                    </CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {booking.parking.address}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {booking.user.name || 'Anonymous User'}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" />
                        <span className="truncate">{booking.user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Start: {startDateTime.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{startDateTime.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>End: {endDateTime.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{endDateTime.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Duration: {duration} hour{duration !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center font-semibold text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>${booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleConfirm(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="flex-1"
                      >
                        {actionLoading === booking.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Confirming...
                          </>
                        ) : (
                          'Confirm'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="flex-1"
                      >
                        {actionLoading === booking.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            Cancelling...
                          </>
                        ) : (
                          'Cancel'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

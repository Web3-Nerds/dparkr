'use client';
import { useGetUser } from '@/hooks/userProfile';
import { useGetAllUserBookings } from '../hooks/getAllUserBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, DollarSign, Car } from 'lucide-react';

export default function BookingsPage() {
  const { userData } = useGetUser();
  const { bookings, loading } = useGetAllUserBookings(userData?.id);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { dateStr, timeStr };
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Car className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          You haven't made any parking space bookings. Start by exploring available parking spaces in your area.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">
          Manage and track all your parking space reservations
        </p>
      </div>

      {/* Stats Cards */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSkeleton />
        ) : bookings.length === 0 ? (
          <EmptyState />
        ) : (
          bookings.map((booking) => {
            const startDate = formatDateTime(booking.startTime);
            const endDate = formatDateTime(booking.endTime);
            
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{booking.parking.title}</CardTitle>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{booking.parking.address}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Booking Duration */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Duration</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">From:</span>
                          <span className="text-sm font-medium">{startDate.dateStr}</span>
                          <span className="text-sm text-muted-foreground">at</span>
                          <span className="text-sm font-medium">{startDate.timeStr}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">To:</span>
                          <span className="text-sm font-medium">{endDate.dateStr}</span>
                          <span className="text-sm text-muted-foreground">at</span>
                          <span className="text-sm font-medium">{endDate.timeStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Total Cost</span>
                      </div>
                      <div className="pl-6">
                        <span className="text-2xl font-bold text-green-600">
                          ${booking.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking ID */}
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Booking ID: #{booking.id}</span>
                    <span>
                      Booked on {new Date(booking.startTime).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

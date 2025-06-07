'use client'
import { useGetUser } from '@/hooks/userProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, MapPin, Clock } from 'lucide-react';
import ParkingMapCard from './components/ParkingMapCard';

export default function Page() {
  const { userData, loading, error } = useGetUser();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Skeleton className="h-96 w-full rounded-t-lg" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Parking Map</h1>
          <p className="text-muted-foreground">
            Find and book parking spaces near you
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load user data. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const firstName = userData?.name?.split(' ')[0] || 'User';
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Hello, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Find and book parking spaces near you
            </p>
          </div>

          <Card className="bg-gradient-to-r from-teal-900/60 via-teal-700/40 to-emerald-900/60 border-emerald-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-emerald-300" />
                <span className="text-gray-200 font-medium">{currentTime}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Local time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-900/60 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-300">Live Availability</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Real-time parking updates</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-900/60 via-indigo-700/40 to-indigo-900/60 border-indigo-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-300" />
                <span className="text-sm font-medium text-indigo-200">GPS Enabled</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Accurate location tracking</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-900/60 via-amber-700/40 to-amber-900/60 border-amber-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-gray-900 font-bold">₹</span>
                </div>
                <span className="text-sm font-medium text-amber-300">Best Prices</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Competitive hourly rates</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ParkingMapCard />
    </div>
  );
}

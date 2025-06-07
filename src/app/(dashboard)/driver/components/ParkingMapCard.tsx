'use client';
import { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useGetAllParkings } from '../hooks/getAllParkings';
import { useGetUser } from '@/hooks/userProfile';
import { Parking } from '@prisma/client';
import BookingModal from './BookingModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Navigation, 
  DollarSign, 
  Clock, 
  Car,
  Locate,
  AlertCircle,
  Star,
  Route
} from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '450px',
  borderRadius: '0.75rem',
  overflow: 'hidden'
};

interface ParkingWithOwner extends Parking {
  owner: {
    name: string | null;
    avatar: string | null;
  };
  bookings: Array<{
    startTime: Date;
    endTime: Date;
    status: string;
  }>;
}

interface BookingData {
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
}

export default function ParkingMapCard() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
  });

  const { parkings, loading: parkingsLoading } = useGetAllParkings();
  const { userData } = useGetUser();
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isRecentering, setIsRecentering] = useState(false);
  const [selectedParking, setSelectedParking] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    startTime: '',
    endTime: '',
    totalHours: 0,
    totalPrice: 0
  });
  const [isBooking, setIsBooking] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getNearestParkings = () => {
    if (!currentPosition || !parkings.length) return [];

    return parkings
      .map(parking => ({
        ...parking,
        distance: calculateDistance(
          currentPosition.lat,
          currentPosition.lng,
          parking.latitude,
          parking.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsRecentering(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(newPosition);

          if (mapRef.current) {
            mapRef.current.panTo(newPosition);
          }
          setIsRecentering(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please enable location services.');
          setIsRecentering(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleBookingClick = (parking: any) => {
    setSelectedParking(parking);
    setIsBookingModalOpen(true);

    // Set default times (current time + 1 hour)
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setBookingData({
      startTime: now.toISOString().slice(0, 16),
      endTime: oneHourLater.toISOString().slice(0, 16),
      totalHours: 1,
      totalPrice: parking.pricePerHour
    });
  };

  const handleTimeChange = () => {
    if (bookingData.startTime && bookingData.endTime && selectedParking) {
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));

      if (hours > 0) {
        setBookingData(prev => ({
          ...prev,
          totalHours: hours,
          totalPrice: hours * selectedParking.pricePerHour
        }));
      }
    }
  };

  useEffect(() => {
    handleTimeChange();
  }, [bookingData.startTime, bookingData.endTime, selectedParking]);

  const handleBookingSubmit = async () => {
    if (!selectedParking || !userData) return;

    setIsBooking(true);
    try {
      const response = await fetch('/api/driver/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          parkingId: selectedParking.id,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          totalPrice: bookingData.totalPrice,
        }),
      });

      if (!response.ok) throw new Error('Booking failed');

      // Close modal and show success
      setIsBookingModalOpen(false);
      alert('Booking successful!');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <Skeleton className="h-[450px] w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
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

  if (!isLoaded) return <LoadingSkeleton />;

  if (locationError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {locationError}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={getCurrentLocation}
              className="ml-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!currentPosition) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Locate className="h-12 w-12 text-blue-600 animate-pulse mb-4" />
          <h3 className="text-lg font-semibold mb-2">Getting your location...</h3>
          <p className="text-muted-foreground text-center">
            Please allow location access to find parking spaces near you.
          </p>
        </CardContent>
      </Card>
    );
  }

  const nearestParkings = getNearestParkings();

  return (
    <div className="space-y-6">
      {/* Enhanced Map Container */}
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Parking Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isRecentering}
                className="gap-2"
              >
                <Navigation className={`h-4 w-4 ${isRecentering ? 'animate-spin' : ''}`} />
                {isRecentering ? 'Locating...' : 'Recenter'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div style={containerStyle} className="relative">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={currentPosition}
              zoom={13}
              onLoad={onMapLoad}
              options={{
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              }}
            >
              {/* User location marker */}
              <Marker
                position={currentPosition}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
	<circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgba(59,130,246,0.2); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<circle cx="45" cy="45" r="15" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(59,130,246); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<circle cx="45" cy="45" r="8" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
</g>
</svg>
                  `),
                  scaledSize: new google.maps.Size(32, 32),
                }}
                title="Your Location"
              />

              {/* Parking markers */}
              {parkings.map((parking) => (
                <Marker
                  key={parking.id}
                  position={{ lat: parking.latitude, lng: parking.longitude }}
                  onClick={() => handleBookingClick(parking)}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
	<path d="M 45 0 C 27.624 0 13.537 14.086 13.537 31.463 c 0 15.99 13.322 38.261 27.707 56.708 c 1.902 2.439 5.61 2.439 7.513 0 c 14.385 -18.447 27.707 -40.717 27.707 -56.708 C 76.463 14.086 62.376 0 45 0 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(34,197,94); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
	<path d="M 45 52.515 c -2.017 0 -3.967 -0.283 -5.814 -0.811 c -3.425 -0.979 -6.493 -2.802 -8.967 -5.228 c -3.905 -3.83 -6.327 -9.167 -6.327 -15.068 C 23.892 19.75 33.342 10.3 45 10.3 s 21.108 9.45 21.108 21.108 S 56.658 52.515 45 52.515 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
	<path d="M 45.312 18.937 h -6.259 c -1.452 0 -2.629 1.177 -2.629 2.629 v 11.894 v 8.848 c 0 1.452 1.177 2.629 2.629 2.629 c 1.452 0 2.629 -1.177 2.629 -2.629 v -6.219 h 3.631 c 4.556 0 8.263 -3.707 8.263 -8.264 V 27.2 C 53.576 22.644 49.869 18.937 45.312 18.937 z M 48.318 27.824 c 0 1.657 -1.348 3.006 -3.006 3.006 h -3.631 v -6.636 h 3.631 c 1.657 0 3.006 1.348 3.006 3.006 V 27.824 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(34,197,94); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
</g>
</svg>
                    `),
                    scaledSize: new google.maps.Size(36, 36),
                  }}
                  title={`${parking.title} - ₹${parking.pricePerHour}/hr`}
                />
              ))}
            </GoogleMap>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Nearest Parking Spaces */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-green-600" />
              Nearest Parking Spaces
            </CardTitle>
            {nearestParkings.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {nearestParkings.length} available
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {parkingsLoading ? (
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
          ) : nearestParkings.length > 0 ? (
<div className="space-y-4">
  {nearestParkings.map((parking, index) => (
    <Card
      key={parking.id}
      className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{parking.title}</h3>
              {index === 0 && (
                <Badge className="bg-green-100 text-green-800 text-xs flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Closest
                </Badge>
              )}
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground line-clamp-2">
                {parking.address}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-bold text-green-600">
                  ₹{parking.pricePerHour}
                </span>
                <span className="text-sm text-muted-foreground">/hr</span>
              </div>

              <div className="flex items-center gap-1">
                <Route className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  {parking.distance.toFixed(1)} km
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600">
                  ~{Math.round(parking.distance * 3)} min drive
                </span>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="w-full md:w-auto flex-shrink-0">
            <Button
              onClick={() => handleBookingClick(parking)}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Car className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No parking spaces found</h3>
                <p className="text-muted-foreground">
                  We couldn't find any parking spaces in your area. Try expanding your search radius.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <BookingModal
        isOpen={isBookingModalOpen}
        userId={userData?.id || ''}
        parking={selectedParking}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={() => {
          handleBookingSubmit();
        }}
      />
    </div>
  );
}

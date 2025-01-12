// import HotelSearch from '@/components/HotelSearch';

// export default function HotelsPage() {
//   return (
//     <main className="container mx-auto py-6">
//       <h1 className="text-3xl font-bold mb-6">Find Hotels!</h1>
//       <HotelSearch />
//     </main>
//   );
// }
// app/hotels/page.tsx
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader } from 'lucide-react';
import { HotelCard } from '@/components/HotelCard';

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const formatDisplayDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function HotelSearch() {
  const [cityCode, setCityCode] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState('1');
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateDates = () => {
    if (!checkIn || !checkOut) return false;
    if (checkIn >= checkOut) {
      setError('Check-out date must be after check-in date');
      return false;
    }
    return true;
  };

  const searchHotels = async () => {
    if (!cityCode || !checkIn || !checkOut) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateDates()) return;

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        cityCode: cityCode.toUpperCase(),
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
        adults,
        page: '1',
        pageSize: '10',
      });

      console.log('Searching hotels with params:', params.toString());

      const response = await fetch(`/api/hotels?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch hotels');
      }

      const data = await response.json();
      
      if (!data.hotels) {
        throw new Error('No hotels found');
      }

      setHotels(data.hotels);
    } catch (err) {
      console.error('Search hotels error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City Code</label>
              <Input
                placeholder="NYC"
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                maxLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Check In</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {checkIn ? formatDisplayDate(checkIn) : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) =>
                      date < new Date() || (checkOut ? date >= checkOut : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Check Out</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {checkOut ? formatDisplayDate(checkOut) : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) =>
                      date < new Date() || (checkIn ? date <= checkIn : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adults</label>
              <Input
                type="number"
                min="1"
                max="9"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}

          <Button
            className="mt-6"
            onClick={searchHotels}
            disabled={loading}
          >
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Search Hotels
          </Button>
        </CardContent>
      </Card>

      {hotels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotelName={hotel.hotelName}
              city={hotel.city}
              country={hotel.country}
              rating={hotel.rating}
              offers={hotel.offers}
              imageUrl={hotel.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
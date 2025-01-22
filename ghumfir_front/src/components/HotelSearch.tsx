
// // "use client";
// // import React, { useState } from 'react';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Input } from '@/components/ui/input';
// // import { Button } from '@/components/ui/button';
// // import { Calendar } from '@/components/ui/calendar';
// // import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// // import { Loader } from 'lucide-react';

// // // HotelCard component
// // type HotelCardProps = {
// //   hotelName: string;
// //   city: string;
// //   country: string;
// //   rating?: string;
// //   offers: Array<{
// //     offerId: string;
// //     roomType: string;
// //     roomDescription: string;
// //     price: {
// //       amount: string;
// //       currency: string;
// //     };
// //   }>;
// //   imageUrl?: string;
// // };

// // const HotelCard: React.FC<HotelCardProps> = ({ 
// //   hotelName, 
// //   city, 
// //   country, 
// //   rating, 
// //   offers,
// //   imageUrl 
// // }) => {
// //   const lowestPrice = offers.reduce((min, offer) => 
// //     parseFloat(offer.price.amount) < parseFloat(min.price.amount) ? offer : min
// //   );

// //   return (
// //     <div className="bg-primary-foreground shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform">
// //       <img
// //         src={imageUrl || './assets/hotel-placeholder.jpg'}
// //         alt={hotelName}
// //         className="w-full h-48 object-cover"
// //       />
// //       <div className="p-4">
// //         <h3 className="text-lg font-semibold text-card-foreground">{hotelName}</h3>
// //         <p className="text-primary font-medium">{city}, {country}</p>
// //         {rating && (
// //           <div className="flex items-center gap-1 mt-1">
// //             <span>⭐</span>
// //             <span className="text-sm text-muted-foreground">{rating}</span>
// //           </div>
// //         )}
// //         <div className="mt-2">
// //           <p className="text-sm text-muted-foreground">From</p>
// //           <p className="text-lg font-bold text-primary">
// //             {lowestPrice.price.amount} {lowestPrice.price.currency}
// //           </p>
// //         </div>
// //         <Button className="w-full mt-4">View Rooms</Button>
// //       </div>
// //     </div>
// //   );
// // };

// // const formatDate = (date: Date) => {
// //   return date.toISOString().split('T')[0];
// // };

// // const formatDisplayDate = (date: Date) => {
// //   return date.toLocaleDateString('en-US', {
// //     year: 'numeric',
// //     month: 'long',
// //     day: 'numeric'
// //   });
// // };

// // const HotelSearch = () => {
// //   const [cityCode, setCityCode] = useState('');
// //   const [checkIn, setCheckIn] = useState<Date>();
// //   const [checkOut, setCheckOut] = useState<Date>();
// //   const [adults, setAdults] = useState('1');
// //   const [hotels, setHotels] = useState<any[]>([]); // Explicitly define it as an array of any type
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [selectedHotel, setSelectedHotel] = useState(null);

// //   const searchHotels = async () => {
// //     if (!cityCode || !checkIn || !checkOut) {
// //       setError('Please fill in all required fields');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await fetch(
// //         `/api/hotels?` +
// //         new URLSearchParams({
// //           cityCode,
// //           checkIn: formatDate(checkIn),
// //           checkOut: formatDate(checkOut),
// //           adults,
// //           page: '1',
// //           pageSize: '10'
// //         })
// //       );
      
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch hotels');
// //       }
      
// //       const data = await response.json();
// //       setHotels(data.hotels || []); // Ensure we set hotels to empty if no data is available
// //     } catch (err) {
// //       setError('Failed to fetch hotels. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-6xl mx-auto p-4">
// //       <Card className="mb-8">
// //         <CardHeader>
// //           <CardTitle>Search Hotels</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium mb-2">City Code</label>
// //               <Input 
// //                 placeholder="KTM" 
// //                 value={cityCode}
// //                 onChange={(e) => setCityCode(e.target.value.toUpperCase())}
// //               />
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium mb-2">Check In</label>
// //               <Popover>
// //                 <PopoverTrigger asChild>
// //                   <Button variant="outline" className="w-full justify-start">
// //                     <span className="mr-2">📅</span>
// //                     {checkIn ? formatDisplayDate(checkIn) : 'Select date'}
// //                   </Button>
// //                 </PopoverTrigger>
// //                 <PopoverContent className="w-auto p-0">
// //                   <Calendar
// //                     mode="single"
// //                     selected={checkIn}
// //                     onSelect={setCheckIn}
// //                     initialFocus
// //                   />
// //                 </PopoverContent>
// //               </Popover>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">Check Out</label>
// //               <Popover>
// //                 <PopoverTrigger asChild>
// //                   <Button variant="outline" className="w-full justify-start">
// //                     <span className="mr-2">📅</span>
// //                     {checkOut ? formatDisplayDate(checkOut) : 'Select date'}
// //                   </Button>
// //                 </PopoverTrigger>
// //                 <PopoverContent className="w-auto p-0">
// //                   <Calendar
// //                     mode="single"
// //                     selected={checkOut}
// //                     onSelect={setCheckOut}
// //                     initialFocus
// //                   />
// //                 </PopoverContent>
// //               </Popover>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">Adults</label>
// //               <Input 
// //                 type="number" 
// //                 min="1" 
// //                 value={adults}
// //                 onChange={(e) => setAdults(e.target.value)}
// //               />
// //             </div>
// //           </div>

// //           {error && (
// //             <p className="text-red-500 mt-4">{error}</p>
// //           )}

// //           <Button 
// //             className="mt-6" 
// //             onClick={searchHotels}
// //             disabled={loading}
// //           >
// //             {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
// //             Search Hotels
// //           </Button>
// //         </CardContent>
// //       </Card>

// //       {hotels.length > 0 && (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {hotels.map((hotel: any) => (
// //             <HotelCard
// //               key={hotel.id}
// //               hotelName={hotel.hotelName}
// //               city={hotel.city}
// //               country={hotel.country}
// //               rating={hotel.rating}
// //               offers={hotel.offers}
// //               imageUrl={hotel.imageUrl}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default HotelSearch;
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { HotelCard } from './HotelCard';

// // Extended city code mapping grouped by country
// const CITY_CODES : Record<string, string> = {
//   // Nepal
//   'Kathmandu, Nepal': 'KTM',
//   'Pokhara, Nepal': 'PKR',
//   'Bhairahawa, Nepal': 'BWA',
//   'Biratnagar, Nepal': 'BIR',
//   'Nepalgunj, Nepal': 'KEP',
//   'Janakpur, Nepal': 'JKR',
  
//   // India
//   'New Delhi, India': 'DEL',
//   'Mumbai, India': 'BOM',
//   'Bangalore, India': 'BLR',
//   'Chennai, India': 'MAA',
//   'Kolkata, India': 'CCU',
//   'Hyderabad, India': 'HYD',
  
//   // Thailand
//   'Bangkok, Thailand': 'BKK',
//   'Phuket, Thailand': 'HKT',
//   'Chiang Mai, Thailand': 'CNX',
//   'Pattaya, Thailand': 'PYX',
//   'Koh Samui, Thailand': 'USM',
  
//   // Japan
//   'Tokyo, Japan': 'TYO',
//   'Osaka, Japan': 'OSA',
//   'Kyoto, Japan': 'UKY',
//   'Fukuoka, Japan': 'FUK',
//   'Sapporo, Japan': 'CTS',
  
//   // South Korea
//   'Seoul, South Korea': 'SEL',
//   'Busan, South Korea': 'PUS',
//   'Jeju, South Korea': 'CJU',
  
//   // Singapore
//   'Singapore, Singapore': 'SIN',
  
//   // Malaysia
//   'Kuala Lumpur, Malaysia': 'KUL',
//   'Penang, Malaysia': 'PEN',
//   'Langkawi, Malaysia': 'LGK',
  
//   // Vietnam
//   'Hanoi, Vietnam': 'HAN',
//   'Ho Chi Minh City, Vietnam': 'SGN',
//   'Da Nang, Vietnam': 'DAD',
  
//   // Indonesia
//   'Jakarta, Indonesia': 'CGK',
//   'Bali, Indonesia': 'DPS',
//   'Yogyakarta, Indonesia': 'JOG',
  
//   // China
//   'Beijing, China': 'PEK',
//   'Shanghai, China': 'SHA',
//   'Hong Kong, China': 'HKG',
//   'Guangzhou, China': 'CAN',
//   'Shenzhen, China': 'SZX',
  
//   // United States
//   'New York, NY': 'NYC',
//   'Los Angeles, CA': 'LAX',
//   'Chicago, IL': 'CHI',
//   'Houston, TX': 'HOU',
//   'San Francisco, CA': 'SFO',
// } as const;

// // Group cities by country for the select dropdown
// const groupedCities = Object.keys(CITY_CODES).reduce((acc, city) => {
//   const country = city.split(', ')[1];
//   if (!acc[country]) {
//     acc[country] = [];
//   }
//   acc[country].push(city);
//   return acc;
// }, {});

// export default function HotelSearch() {
//   const [selectedCity, setSelectedCity] = useState('');
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [adults, setAdults] = useState('2');
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSearch = async () => {
//     if (!selectedCity || !checkIn || !checkOut) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const cityCode = CITY_CODES[selectedCity];
      
//       const params = new URLSearchParams({
//         cityCode,
//         checkIn,
//         checkOut,
//         adults,
//       });

//       const response = await fetch(`/api/hotels?${params}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to fetch hotels');
//       }

//       setHotels(data.hotels);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const today = new Date().toISOString().split('T')[0];

//   return (
//     <div className="max-w-7xl mx-auto p-4 space-y-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Search Hotels</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Select
//                 value={selectedCity}
//                 onValueChange={setSelectedCity}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select City" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.entries(groupedCities).map(([country, cities]) => (
//                     <React.Fragment key={country}>
//                       <SelectItem value={`group-${country}`} disabled className="font-semibold">
//                         {country}
//                       </SelectItem>
//                       {cities.map((city) => (
//                         <SelectItem key={city} value={city} className="pl-6">
//                           {city.split(', ')[0]}
//                         </SelectItem>
//                       ))}
//                     </React.Fragment>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Input
//                 type="date"
//                 min={today}
//                 value={checkIn}
//                 onChange={(e) => {
//                   setCheckIn(e.target.value);
//                   if (checkOut && e.target.value > checkOut) {
//                     setCheckOut(e.target.value);
//                   }
//                 }}
//                 className="w-full"
//                 placeholder="Check-in Date"
//               />
//             </div>

//             <div>
//               <Input
//                 type="date"
//                 min={checkIn || today}
//                 value={checkOut}
//                 onChange={(e) => setCheckOut(e.target.value)}
//                 className="w-full"
//                 placeholder="Check-out Date"
//               />
//             </div>

//             <div>
//               <Select value={adults} onValueChange={setAdults}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Number of Adults" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[1, 2, 3, 4].map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} {num === 1 ? 'Adult' : 'Adults'}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <Button 
//             onClick={handleSearch} 
//             className="mt-4 w-full"
//             disabled={loading}
//           >
//             {loading ? 'Searching...' : 'Search Hotels'}
//           </Button>

//           {error && (
//             <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
//               {error}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {hotels.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {hotels.map((hotel) => (
//             <HotelCard
//               key={hotel.id}
//               hotelName={hotel.hotelName}
//               city={hotel.city}
//               country={hotel.country}
//               rating={hotel.rating}
//               offers={hotel.offers}
//             />
//           ))}
//         </div>
//       )}

//       {!loading && hotels.length === 0 && !error && (
//         <div className="text-center text-gray-500 mt-8">
//           No hotels found. Try adjusting your search criteria.
//         </div>
//       )}
//     </div>
//   );
// }
// HotelSearch.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HotelCard } from './HotelCard';
import { Loader2 } from 'lucide-react';

// Types
interface Hotel {
  id: string;
  hotelName: string;
  city: string;
  country: string;
  rating?: string;
  offers: Array<{
    offerId: string;
    roomType: string;
    roomDescription: string;
    price: {
      amount: string;
      currency: string;
    };
  }>;
  imageUrl?: string;
}

type CityCodeMapping = {
  [key: string]: string;
};

type GroupedCities = {
  [country: string]: string[];
};

// City codes data
const CITY_CODES: CityCodeMapping = {
  // Nepal
  'Kathmandu, Nepal': 'KTM',
  'Pokhara, Nepal': 'PKR',
  'Bhairahawa, Nepal': 'BWA',
  'Biratnagar, Nepal': 'BIR',
  'Nepalgunj, Nepal': 'KEP',
  'Janakpur, Nepal': 'JKR',
  
  // India
  'New Delhi, India': 'DEL',
  'Mumbai, India': 'BOM',
  'Bangalore, India': 'BLR',
  'Chennai, India': 'MAA',
  'Kolkata, India': 'CCU',
  'Hyderabad, India': 'HYD',
  
  // Thailand
  'Bangkok, Thailand': 'BKK',
  'Phuket, Thailand': 'HKT',
  'Chiang Mai, Thailand': 'CNX',
  'Pattaya, Thailand': 'PYX',
  'Koh Samui, Thailand': 'USM',
  
  // Japan
  'Tokyo, Japan': 'TYO',
  'Osaka, Japan': 'OSA',
  'Kyoto, Japan': 'UKY',
  'Fukuoka, Japan': 'FUK',
  'Sapporo, Japan': 'CTS',
  
  // Singapore
  'Singapore, Singapore': 'SIN',
  
  // Malaysia
  'Kuala Lumpur, Malaysia': 'KUL',
  'Penang, Malaysia': 'PEN',
  'Langkawi, Malaysia': 'LGK',
};

// Group cities by country
const groupedCities: GroupedCities = Object.keys(CITY_CODES).reduce<GroupedCities>((acc, city) => {
  const [, country] = city.split(', ');
  if (!acc[country]) {
    acc[country] = [];
  }
  acc[country].push(city);
  return acc;
}, {});

const HotelSearch: React.FC = () => {
  // State
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [adults, setAdults] = useState<string>('2');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handlers
  const handleSearch = async () => {
    if (!selectedCity || !checkIn || !checkOut) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cityCode = CITY_CODES[selectedCity];
      const params = new URLSearchParams({
        cityCode,
        checkIn,
        checkOut,
        adults,
      });

      const response = await fetch(`/api/hotels?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hotels');
      }

      setHotels(data.hotels);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date in inputs
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Search Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedCities).map(([country, cities]) => (
                    <React.Fragment key={country}>
                      <SelectItem value={`group-${country}`} disabled className="font-semibold">
                        {country}
                      </SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city} className="pl-6">
                          {city.split(', ')[0]}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Check-in Date</label>
              <Input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value > checkOut) {
                    setCheckOut(e.target.value);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Check-out Date</label>
              <Input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Adults</label>
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Adults" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Adult' : 'Adults'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
              {error}
            </div>
          )}

          <Button 
            onClick={handleSearch} 
            className="mt-6 w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search Hotels'
            )}
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

      {!loading && hotels.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-8">
          No hotels found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
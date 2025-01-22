// "use client";
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Loader } from 'lucide-react';

// // Add HotelCard component
// type HotelCardProps = {
//   hotelName: string;
//   city: string;
//   country: string;
//   rating?: string;
//   offers: Array<{
//     offerId: string;
//     roomType: string;
//     roomDescription: string;
//     price: {
//       amount: string;
//       currency: string;
//     };
//   }>;
//   imageUrl?: string;
// };

// const HotelCard: React.FC<HotelCardProps> = ({ 
//   hotelName, 
//   city, 
//   country, 
//   rating, 
//   offers,
//   imageUrl 
// }) => {
//   const lowestPrice = offers.reduce((min, offer) => 
//     parseFloat(offer.price.amount) < parseFloat(min.price.amount) ? offer : min
//   );

//   return (
//     <div className="bg-primary-foreground shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform">
//       <img
//         src={imageUrl || '/placeholder-hotel.jpg'}
//         alt={hotelName}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-card-foreground">{hotelName}</h3>
//         <p className="text-primary font-medium">{city}, {country}</p>
//         {rating && (
//           <div className="flex items-center gap-1 mt-1">
//             <span>⭐</span>
//             <span className="text-sm text-muted-foreground">{rating}</span>
//           </div>
//         )}
//         <div className="mt-2">
//           <p className="text-sm text-muted-foreground">From</p>
//           <p className="text-lg font-bold text-primary">
//             {lowestPrice.price.amount} {lowestPrice.price.currency}
//           </p>
//         </div>
//         <Button className="w-full mt-4">View Rooms</Button>
//       </div>
//     </div>
//   );
// };

// const formatDate = (date: Date) => {
//   return date.toISOString().split('T')[0];
// };

// const formatDisplayDate = (date: Date) => {
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// };

// const HotelSearch = () => {
//   const [cityCode, setCityCode] = useState('');
//   const [checkIn, setCheckIn] = useState<Date>();
//   const [checkOut, setCheckOut] = useState<Date>();
//   const [adults, setAdults] = useState('1');
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedHotel, setSelectedHotel] = useState(null);

//   const searchHotels = async () => {
//     if (!cityCode || !checkIn || !checkOut) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch(
//         `/api/hotels?` +
//         new URLSearchParams({
//           cityCode,
//           checkIn: formatDate(checkIn),
//           checkOut: formatDate(checkOut),
//           adults,
//           page: '1',
//           pageSize: '10'
//         })
//       );
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch hotels');
//       }
      
//       const data = await response.json();
//       setHotels(data.hotels);
//     } catch (err) {
//       setError('Failed to fetch hotels. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Search Hotels</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">City Code</label>
//               <Input 
//                 placeholder="KTM" 
//                 value={cityCode}
//                 onChange={(e) => setCityCode(e.target.value.toUpperCase())}
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-2">Check In</label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" className="w-full justify-start">
//                     <span className="mr-2">📅</span>
//                     {checkIn ? formatDisplayDate(checkIn) : 'Select date'}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={checkIn}
//                     onSelect={setCheckIn}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Check Out</label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" className="w-full justify-start">
//                     <span className="mr-2">📅</span>
//                     {checkOut ? formatDisplayDate(checkOut) : 'Select date'}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={checkOut}
//                     onSelect={setCheckOut}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Adults</label>
//               <Input 
//                 type="number" 
//                 min="1" 
//                 value={adults}
//                 onChange={(e) => setAdults(e.target.value)}
//               />
//             </div>
//           </div>

//           {error && (
//             <p className="text-red-500 mt-4">{error}</p>
//           )}

//           <Button 
//             className="mt-6" 
//             onClick={searchHotels}
//             disabled={loading}
//           >
//             {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
//             Search Hotels
//           </Button>
//         </CardContent>
//       </Card>

//       {hotels.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {hotels.map((hotel: any) => (
//             <HotelCard
//               key={hotel.id}
//               hotelName={hotel.hotelName}
//               city={hotel.city}
//               country={hotel.country}
//               rating={hotel.rating}
//               offers={hotel.offers}
//               imageUrl={hotel.imageUrl}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HotelSearch;
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader } from 'lucide-react';

// HotelCard component
type HotelCardProps = {
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
};

const HotelCard: React.FC<HotelCardProps> = ({ 
  hotelName, 
  city, 
  country, 
  rating, 
  offers,
  imageUrl 
}) => {
  const lowestPrice = offers.reduce((min, offer) => 
    parseFloat(offer.price.amount) < parseFloat(min.price.amount) ? offer : min
  );

  return (
    <div className="bg-primary-foreground shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform">
      <img
        src={imageUrl || './assets/hotel-placeholder.jpg'}
        alt={hotelName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground">{hotelName}</h3>
        <p className="text-primary font-medium">{city}, {country}</p>
        {rating && (
          <div className="flex items-center gap-1 mt-1">
            <span>⭐</span>
            <span className="text-sm text-muted-foreground">{rating}</span>
          </div>
        )}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">From</p>
          <p className="text-lg font-bold text-primary">
            {lowestPrice.price.amount} {lowestPrice.price.currency}
          </p>
        </div>
        <Button className="w-full mt-4">View Rooms</Button>
      </div>
    </div>
  );
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const formatDisplayDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const HotelSearch = () => {
  const [cityCode, setCityCode] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState('1');
  const [hotels, setHotels] = useState<any[]>([]); // Explicitly define it as an array of any type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);

  const searchHotels = async () => {
    if (!cityCode || !checkIn || !checkOut) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/hotels?` +
        new URLSearchParams({
          cityCode,
          checkIn: formatDate(checkIn),
          checkOut: formatDate(checkOut),
          adults,
          page: '1',
          pageSize: '10'
        })
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }
      
      const data = await response.json();
      setHotels(data.hotels || []); // Ensure we set hotels to empty if no data is available
    } catch (err) {
      setError('Failed to fetch hotels. Please try again.');
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
                placeholder="KTM" 
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value.toUpperCase())}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Check In</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">📅</span>
                    {checkIn ? formatDisplayDate(checkIn) : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Check Out</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">📅</span>
                    {checkOut ? formatDisplayDate(checkOut) : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adults</label>
              <Input 
                type="number" 
                min="1" 
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
          {hotels.map((hotel: any) => (
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
};

export default HotelSearch;

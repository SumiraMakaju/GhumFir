

// // app/components/HotelCard.tsx
// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// interface HotelCardProps {
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
// }

// export const HotelCard: React.FC<HotelCardProps> = ({
//   hotelName,
//   city,
//   country,
//   rating,
//   offers,
//   imageUrl,
// }) => {
//   const lowestPrice = offers.reduce((min, offer) =>
//     parseFloat(offer.price.amount) < parseFloat(min.price.amount) ? offer : min
//   );

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow">
//       <img
//         src={imageUrl || '/api/placeholder/400/200'}
//         alt={hotelName}
//         className="w-full h-48 object-cover"
//       />
//       <CardContent className="p-4">
//         <h3 className="text-lg font-semibold">{hotelName}</h3>
//         <p className="text-sm text-muted-foreground">{city}, {country}</p>
//         {rating && (
//           <div className="flex items-center gap-1 mt-1">
//             <span>⭐</span>
//             <span className="text-sm">{rating}</span>
//           </div>
//         )}
//         <div className="mt-4">
//           <p className="text-sm text-muted-foreground">From</p>
//           <p className="text-xl font-bold">
//             {parseFloat(lowestPrice.price.amount).toLocaleString('en-US', {
//               style: 'currency',
//               currency: lowestPrice.price.currency,
//             })}
//           </p>
//         </div>
//         <Button className="w-full mt-4">View Details</Button>
//       </CardContent>
//     </Card>
//   );
// };
// HotelCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Price {
  amount: string;
  currency: string;
}

interface HotelOffer {
  offerId: string;
  roomType: string;
  roomDescription: string;
  price: Price;
}

interface HotelCardProps {
  hotelName: string;
  city: string;
  country: string;
  rating?: string;
  offers: HotelOffer[];
  imageUrl?: string;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotelName,
  city,
  country,
  rating,
  offers,
  imageUrl,
}) => {
  const lowestPrice = offers.reduce((min, offer) =>
    parseFloat(offer.price.amount) < parseFloat(min.price.amount) ? offer : min
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={imageUrl || '/api/placeholder/400/200'}
        alt={hotelName}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{hotelName}</h3>
        <p className="text-sm text-muted-foreground">{city}, {country}</p>
        {rating && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm">{rating}</span>
          </div>
        )}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">From</p>
          <p className="text-xl font-bold">
            {lowestPrice.price.amount} {lowestPrice.price.currency}
          </p>
        </div>
        <Button className="w-full mt-4">View Details</Button>
      </CardContent>
    </Card>
  );
};
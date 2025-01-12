// import { NextResponse } from 'next/server';

// // Types for the hotel response
// interface HotelOffer {
//   id: string;
//   hotel: {
//     name: string;
//     hotelId: string;
//     rating?: string;
//     address: {
//       cityName: string;
//       countryCode: string;
//     };
//   };
//   offers: Array<{
//     id: string;
//     checkInDate: string;
//     checkOutDate: string;
//     price: {
//       total: string;
//       currency: string;
//     };
//     room: {
//       type: string;
//       description: string;
//     };
//   }>;
// }

// async function getAmadeusToken() {
//   const clientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
//   const clientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

//   if (!clientId || !clientSecret) {
//     throw new Error('Missing Amadeus credentials');
//   }

//   const response = await fetch(
//     'https://test.api.amadeus.com/v1/security/oauth2/token',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({
//         grant_type: 'client_credentials',
//         client_id: clientId,
//         client_secret: clientSecret,
//       }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error('Failed to get Amadeus token');
//   }

//   const data = await response.json();
//   return data.access_token;
// }

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const cityCode = searchParams.get('cityCode') || '';
//   const checkInDate = searchParams.get('checkIn') || '';
//   const checkOutDate = searchParams.get('checkOut') || '';
//   const adults = searchParams.get('adults') || '1';
//   const page = parseInt(searchParams.get('page') || '1');
//   const pageSize = parseInt(searchParams.get('pageSize') || '10');

//   if (!cityCode || !checkInDate || !checkOutDate) {
//     return NextResponse.json(
//       { error: 'Missing required parameters' },
//       { status: 400 }
//     );
//   }

//   try {
//     // Get access token
//     const accessToken = await getAmadeusToken();

//     // Search for hotel offers
//     const hotelResponse = await fetch(
//       `https://test.api.amadeus.com/v3/shopping/hotel-offers?` +
//       new URLSearchParams({
//         cityCode,
//         checkInDate,
//         checkOutDate,
//         adults,
//         page: page.toString(),
//         max: pageSize.toString(),
//         currency: 'USD',
//       }),
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         next: { revalidate: 3600 }, // Cache for 1 hour
//       }
//     );

//     if (!hotelResponse.ok) {
//       throw new Error(`Amadeus API error: ${hotelResponse.status}`);
//     }

//     const hotelData = await hotelResponse.json();

//     // Transform the data to a more usable format
//     const hotels = hotelData.data.map((offer: HotelOffer) => ({
//       id: offer.id,
//       hotelName: offer.hotel.name,
//       hotelId: offer.hotel.hotelId,
//       rating: offer.hotel.rating,
//       city: offer.hotel.address.cityName,
//       country: offer.hotel.address.countryCode,
//       offers: offer.offers.map(roomOffer => ({
//         offerId: roomOffer.id,
//         checkIn: roomOffer.checkInDate,
//         checkOut: roomOffer.checkOutDate,
//         price: {
//           amount: roomOffer.price.total,
//           currency: roomOffer.price.currency,
//         },
//         roomType: roomOffer.room.type,
//         roomDescription: roomOffer.room.description,
//       })),
//     }));

//     return NextResponse.json({
//       hotels,
//       pagination: {
//         page,
//         pageSize,
//         total: hotelData.meta?.count || hotels.length,
//         hasMore: (page * pageSize) < (hotelData.meta?.count || 0),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching hotels:', error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Failed to fetch hotels' },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';

// Types for the hotel response
interface HotelOffer {
  id: string;
  hotel: {
    name: string;
    hotelId: string;
    rating?: string;
    address: {
      cityName: string;
      countryCode: string;
    };
  };
  offers: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    price: {
      total: string;
      currency: string;
    };
    room: {
      type: string;
      description: string;
    };
  }>;
}

async function getAmadeusToken() {
  const clientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Amadeus credentials');
  }

  const response = await fetch(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get Amadeus token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityCode = searchParams.get('cityCode') || '';
  const checkInDate = searchParams.get('checkIn') || '';
  const checkOutDate = searchParams.get('checkOut') || '';
  const adults = searchParams.get('adults') || '1';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  if (!cityCode || !checkInDate || !checkOutDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Get access token
    const accessToken = await getAmadeusToken();

    // Search for hotel offers
    const hotelResponse = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?` +
      new URLSearchParams({
        cityCode,
        checkInDate,
        checkOutDate,
        adults,
        page: page.toString(),
        max: pageSize.toString(),
        currency: 'USD',
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!hotelResponse.ok) {
      throw new Error(`Amadeus API error: ${hotelResponse.status}`);
    }

    const hotelData = await hotelResponse.json();

    // Transform the hotel data for the frontend
    const transformedHotels = hotelData.data.map((hotel: HotelOffer) => ({
      id: hotel.hotel.hotelId,
      hotelName: hotel.hotel.name,
      city: hotel.hotel.address.cityName,
      country: hotel.hotel.address.countryCode,
      rating: hotel.hotel.rating,
      offers: hotel.offers.map((offer) => ({
        offerId: offer.id,
        roomType: offer.room.type,
        roomDescription: offer.room.description,
        price: {
          amount: offer.price.total,
          currency: offer.price.currency,
        },
      })),
      // imageUrl: hotel.hotel.images[0]?.url || '/default-image.jpg',
    }));

    return NextResponse.json({ hotels: transformedHotels });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while fetching hotels' },
      { status: 500 }
    );
  }
}

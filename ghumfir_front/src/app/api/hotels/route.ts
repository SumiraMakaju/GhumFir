
// app/api/hotels/route.ts
import { NextResponse } from 'next/server';

async function getAmadeusToken() {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Amadeus credentials');
  }

  try {
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
      const error = await response.json();
      console.error('Amadeus token error:', error);
      throw new Error('Failed to get Amadeus token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw error;
  }
}

async function getHotelsInCity(cityCode: string, accessToken: string) {
  const params = new URLSearchParams({
    cityCode,
    radius: '50',
    radiusUnit: 'KM',
    hotelSource: 'ALL'
  });

  const response = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Hotel search error:', error);
    throw new Error(`Failed to get hotels: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.data;
}

async function getHotelOffers(
  hotelIds: string[],
  checkInDate: string,
  checkOutDate: string,
  adults: string,
  accessToken: string
) {
  const params = new URLSearchParams({
    hotelIds: hotelIds.join(','),
    checkInDate,
    checkOutDate,
    adults,
    roomQuantity: '1',
    currency: 'USD',
    bestRateOnly: 'true',
    view: 'FULL'
  });

  const response = await fetch(
    `https://test.api.amadeus.com/v3/shopping/hotel-offers?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Hotel offers error:', error);
    throw new Error(`Failed to get hotel offers: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cityCode = searchParams.get('cityCode')?.toUpperCase();
    const checkInDate = searchParams.get('checkIn');
    const checkOutDate = searchParams.get('checkOut');
    const adults = searchParams.get('adults') || '1';

    if (!cityCode || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('Searching hotels for:', { cityCode, checkInDate, checkOutDate, adults });

    // Get access token
    const accessToken = await getAmadeusToken();

    // Step 1: Get hotels in the city
    const hotels = await getHotelsInCity(cityCode, accessToken);
    
    if (!hotels || hotels.length === 0) {
      return NextResponse.json({
        hotels: [],
        message: 'No hotels found in this city'
      });
    }

    // Get first 10 hotels
    const hotelIds = hotels.slice(0, 10).map((hotel: any) => hotel.hotelId);

    // Step 2: Get offers for these hotels
    const offersData = await getHotelOffers(
      hotelIds,
      checkInDate,
      checkOutDate,
      adults,
      accessToken
    );

    console.log('Raw offers data:', JSON.stringify(offersData, null, 2));

    // Transform the data with null checks
    const transformedHotels = offersData.data
      .filter((offer: any) => offer && offer.hotel && offer.offers && offer.offers.length > 0)
      .map((offer: any) => {
        const hotel = offer.hotel;
        return {
          id: hotel.hotelId || 'unknown',
          hotelName: hotel.name || 'Unknown Hotel',
          rating: hotel.rating || null,
          city: hotel.address?.cityCode || cityCode,
          country: hotel.address?.countryCode || 'Unknown',
          offers: offer.offers.map((roomOffer: any) => ({
            offerId: roomOffer.id || 'unknown',
            checkIn: roomOffer.checkInDate || checkInDate,
            checkOut: roomOffer.checkOutDate || checkOutDate,
            price: {
              amount: roomOffer.price?.total || '0',
              currency: roomOffer.price?.currency || 'USD',
            },
            roomType: roomOffer.room?.type || 'Standard Room',
            roomDescription: roomOffer.room?.description || 'No description available',
          })),
        };
    });

    return NextResponse.json({
      hotels: transformedHotels,
      pagination: {
        page: 1,
        pageSize: hotelIds.length,
        total: transformedHotels.length,
        hasMore: false,
      },
    });

  } catch (error) {
    console.error('Error in hotel search:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch hotels',
        details: error instanceof Error ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}
// // app/api/events/route.ts
// import { NextResponse } from 'next/server';

// const EVENTBRITE_BASE_URL = 'https://www.eventbriteapi.com/v3';

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = searchParams.get('page') || '1';
//     const pageSize = searchParams.get('pageSize') || '12';

//     const response = await fetch(
//       `${EVENTBRITE_BASE_URL}/events/search/?page=${page}&page_size=${pageSize}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.EVENTBRITE_TOKEN}`,
//           'Content-Type': 'application/json'
//         },
//         next: { revalidate: 3600 } // Cache for 1 hour
//       }
//     );
//     console.log('Eventbrite API response:', response.body);
//     if (!response.ok) {
//       throw new Error(`Eventbrite API error: ${response.status}`);
//     }

//     const data = await response.json();
    
//     const formattedEvents = data.events.map((event: any) => ({
//       title: event.name.text,
//       location: event.venue?.name || 'Location TBA',
//       description: event.description.text,
//       imageUrl: event.logo?.url || '/placeholder-event.jpg',
//       startDate: event.start.local,
//       endDate: event.end.local,
//       url: event.url
//     }));

//     return NextResponse.json({
//       events: formattedEvents,
//       pagination: {
//         hasMore: data.pagination.has_more_items,
//         page: parseInt(page),
//         pageSize: parseInt(pageSize),
//         total: data.pagination.page_count
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching events:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch events' },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from 'next/server';
// import event_data from '@/assets/eventbrite_events.json'

// interface Event {
//     id: string;
//     url: string;
//   }
  
// interface EventData {
//     countries : [Event[]];
//   }
  
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get('q') || '';
//   const categories = searchParams.get('categories') || '';
//   const location = searchParams.get('location') || '';
//   const page = searchParams.get('page') || '1';
//   const pageSize = searchParams.get('pageSize') || '12';

//   const apiKey = process.env.EVENTBRITE_TOKEN;
//   const parseEventData = (data: EventData): Event[] => {
//     const events: Event[] = [];
  
//     // Loop through India and Nepal event data and push each event's id and url
//     for (const country of Object.values(data.countries)) {
//       country.forEach(event => {
//         events.push({
//           id: event.id,
//           url: event.url
//         });
//       });
//     }
  
//     return events;
//   };
  
//   // Sample usage
//   const result = parseEventData(event_data);

//   if (!apiKey) {
//     return NextResponse.json({ error: 'Missing Eventbrite API key' }, { status: 500 });
//   }
//   let totaldata = [];
//     result.forEach(async (event) => {
//     try {
//         const response = await fetch(`https://www.eventbriteapi.com/v3/events/${event.id}/`,
//             {
//                 headers: {
//                     "Authorization": `Bearer ${apiKey}`,
//                 }
//             }  
//         );
//         if (!response.ok) {
//         throw new Error(`Eventbrite API error: ${response.status}`);
//         }
//         const data = await response.json();
//         totaldata.push(data);
//     } catch (error: any) {
//         console.error('Error fetching events:', error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     })
// console.log(totaldata);
//     return NextResponse.json({ events: totaldata });
// }


import { NextResponse } from 'next/server';
import event_data from '@/assets/eventbrite_events.json';

interface Event {
  id: string;
  url: string;
}

interface EventData {
  countries: [Event[]];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const categories = searchParams.get('categories') || '';
  const location = searchParams.get('location') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');

  const apiKey = process.env.EVENTBRITE_TOKEN;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Eventbrite API key' }, { status: 500 });
  }

  const parseEventData = (data: EventData): Event[] => {
    const events: Event[] = [];
    for (const country of Object.values(data.countries)) {
      country.forEach(event => {
        events.push({
          id: event.id,
          url: event.url
        });
      });
    }
    return events;
  };

  try {
    const events = parseEventData(event_data);
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = events.slice(startIndex, endIndex);

    // Fetch all events in parallel using Promise.all
    const totaldata = await Promise.all(
      paginatedEvents.map(async (event) => {
        const response = await fetch(
          `https://www.eventbriteapi.com/v3/events/${event.id}/`,
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
            },
            next: { revalidate: 3600 } // Cache for 1 hour
          }
        );

        if (!response.ok) {
          throw new Error(`Eventbrite API error for event ${event.id}: ${response.status}`);
        }

        const data = await response.json();
        return {
          id: data.id,
          title: data.name?.text,
          location: data.venue?.name || 'Location TBA',
          description: data.description?.text,
          imageUrl: data.logo?.url || null,
          startDate: data.start?.local,
          endDate: data.end?.local,
          url: data.url
        };
      })
    );

    return NextResponse.json({
      events: totaldata,
      pagination: {
        page,
        pageSize,
        total: events.length,
        hasMore: endIndex < events.length
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
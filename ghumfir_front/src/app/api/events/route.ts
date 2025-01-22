
import { NextResponse } from 'next/server';
import event_data from '@/assets/eventbrite_events.json';

interface Event {
  id: string;
  url: string;
}


interface EventData {
  countries: {
    [key: string]: Event[];
  };
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = event_data;
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
      // Update this to use Object.values on the countries object
      Object.values(data.countries).forEach(countryEvents => {
        countryEvents.forEach(event => {
          events.push({
            id: event.id,
            url: event.url
          });
        });
      });
      return events;
    };

  try {
    const events = parseEventData(data);
    
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
// "use client";

// import React, { useEffect, useState } from 'react';
// import EventCard from '@/components/EventsCard';
// import InfiniteScrollContainer from '@/components/ui/infiniteload'; 
// import {Event as Event_mine}  from '@/lib/types';

// export default function Page() {
//   const [events, setEvents] = useState([
//     {
//       title: 'Bhaktapur Mahotsab',
//       location: 'Bhaktapur',
//       description: 'Experience the vibrant culture and yummy food.',
//       imageUrl: '/bhaktapur-city.webp',
//     },
//     {
//       title: 'Otaku Jatra',
//       location: 'Kathmandu',
//       description: 'Calling all anime fans! \n Jan 1 - Jan 5',
//       imageUrl: '/otakujatra.jpg',
//     },
//     {
//       title: 'Lalit Carnival',
//       location: 'Lalitpur',
//       description: 'Celebrate this tourism day with us.',
//       imageUrl: '/lalitpur.jpg',
//     },

//     {
//       title: 'Everest Carnival',
//       location: 'Solukhumbu',
//       description: 'celebrating world\'s highest peak.',
//       imageUrl: '/everest.jpg',
//     },
//   ]);
  
//   const [loading, setLoading] = useState(false);
//   //this part is just to remember infinite scroll ni haalnu xa
//   const hasNextPage = true; // Replace with actual logic
//   const isFetching = false; // Replace with actual logic
//   const fetchNextPage = () => {
//     // Replace with actual logic to fetch next page
//     console.log('Fetching next page...');
//   };
// //api call garne
//   const [clientOnly, setClientOnly] = useState(false);

//   useEffect(() => {
//     setClientOnly(true);
//   }, []);

//   if (!clientOnly) return null;

//   return (
//     <div className="p-8 bg-card rounded-2xl shadow-sm">
//       <h1 className="text-3xl font-bold text-center text-muted-foreground mb-8">
//         Popular Events Worldwide
//       </h1>
//       <InfiniteScrollContainer
//             className="space-y-5"
//             onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
//           >
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {events.map((event, index) => (
//             <EventCard key={index} {...event} />
//           ))}
//         </div>
//         {loading && <p className="text-center text-primary">Loading more events...</p>}
//       </InfiniteScrollContainer>
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import EventCard from '@/components/EventsCard';
import EventSearch from '@/components/EventSearch';
import InfiniteScrollContainer from '@/components/ui/infiniteload';

interface SearchParams {
  q: string;
  categories: string;
  location: string;
}

interface Event {
  id: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  url: string;
  category: string;
  ticketAvailability: string;
  price: number | null;
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    q: '',
    categories: '',
    location: ''
  });

  const fetchEvents = async (resetEvents = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        pageSize: '12'
      });

      const response = await fetch(`/api/events?${queryParams}`);
      const data = await response.json();
      console.log('Eventbrite API response:', data);

      if (!data.events) {
        throw new Error('Invalid response format');
      }
      
      setEvents(prev => resetEvents ? data.events : [...prev, ...data.events]);
      setHasNextPage(data.pagination?.hasMore ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      setEvents(resetEvents ? [] : events);
    } finally {
      setLoading(false);
    }
  };

  // const fetchCategories = async () => {
  //   try {
  //     const response = await fetch('/api/events', { method: 'GET' });
  //     const data = await response.json();
  //     setCategories(data || []);
  //   } catch (err) {
  //     console.error('Failed to fetch categories:', err);
  //     setCategories([]);
  //   }
  // };

  useEffect(() => {
    // fetchCategories();
    fetchEvents(true);
    setCategories([]);
  }, []);

  useEffect(() => {
    if (searchParams) {
      fetchEvents(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (page > 1) {
      fetchEvents(false);
    }
  }, [page]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="p-8 bg-card rounded-2xl shadow-sm">
      <h1 className="text-3xl font-bold text-center text-muted-foreground mb-8">
        Popular Events Worldwide
      </h1>
      
      <EventSearch 
        onSearch={handleSearch} 
        categories={categories}
        
        />

      {error && (
        <p className="text-center text-red-500 mb-4">{error}</p>
      )}

      <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => {
          if (!loading && hasNextPage) {
            setPage(prev => prev + 1);
          }
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event, index) => (
            <EventCard 
            key={`${event.id}-${index}`} {...event} 
            url = {event.url}
            />
          ))}
        </div>
        {loading && (
          <p className="text-center text-primary">Loading more events...</p>
        )}
      </InfiniteScrollContainer>
    </div>
  );
}
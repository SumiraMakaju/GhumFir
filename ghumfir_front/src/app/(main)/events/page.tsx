"use client";

import React, { useEffect, useState } from 'react';
import EventCard from '@/components/EventsCard';
import InfiniteScrollContainer from '@/components/ui/infiniteload'; 

export default function Page() {
  const [events, setEvents] = useState([
    {
      title: 'Bhaktapur Mahotsab',
      location: 'Bhaktapur',
      description: 'Experience the vibrant culture and yummy food.',
      imageUrl: '/bhaktapur-city.webp',
    },
    {
      title: 'Otaku Jatra',
      location: 'Kathmandu',
      description: 'Calling all anime fans! \n Jan 1 - Jan 5',
      imageUrl: '/otakujatra.jpg',
    },
    {
      title: 'Lalit Carnival',
      location: 'Lalitpur',
      description: 'Celebrate this tourism day with us.',
      imageUrl: '/lalitpur.jpg',
    },

    {
      title: 'Everest Carnival',
      location: 'Solukhumbu',
      description: 'celebrating world\'s highest peak.',
      imageUrl: '/everest.jpg',
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  //this part is just to remember infinite scroll ni haalnu xa
  const hasNextPage = true; // Replace with actual logic
  const isFetching = false; // Replace with actual logic
  const fetchNextPage = () => {
    // Replace with actual logic to fetch next page
    console.log('Fetching next page...');
  };
//api call garne
  const [clientOnly, setClientOnly] = useState(false);

  useEffect(() => {
    setClientOnly(true);
  }, []);

  if (!clientOnly) return null;

  return (
    <div className="p-8 bg-card rounded-2xl shadow-sm">
      <h1 className="text-3xl font-bold text-center text-muted-foreground mb-8">
        Popular Events Worldwide
      </h1>
      <InfiniteScrollContainer
            className="space-y-5"
            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
          >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
        {loading && <p className="text-center text-primary">Loading more events...</p>}
      </InfiniteScrollContainer>
    </div>
  );
}

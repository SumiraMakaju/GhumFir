import React from 'react';

type EventCardProps = {
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  url: string;
};

const EventCard: React.FC<EventCardProps> = ({ title, location, description, imageUrl, url }) => {
  return (
    < a href = { url } >
    <div className="bg-primary-foreground shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-primary font-medium">{location}</p>
        <p className="text-muted-foreground text-sm mt-2">{description}</p>
      </div>
    </div>
    </a>
  );
};

export default EventCard;

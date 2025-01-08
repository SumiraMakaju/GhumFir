// HotelCard.tsx
import { Button } from "@/components/ui/button";
import React from "react";

export interface HotelProps {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: string[];
  price: number;
  description: string;
  availableFrom: string;
  availableTo: string;
  image: string;
  onSelect?: () => void;
}

const HotelCard: React.FC<HotelProps> = ({
  name,
  location,
  rating,
  price,
  description,
  image,
  onSelect,
}) => {
  return (
    <div
      className="bg-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      onClick={onSelect}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary">{name}</h3>
        <p className="text-sm text-muted-foreground">{location}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-muted-foreground font-semibold">
            NPR {price} / night
          </p>
          <p className="text-yellow-500 font-semibold flex items-center">
            ⭐ {rating.toFixed(1)}
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
          {description}
        </p>
      </div>
      <div className="p-4 bg-muted">
        <Button
        onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect();
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default HotelCard;
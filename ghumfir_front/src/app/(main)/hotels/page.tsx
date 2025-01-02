"use client";


import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HotelCard, { HotelProps } from "./HotelCard";
import { Button } from "@/components/ui/button";

const hotels: HotelProps[] = [
  {
    id: 1,
    name: "Hyatt Regency",
    location: "Kathmandu",
    rating: 4.8,
    reviews: ["Amazing service!", "Loved the food!", "Perfect for families."],
    price: 8560,
    description: "A luxurious hotel offering world-class amenities.",
    availableFrom: "2025-01-10",
    availableTo: "2025-02-20",
    image: "/hyatt.webp",
  },
  {
    id: 2,
    name: "Everest Boutique Hotel and Spa",
    location: "Kathmandu",
    rating: 4.6,
    reviews: [
      "The spa experience was heavenly.",
      "Rooms are cozy, and the location is excellent.",
      "Would highly recommend for a relaxing getaway.",
    ],
    price: 6753,
    description:
      "Nestled in the heart of Kathmandu, Everest Boutique Hotel and Spa provides a peaceful retreat with excellent hospitality and modern facilities.",
    availableFrom: "2025-01-15",
    availableTo: "2025-03-10",
    image: "/everest.webp",
  },
  {
    id: 3,
    name: "Barahi Jungle Lodge",
    location: "Dubai",
    rating: 4.7,
    reviews: [
      "A unique experience in the heart of nature.",
      "Loved the jungle safari and cultural evenings.",
      "Exceptional service and delicious cuisine.",
    ],
    price: 2000,
    description:
      "Barahi Jungle Lodge offers a unique jungle retreat with luxury accommodations and thrilling activities in Dubai.",
    availableFrom: "2025-02-01",
    availableTo: "2025-03-15",
    image: "/barahi.webp",
  },
  {
    id: 4,
    name: "Hotel Heritage",
    location: "Pokhara",
    rating: 4.6,
    reviews: [
      "The view of the lake is breathtaking.",
      "Great location, and the staff is super friendly.",
      "Rooms are spacious and well-maintained.",
    ],
    price: 6753,
    description:
      "Hotel Heritage in Pokhara combines traditional charm with modern comforts. It's the perfect spot to relax and enjoy the beauty of the Himalayas.",
    availableFrom: "2025-01-15",
    availableTo: "2025-03-10",
    image: "/heritage.webp",
  },
];

const BookingPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredHotels, setFilteredHotels] = useState(hotels);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<HotelProps | null>(null);
    const [viewDetailsModal, setViewDetailsModal] = useState<HotelProps | null>(null);
  
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      const filtered = hotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().startsWith(query) ||
          hotel.location.toLowerCase().startsWith(query)
      );
      setFilteredHotels(filtered);
    };
  
    return (
      <div className="h-screen flex flex-col bg-background text-foreground">
        <div className="sticky top-[5.25rem] rounded-2xl bg-card shadow-md p-6">
          <h2 className=" text-2xl font-bold mb-4 text-primary">Search Hotels & Resorts</h2>
          <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name or location"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border rounded-md p-2 bg-input text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                placeholderText="Check-in Date"
                className="border rounded-md p-2 w-full bg-input text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                placeholderText="Check-out Date"
                className="border rounded-md p-2 w-full bg-input text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>
        </div>
  
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  {...hotel}
                  onSelect={() => setViewDetailsModal(hotel)}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No hotels found matching your criteria.</p>
            )}
          </div>
        </div>

      {viewDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4">{viewDetailsModal.name}</h2>
            <img
              src={viewDetailsModal.image}
              alt={viewDetailsModal.name}
              className="w-full rounded-md mb-4"
            />
            <p className="mb-4">{viewDetailsModal.description}</p>
            <h3 className="font-bold">Reviews:</h3>
            <ul className="list-disc pl-5 mb-4">
              {viewDetailsModal.reviews.map((review, index) => (
                <li key={index}>{review}</li>
              ))}
            </ul>
            <p className="font-bold mb-4">Price: NPR {viewDetailsModal.price}</p>
            <div className="flex justify-between">
              <Button
                
                onClick={() => setSelectedHotel(viewDetailsModal)}
              >
                Book Now
              </Button>
              <Button
                className="ml-4 bg-destructive text-white py-2 px-4 rounded-md"
                onClick={() => setViewDetailsModal(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">{selectedHotel.name}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Booking submitted!");
                setSelectedHotel(null);
              }}
            >
              <div className="mb-4">
                <label className="block font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Email</label>
                <input
                  type="email"
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-foreground"
              >
                Confirm Booking
              </Button>
              <Button
                //type="button"
                className="ml-4 bg-destructive text-white py-2 px-4 rounded-md"
                onClick={() => setSelectedHotel(null)}
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
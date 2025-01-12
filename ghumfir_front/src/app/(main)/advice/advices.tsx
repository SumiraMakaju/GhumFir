"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/recommendation/card";
import { Slider } from "@/components/recommendation/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Plane, Hotel, Compass, Share2, Loader2 } from "lucide-react";
import { TravelPackage, adaptTravelPackage } from "@/lib/travelPackages";
import { set } from "date-fns";

export default function TripAdvisor() {
  const [budget, setBudget] = useState<number[]>([10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [transportPreference, setTransportPreference] = useState("");
  const [accommodationPreference, setAccommodationPreference] = useState("");
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<TravelPackage[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<TravelPackage[]>([]);
  const [additoinal, setAdditional] = useState<string>("");

  useEffect(() => {
    fetchTravelPackages();
  }, []);

  useEffect(() => {
    filterRecommendations();
  }, [searchQuery, budget, transportPreference, accommodationPreference, recommendations]);

  const fetchTravelPackages = async () => {
    try {
        setLoading(true);
        
        const queryParams = new URLSearchParams({
            budget: budget[0].toString(),
            searchQuery: searchQuery,
        });
        
        if (additoinal) {
            queryParams.append("additional", additoinal);
        }
        
        const response = await fetch(`/api/recommend?${queryParams.toString()}`);
        const data = await response.json();
        
        // Debug logs
        console.log("Raw API Response:", data);

        if (!data?.success || !data?.data) {
            console.error("Invalid API response structure:", data);
            throw new Error("Invalid API response");
        }

        if (!Array.isArray(data.data)) {
            console.error("API data is not an array:", data.data);
            throw new Error("API data is not an array");
        }

        const adaptedPackages = data.data
            .filter(item => item !== null && typeof item === 'object')
            .map(item => {
                try {
                    return adaptTravelPackage(item);
                } catch (error) {
                    console.error('Error adapting package:', error, item);
                    return null;
                }
            })
            .filter(Boolean);


        if (adaptedPackages.length === 0) {
            console.warn("No valid packages after adaptation");
        }

        setRecommendations(adaptedPackages);
        setFilteredRecommendations(adaptedPackages);
        setSearchQuery("");
        } catch (error) {
        console.error("Error in fetchTravelPackages:", error);
        setRecommendations([]);
        setFilteredRecommendations([]);
    } finally {
        setLoading(false);
    }
};

const filterRecommendations = () => {
    if (!Array.isArray(recommendations)) {
        setFilteredRecommendations([]);
        return;
    }

    const filtered = recommendations.filter(rec => {
        if (!rec) return false;

        try {
            const matchesSearch = searchQuery
                ? rec.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  rec.activities.some(activity => 
                      activity.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : true;

            const matchesBudget = rec.price <= budget[0];
            
            const matchesTransport = !transportPreference || 
                rec.transport.toLowerCase().includes(transportPreference.toLowerCase());
            
            const matchesAccommodation = !accommodationPreference || 
                rec.accommodation.toLowerCase().includes(accommodationPreference.toLowerCase());

            return matchesSearch && matchesBudget && matchesTransport && matchesAccommodation;
        } catch (error) {
            console.error('Error filtering recommendation:', error);
            return false;
        }
    });

    setFilteredRecommendations(filtered);
};

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Search Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Find Your Next Adventure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search destinations or activities"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Travel Dates</label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <Input type="date" className="w-full" />
              </div>
            </div>

            {/* Budget Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget (NPR)</label>
              <Slider
                value={budget}
                onValueChange={setBudget}
                max={100000}
                step={500}
                className="py-4"
              />
              <div className="text-sm text-gray-500">
                Maximum: USD {budget[0].toLocaleString()}
              </div>
            </div>

            {/* Transport Preferences */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Transportation Preferences</label>
              <Input
                placeholder="E.g., Flights, Train, Bus"
                value={transportPreference}
                onChange={(e) => setTransportPreference(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Accommodation Preferences */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Accommodation Preferences</label>
              <Input
                placeholder="E.g., Hotels, Hostels, Camping"
                value={accommodationPreference}
                onChange={(e) => setAccommodationPreference(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Additional Preferences */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional</label>
              <Input
                placeholder="Additional "
                value={additoinal}
                onChange={(e) => setAdditional(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4">
            <Button onClick={fetchTravelPackages} className="bg-blue-600 text-white">
              Advice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No travel packages found matching your criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecommendations.map((rec, index) => {
            if (!rec) return null; // Safety check to avoid rendering invalid data
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{rec.destination}</CardTitle>
                      <p className="text-sm text-gray-500">{rec.duration}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {rec.matchScore}% Match
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Plane className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{rec.flight}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hotel className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{rec.hotel}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Compass className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Activities</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.activities && rec.activities.map((activity, i) => {
                            if (!activity) return null; // Safety check to avoid rendering invalid data
                            return (
                          <span
                            key={i}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {activity}
                          </span>
                        )}
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t pt-4">
                      <div className="text-xl font-bold">USD {rec.price.toLocaleString()}</div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" className="bg-transparent text-blue-600">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

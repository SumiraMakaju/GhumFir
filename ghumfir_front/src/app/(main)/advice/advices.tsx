// import React, { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/recommendation/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {Slider} from "@/components/recommendation/slider";
// import { Calendar, MapPin, Plane, Hotel, Compass, Share2 } from 'lucide-react';

// const TripAdvisor = () => {
//   const [budget, setBudget] = useState([2000]);
  
//   const recommendations = [
//     {
//       destination: "Barcelona, Spain",
//       price: 2450,
//       duration: "7 days",
//       flight: "Direct, 8hrs",
//       hotel: "4-star Beachfront",
//       activities: ["Sagrada Familia", "Gothic Quarter", "Beach Day", "Cooking Class"],
//       weather: "Sunny, 25°C",
//       matchScore: 95
//     },
//     {
//       destination: "Tokyo, Japan",
//       price: 3200,
//       duration: "10 days",
//       flight: "1 stop, 14hrs",
//       hotel: "3-star City Center",
//       activities: ["Shibuya Crossing", "Mount Fuji Tour", "Sushi Workshop", "Temple Visit"],
//       weather: "Mild, 20°C",
//       matchScore: 88
//     }
//   ];

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       {/* Preference Panel */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Find Your Perfect Trip</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Where to?</label>
//               <div className="flex items-center space-x-2">
//                 <MapPin className="w-4 h-4" />
//                 <Input placeholder="Destination" />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <label className="text-sm font-medium">When?</label>
//               <div className="flex items-center space-x-2">
//                 <Calendar className="w-4 h-4" />
//                 <Input placeholder="Select dates" />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Budget (USD)</label>
//               <Slider
//                 value={budget}
//                 onValueChange={setBudget}
//                 max={10000}
//                 step={100}
//                 className="py-4"
//               />
//               <div className="text-sm text-gray-500">Max: ${budget[0]}</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Recommendations */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {recommendations.map((rec, index) => (
//           <Card key={index} className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle>{rec.destination}</CardTitle>
//                   <p className="text-sm text-gray-500">{rec.duration}</p>
//                 </div>
//                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
//                   {rec.matchScore}% Match
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Plane className="w-4 h-4" />
//                     <span className="text-sm">{rec.flight}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Hotel className="w-4 h-4" />
//                     <span className="text-sm">{rec.hotel}</span>
//                   </div>
//                 </div>
                
//                 <div>
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Compass className="w-4 h-4" />
//                     <span className="font-medium">Activities</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {rec.activities.map((activity, i) => (
//                       <span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
//                         {activity}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center border-t pt-4">
//                   <div className="text-xl font-bold">${rec.price}</div>
//                   <div className="space-x-2">
//                     <Button variant="outline" size="sm">
//                       <Share2 className="w-4 h-4 mr-2" />
//                       Share
//                     </Button>
//                     <Button size="sm">View Details</Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TripAdvisor;

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/recommendation/card";
import { Slider } from "@/components/recommendation/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Plane, Hotel, Compass, Share2 } from "lucide-react";

interface Recommendation {
    destination: string;
    price: number;
    duration: string;
    flight: string;
    hotel: string;
    activities: string[];
    weather: string;
    matchScore: number;
}

export default function TripAdvisor() {
    const [budget, setBudget] = React.useState<number[]>([2000]);

    const recommendations: Recommendation[] = [
        {
            destination: "Pokhara, Nepal",
            price: 450,
            duration: "4 days",
            flight: "40min flight",
            hotel: "4-star Lakeside",
            activities: ["Paragliding", "Boating", "Hiking", "Temple Visit"],
            weather: "Pleasant, 22°C",
            matchScore: 95
        },
        {
            destination: "Kathmandu Valley",
            price: 350,
            duration: "3 days",
            flight: "Local transport",
            hotel: "3-star Thamel",
            activities: ["Durbar Square", "Swayambhu", "Shopping", "Food Tour"],
            weather: "Mild, 20°C",
            matchScore: 88
        }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Search Panel */}
            <Card>
                <CardHeader>
                    <CardTitle>Find Your Next Adventure</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Destination</label>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <Input placeholder="Where to?" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Travel Dates</label>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <Input placeholder="When do you want to travel?" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Budget (NPR)</label>
                            <Slider
                                value={budget}
                                onValueChange={setBudget}
                                max={10000}
                                step={500}
                                className="py-4"
                            />
                            <div className="text-sm text-gray-500">
                                Maximum: NPR {budget[0].toLocaleString()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{rec.destination}</CardTitle>
                                    <p className="text-sm text-gray-500">{rec.duration}</p>
                                </div>
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                    {rec.matchScore}% Match
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Plane className="w-4 h-4" />
                                        <span className="text-sm">{rec.flight}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Hotel className="w-4 h-4" />
                                        <span className="text-sm">{rec.hotel}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Compass className="w-4 h-4" />
                                        <span className="font-medium">Activities</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {rec.activities.map((activity, i) => (
                                            <span
                                                key={i}
                                                className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                                            >
                                                {activity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t pt-4">
                                    <div className="text-xl font-bold">NPR {rec.price}</div>
                                    <div className="space-x-2">
                                        <Button variant="outline" size="sm">
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button size="sm">View Details</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
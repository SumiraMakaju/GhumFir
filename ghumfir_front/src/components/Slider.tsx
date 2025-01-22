"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const destinations = [
  {
    id: 1,
    title: "Bhaktapur",
    subtitle: "Historic charm, timeless beauty",
    description:
      "Explore Bhaktapur, a city rich in history and culture, where ancient temples, stunning architecture, and vibrant traditions await. Experience the charm of Nepal's past in every corner of this UNESCO heritage site",
    country: "Nepal",
    location: "Bhaktapur, Bagmati Zone",
    imageUrl: "/bhaktapur-city.webp",
  },
  {
    id: 2,
    title: "Tilicho",
    subtitle: "Himalayan Serenity",
    country: "Nepal",
    description:
      "Embark on an epic trek to witness the serene beauty of Tilicho Lake, surrounded by towering peaks.",
    location: "",
    imageUrl: "/tilicho.jpg",
  },
  {
    id: 3,
    title: "Nikko",
    subtitle: "Nature and Heritage",
    country: "Japan",
    description:
      "Discover Nikko, a serene destination offering panoramic views of natural beauty and historic temples.",
    location: "Tochigi",
    imageUrl: "/nikko.jpg",
  },
  {
    id: 4,
    title: "Navarra Camp",
    subtitle: "Adventure Awaits",
    country: "Costa Rica",
    description:
      "Experience the thrill of camping under the stars in this natural wonderland.",
    location: "Navarra Camp",
    imageUrl: "/navarra.jpg",
  },
  {
    id: 5,
    title: "Lumbini",
    subtitle: "Buddha's Birthplace",
    country: "Nepal",
    description:
      "Immerse yourself in the tranquil spiritual atmosphere at the sacred site of Lord Buddha's birth.",
    location: "",
    imageUrl: "/lumbini.jpg",
  },
  {
    id: 6,
    title: "Everest",
    subtitle: "Conquer the Summit",
    country: "Nepal",
    description:
      "Experience the awe-inspiring beauty and challenge of trekking to the world's highest peak.",
    location: "",
    imageUrl: "/everest.jpg",
  },
  {
    id: 7,
    title: "Potala Palace",
    subtitle: "Majestic Tibetan Wonder",
    country: "China",
    description:
      "Explore the stunning architecture and rich history of this iconic palace in the heart of Lhasa.",
    location: "",
    imageUrl: "/potala.jpg",
  },
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updatedCards = [
      currentIndex === 0 ? destinations.length - 1 : currentIndex - 1,
      currentIndex,
      (currentIndex + 1) % destinations.length,
    ];
    setVisibleCards(updatedCards);
  }, [currentIndex]);

  // Autoplay feature
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Ghumfir Text/Logo with Autoplay Indicator */}
      <div className="absolute top-6 right-8 z-50 text-2xl font-bold text-amber-400 flex items-center space-x-2">
        <span>Ghumfir</span>
        <div className="relative w-6 h-6">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 5,
              ease: "easeOut",
              repeat: Infinity,
            }}
            className="absolute top-0 left-0 h-full bg-amber-400 rounded-full"
          />
          <div className="absolute inset-0 border-2 border-amber-400 rounded-full" />
        </div>
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center px-4"
            >
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-4"
                animate={{
                  scale: [1, 1.03, 1],
                  textShadow: [
                    "0px 0px 0px rgba(251, 191, 36, 0)",
                    "0px 0px 25px rgba(251, 191, 36, 0.4)",
                    "0px 0px 0px rgba(251, 191, 36, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                Welcome to Ghumfir
              </motion.h1>
              <motion.p
                className="text-white/80 text-lg md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Discover your next adventure
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Transition */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img
            src={destinations[currentIndex].imageUrl}
            alt={destinations[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <motion.div
            key={`description-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <p className="text-white text-sm tracking-wide uppercase">
              {destinations[currentIndex].subtitle}
            </p>
            <h1 className="text-amber-400 text-4xl md:text-6xl font-bold">
              {destinations[currentIndex].title}
            </h1>
            <p className="text-white max-w-2xl mx-auto text-lg">
              {destinations[currentIndex].description}
            </p>
          </motion.div>
        </div>

        {/* Image Cards */}
        <div className="flex items-center justify-center space-x-4">
          <AnimatePresence initial={false}>
            {visibleCards.map((index) => (
              <motion.div
                key={`card-${destinations[index].id}`}
                className={`relative flex-shrink-0 w-56 h-36 md:w-72 md:h-48 overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 shadow-lg ${
                  index === currentIndex
                    ? "scale-110 ring-4 ring-amber-500"
                    : "scale-95 opacity-75"
                }`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={destinations[index].imageUrl}
                  alt={destinations[index].title}
                  className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function formatDateWithMonthMap(dateString: string): string {
  const monthMap: { [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return `${monthMap[month]} ${day}, ${year}`;
}

interface Event {
  _id: string;
  eventName: string;
  date: string;
  coverImage: string;
  speakers: number;
  city: string;
  state: string;
  numberOfSeats: number;
}

interface ApiResponse {
  data: Event[];
}

const parentVariants = {
  initial: { x: 100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3, // Ensure animations happen in sequence
    },
  },
  exit: { x: -100, opacity: 0 },
};

const childVariants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }, // Control speed of individual items
  },
  exit: { opacity: 0, y: -50 },
};

export default function EventsBanner() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ApiResponse>("/api/v1/events/retrives");
        const filteredEvents = res.data.data.filter(
          (event: Event) => new Date(event.date) > new Date()
        );
        setEvents(filteredEvents);
      } catch (error) {
        toast.error("Failed to fetch events");
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [events.length]);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  if (events.length === 0) {
    return null;
  }

  const router = useRouter();

  const handleBookNow = (id: string) => {
    if (events[currentIndex]) {
      router.push(`/live-connect/career-connect/${id}/register`);
    }
  };

  const currentEvent: any = events[currentIndex];

  return (
    <section className="w-full h-screen relative overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentEvent._id}
          variants={parentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          {currentEvent && currentEvent.coverImage && (
            <div
              className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${currentEvent.coverImage})` }}
            >
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center px-4 py-8">
                <motion.div
                  variants={childVariants}
                  className="flex flex-col items-center max-w-4xl"
                >
                  <motion.p
                    variants={childVariants}
                    className="text-xl md:text-2xl mb-4 text-yellow-500 font-semibold"
                  >
                    {formatDateWithMonthMap(currentEvent.date)}
                  </motion.p>
                  <motion.h2
                    variants={childVariants}
                    className="text-4xl md:text-7xl font-extrabold text-white text-center mb-6"
                  >
                    {currentEvent.eventName}{" "}
                    {new Date(currentEvent.date).getFullYear()}
                  </motion.h2>
                  <motion.div
                    variants={childVariants}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6"
                  >
                    <p className="text-lg md:text-xl text-white">
                      <span className="mr-2">
                        🎤 {currentEvent.speakers} Speakers
                      </span>
                    </p>
                    <p className="text-lg md:text-xl text-white">
                      <span>
                        📍 {currentEvent.city}, {currentEvent.state}
                      </span>
                    </p>
                  </motion.div>
                  <motion.p
                    variants={childVariants}
                    className="text-lg md:text-xl mb-8 text-white"
                  >
                    🪑 {currentEvent.numberOfSeats} Seats Available
                  </motion.p>
                  <motion.button
                    variants={childVariants}
                    className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-full text-black font-semibold text-lg transition-colors duration-300"
                    onClick={() => handleBookNow(currentEvent._id)}
                  >
                    Book Now
                  </motion.button>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
        aria-label="Previous event"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
        aria-label="Next event"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </section>
  );
}

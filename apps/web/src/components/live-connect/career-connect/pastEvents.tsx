"use client";

import { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { authAxios } from "../../utils/axiosKits";
import toast from "react-hot-toast";

export default function PastEvents({ pastEvents }: { pastEvents: any[] }) {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleRating = async (eventId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [eventId]: rating,
    }));
    console.log(`Rated event ${eventId} with ${rating} stars`);

    try {
      const response = await authAxios.post(`/events/${eventId}/rating`, {
        rating: rating,
      });
      console.log("Rating event response:", response);
      if (response.data.success) {
        toast.success("Event rated successfully");
      }
    } catch (error) {
      console.error("Error rating event:", error);
      toast.error("Failed to rate event");
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-900 w-4/5 mx-auto">
      <h1 className="text-5xl font-bold  text-black ">
        Past Events
      </h1>

      <div className="w-full relative">
        {/* Slider Buttons */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
          onClick={scrollLeft}
        >
          &larr;
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
          onClick={scrollRight}
        >
          &rarr;
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide w-full py-4"
        >
          {pastEvents.map((pastEvent) => {
            const eventDetails = pastEvent.fullEventDetails;
            const eventDate = new Date(eventDetails?.date || pastEvent.date);
            const existingRating = pastEvent.rating;

            return (
              <div
                key={pastEvent._id}
                className="min-w-[200px] rounded-lg bg-cover bg-center relative "
                style={{
                  backgroundImage: `url(${eventDetails?.coverImage})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg"></div>

                {/* Content */}
                <div className="relative text-white flex flex-col items-center justify-center p-4">
                  {/* Event Name */}
                  <h3 className="text-lg font-bold mb-1 text-center">
                    {eventDetails?.eventName || "Event Name"}
                  </h3>

                  {/* Event Date */}
                  <p className="text-xs mb-2 text-center">
                    {eventDate.toLocaleDateString() || "Event Date"}
                  </p>

                  

                  {/* Rating Section */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer ${
                          star <= (existingRating || ratings[pastEvent._id] || 0)
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                        onClick={() =>
                          !existingRating && handleRating(pastEvent.event, star)
                        }
                      />
                    ))}
                  </div>
                  {existingRating && (
                    <p className="text-xs mt-2 text-center">
                      You rated this {existingRating} stars
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

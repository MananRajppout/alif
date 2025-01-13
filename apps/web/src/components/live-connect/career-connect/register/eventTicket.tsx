"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisteredEventsTickets({
  mappedRegisteredEvents,
  userType,
}: {
  mappedRegisteredEvents: any[];
  userType: string;
}) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinClick = (eventDate: string, eventId: string) => {
    const eventTime = new Date(eventDate).getTime();
    const currentTime = new Date().getTime();

    if (true || currentTime > eventTime) {
      if (userType === "employer") {
        router.push(`career-connect/${eventId}/company`);
      } else {
        // Remove true
        router.push(`career-connect/${eventId}/job-seeker`);
      }
    } else {
      alert("You can join only after the event date.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-900  w-4/5  ">
      <h1 className="text-5xl bg-gradient-to-r font-bold mb-4 pt-4">
        Registered Events
      </h1>
      <div className="grid gap-6">
        {mappedRegisteredEvents.map((regEvent) => {
          const eventDetails = regEvent.fullEventDetails;
          const eventDate = new Date(eventDetails?.date || regEvent.date);
          const remainingTime = Math.max(
            0,
            eventDate.getTime() - currentTime.getTime()
          );
          console.log("eventDetails", eventDetails);
          // Calculate days, hours, and minutes remaining
          const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
          );

          return (
            <div
              key={regEvent._id}
              className="relative flex items-center justify-between p-4 rounded-xl overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: `url(${eventDetails?.coverImage})`,
              }}
            >
              {/* Timer Section */}
              <div className="flex flex-col items-center text-white text-center px-10 py-6 bg-black bg-opacity-80 rounded-md">
                <p className="text-lg font-semibold">TIMER</p>
                <p className="text-sm">{`${days}d ${hours}h ${minutes}m`}</p>
              </div>

              {/* Event Info Section */}
              <div className="flex flex-col text-white bg-black bg-opacity-50 p-4 rounded-md flex-1 mx-4 justify-center items-center">
                <h3 className="text-xl font-bold mb-2">
                  {eventDetails?.eventName || "Event Name"}
                </h3>
                <p className="text-sm">
                  {eventDetails?.bulletPoints?.join(" ") || "Event Details"}
                </p>
              </div>

              <button
                className="bg-blue-600 text-white font-bold py-2 px-10 rounded hover:bg-blue-700"
                onClick={() =>
                  handleJoinClick(
                    eventDetails?.date || regEvent.date,
                    eventDetails?._id
                  )
                }
              >
                Join
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

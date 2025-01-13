"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Event {
  _id: string;
  date: string;
  eventName: string;
}

const CountdownTimer = () => {
  const [nearestEvent, setNearestEvent] = useState<Event | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/v1/events/retrives");
        const events = res.data.data;
        
        // Find the nearest upcoming event
        const now = new Date().getTime();
        const upcomingEvents = events
          .map((event: Event) => ({
            ...event,
            timestamp: new Date(event.date).getTime(),
          }))
          .filter(
            //@ts-ignore
            event => event.timestamp > now)
          .sort(
            //@ts-ignore
            (a, b) => a.timestamp - b.timestamp);

        if (upcomingEvents.length > 0) {
          setNearestEvent(upcomingEvents[0]);
          updateTimeLeft(upcomingEvents[0].timestamp);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (nearestEvent) {
        updateTimeLeft(new Date(nearestEvent.date).getTime());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nearestEvent]);

  const updateTimeLeft = (eventTime: number) => {
    const now = new Date().getTime();
    const difference = eventTime - now;

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    });
  };

  return (
    <div className="flex flex-col items-center p-4">
      {nearestEvent ? (
        <div className="w-[70%] bg-gradient-to-r from-[#4B0082] to-[#FF007F] text-white  shadow-lg px-6 py-3 text-center">
          <h2 className="text-2xl font-bold mb-4">{nearestEvent.eventName}</h2>
          <div className="flex justify-center gap-4 text-4xl font-bold">
            <div className="flex flex-col items-center">
              <span>{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-lg mt-2">Days</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-lg mt-2">Hours</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-lg mt-2">Minutes</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-lg mt-2">Seconds</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xl text-gray-500">No upcoming events</p>
      )}
    </div>
  );
};

export default CountdownTimer;

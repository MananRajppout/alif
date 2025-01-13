"use client";

import EventsBanner from "@/src/components/frontend/banner/eventsBanner";
import Layout from "@/src/components/frontend/layout";
import { Loader } from "@/src/components/lib/loader";
import PastEvents from "@/src/components/live-connect/career-connect/pastEvents";
import RegisteredEventsTickets from "@/src/components/live-connect/career-connect/register/eventTicket";
import { authAxios } from "@/src/components/utils/axiosKits";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CareerConnect() {
  const [events, setEvents] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data, status } = useSession();
  const userData: any = data?.user || {};
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    console.log("userData", userData);
    setUserType(userData?.role.isEmployer ? "employer" : "candidate");
  }, [userData]);

  useEffect(() => {
    setLoading(true);
    const fetchRegisteredEvents = async () => {
      try {
        const res = await authAxios.get("/events/registered-events");
        const regEvents = res.data.data[0].registeredEvents;
        setRegisteredEvents(regEvents);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch registered events");
        setLoading(false);
      }
    };
    fetchRegisteredEvents();
  }, []);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get<{ data: any[] }>("/api/v1/events/retrives");
        console.log("Events fetched", res.data.data);
        setEvents(res.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch events");
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  useEffect(() => {
    if (registeredEvents.length > 0 && events.length > 0) {
      const now = new Date(); // Current date and time
      const currentEventsList: any[] = [];
      const pastEventsList: any[] = [];

      registeredEvents.forEach((regEvent) => {
        const fullEvent = events.find((event) => event._id === regEvent.event);

        if (fullEvent) {
          const eventDate = new Date(regEvent.date); // Convert to Date object
          console.log(
            `Registered Event ID: ${regEvent.event}, Event Date: ${eventDate}, Now: ${now}`
          );

          if (eventDate > now) {
            currentEventsList.push({
              ...regEvent,
              fullEventDetails: fullEvent,
            });
          } else {
            pastEventsList.push({ ...regEvent, fullEventDetails: fullEvent });
          }
        } else {
          console.error(
            `Event with ID ${regEvent.event} not found in events list`
          );
        }
      });

      console.log("Current events:", currentEventsList);
      console.log("Past events:", pastEventsList);
      console.log("Registered events:", registeredEvents);

      setCurrentEvents(currentEventsList);
      setPastEvents(pastEventsList);
    }
  }, [registeredEvents, events]);

  return (
    <>
      <Head>
        <title>MetaJobs - Find Your Dream Job</title>
        <meta
          name="description"
          content="Best job portal to find your dream job. Find all jobs category. Your next tech career awaits."
        />
      </Head>

      <Layout>
        <main>
          <EventsBanner />

          <section>
            {/* Current Events */}
            {currentEvents && currentEvents.length > 0 ? (
              <div className="flex justify-center">
                <RegisteredEventsTickets
                  mappedRegisteredEvents={currentEvents}
                  userType={userType as string}
                />
              </div>
            ) : (
              <h1 className="text-5xl bg-gradient-to-r font-bold mb-4 pt-4 flex justify-center text-black py-8">
                No Registered events found
              </h1>
            )}

            {/* Past Events */}
            {pastEvents && pastEvents.length > 0 ? (
              <PastEvents pastEvents={pastEvents} />
            ) : (
              <h1 className="text-5xl bg-gradient-to-r font-bold mb-4 pt-4 text-black flex justify-center py-8">
                No past events found
              </h1>
            )}
          </section>
        </main>
      </Layout>

      {loading && <Loader />}
    </>
  );
}

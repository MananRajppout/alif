"use client";
import React from "react";
import useSWR from "swr";
import { authAxios } from "../../utils/axiosKits";
import { IEvent } from "@/interface/EventInterface";
import UpcomingEventCard from "./upcoming-event-card";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const UpcomingEvent = () => {
  const {data, error } = useSWR("/events/upcoming", fetcher);


  return (
    <section className="mb-6">
      <div className="shadow-lg bg-white rounded-lg mb-10 overflow-x-auto overflow-y-hidden hidden md:block relative">
        {error && (
          <div className="w-full lg:w-2/4 mx-auto h-40 bg-white shadow rounded-lg flex justify-center items-center">
            <div className="text-center">
              <h3 className="text-lg mb-2 font-semibold text-red-400">
                Failed to load data ☹️
              </h3>
              <p className="text-themeLight">
                Check Your internet connection OR api response issue.
              </p>
            </div>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="w-full lg:w-2/4 mx-auto h-40 bg-white shadow rounded-lg flex justify-center items-center">
            <div className="text-center">
              <h3 className="text-lg mb-2 font-semibold text-red-400">
                No Upcoming Event Found
              </h3>
              <p className="text-themeLight">
                Please check back later for upcoming events.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {data && data.length > 0 && data.map((event:IEvent) => (
            <UpcomingEventCard key={event._id} event={event}/>
          ))}
        </div>
        
           
                
      </div>


    </section>
  );
};


export default UpcomingEvent;

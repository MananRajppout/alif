"use client";
import loadingCategory from "@/src/data/loadingCategory.json";
import Head from "next/head";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Banner from "@/src/components/frontend/banner";
import Blog from "@/src/components/frontend/blog";
import PopularCategories from "@/src/components/frontend/categories/popular-categories";
import RecentJob from "@/src/components/frontend/job/recent-job";
import Layout from "@/src/components/frontend/layout";
import Testimonials from "@/src/components/frontend/testimonials";
import { Axios } from "@/src/components/utils/axiosKits";
import blogsDataPre from "@/src/data/blogData.json";
import testimonialsDataPre from "@/src/data/testimonialsData.json";
import EventsBanner from "@/src/components/frontend/banner/eventsBanner";
import CountdownTimer from "@/src/components/frontend/banner/countdownTimer";
import EventCard from "@/src/components/frontend/banner/EventDetails";
import axios from "axios";
import FeatureSelection from "@/src/components/frontend/banner/feature-selection";

const fetcher = (url: string) => Axios(url).then((res: any) => res.data.data);
const JobsAPI = "/jobs/retrives";
const catsAPI = "/jobs/categories/retrives";
const blogsAPI = "/blogs/retrives";
const testimonialsAPI = "/testimonials/retrives";

function CategoryData({
  categoryData,
  categoryError,
}: {
  categoryData: any;
  categoryError: any;
}) {
  if (!categoryData) {
    return <PopularCategories data={loadingCategory} />;
  }

  return <PopularCategories data={categoryData} />;
}

function PopularJobsData({ jobs }: { jobs: any }) {
  const { data: Jobs, error } = useSWR(JobsAPI, fetcher, {
    fallbackData: jobs,
  });

  return <RecentJob data={Jobs} />;
}

export default function Home() {
  const [jobs, setJobs] = useState<any>(null);
  const [totalCountData, setTotalCountData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setJobs(null);
      setTotalCountData(null);
    };

    fetchData();
  }, []); // Run effect once when the component mounts

  const { data: categoryData, error: categoryError } = useSWR(catsAPI, fetcher);
  const { data: blogsData } = useSWR(blogsAPI, fetcher, {
    fallbackData: blogsDataPre,
  });
  const { data: testimonialsData } = useSWR(testimonialsAPI, fetcher, {
    fallbackData: testimonialsDataPre,
  });

  const [nearestEvent, setNearestEvent] = useState<any>(null);
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

        const now = new Date().getTime();
        const upcomingEvents = events
          .map((event: any) => ({
            ...event,
            timestamp: new Date(event.date).getTime(),
          }))
          .filter((event: any) => event.timestamp > now)
          .sort((a: any, b: any) => a.timestamp - b.timestamp);

        if (upcomingEvents.length > 0) {
          setNearestEvent(upcomingEvents[0]);
          updateTimeLeft(upcomingEvents[0].timestamp);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    const updateTimeLeft = (eventTime: number) => {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventTime - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Head>
        <title>MetaJobs- Find Your Dream Job</title>
        <meta
          name="description"
          content="Best job portal to find your dream job. Find all jobs category. Your next tech career awaits."
        />
      </Head>

      <Layout>
        <main>
          <div
            style={{
              zIndex: 0,
            }}
          >
            <EventsBanner />
          </div>
          <div
            style={{
              position: "absolute",
              top: "97vh",
              width: "100%",
              zIndex: 100,
            }}
          >
            <CountdownTimer />
          </div>
          {nearestEvent && (
            <div
              style={{
                marginTop: "17vh",
              }}
            >
              <EventCard nearestEvent={nearestEvent} />
            </div>
          )}
           <PopularJobsData jobs={jobs} />
          {/* <FeatureSelection /> */}
          <Blog data={blogsData} />
          {/* <CategoryData
            categoryData={categoryData}
            categoryError={categoryError}
          /> */}
          {/* <Testimonials data={testimonialsData} /> */}
        </main>
      </Layout>
    </>
  );
}

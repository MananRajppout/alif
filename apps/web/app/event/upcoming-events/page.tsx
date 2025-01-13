"use client"
import { User } from "@/interface/AuthInterface";
import UpcomingEvent from "@/src/components/dashboard/event/upoming-events";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import { useSession } from "next-auth/react";
import Head from "next/head";

const Dashboard = () => {
  const { data, status } = useSession();
  const userData = data?.user as User;
  const isCandidate = userData?.role?.isCandidate;
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Dashboard- Bookmark jobs, upcoming events and register"
        />
      </Head>

      <Layout>
        <main className="">
          {status === "unauthenticated" && <UserNotLogin />}
          {isCandidate && <UserGoBack />}
          {userData && status === "authenticated" && !isCandidate && (
            < UpcomingEvent />
          )}
        </main>
      </Layout>
    </>
  );
};

export default Dashboard;

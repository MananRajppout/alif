"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import ApplicationsByJob from "@/src/components/dashboard/job/applications-by-job";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

const JobApplications = () => {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isCandidate = userData?.role.isCandidate;

  return (
    <>
      <Head>
        <meta name="description" content="Job Application" />
      </Head>

      <Layout>
        {status === "unauthenticated" && <UserNotLogin />}
        {isCandidate && <UserGoBack />}
        <main>
          {userData && status === "authenticated" && !isCandidate && (
            <ApplicationsByJob />
          )}
        </main>
      </Layout>
    </>
  );
};

export default JobApplications;
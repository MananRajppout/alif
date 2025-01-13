"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import AllApplications from "@/src/components/dashboard/job/all-applied-job";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

const Applications = () => {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isEmployer = userData?.role.isEmployer;
  return (
    <>
      <Head>
        <meta name="description" content="Job Application" />
      </Head>

      <Layout>
        {status === "unauthenticated" && <UserNotLogin />}
        {isEmployer && <UserGoBack />}
        <main>
          {userData && status === "authenticated" && !isEmployer && (
            <AllApplications />
          )}
        </main>
      </Layout>
    </>
  );
};

export default Applications;

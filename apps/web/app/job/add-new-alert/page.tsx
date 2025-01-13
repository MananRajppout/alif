"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import AddJobAlerts from "@/src/components/dashboard/job-alerts/add-job-alerts";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function AddNewAlert() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isEmployer = userData?.role.isEmployer;

  return (
    <>
      <Head>
        <meta name="description" content=" Add New Alert" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {isEmployer && <UserGoBack />}
          {userData && status === "authenticated" && !isEmployer && (
            <AddJobAlerts />
          )}
        </main>
      </Layout>
    </>
  );
}

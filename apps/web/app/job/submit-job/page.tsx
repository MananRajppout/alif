"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import SubmitJobForm from "@/src/components/dashboard/form/submit-job-form";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function SubmitJob() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isCandidate = userData?.role.isCandidate;

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Submit your Job Details. fill up all the required field"
        />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {isCandidate && <UserGoBack />}
          {userData && status === "authenticated" && !isCandidate && (
            <SubmitJobForm userData={userData} />
          )}
        </main>
      </Layout>
    </>
  );
}

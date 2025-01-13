"use client"
import Head from "next/head";

import EditResume from "@/src/components/dashboard/edit-resume/edit-resume-form";
import Layout from "@/src/components/dashboard/layout";

import { useSession } from "next-auth/react";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function AddResume() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isEmployer = userData?.role.isEmployer;

  return (
    <>
      <Head>
        <meta name="description" content="Add resume" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {isEmployer && <UserGoBack />}
          {userData && status === "authenticated" && !isEmployer && (
            <EditResume />
          )}
        </main>
      </Layout>
    </>
  );
}

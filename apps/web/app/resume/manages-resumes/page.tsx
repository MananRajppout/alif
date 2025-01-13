"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import AllResumes from "@/src/components/dashboard/manage-resumes/all-resumes";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function ManagesResumes() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isEmployer = userData?.role.isEmployer;

  return (
    <>
      <Head>
        <meta name="description" content="Manage Your Resumes" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {isEmployer && <UserGoBack />}
          {userData && status === "authenticated" && !isEmployer && (
            <AllResumes />
          )}
        </main>
      </Layout>
    </>
  );
}

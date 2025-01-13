"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import ResumeForm from "@/src/components/dashboard/add-resume/resume-form";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function AddResume() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isEmployer = userData?.role.isEmployer;

  return (
    <>
      <Head>
        <meta name="description" content="Add New resume" />
      </Head>

      <Layout>
        <main>
          {status == "unauthenticated" && <UserNotLogin />}
          {isEmployer && <UserGoBack />}
          {userData && status === "authenticated" && !isEmployer && (
            <ResumeForm />
          )}
        </main>
      </Layout>
    </>
  );
}

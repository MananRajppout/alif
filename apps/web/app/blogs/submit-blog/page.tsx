"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import SubmitEventForm from "@/src/components/dashboard/event/submit-event-form";
import SubmitBlogForm from "@/src/components/dashboard/blog/submit-blog-form";

export default function SubmitBlog() {
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
            <SubmitBlogForm/>
          )}
        </main>
      </Layout>
    </>
  );
}

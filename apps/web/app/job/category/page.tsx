"use client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CategoryInfo from "@/src/components/dashboard/job-alerts/category-info";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function Category() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isAdmin = userData?.role.isAdmin;

  return (
    <>
      <Head>
        <meta name="description" content="category page " />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && !isAdmin && <UserGoBack />}
          {userData && status === "authenticated" && isAdmin && (
            <CategoryInfo />
          )}
        </main>
      </Layout>
    </>
  );
}

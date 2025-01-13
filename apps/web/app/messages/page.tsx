"use client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import MessagesInfo from "@/src/components/dashboard/messages";
import { UserNotLogin } from "@/src/components/lib/user";

export default function Messages() {
  const { data, status } = useSession();
  const userData = data?.user;

  return (
    <>
      <Head>
        <meta name="description" content="Message Page" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && status === "authenticated" && <MessagesInfo />}
        </main>
      </Layout>
    </>
  );
}

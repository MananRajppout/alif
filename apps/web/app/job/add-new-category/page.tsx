"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function AddNewCategory() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isAdmin = userData?.role.isAdmin;

  return (
    <>
      <Head>
        <meta name="description" content="Add new category" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {!isAdmin && <UserGoBack />}
          {userData && status === "authenticated" && isAdmin && (
            <section>
              <h2>Welcome To Add New Category Page</h2>
            </section>
          )}
        </main>
      </Layout>
    </>
  );
}

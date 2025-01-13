"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import Filters from "@/src/components/dashboard/super-admin/Filters/index";
import { UserGoBack } from "@/src/components/lib/user";

export default function FilterPage() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isAdmin = userData?.role.isAdmin;

  return (
    <>
      <Head>
        <meta name="description" content="Filter Settings" />
      </Head>

      <Layout>
        <main>
          {userData && !isAdmin && <UserGoBack />}
          {userData && status === "authenticated" && isAdmin && (
            <section>
              <Filters />
            </section>
          )}
        </main>
      </Layout>
    </>
  );
}

"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import PreviewPackages from "@/src/components/dashboard/packages/preview-packages";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

const ActivePackage = () => {
  const { data, status } = useSession();
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: {
      isEmployer: boolean;
    };
  }

  const userData = data?.user as User;
  const isEmployer = userData?.role?.isEmployer;

  return (
    <>
      <Head>
        <meta name="description" content="Active package" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && !isEmployer && status === "authenticated" && (
            <UserGoBack />
          )}
          {userData && status === "authenticated" && isEmployer && (
            <PreviewPackages />
          )}
        </main>
      </Layout>
    </>
  );
};

export default ActivePackage;

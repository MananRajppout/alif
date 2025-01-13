"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import AddCompanyForm from "@/src/components/dashboard/form/add-company-form";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

export default function AddCompany() {
  const { data, status } = useSession();
  const userData = data?.user as { name?: string | null; email?: string | null; image?: string | null; role: { isCandidate: boolean } };
  const isCandidate = userData?.role.isCandidate;

  return (
    <>
      <Head>
        <meta name="description" content="Add your company" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {isCandidate && <UserGoBack />}
          {userData && status === "authenticated" && !isCandidate && (
            <AddCompanyForm />
          )}
        </main>
      </Layout>
    </>
  );
}

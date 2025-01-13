"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import EditPackageForm from "@/src/components/dashboard/packages/edit-package-form";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

const EditPackage = () => {
  const { data, status } = useSession();
  const userData = data?.user as { name?: string | null; email?: string | null; image?: string | null; role: { isAdmin: boolean } };
  const isAdmin = userData?.role.isAdmin;
  return (
    <>
      <Head>
        <meta name="description" content="Create new package" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && !isAdmin && status === "authenticated" && <UserGoBack />}
          {userData && status === "authenticated" && isAdmin && (
            <EditPackageForm />
          )}
        </main>
      </Layout>
    </>
  );
};

export default EditPackage;

"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import AddCategoryForm from "@/src/components/dashboard/form/add-category-form";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";

const AddCategory = () => {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isAdmin = userData?.role.isAdmin;

  return (
    <>
      <Head>
        <meta name="description" content="Add Job category " />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && !isAdmin && <UserGoBack />}
          {userData && status === "authenticated" && <AddCategoryForm />}
        </main>
      </Layout>
    </>
  );
};

export default AddCategory;

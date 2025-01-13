"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/frontend/layout";
import { UserLogin } from "@/src/components/lib/user";
import RegisterForm from "@/src/components/register/register-form";

export default function SignUp() {
  const { status } = useSession();
  if (status === "authenticated") return <UserLogin />;

  if (status === "unauthenticated") {
    return (
      <>
        <Head>
          <meta name="description" content="Sign Up to get access" />
        </Head>

        <Layout>
          <main>
            <section className="py-24 md:py-32 bg-light pt-12 pb-12">
              <RegisterForm />
            </section>
          </main>
        </Layout>
      </>
    );
  }
}

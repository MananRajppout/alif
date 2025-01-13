// app/login/page.tsx
"use client";

import { Loader } from "@/src/components/lib/loader";
import { UserLogin } from "@/src/components/lib/user";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { useToasts } from "@/src/components/toast/toast";
import Layout from "@/src/components/frontend/layout"; // Adjust the import path if necessary
import LoginForm from "@/src/components/register/login-form"; // Adjust the import path if necessary
import toast from "react-hot-toast";

const Login = () => {
  const session = useSession();
  const { addToast } = useToasts();


  useEffect(() => {
    // Handle redirection and error messages based on session statu
    
    if (session.status === "unauthenticated" && window.location.search.includes("error")) {
      addToast("Email or Password is incorrect", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }, [session]);

  // Return the appropriate content based on the session status
  if (session.status === "unauthenticated") {
    return (
      <>
        <Head>
          <meta name="description" content="Login to your dashboard" />
        </Head>

        <Layout>
          <main className="bg-light">
            <section className="py-24 md:py-32 bg-light pt-12 pb-12">
              <LoginForm />
            </section>
          </main>
        </Layout>
      </>
    );
  }

  if (session.status === "authenticated") return <UserLogin />;
  
  // Fallback loader while session state is being determined
  return <Loader />;
};

export default Login;

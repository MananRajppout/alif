"use client";
import ResumeForm from "@/src/components/dashboard/add-resume/resume-form";
import Layout from "@/src/components/frontend/layout";
import { Loader } from "@/src/components/lib/loader";
import { UserNotLogin } from "@/src/components/lib/user";
import RegistrationCompanyForm from "@/src/components/live-connect/career-connect/register/RegistrationCompanyForm";
import RegistrationEventForm from "@/src/components/live-connect/career-connect/register/registrationEventForm";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function RegisteredEvents() {
  const { data, status } =  useSession();
  const params = useParams();
  const { id } = params;
  const userData = data?.user;
  interface UserRole {
    isCandidate?: boolean;
    isAdmin?: boolean;
    isEmployer?: boolean;
  }

  interface SessionUser {
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  }

  

  let isEmployer = (userData as SessionUser)?.role?.isEmployer;
  let isCandidate = (userData as SessionUser)?.role?.isCandidate;

   useEffect(()=>{
    console.log(userData);
    console.log("emp",isEmployer);
    console.log("candei",isCandidate)
  isEmployer = (data as SessionUser)?.role?.isEmployer;
  isCandidate = (data as SessionUser)?.role?.isCandidate;
  },[userData])

  return (
    <>
      <Head>
        <title>MetaJobs- Find Your Dream Job</title>
        <meta
          name="description"
          content="Best job portal to find your dream job. Find all jobs category. Your next tech career awaits."
        />
      </Head>

      <Layout>
        <main className="">
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && status === "authenticated" && (
            <section className="mb-6 mt-6 ">
              {id && isCandidate && (
                //@ts-ignore
                <RegistrationEventForm id={id} />
              )}

              {id && isEmployer && (
                //@ts-ignore
                <RegistrationCompanyForm id={id} />
              )}

            </section>
          )}
          {status === "loading" && <Loader />}
        </main>
      </Layout>
    </>
  );
}

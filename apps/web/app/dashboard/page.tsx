"use client"
import AdminDashboard from "@/src/components/dashboard/dashboard/admin-dashboard";
import CandidateDashboard from "@/src/components/dashboard/dashboard/candidate-dashbaord";
import EmploterDashboard from "@/src/components/dashboard/dashboard/employer-dashbaord";
import RecentActivities from "@/src/components/dashboard/dashboard/recent-activities";
import ResumeBookmarks from "@/src/components/dashboard/dashboard/recent-bookmarks";
import UserInfoBox from "@/src/components/dashboard/dashboard/user-info-box";
import Layout from "@/src/components/dashboard/layout";
import { Loader } from "@/src/components/lib/loader";
import { UserNotLogin } from "@/src/components/lib/user";
import { useSession } from "next-auth/react";
import Head from "next/head";

const Dashboard = () => {
  const { data, status } = useSession();

  const userData: any = data?.user;

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Dashboard- Bookmark jobs, company and resume"
        />
      </Head>

      <Layout>
        <main className="">
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && status === "authenticated" && (
            <section className="mb-6">
              <div className="mx-auto">
                <UserInfoBox />
                <div className="grid lg:grid-cols-2 grid-cols-1 sm:grid-cols-1 gap-10">
                  <div>
                    <RecentActivities />
                  </div>
                  <div>
                    <ResumeBookmarks />
                  </div>
                </div>

                <div className="mt-5">
                  {
                    userData?.role?.isEmployer &&
                    <EmploterDashboard />
                  }

                  {
                    userData?.role?.isCandidate &&
                    <CandidateDashboard />
                  }


                  {
                    userData?.role?.isAdmin &&
                    <AdminDashboard />
                  }

                  

                </div>
              </div>
            </section>
          )}
          {status === "loading" && <Loader />}
        </main>
      </Layout>
    </>
  );
};

export default Dashboard;

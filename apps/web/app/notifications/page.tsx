"use client"
import _ from "lodash";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { IoNotificationsCircle } from "react-icons/io5";
import Layout from "@/src/components/dashboard/layout";
import { LoaderGrowing } from "@/src/components/lib/loader";
import { UserNotLogin } from "@/src/components/lib/user";
import { ThemeContext } from "@/src/context/ThemeContext";

const Notification = (): any => {
  const { data, status } = useSession();
  const { recentNotification, recentNotificationError } = React.useContext(
    ThemeContext,
  ) as any;
  const userData = data?.user;
  return (
    <>
      <Head>
        <meta
          name="description"
          content="All Notifications - Bookmark jobs, company and resume"
        />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && status === "authenticated" && (
            <div className="shadow rounded bg-white">
              <div className="h-16 bg-themeDark flex items-center px-10 rounded-lg">
                <p className="text-xxs text-white">All Notifications</p>
              </div>

              <div className="py-3 relative">
                {!recentNotification && (
                  <div className="h-40">
                    <LoaderGrowing />
                  </div>
                )}
                {recentNotificationError && (
                  <div className="h-40">
                    <p className="text-center text-gray-600">
                      Something went wrong. Please try again later.
                    </p>
                  </div>
                )}
                {recentNotification &&
                  _.map(recentNotification, (notify, index) => (
                    <div
                      className="flex flex-wrap justify-between py-3 px-5 md:px-8 border-b border-gray last-of-type:border-b-0 hover:bg-themeLighterAlt transition-all duration-300 ease-in-out"
                      key={index}
                    >
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div>
                          <IoNotificationsCircle className="w-10 h-10 text-themePrimary" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-xs break-all text-themeDarker font-medium">
                            {notify.event}
                          </p>
                          <p className="text-sm text-themeLighter">
                            {notify.message}
                          </p>
                          <span className="block sm:hidden text-sm text-themeLight">
                            {moment(notify.timestamp).fromNow()}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <span className="text-sm text-themeLight">
                          {moment(notify.timestamp).fromNow()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Notification;

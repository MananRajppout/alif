"use client"
import _ from "lodash";
import moment from "moment";
import React from "react";
import { IoNotificationsCircle } from "react-icons/io5";
import { ThemeContext } from "../../../context/ThemeContext";
import { authAxios } from "../../utils/axiosKits";

// create fetcher with authaxios
const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const activitiesAPI = "/users/notifications/catalog";

const RecentActivities = () => {
  // const { data, error } = useSWR(activitiesAPI, fetcher);
  const { recentNotification, recentNotificationError } = React.useContext(
    ThemeContext
  ) as any;

  if (!recentNotification) {
    return (
      <div>
        <div className="shadow-lg rounded-lg h-full bg-white relative overflow-hidden">
          <div className="px-5 md:px-10 pt-5 pb-3 border-b border-gray">
            <h2 className="text-lg2 font-semibold">Recent Activities</h2>
          </div>
        </div>
      </div>
    );
  }
  // if error
  if (recentNotificationError) {
    return <div>failed to load</div>;
  }
  // if data

  return (
    <div className="shadow-lg rounded-lg h-full bg-white relative overflow-hidden">
      <div className="px-5 md:px-10 pt-5 pb-3 border-b border-gray">
        <h2 className="text-lg2 font-semibold">Recent Activities</h2>
      </div>
      <div className="pb-5">
        {recentNotification &&
          _.map(
            _.slice(recentNotification, 0, 5),
            (
              notify: {
                event: string;
                message: string;
                timestamp: string;
              },
              index: number
            ) => (
              <div
                className="flex flex-wrap justify-between py-3 px-5 md:px-8 border-b border-gray last-of-type:border-b-0 hover:bg-themeLighterAlt transition-all duration-300 ease-in-out"
                key={index}
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  <div>
                    <IoNotificationsCircle className="w-10 h-10 text-themePrimary" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-xs break-all text-themeLight">
                      {moment(notify.timestamp).fromNow()}
                    </p>
                    <p className="text-sm text-themeLighter">
                      {notify.message}
                    </p>
                    <span className="block sm:hidden text-sm text-themeLight">
                      {moment(notify.timestamp).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default RecentActivities;

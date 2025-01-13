"use client"
import {
  CalendarIcon,
  ClockIcon,
  DollarIcon,
  HandWatchIcon,
  JobLocationIcon,
  OfficeBag,
} from "@/src/icons";
import _ from "lodash";
import millify from "millify";
import moment from "moment";
import { LoaderGrowing } from "../../lib/loader";

const JobOverview = ({ data }: { data: any }) => {
  const date = new Date(data?.data?.expireAt);
  const expireAt = date.toLocaleDateString("en-US", {
    year: "numeric",
    day: "numeric",
    month: "long",
  });
  return (
    <div className="p-8 rounded-md bg-white mb-6 relative">
      {(!data?.data || data?.loading) && <LoaderGrowing />}
      <h4 className="text-lg2 font-bold text-black leading-6 mb-6">
        Job Overview
      </h4>
      <ul>
        {/* Posted Date */}
        {data?.data?.createdAt && (
          <li className="flex gap-3 items-center flex-wrap  !mb-3">
            <div className="">
              <CalendarIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Job Posted
              </h5>
              <p className="text-grayLight text-sm font-normal">
                {/* post date 2 day ago */}
                {moment(data?.data?.createdAt || "").fromNow()}
              </p>
            </div>
          </li>
        )}
        {/* Deadline */}
        {data?.data?.expireAt && (
          <li className="flex gap-3 items-center flex-wrap  !mb-3">
            <div className="">
              <ClockIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Deadline
              </h5>
              <p className="text-grayLight text-sm font-normal">{expireAt}</p>
            </div>
          </li>
        )}
        {/* job title */}
        {/* <li className="flex gap-3 items-center flex-wrap  !mb-3">
          <div className="">
            <DocumentIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
            />
          </div>
          <div className="">
            <h5 className="text-base font-medium text-black leading-5 mb-0">
              Job Title
            </h5>
            <p className="text-grayLight text-sm font-normal">
              {data?.data?.jobTitle}
            </p>
          </div>
        </li> */}
        {data?.data?.jobTypes && (
          <li className="flex gap-3 items-center flex-wrap  !mb-3">
            <div className="">
              <OfficeBag
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Job Types
              </h5>
              <p className="text-grayLight text-sm font-normal">
                {_.toString(data?.data?.jobTypes)}
              </p>
            </div>
          </li>
        )}
        {/* Hourly Rate */}
        {data?.data?.hourlyrate?.minimum && data?.data?.hourlyrate?.maximum && (
          <li className="flex gap-3 items-center flex-wrap  !mb-3">
            <div className="">
              <HandWatchIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Hourly Rate
              </h5>
              <p className="text-grayLight text-sm font-normal">
                {millify(data?.data ? data?.data?.hourlyrate?.minimum : 10000, {
                  precision: 3,
                  lowercase: true,
                })}{" "}
                -{" "}
                {millify(
                  data?.data ? data?.data?.hourlyrate?.maximum : 100000,
                  {
                    precision: 3,
                    lowercase: true,
                  }
                )}{" "}
                / hour
              </p>
            </div>
          </li>
        )}
        {/* Salary */}
        {data?.data?.salary?.minimum && data?.data?.salary?.maximum && (
          <li className="flex gap-3 items-center flex-wrap  !mb-3">
            <div className="">
              <DollarIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Salary
              </h5>
              <p className="text-grayLight text-sm font-normal">
                {millify(data?.data ? data?.data?.salary?.minimum : 10000, {
                  precision: 3,
                  lowercase: true,
                })}{" "}
                -{" "}
                {millify(data?.data ? data?.data?.salary?.maximum : 100000, {
                  precision: 3,
                  lowercase: true,
                })}{" "}
              </p>
            </div>
          </li>
        )}
        {/* Location */}
        {data?.data?.location && (
          <li className="flex gap-3 items-center flex-wrap  !mb-3">
            <div className="">
              <JobLocationIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Job Location
              </h5>
              <p className="text-grayLight text-sm font-normal">
                {data.data.location}
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default JobOverview;

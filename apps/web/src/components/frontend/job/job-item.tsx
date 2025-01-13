"use client";
import _ from "lodash";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import Image from "../../optimize/image";
import moment from "moment";

const { millify } = require("millify");

const JobItem = ({ item }: { item: any }) => {
  return (
    <div
      className={`overflow-hidden relative h-full grid content-between px-6 !pt-4 pb-6 ${
        item
          ? item?.status?.isFeatured
            ? "!border-themePrimary"
            : "border-gray"
          : "border-gray"
      } bg-white border border-solid transition-all rounded-md group hover:!border-themePrimary `}
    >
      {item && item?.status?.isFeatured && (
        <div className="bg-themePrimary p-1 absolute transform -rotate-[135deg] m-0 flex justify-center text-white font-medium w-[66px] h-[66px] -right-[33px] -top-[33px] z-[90]">
          {/* featured icon */}
          <AiFillStar className="text-white text-xxs -rotate-6" />
        </div>
      )}
      <span className="flex flex-wrap gap-2 left-0">
        {item ? (
          _.map(item.jobTypes, (item) =>
            _.upperCase(item) === "INTERNSHIP" ? (
              <span
                key={item}
                className="bg-red-100 py-1 px-2.5 rounded-sm text-xss1 font-normal text-red-400"
              >
                {_.capitalize(_.replace(item, /[-]/g, " "))}
              </span>
            ) : _.upperCase(item) === "TEMPORARY" ? (
              <span
                key={item}
                className="bg-yellow-100 py-1 px-2.5 rounded-sm text-xss1 font-normal text-yellow-500"
              >
                {_.capitalize(_.replace(item, /[-]/g, " "))}
              </span>
            ) : _.upperCase(item) === "FULL TIME" ? (
              <span
                key={item}
                className="bg-blue-100 py-1 px-2.5 rounded-sm text-xss1 font-normal text-blue-500"
              >
                {_.capitalize(_.replace(item, /[-]/g, " "))}
              </span>
            ) : _.upperCase(item) === "FREELANCE" ? (
              <span
                key={item}
                className="bg-orange-100 py-1 px-2.5 rounded-sm text-xss1 font-normal text-orange-500"
              >
                {_.capitalize(_.replace(item, /[-]/g, " "))}
              </span>
            ) : _.upperCase(item) === "PART TIME" ? (
              <span
                key={item}
                className="bg-purple-100 py-1 px-2.5 rounded-sm text-xss1 font-normal text-purple-500"
              >
                {_.capitalize(_.replace(item, /[-]/g, " "))}
              </span>
            ) : _.upperCase(item) === "REMOTE" ? (
              <span
                key={item}
                className="bg-cyan-100 py-1 px-2.5 rounded-sm text-xss1 font-normal text-cyan-500"
              >
                {_.capitalize(_.replace(item, /[-]/g, " "))}
              </span>
            ) : (
              <span
                key={item}
                className="bg-greenLight py-1 px-2.5 rounded-sm text-xss1 font-normal text-themePrimary"
              >
                {_.capitalize(_.replace(item, /[-]/g, " "))}
              </span>
            )
          )
        ) : (
          <span className="bg-greenLight py-1 px-2.5 rounded-sm text-xss1 font-normal text-themePrimary">
            Full Time
          </span>
        )}
      </span>
      <div className="text-center !pt-5 pb-6">
        <div className="flex justify-center mb-4">
          {item?.company?.logo ? (
            <Image
              width={100}
              height={100}
              src={item?.company?.logo}
              className="rounded-lg"
              alt="img"
            />
          ) : (
            <Image
              width={100}
              height={100}
              className="rounded-lg"
              src="/assets/img/avatar.png"
              alt="img"
            />
          )}
        </div>
        <h3 className="text-xxs font-normal capitalize text-black leading-5 mb-2">
          {item ? item.jobTitle : "Web and UI/UX Designer"}
        </h3>
        <div className="flex gap-2 justify-center items-center text-grayLight text-xss1 capitalize font-normal">
          <Image
            width={16}
            height={16}
            noPlaceholder
            src="/assets/img/map-pin1.svg"
            alt="img"
          />
          {item ? item.location : "Bangalore"}
        </div>
      </div>
      <div className="px-2">
        <ul className="mb-4">
          {/* Vacancy hidden */}
          {/* <li className="mb-2">
             <p className="flex gap-3 items-center text-deep text-xss1 font-normal">
               <Image
                 width={16}
                 height={16}
                 noPlaceholder
                 src="/assets/img/users1.svg"
                 alt="img"
               />
               02 Vacancy
             </p>
           </li> */}
          <li className="mb-2">
            <div className="flex gap-3 items-center text-deep text-xss1 font-normal">
              <Image
                width={16}
                height={16}
                noPlaceholder
                src="/assets/img/dollar-sign3.svg"
                alt="img"
              />
              {millify(item.salary?.minimum ? item.salary?.minimum : 10000, {
                precision: 3,
                lowercase: true,
              })}{" "}
              -{" "}
              {millify(item.salary?.maximum ? item.salary?.maximum : 100000, {
                precision: 3,
                lowercase: true,
              })}{" "}
              Taka
            </div>
          </li>
          <li className="mb-0">
            <div className="flex gap-3 items-center text-deep text-xss1 font-normal">
              <Image
                width={16}
                height={16}
                noPlaceholder
                src="/assets/img/clock1.svg"
                alt="img"
              />
              {moment(item ? item.createdAt : new Date()).fromNow()}
            </div>
          </li>
        </ul>
        <div>
          <Link legacyBehavior href={item ? (item?._id ? `/job/${item?._id}` : "#") : "#"}>
            <a className="block leading-4 text-deep text-xs group-hover:text-white text-center py-3 px-6 bg-light rounded-md transition-all group-hover:!bg-themePrimary">
              Apply Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobItem;

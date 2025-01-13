"use client"
import _ from "lodash";
import millify from "millify";
import Link from "next/link";
import { LoaderGrowing } from "../../lib/loader";
import Image from "../../optimize/image";
import moment from "moment";

const CompanyJobItem = ({ item, loading }: { item: any; loading: any }) => {
  return (
    <div className="bg-white relative p-6 border-gray border border-solid transition-all rounded-md group hover:!border-themePrimary">
      {loading && <LoaderGrowing />}
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
          <span className="bg-greenLight mt-4 py-1 px-2.5 rounded-sm text-xss1 font-normal text-themePrimary">
            Full Time
          </span>
        )}
      </span>
      <div className="!pt-4 !pb-4">
        <h3 className="text-xxs font-normal text-black leading-5 mb-0">
          {item ? item.jobTitle : "Job Title"}
        </h3>
      </div>
      <div>
        <ul className="mb-3">
          {/* <li className="mb-2">
            <p className="flex gap-3 items-center text-deep text-xss font-normal">
              <Image
                width={20}
                height={20}
                noPlaceholder
                src="/assets/img/users1.svg"
                alt="img"
              />
              02 Vacancy
            </p>
          </li> */}
          <li className="mb-2">
            <p className="flex gap-3 items-center text-deep text-xss font-normal">
              <Image
                width={16}
                height={16}
                noPlaceholder
                src="/assets/img/dollar-sign3.svg"
                alt="img"
              />
              {millify(item ? item.salary.minimum : 10000, {
                precision: 3,
                lowercase: true,
              })}{" "}
              -{" "}
              {millify(item ? item.salary.maximum : 100000, {
                precision: 3,
                lowercase: true,
              })}{" "}
              Taka
            </p>
          </li>
          <li className="mb-0">
            <p className="flex gap-3 items-center text-deep text-xss font-normal">
              <Image
                width={20}
                height={20}
                noPlaceholder
                src="/assets/img/clock1.svg"
                alt="img"
              />
              {moment(item ? item.createdAt : new Date()).fromNow()}
            </p>
          </li>
        </ul>
        <div>
          <Link href={`/job/${item?._id} `} legacyBehavior>
            <a className="block text-center py-3 px-6 bg-light rounded-md group-hover:!bg-themePrimary leading-4 text-deep transition-all text-xs group-hover:text-white">
              Apply Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobItem;

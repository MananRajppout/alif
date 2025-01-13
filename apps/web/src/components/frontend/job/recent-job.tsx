"use client";
import _ from "lodash";
import Link from "next/link";
import React from "react";
import JobItem from "./job-item";

const JobList = ["1", "2", "3", "4", "5", "6", "7", "8"];

const RecentJob = ({ data }: { data: any }) => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-themePrimary font-bold text-xs leading-none mb-1">
            Recent Job
          </p>
          <h2 className="text-xl font-bold text-black">Popular Listed jobs</h2>
        </div>

        <div className="grid gap-6 xl:gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {_.map(_.slice(data ? data : JobList, 0, 8), (item: any, index) => (
            <div key={item._id ? item._id : index}>
              <JobItem item={data ? item : false} />
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link legacyBehavior href="/find-job">
            <a className="text-white text-xs font-normal transition-all bg-arsenic px-6 py-2.5 rounded-md hover:!bg-themePrimary">
              Browse All Job
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentJob;

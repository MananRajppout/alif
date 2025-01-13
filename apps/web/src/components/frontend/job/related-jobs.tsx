"use client"
import _ from "lodash";
import React from "react";
import ImageOpt from "../../optimize/image";
import JobItem from "./job-item";

const jobs = [
  {
    id: 1,
    img: "/assets/img/loader/job_loader.svg",
  },
  {
    id: 1,
    img: "/assets/img/loader/job_loader.svg",
  },
  {
    id: 1,
    img: "/assets/img/loader/job_loader.svg",
  },
  {
    id: 1,
    img: "/assets/img/loader/job_loader.svg",
  },
];

const RelatedJobs = ({ data }: { data: any }) => {
  return (
    <section className="py-28 bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-themePrimary font-bold text-xs leading-none mb-3">
            Related Jobs
          </p>
          <h2 className="text-xl font-bold text-black">
            Latest Related Job For You
          </h2>
        </div>
        <div className="grid gap-6 xl:gap-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {data.relatedJobs &&
            _.map(data?.relatedJobs, (item, index) => (
              <JobItem key={index} item={item} />
            ))}
          {!data.relatedJobs &&
            _.map(jobs, (item, index) => (
              <div key={item.id}>
                <ImageOpt src={item.img} alt="image" width={315} height={418} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedJobs;

"use client"
import _ from "lodash";
import Link from "next/link";
import React from "react";
import Image from "../../optimize/image";

const CandidateItem = ({ item }: { item: any }) => {
  return (
    <div className="relative grid content-between bg-white p-6 border-white border border-solid transition-all rounded-md group hover:!border-themePrimary">
      <div className="text-center pt-2 pb-3">
        <div className="flex justify-center mb-2">
          <Image
            className="rounded-full p-2 border border-solid border-gray group-hover:border-themePrimary"
            src={
              item
                ? item.photo || `/assets/img/pic5.png`
                : "/assets/img/pic5.png"
            }
            alt="img"
            width={96}
            height={96}
          />
        </div>
        <h3 className="text-xs font-normal text-black leading-6 mb-0">
          {item ? item.name : "Candidate Name"}
        </h3>
        <p className="flex gap-2 items-center justify-center text-grayLight text-xss1 font-normal">
          <Image
            width={16}
            height={16}
            noPlaceholder
            src="/assets/img/map-pin1.svg"
            alt="img"
          />
          {item ? _.capitalize(item.location) : "San Francisco"}
        </p>
      </div>
      <div>
        <ul className="flex gap-2 justify-center flex-wrap mb-4">
          {item ? (
            _.map(item.skills, (skill, key) => (
              <li key={key}>
                {skill && (
                  <span className="text-deep text-xsss font-normal py-0.5 px-2 rounded-sm border border-solid border-gray">
                    {_.capitalize(skill)}
                  </span>
                )}
              </li>
            ))
          ) : (
            <>
              <li>
                <a
                  className="text-deep text-xsss font-normal py-0.5 px-2 rounded-sm border border-solid border-gray"
                  href="#"
                >
                  Skill Name
                </a>
              </li>
              <li>
                <a
                  className="text-deep text-xsss font-normal py-0.5 px-2 rounded-sm border border-solid border-gray"
                  href="#"
                >
                  Skill Name
                </a>
              </li>
              <li>
                <a
                  className="text-deep text-xsss font-normal py-0.5 px-2 rounded-sm border border-solid border-gray"
                  href="#"
                >
                  Skill Name
                </a>
              </li>
              <li>
                <a
                  className="text-deep text-xsss font-normal py-0.5 px-2 rounded-sm border border-solid border-gray"
                  href="#"
                >
                  Skill Name
                </a>
              </li>
              <li>
                <a
                  className="text-deep text-xsss font-normal py-0.5 px-2 rounded-sm border border-solid border-gray"
                  href="#"
                >
                  Skill Name
                </a>
              </li>
            </>
          )}
        </ul>
        <div>
          <Link legacyBehavior href={`/resume/${item._id}`}>
            <a className="block text-center py-3 px-6 bg-light rounded-md group-hover:!bg-themePrimary leading-4 text-deep transition-all font-medium text-xs group-hover:text-white">
              View Candidate
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateItem;

"use client";

import React from "react";
import { CircleArrowIcon } from "@/src/icons"; // Adjust the path if necessary
import _ from "lodash";
import { useRouter } from "next/navigation";
import Image from "../../optimize/image"; // Adjust the path if necessary

const CategoryItemTwo = ({
  category,
}: {
  category: {
    avatar?: string | null;
    categoryTitle?: string;
    count?: number;
  };
}) => {
  const router = useRouter();

  const onSearchHandler = (title?: string) => {
    if (!title) return;

    const values = {
      category: title,
    };

    const filtered = _.pickBy(values, (value) => value !== "");
    const queryString = new URLSearchParams(filtered).toString();
    router.push(`/find-job?${queryString}`);
  };

  // Add null checks to prevent potential undefined errors
  if (!category) return null;

  return (
    <div className="bg-white p-3 border-white border border-solid transition-all rounded-md group hover:border-themePrimary">
      <div>
        <div className="mb-2">
          {category.avatar && (
            <Image
              width={70}
              height={70}
              src={category.avatar}
              alt={category.categoryTitle || "Category Image"}
              className="rounded-lg"
              // Add object-fit and quality for better optimization
              objectFit="cover"
              quality={75}
            />
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-xxs font-normal text-black leading-6 mb-1 ">
            {category.categoryTitle || "Unnamed Category"}
          </h3>
          <p className="text-grayLight text-xss font-normal">
            {category.count || 0} Job
            {(category.count || 0) > 1 && <span>s</span>}
          </p>
          <a
            onClick={() => onSearchHandler(category.categoryTitle)}
            className="text-xss1 font-medium text-themePrimary hover:text-themePrimary leading-5 flex gap-4 items-center cursor-pointer"
          >
            View All Job
            <CircleArrowIcon
              className="w-[16px] h-[16px] text-themePrimary"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CategoryItemTwo;

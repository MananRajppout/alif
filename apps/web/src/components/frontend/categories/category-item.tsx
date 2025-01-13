"use client";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "../../optimize/image";

const CategoryItem = ({ data }: { data: any }) => {
  const router = useRouter();

  const OnSearchHandler = (title: any) => {
    const values = {
      category: title,
    };
    const filtered = _.pickBy(values, (value) => value !== "");
    const queryString = new URLSearchParams(filtered).toString();
    router.push(`/find-job?${queryString}`);
  };

  return (
    // <Link legacyBehavior href="/">
    <a
      className="text-center bg-white rounded-lg p-6 group cursor-pointer"
      onClick={() => OnSearchHandler(data?.categoryTitle)}
    >
      <div className="mb-3 flex justify-center transition-all group-hover:scale-125">
        {data?.avatar && (
          <>
            {_.includes(data.avatar, ".svg") ? (
              <Image
                width={60}
                height={60}
                noPlaceholder
                src={data.avatar}
                className="rounded"
                alt="icon"
              />
            ) : (
              <Image
                width={60}
                height={60}
                className="rounded"
                src={data.avatar}
                alt="icon"
              />
            )}
          </>
        )}
      </div>
      <h4 className="text-xs text-black font-normal mb-2">
        {_.capitalize(data.categoryTitle) || data.name}
      </h4>
      <p className="text-grayLight text-xss font-normal">
        {/* {data.count || data.subtitle} Jobs */}
        {data.categoryTitle && data.count}
        {!data.categoryTitle && data.subtitle} Job
        {data.count > 1 && <span>s</span>}
      </p>
    </a>
    // </Link>
  );
};

export default CategoryItem;

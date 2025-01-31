"use client";

import Link from "next/link";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Image from "../../optimize/image";

const BlogItem = ({ data }: { data: any }) => {
  return (
    <div className="single-blog !p-5 border-gray border border-solid transition-all rounded-md group hover:border-themePrimary">
      <div className="img mb-4 overflow-hidden rounded-md">
        {data && (
          <Link legacyBehavior href={`/blog/${data?.slug}`}>
            <a>
              <Image
                className="transition-all duration-300 group-hover:scale-125"
                src={data?.cover_image || "/assets/img/post/default.webp"}
                width={1000}
                height={650}
                alt={data?.cover_image_alt}
              />
            </a>
          </Link>
        )}
      </div>
      <p className="text-grayLight text-xss font-normal mb-2">{data?.date}</p>
      <Link legacyBehavior href={`/blog/${data?.slug}`}>
        <a className="text-arsenic hover:text-themePrimary transition-all duration-300 ease-in-out text-lg2 font-bold leading-6 mb-3 block">
          {data?.title}
        </a>
      </Link>
      {/* <div className="mb-6">
        <p className="text-xs text-deep font-normal leading-6">
          {data?.excerpt}
        </p>
      </div> */}
      <div className="blog-btn">
        <Link legacyBehavior href={`/blog/${data?.slug}`}>
          <a className="inline-flex gap-3 items-center  py-2.5 px-6 bg-light rounded-md group-hover:!bg-themePrimary leading-4 text-deep transition-all text-xxs group-hover:!text-white">
            View Company
            <FiArrowRight className="text-lg" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;

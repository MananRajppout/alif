"use client";
import _ from "lodash";
import Link from "next/link";
import React from "react";
import BlogItem from "./blog-item";

const Blog = ({ data }: { data: any }) => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-themePrimary font-bold text-xs leading-none mb-1">
            Speakers & Companies{" "}
          </p>
          <h2 className="text-xl font-bold text-black">
            See which companies will be joining us at our next event.
          </h2>
        </div>

        <div className="grid gap-4 xl:gap-6 xl:grid-cols-3 md:grid-cols-2">
          {_.map(_.slice(data, 0, 3), (item, index) => (
            <BlogItem data={item} key={index} />
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/career-advice" legacyBehavior>
            <a className="text-white text-xs font-normal transition-all bg-arsenic px-6 py-2.5 rounded-md hover:bg-themePrimary">
              See All Companies & Speakers
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;

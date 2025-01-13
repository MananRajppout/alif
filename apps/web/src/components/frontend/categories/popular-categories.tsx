"use client";
import _ from "lodash";
import Link from "next/link";
import React from "react";
import CategoryItem from "./category-item";

const categoryList = [
  {
    name: "Accounting/Finance",
    image: "./assets/img/top-c-1.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Automotive Jobs",
    image: "./assets/img/top-c-2.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Bank/Non-Bank Fin.",
    image: "./assets/img/top-c-3.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Commercial/Supply",
    image: "./assets/img/top-c-4.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Construction/Facilities",
    image: "./assets/img/top-c-5.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Design/Creative",
    image: "./assets/img/top-c-6.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Education/Training",
    image: "./assets/img/top-c-7.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Engineer/Architects",
    image: "./assets/img/top-c-8.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Hospitality/Travel",
    image: "./assets/img/top-c-9.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Electrical/Repair",
    image: "./assets/img/top-c-10.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "IT/Telecommunication",
    image: "./assets/img/top-c-11.svg",
    subtitle: "1234 Jobs",
  },
  {
    name: "Marketing/Sales",
    image: "./assets/img/top-c-12.svg",
    subtitle: "1234 Jobs",
  },
];

const PopularCategories = ({ data }: { data: any }) => {
  return (
    <section className="py-16 md:py-20 lg:py-25 !bg-light">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-themePrimary font-bold text-xs leading-none mb-2">
            Popular Categories
          </p>
          <h2 className="text-xl font-bold text-black">
            Browse Top Categories
          </h2>
        </div>
        <div className="grid gap-4 xl:gap-5 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
          {_.map(_.slice(data ? data : categoryList, 0, 12), (item, index) => (
            <CategoryItem key={index} data={item} />
          ))}
        </div>
        <div className="text-center mt-14">
          <Link legacyBehavior href="/all-categories">
            <a className="text-white text-xs font-normal transition-all bg-arsenic px-6 py-2.5 rounded-lg hover:bg-themePrimary">
              Browse All Category
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;

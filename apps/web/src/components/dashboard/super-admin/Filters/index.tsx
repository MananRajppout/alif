"use client"
import React from "react";
import useSWR from "swr";
import { Axios } from "../../../utils/axiosKits";
import Experience from "./experience";
import Regions from "./regions";
import Revenue from "./revenue";
import Salary from "./salary";
import Sizes from "./sizes";
import Skills from "./skills";
import Tags from "./tags";
import Types from "./types";

const fetcher = async (url: string) => {
  const res = await Axios(url);
  const data = await res.data.data;
  return data;
};

const Filters = () => {
  const [active, setActive] = React.useState(1);
  const { data, error } = useSWR("/admin/filters/retrives", fetcher);

  const handleClick = (value: any) => {
    setActive(value);
  };

  return (
    <div className="shadow rounded-lg bg-white">
      <div className="h-16 bg-themeDark mb-8 flex items-center px-10 rounded-lg">
        <p className="text-xxs text-white">Mange Filters</p>
      </div>
      <div className="px-8 pb-8">
        <div className="flex flex-wrap gap-3 items-center border-b pb-4 mb-10 border-gray">
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active == 1
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(1)}
          >
            Job Types
          </button>
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active === 2
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(2)}
          >
            Experience
          </button>
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active === 3
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(3)}
          >
            Regions
          </button>
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active === 4
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(4)}
          >
            Sizes
          </button>
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active === 5
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(5)}
          >
            Salary
          </button>
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active === 6
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(6)}
          >
            Revenue
          </button>
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active === 7
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(7)}
          >
            Tags
          </button>
          <button
            className={`px-3 py-2 border-2 border-themeDarkAlt duration-300 ease-in-out text-themeDarkAlt text-xs rounded-md ${
              active === 8
                ? "bg-themePrimary !border-themePrimary text-white"
                : "hover:bg-themePrimary hover:border-themePrimary hover:text-white"
            }`}
            onClick={() => handleClick(8)}
          >
            Skills
          </button>
        </div>
        {active === 1 && <Types data={data?.jobTypes} />}
        {active === 2 && <Experience data={data?.jobExperience} />}
        {active === 3 && <Regions data={data?.region} />}
        {active === 4 && <Sizes data={data?.companySize} />}
        {active === 5 && <Salary data={data?.avarageSalary} />}
        {active === 6 && <Revenue data={data?.revenue} />}
        {active === 7 && <Tags data={data?.tags} />}
        {active === 8 && <Skills data={data?.skills} />}
      </div>
    </div>
  );
};

export default Filters;

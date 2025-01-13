"use client";
import { CompanyIcon, EmployeeIcon, JobIcon } from "@/src/icons";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { Axios } from "../../utils/axiosKits";
import { useEffect, useState } from "react";
import axios from "axios";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data.data);
const fetcher2 = (url: string) => Axios(url).then((res) => res.data.data);
const CountAPI = "/jobs/count";
const catsAPI = "/jobs/categories/retrives";

const Banner = ({ totalCount }: { totalCount: any }) => {
  const { data: countData, error: countError } = useSWR(CountAPI, fetcher, {
    fallbackData: totalCount,
  });
  const { data: categoryData, error: categoryError } = useSWR(
    catsAPI,
    fetcher2,
    {
      fallbackData: [],
    }
  );

  // const { categoryData } = React.useContext(ThemeContext) as any
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    mode: "onBlur",
  });

  const OnSubmitHandler = (data: any) => {
    const values = {
      jobTitle: data.jobTitle,
      location: data.location,
      category: data.category,
    };
    const filtered = _.pickBy(values, (value) => value !== "");

    const queryString = new URLSearchParams(filtered).toString();
    router.push(`/find-job?${queryString}`);
  };

  const [count, setCount] = useState<any>(null);

  useEffect(()=>{
    const f = async () =>{
      const res = await axios.get("/api/v1/jobs/count");
      setCount(res.data.data);
    }
    f();
  },[])

  return (
    <section
      className="py-16 md:py-20 lg:py-24 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(assets/img/banner-bg.webp)" }}
    >
      <div className="absolute w-full h-full left-0 top-0 z-2 bg-themePrimary/70"></div>
      <div className="container">
        <div className="w-10/12 m-auto z-4 relative">
          <div className="text-center">
            <h1 className="text-xxl xl:text-xxxl font-bold text-white text-center leading-none mb-3">
              Find Your Dream Job <br className="hidden xl:inline" />
              With Brand Name
            </h1>
            <p className="text-lg font-normal text-white leading-8">
              Lorem Ipsum is simply dummy text of the printing and{" "}
              <br className="hidden xl:inline" />
              typesetting industry’s standard dummy text
            </p>
          </div>
          <div className="search-wrapper mt-10 p-2 rounded-2xl mb-10 bg-themePrimary/50">
            <form onSubmit={handleSubmit(OnSubmitHandler)}>
              <div className="bg-white overflow-hidden rounded-xl  md:grid gap-7 lg:gap-10 grid-cols-8 xl:grid-cols-7 items-center">
                <div className="col-span-2  px-4 md:px-0 md:pl-4 border-r-2 border-gray h-full flex items-center">
                  <input
                    type="text"
                    className="w-full block !pr-3 py-4 border-b-2 border-gray md:border-0 md:py-4 focus:outline-none bg-left bg-no-repeat px-8 placeholder:text-deep"
                    placeholder="Job Title"
                    {...register("jobTitle")}
                    style={{
                      backgroundImage: "url(assets/img/search.svg)",
                      backgroundPosition: "0 center",
                    }}
                  />
                </div>
                <div className="col-span-2 px-4 md:!px-0  border-r-2 border-gray h-full flex items-center">
                  <input
                    type="text"
                    className="w-full block !pr-3 py-3 border-b-2 border-gray md:border-0 md:py-4 focus:outline-none bg-left bg-no-repeat px-8 placeholder:text-deep"
                    placeholder="Location"
                    {...register("location")}
                    style={{
                      backgroundImage: "url(assets/img/map-pin.svg)",
                      backgroundPosition: "0 center",
                    }}
                  />
                </div>
                <div className="col-span-2 px-4 md:!px-0">
                  <select
                    aria-label="Default select example"
                    {...register("category")}
                    className="border-0 focus:shadow-none py-3 select2-init text-xxs text-deep font-normal focus-visible:white focus:outline-none w-full"
                  >
                    <option value="">Select Categories</option>
                    {categoryData.map((item: any) => (
                      <option value={item.categoryTitle} key={item._id}>
                        {_.capitalize(item.categoryTitle)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="btn-banner px-4 md:!px-0 col-span-2 xl:col-span-1 text-center grid md:justify-end py-4 md:!py-2 lg:text-right mr-4">
                  <button
                    type="submit"
                    className="md:w-28 block bg-themePrimary text-white px-4 py-3 text-xs font-medium rounded-md hover:bg-black transition-all outline-none"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="grid gap-8 xl:gap-12 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
            {count && (
              <>
                <div className="bg-white rounded-lg text-center p-8 duration-300 transition hover:bg-opacity-90">
                  <div className="flex mb-6 justify-center">
                    <JobIcon className="text-themePrimary" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl text-black font-bold leading-none mb-2">
                    {count.totalJobs + " +" || "0"}
                  </h2>
                  <p className="text-xs text-deep font-medium">JOB AVAILABLE</p>
                </div>
                <div className="bg-white rounded-lg text-center p-8 duration-300 transition hover:bg-opacity-90">
                  <div className="flex mb-6 justify-center">
                    <CompanyIcon
                      className="text-themePrimary"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-xl text-black font-bold leading-none mb-2">
                    {count.totalCompanies + " +" || "0"}
                  </h2>
                  <p className="text-xs text-deep font-medium">COMPANY</p>
                </div>
                <div className="bg-white rounded-lg text-center p-8 duration-300 transition hover:bg-opacity-90">
                  <div className="flex mb-6 justify-center">
                    <EmployeeIcon
                      className="text-themePrimary"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-xl text-black font-bold leading-none mb-2">
                    {count.totalResumes + " +" || "0"}
                  </h2>
                  <p className="text-xs text-deep font-medium">
                    AVAILABLE RESUMES
                  </p>
                </div>
              </>
            )}
            {countError && (
              <>
                {_.map(["1", "2", "3"], (item) => (
                  <div
                    key={item}
                    className="text-center bg-red-400 p-20 rounded-lg"
                  >
                    <p className="text-lg font-normal text-white leading-8">
                      No Data Found
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

"use client"
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { ThemeContext } from "../../../../context/ThemeContext";
import { Axios } from "../../../utils/axiosKits";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);

export const JobsFilter = ({
  types,
  jobExperience,
  setCurrentPage,
}: {
  types: any;
  jobExperience: any;
  setCurrentPage: any;
}) => {
  const { categoryData } = useContext(ThemeContext) as any;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobTitle, setJobTitle] = useState("") as any;
  const [location, setLocation] = useState("") as any;
  const [category, setCategory] = useState("") as any;
  const [jobTypes, setJobTypes] = useState([]) as any;
  const [experienceYear, setExperience] = useState([]) as any;
  const { register, setValue, reset, watch } = useForm();

  /* ------------ auto complete filed if router query is not empty ------------ */
  useEffect(() => {
    const CallRouter = async () => {
      if (
        searchParams.get("jobTitle") &&
        (searchParams.get("jobTitle") !== "") !== jobTitle
      ) {
        await setValue("jobTitle", searchParams.get("jobTitle"));
        await setJobTitle(searchParams.get("jobTitle"));
      }
      if (!searchParams.get("jobTitle") && jobTitle !== "") {
        await setJobTitle("");
        await setValue("jobTitle", "");
      }
    };
    CallRouter();
  }, [searchParams.get("jobTitle")]);

  useEffect(() => {
    const CallRouter = async () => {
      if (
        searchParams.get("location") &&
        (searchParams.get("location") !== "") !== location
      ) {
        await setValue("location", searchParams.get("location"));
        await setLocation(searchParams.get("location"));
      }
      if (!searchParams.get("location") && location !== "") {
        await setLocation("");
        await setValue("jobTitle", "");
      }
    };
    CallRouter();
  }, [searchParams.get("location")]);

  useEffect(() => {
    const CallRouter = async () => {
      if (
        searchParams.get("category") &&
        (searchParams.get("category") !== "") !== category
      ) {
        await setValue("category", searchParams.get("category"));
        await setCategory(searchParams.get("category"));
      }
      if (!searchParams.get("category") && category !== "") {
        await setCategory("");
        await setValue("category", "");
      }
    };
    CallRouter();
  }, [searchParams.get("category")]);

  useEffect(() => {
    const CallRouter = async () => {
      let jt = searchParams.get("jobTypes");
      let exp = searchParams.get("experienceYear");
      if (jt &&
        searchParams.get("jobTypes") &&
        jt.split(",").length !== jobTypes.length
      ) {
        await setJobTypes(_.split(searchParams.get("jobTypes"), ","));
      }
      if ( exp &&
        searchParams.get("experienceYear") &&
        exp.split(",").length !== experienceYear.length
      ) {
        await setExperience(_.split(searchParams.get("experienceYear"), ","));
      }
      if (!searchParams.get("jobTypes") && jobTypes.length > 0) {
        setJobTypes([]);
      }
      if (!searchParams.get("experienceYear") && experienceYear.length > 0) {
        setExperience([]);
      }
    };
    CallRouter();
  }, [searchParams.get("jobTypes"), searchParams.get("experienceYear")]);

  /* --------- job title,location auto complete router query --------- */
  useEffect(() => {
    if (
      jobTitle ||
      watch("jobTitle") !== "" ||
      searchParams.get("jobTitle") !== jobTitle ||
      location ||
      watch("location") !== "" ||
      searchParams.get("location") !== location
    ) {
      const delayDebounceFn = setTimeout(() => {
        const values = {
          jobTitle: watch("jobTitle"),
          location: watch("location"),
          category: watch("category"),
          jobTypes: `${jobTypes.join(",")}`,
          experienceYear: `${experienceYear.join(",")}`,
        };
        const filtered = _.pickBy(
          values,
          (value) =>
            value !== "" &&
            value !== null &&
            value !== undefined &&
            value.length > 0
        );
        const queryString = new URLSearchParams(filtered).toString();
        router.push(`/find-job?${queryString}`);
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [jobTitle, location]);

  /* --------- category auto complete router query --------- */
  useEffect(() => {
    if (
      watch("category") !== "" ||
      category ||
      searchParams.get("category") !== category
    ) {
      const values = {
        jobTitle: watch("jobTitle"),
        location: watch("location"),
        category: watch("category"),
        jobTypes: `${jobTypes.join(",")}`,
        experienceYear: `${experienceYear.join(",")}`,
      };
      const filtered = _.pickBy(
        values,
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value.length > 0
      );
      const queryString = new URLSearchParams(filtered).toString();
      router.push(`/find-job?${queryString}`);
    }
  }, [category]);

  /* ----------- jobTypes,experienceYear auto complete router query ----------- */
  useEffect(() => {
    const CallRouter = async () => {
      if (
        jobTypes.length > 0 ||
        searchParams.get("jobTypes") !== jobTypes.join(",") ||
        experienceYear.length > 0 ||
        searchParams.get("experienceYear") !== experienceYear.join(",")
      ) {
        const values = {
          jobTitle: watch("jobTitle"),
          location: watch("location"),
          category: watch("category"),
          jobTypes: `${jobTypes.join(",")}`,
          experienceYear: `${experienceYear.join(",")}`,
        };
        const filtered = _.pickBy(
          values,
          (value) =>
            value !== "" &&
            value !== null &&
            value !== undefined &&
            value.length > 0
        );
        const queryString = new URLSearchParams(filtered).toString();
        router.push(`/find-job?${queryString}`);
      }
    };

    CallRouter();
  }, [jobTypes, experienceYear]);

  /* --------------- reset all form field on click reset button --------------- */
  const ClearFilterHandler = () => {
    setJobTitle("");
    setLocation("");
    setCategory("");
    setJobTypes([]);
    setCurrentPage(0);
    setExperience([]);
    reset();
    router.push(`/find-job`);
  };

  /* -------------------- set value to jobTypes form field -------------------- */
  const AddJobTypesHandler = async (value: any, e: any) => {
    if (e.target.checked) {
      if (!jobTypes.includes(value)) {
        await setJobTypes([...jobTypes, value]);
        setCurrentPage(0);
      }
    } else {
      await setJobTypes(jobTypes.filter((item: any) => item !== value));
      setCurrentPage(0);
    }
  };

  /* ------------------- set value to experienceYear form field ------------------- */
  const AddExperienceHandler = async (value: any, e: any) => {
    if (e.target.checked) {
      if (!experienceYear.includes(value)) {
        await setExperience([...experienceYear, value]);
        setCurrentPage(0);
      }
    } else {
      await setExperience(_.without(experienceYear, value));
      setCurrentPage(0);
    }
  };

  /* ------------------- register jobTitle,location,category ------------------ */
  const job_title = register("jobTitle");
  const location_name = register("location");
  const category_name = register("category");

  return (
    <div className="col-span-3 md:w-[400px]">
      <div className="bg-white rounded-lg">
        <div className="px-6 py-3 flex items-center justify-between border-b border-gray">
          <p className="text-xs py-2 font-bold text-black leading-4">
            Search Filter
          </p>
          {(location !== "" ||
            jobTitle !== "" ||
            category !== "" ||
            jobTypes.length > 0 ||
            experienceYear.length > 0) && (
            <button
              type="button"
              onClick={ClearFilterHandler}
              className="text-xss1 font-normal text-grayLight px-2.5 py-2 rounded-lg duration-300 ease-in-out hover:text-red-400 leading-4"
            >
              Clear
            </button>
          )}
        </div>
        <div className="p-6">
          <form className="border-b border-gray">
            <div className="mb-4">
              <input
                className="bg-light rounded-md w-full text-grayLight text-base py-3 px-6 leading-tight focus:outline-none"
                type="text"
                {...job_title}
                onChange={(e) => {
                  job_title.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setJobTitle(e.target.value); // your method
                }}
                onBlur={job_title.onBlur}
                ref={job_title.ref}
                placeholder="Job Title or Keyword"
              />
            </div>
            <div className="mb-4">
              <input
                className="bg-light rounded-md w-full text-grayLight text-base py-3 px-6 leading-tight focus:outline-none"
                type="text"
                {...location_name}
                onChange={(e) => {
                  location_name.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setLocation(e.target.value); // your method
                }}
                onBlur={location_name.onBlur}
                ref={location_name.ref}
                placeholder="Location"
              />
            </div>
            <div className="jobCategorise pb-4">
              <select
                aria-label="Categories"
                {...category_name}
                onChange={(e) => {
                  category_name.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setCategory(e.target.value); // your method
                }}
                onBlur={category_name.onBlur}
                ref={category_name.ref}
                className="border-0 focus:shadow-none h-[52px] bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none w-full svg_icon px-2 appearance-none rounded-md"
              >
                <option value="">Select Categories</option>
                {_.map(categoryData, (item) => {
                  return (
                    <option
                      value={item.categoryTitle}
                      key={item.categoryTitle}
                      selected={item.categoryTitle === category}
                    >
                      {_.capitalize(item.categoryTitle)}
                    </option>
                  );
                })}
              </select>
            </div>
          </form>
        </div>

        {/* <!-- check Option --> */}
        <div className="collapsed-group mb-4">
          {types?.length > 0 && (
            <div className="mb-2">
              <div className="px-6 flex items-center justify-between">
                <div className="">
                  <p className="text-xs font-bold text-black leading-4">
                    Job Type
                  </p>
                </div>
                {/* <button className="btnCollapsedToggle">
                  <Image
                    width={20}
                    height={20}
                    noPlaceholder
                    src="/assets/img/minus.svg"
                    alt="icon"
                  />
                </button> */}
              </div>
              {/* <!-- collapsed-item --> */}
              <div className="collapsed-item px-6 py-4">
                <div className="border-b border-gray">
                  {_.map(_.sortBy(types, "_id"), (item, key) => {
                    return (
                      <div className="mb-3 w-full relative" key={key}>
                        <div
                          className="w-full"
                          onChange={(e) => AddJobTypesHandler(item._id, e)}
                        >
                          <div className="text-themeLight flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`${item._id}-${item.count}`}
                              onChange={() => {}}
                              checked={jobTypes.includes(item._id)}
                              className="w-5 h-5 bg-[#d5dde5] border border-[#d5dde5] rounded-[3px] mt-0.5 accent-green-600 focus:shadow-none flex-none"
                            ></input>

                            <label
                              title=""
                              htmlFor={`${item._id}-${item.count}`}
                              className="w-full cursor-pointer text-base leading-[18px]"
                            >
                              {_.capitalize(item._id)}
                            </label>
                          </div>
                        </div>
                        <span className="text-xs text-deep font-normal top-0 right-0 absolute">
                          {item.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* <!--/ collapsed-item --> */}
            </div>
          )}
          {jobExperience?.length > 0 && (
            <div className="mb-2">
              <div className="px-6 flex items-center justify-between">
                <div className="">
                  <p className="text-xs font-bold text-black leading-4">
                    Experience
                  </p>
                </div>
                {/* <button className="btnCollapsedToggle">
                  <Image
                    width={20}
                    height={20}
                    noPlaceholder
                    src="/assets/img/minus.svg"
                    alt="icon"
                  />
                </button> */}
              </div>
              {/* <!-- collapsed-item --> */}
              <div className="collapsed-item px-6 py-4">
                <div>
                  {_.map(_.sortBy(jobExperience, "_id"), (item, key) => {
                    const name = _.replace(item._id, / /g, "-").toLowerCase();
                    return (
                      <div className="mb-3 w-full relative" key={key}>
                        <div
                          className="w-full"
                          onChange={(e) => AddExperienceHandler(name, e)}
                        >
                          <div className="text-themeLight flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={item._id + key}
                              onChange={() => {}}
                              checked={experienceYear.includes(name)}
                              className="w-5 h-5 bg-[#d5dde5] border border-[#d5dde5] rounded-[3px] mt-0.5 accent-green-600 focus:shadow-none flex-none"
                            ></input>
                            <label
                              title=""
                              htmlFor={item._id + key}
                              className="w-full cursor-pointer text-base leading-[18px]"
                            >
                              {`${item._id}+ Years`}
                            </label>
                          </div>
                        </div>
                        <span className="text-xs text-deep font-normal top-0 right-0 absolute">
                          {item.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* <!--/ collapsed-item --> */}
            </div>
          )}
          {/* <div className="mb-2">
              <div className="px-6 flex items-center justify-between">
                <div className="">
                  <p className="text-xs font-bold text-black leading-4">
                    Skill
                  </p>
                </div>
                <button className="btnCollapsedToggle">
                  <Image
                    width={20}
                    height={20}
                    noPlaceholder
                    src="/assets/img/minus.svg"
                    alt="icon"
                  />
                </button>
              </div>
              {/* <!-- collapsed-item --> */}
          {/*<div className="collapsed-item px-6 py-4">
                <div className="">
                  <div className="mb-1 flex justify-between">
                    <label className="checkItem">
                      <input type="checkbox" checked="checked" />
                      <span className="checkmark"></span>
                      HTML
                    </label>
                    <span className="text-xs text-deep font-normal">123</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <label className="checkItem">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      CSS
                    </label>
                    <span className="text-xs text-deep font-normal">123</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <label className="checkItem">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      JavaScript
                    </label>
                    <span className="text-xs text-deep font-normal">123</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <label className="checkItem">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      React
                    </label>
                    <span className="text-xs text-deep font-normal">123</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <label className="checkItem">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Node.Js
                    </label>
                    <span className="text-xs text-deep font-normal">123</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <label className="checkItem">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Laravel
                    </label>
                    <span className="text-xs text-deep font-normal">123</span>
                  </div>
                </div>
              </div>
              {/* <!--/ collapsed-item --> */}
          {/*</div> */}
          {/* Button hidden */}
          {/* <div className="text-center pb-4 px-6">
              <button
                type="button"
                className="w-full bg-themePrimary text-white px-6 py-3 text-xs font-medium rounded-md hover:bg-black transition-all outline-none"
              >
                Search Job
              </button>
            </div> */}
        </div>
        {/* <!--/ check Option --> */}
      </div>
    </div>
  );
};

export const CompanyFilter = ({ setCurrentPage }: { setCurrentPage: any }) => {
  const router = useRouter();
  const { categoryData } = React.useContext(ThemeContext) as any;
  const [companyName, setCompanyName] = useState("") as any;
  const [industry, setIndustry] = React.useState("") as any;
  const [Size, setSize] = useState("") as any;
  const [Salary, setSalary] = React.useState("") as any;
  const [Revenue, setRevenue] = React.useState("") as any;
  const searchParams = useSearchParams();
  const { register, setValue, reset, watch } = useForm({
    mode: "Blur" as any,
  });
  const { data: filterData, error: filterError } = useSWR(
    "/admin/filters/retrives",
    fetcher,
    {
      refreshInterval: 0,
    }
  );

  /* ------------ auto complete filed if router query is not empty ------------ */
  useEffect(() => {
    const CallRouter = async () => {
      if (
        searchParams.get("companyName") &&
        (searchParams.get("companyName") !== "") !== companyName
      ) {
        await setValue("companyName", searchParams.get("companyName"));
        await setCompanyName(searchParams.get("companyName"));
      }

      if (!searchParams.get("companyName") && companyName !== "") {
        await setCompanyName("");
        await setValue("companyName", "");
      }
    };
    CallRouter();
  }, [searchParams.get("companyName")]);

  useEffect(() => {
    const CallRouter = async () => {
      if (
        searchParams.get("industry") &&
        (searchParams.get("industry") !== "") !== industry
      ) {
        await setValue("industry", searchParams.get("industry"));
        await setIndustry(searchParams.get("industry"));
      }

      if (!searchParams.get("industry") && industry !== "") {
        await setIndustry("");
        await setValue("industry", "");
      }
    };
    CallRouter();
  }, [searchParams.get("industry")]);

  useEffect(() => {
    const CallRouter = async () => {
      if (
        searchParams.get("companySize") &&
        (searchParams.get("companySize") !== "") !== Size
      ) {
        await setValue("Size", searchParams.get("companySize"));
        await setSize(searchParams.get("companySize"));
      }

      if (!searchParams.get("companySize") && Size !== "") {
        await setSize("");
        await setValue("Size", "");
      }
    };
    CallRouter();
  }, [searchParams.get("companySize")]);

  useEffect(() => {
    const CallRouter = async () => {
      if (
        searchParams.get("avarageSalary") &&
        (searchParams.get("avarageSalary") !== "") !== Salary
      ) {
        await setValue("Salary", searchParams.get("avarageSalary"));
        await setSalary(searchParams.get("avarageSalary"));
      }

      if (!searchParams.get("avarageSalary") && Salary !== "") {
        await setSalary("");
        await setValue("Salary", "");
      }
    };
    CallRouter();
  }, [searchParams.get("avarageSalary")]);

  useEffect(() => {
    const CallRouter = async () => {
      if (searchParams.get("revenue") && (searchParams.get("revenue") !== "") !== Revenue) {
        await setValue("Revenue", searchParams.get("revenue"));
        await setRevenue(searchParams.get("revenue"));
      }

      if (!searchParams.get("revenue") && Revenue !== "") {
        await setRevenue("");
        await setValue("Revenue", "");
      }
    };
    CallRouter();
  }, [searchParams.get("revenue")]);

  /* --------- company name auto complete router query --------- */
  useEffect(() => {
    if (
      companyName !== "" ||
      (searchParams.get("companyName") && companyName === "")
    ) {
      const delayDebounceFn = setTimeout(() => {
        const values = {
          companyName: companyName,
          industry: industry,
          companySize: Size,
          avarageSalary: Salary,
          revenue: Revenue,
        };
        const filtered = _.pickBy(values, (value) => value !== "");
        const queryString = new URLSearchParams(filtered).toString();
        router.push(`/company?${queryString}`);
      }, 1500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [companyName]);

  /* --------- industry,size,salary,revenue auto complete router query --------- */
  useEffect(() => {
    if (
      watch("industry") !== "" ||
      industry ||
      searchParams.get("industry") !== industry ||
      watch("Size") !== "" ||
      Size ||
      searchParams.get("companySize") !== Size ||
      watch("Salary") ||
      Salary ||
      searchParams.get("avarageSalary") !== Salary ||
      watch("Revenue") ||
      Revenue ||
      searchParams.get("revenue") !== Revenue
    ) {
      const values = {
        companyName: watch("companyName"),
        industry: watch("industry"),
        companySize: watch("Size"),
        avarageSalary: watch("Salary"),
        revenue: watch("Revenue"),
      };
      const filtered = _.pickBy(
        values,
        (value) => value !== "" && value !== null && value !== undefined
      );
      const queryString = new URLSearchParams(filtered).toString();
      router.push(`/company?${queryString}`);
    }
  }, [industry, Size, Salary, Revenue, watch]);

  /* --------------- reset all form field on click reset button --------------- */
  const ClearFilterHandler = () => {
    setCompanyName("");
    setIndustry("");
    setSize("");
    setSalary("");
    setRevenue("");
    reset();
    router.push("/company");
  };

  /* ------------------- register jobTitle,location,category ------------------ */
  const company_name = register("companyName");
  const industry_name = register("industry");
  const size = register("Size");
  const salary = register("Salary");
  const revenue = register("Revenue");

  return (
    <div className="col-span-3  lg:w-[350px]">
      <div className="bg-white rounded-lg p-2">
        <div className="px-6 py-3 flex items-center justify-between border-b border-gray ">
          <p className="text-xs py-2 font-bold text-black leading-4">
            Search Filter
          </p>
          {(companyName !== "" ||
            industry !== "" ||
            Size !== "" ||
            Salary !== "" ||
            Revenue !== "") && (
            <button
              type="button"
              onClick={ClearFilterHandler}
              className="text-xss1 font-normal text-grayLight px-2.5 py-2 rounded-lg duration-300 ease-in-out hover:text-red-400 leading-4"
            >
              Clear
            </button>
          )}
        </div>
        <div className="p-6">
          <form className="">
            <div className="mb-4">
              <input
                className="bg-light rounded-md w-full py-3 px-6 leading-tight focus:outline-none"
                type="text"
                {...company_name}
                onChange={(e) => {
                  company_name.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setCompanyName(e.target.value); // your method
                }}
                onBlur={company_name.onBlur}
                ref={company_name.ref}
                placeholder="Company Name"
              />
            </div>
            <div className="jobCategorise pb-4">
              <select
                aria-label="Default select example"
                {...industry_name}
                onChange={(e) => {
                  industry_name.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setIndustry(e.target.value); // your method
                }}
                onBlur={industry_name.onBlur}
                ref={industry_name.ref}
                className="border-0 focus:shadow-none py-3 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none svg_icon px-2 appearance-none w-full"
              >
                <option value="">Select Category</option>
                {_.map(categoryData, (item) => {
                  return (
                    <option
                      key={item._id}
                      value={item.categoryTitle}
                      selected={item.categoryTitle === industry}
                    >
                      {item.categoryTitle}
                    </option>
                  );
                })}
                {categoryData?.length === 0 && (
                  <option value="" disabled>
                    No Category Found
                  </option>
                )}
              </select>
            </div>
            <div className="jobCategorise pb-4">
              <select
                aria-label="Default select example"
                {...size}
                onChange={(e) => {
                  size.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setSize(e.target.value); // your method
                }}
                onBlur={size.onBlur}
                ref={size.ref}
                className="border-0 focus:shadow-none py-3 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none svg_icon px-2 appearance-none w-full"
              >
                <option value="">Company Size</option>
                {_.map(filterData?.companySize, (item, index) => {
                  return (
                    <option key={index} value={item} selected={item === Size}>
                      {item}
                    </option>
                  );
                })}
                {filterData?.companySize.length === 0 && (
                  <option value="" disabled>
                    No Size Found
                  </option>
                )}
              </select>
            </div>
            <div className="jobCategorise pb-4">
              <select
                aria-label="Default select example"
                {...salary}
                onChange={(e) => {
                  salary.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setSalary(e.target.value); // your method
                }}
                onBlur={salary.onBlur}
                ref={salary.ref}
                className="border-0 focus:shadow-none py-3 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none svg_icon px-2 appearance-none w-full"
              >
                <option value="">AVG. Salary</option>
                {_.map(filterData?.avarageSalary, (item, key) => {
                  return (
                    <option key={key} value={item} selected={item === Salary}>
                      {item}
                    </option>
                  );
                })}
                {filterData?.avarageSalary.length === 0 && (
                  <option value="" disabled>
                    No Salary Found
                  </option>
                )}
              </select>
            </div>
            <div className="jobCategorise pb-4">
              <select
                aria-label="Default select example"
                {...revenue}
                onChange={(e) => {
                  revenue.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setRevenue(e.target.value); // your method
                }}
                onBlur={revenue.onBlur}
                ref={revenue.ref}
                className="border-0 focus:shadow-none py-3 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none svg_icon px-2 appearance-none w-full"
              >
                <option value="">Revenue</option>
                {_.map(filterData?.revenue, (item, key) => {
                  return (
                    <option key={key} value={item} selected={item === Revenue}>
                      {item}
                    </option>
                  );
                })}
                {filterData?.revenue.length === 0 && (
                  <option value="" disabled>
                    No Revenue Found
                  </option>
                )}
              </select>
            </div>
          </form>
          {/* <div className="text-center pt-2 pb-3">
            <button
              type="button"
              className="w-full bg-themePrimary text-white px-6 py-3 text-xs font-medium rounded-md hover:bg-black transition-all outline-none"
            >
              Search Company
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export const CandidateFilter = ({
  setCurrentPage,
}: {
  setCurrentPage: any;
}) => {
  const { categoryData } = useContext(ThemeContext) as any;
  const router = useRouter();
  const [serviceName, setServiceName] = useState("") as any;
  const [category, setCategory] = useState("") as any;
  const [industry, setIndustry] = React.useState("") as any;
  const searchParams = useSearchParams();
  const [skill, setSkill] = React.useState("") as any;
  const { register, handleSubmit, setValue, reset, watch } = useForm({
    mode: "Blur" as any,
  });
  const { data: filterData, error: filterError } = useSWR(
    "/admin/filters/retrives",
    fetcher,
    {
      refreshInterval: 0,
    }
  );
  /* ------------ auto complete filed if router query is not empty ------------ */
  useEffect(() => {
    // serviceName function call
    if (
      searchParams.get("professionalTitle") &&
      (searchParams.get("professionalTitle") !== "") !== serviceName
    ) {
      setValue("serviceName", searchParams.get("professionalTitle"));
      setServiceName(searchParams.get("professionalTitle"));
    } else if (!searchParams.get("professionalTitle") && serviceName !== "") {
      setServiceName("");
      setValue("serviceName", "");
    }
    // industry function call
    if (searchParams.get("industry") && (searchParams.get("industry") !== "") !== industry) {
      setValue("industry", searchParams.get("industry"));
      setIndustry(searchParams.get("industry"));
    } else if (!searchParams.get("industry") && industry !== "") {
      setIndustry("");
      setValue("industry", "");
    }

    // skill function call
    if (searchParams.get("skills") && (searchParams.get("skills") !== "") !== skill) {
      setValue("skill", searchParams.get("skills"));
      setSkill(searchParams.get("skills"));
    } else if (!searchParams.get("skills") && skill !== "") {
      setSkill("");
      setValue("skill", "");
    }

    // category function call
    if (searchParams.get("category") && (searchParams.get("category") !== "") !== category) {
      setValue("category", searchParams.get("category"));
      setCategory(searchParams.get("category"));
    } else if (!searchParams.get("category") && category !== "") {
      setCategory("");
      setValue("category", "");
    }
  }, [
    searchParams.get("professionalTitle"),
    searchParams.get("industry"),
    searchParams.get("skills"),
    searchParams.get("category"),
  ]);

  /* --------- service name auto complete router query --------- */
  useEffect(() => {
    if (
      serviceName !== "" ||
      (searchParams.get("professionalTitle") && serviceName === "")
    ) {
      const delayDebounceFn = setTimeout(() => {
        const values = {
          professionalTitle: serviceName,
          category: category,
          industry: industry,
          skills: skill,
        };
        const filtered = _.pickBy(values, (value) => value !== "");
        const queryString = new URLSearchParams(filtered).toString();
        router.push(`/candidate?${queryString}`);
      }, 1500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [serviceName]);

  /* --------- service name auto complete router query --------- */
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (
        watch("skill") ||
        skill ||
        searchParams.get("companySize") !== skill ||
        watch("category") ||
        category ||
        searchParams.get("category") !== category
      ) {
        const values = {
          professionalTitle: serviceName,
          category: category,
          skills: skill,
        };
        const filtered = _.pickBy(values, (value) => value !== "");
        const queryString = new URLSearchParams(filtered).toString();
        router.push(`/candidate?${queryString}`);
      }
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [category, skill]);

  const OnSubmitHandler = (data: any) => {
    const values = {
      professionalTitle: data.serviceName.replace(/[ ]/g, "-"),
      category: data.category,
      industry: data.industry,
      skills: data.skill,
    };
    const filtered = _.pickBy(values, (value) => value !== "");
    const queryString = new URLSearchParams(filtered).toString();
    router.push(`/candidate?${queryString}`);
  };

  /* --------------- reset all form field on click reset button --------------- */
  const ClearFilterHandler = () => {
    setServiceName("");
    setCategory("");
    setIndustry("");
    setSkill("");
    reset();
    router.push("/candidate");
  };

  /* ------------------- register jobTitle,location,category ------------------ */
  const candidate_title = register("serviceName");
  const category_name = register("category");
  const skill_name = register("skill");

  return (
    <div className="col-span-3 md:w-[350px]">
      <div className="bg-white rounded-lg">
        <div className="px-6 py-3 flex items-center justify-between border-b border-gray">
          <p className="text-xs py-2 font-bold text-black leading-4">
            Search Filter
          </p>
          {(serviceName !== "" ||
            industry !== "" ||
            skill !== "" ||
            category !== "") && (
            <button
              type="button"
              onClick={ClearFilterHandler}
              className="text-xss1 font-normal text-grayLight px-2.5 py-2 rounded-lg duration-300 ease-in-out hover:text-red-400 leading-4"
            >
              Clear
            </button>
          )}
        </div>
        <div className="p-6">
          <form className="" onSubmit={handleSubmit(OnSubmitHandler)}>
            <div className="mb-4">
              <input
                className="bg-light rounded-md w-full py-3 px-6 leading-tight focus:outline-none"
                type="text"
                {...candidate_title}
                onChange={(e) => {
                  candidate_title.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setServiceName(e.target.value); // your method
                }}
                onBlur={candidate_title.onBlur}
                ref={candidate_title.ref}
                placeholder="Search By Service"
              />
            </div>
            {/* <div className="jobCategorise pb-4">
              <Form.Select
                aria-label="Default select example"
                {...industry_name}
                onChange={(e) => {
                  industry_name.onChange(e) // method from hook form register
                  setIndustry(e.target.value) // your method
                }}
                onBlur={industry_name.onBlur}
                ref={industry_name.ref}
                className="border-0 focus:shadow-none py-3 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none"
              >
                <option value="">Industry</option>
                {_.map(industryList, (item, index) => {
                  const value = _.replace(item.name.toLowerCase(), /[ ]/g, '-')
                  return (
                    <option key={index} value={value}>
                      {item.name}
                    </option>
                  )
                })}
              </Form.Select>
            </div> */}
            <div className="jobCategorise pb-4">
              <select
                aria-label="Default select example"
                {...category_name}
                onChange={(e) => {
                  category_name.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setCategory(e.target.value); // your method
                }}
                onBlur={category_name.onBlur}
                ref={category_name.ref}
                className="border-0 focus:shadow-none py-3 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none svg_icon px-2 appearance-none w-full"
              >
                <option value="">Select Category</option>
                {_.map(categoryData, (item, index) => {
                  return (
                    <option key={index} value={item.categoryTitle}>
                      {item.categoryTitle}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="jobCategorise pb-4">
              <select
                aria-label="Default select example"
                {...skill_name}
                onChange={(e) => {
                  skill_name.onChange(e); // method from hook form register
                  setCurrentPage(0); // current page reset to 0
                  setSkill(e.target.value); // your method
                }}
                onBlur={skill_name.onBlur}
                ref={skill_name.ref}
                className="border-0 focus:shadow-none py-3 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none svg_icon px-2 appearance-none w-full"
              >
                <option value="">Select Skill</option>
                {_.map(filterData?.skills, (item, index) => {
                  return (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* <div className="text-center pt-2 pb-3">
              <button
                type="submit"
                className="w-full bg-themePrimary text-white px-6 py-3 text-xs font-medium rounded-md hover:bg-black transition-all outline-none"
              >
                Search Company
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

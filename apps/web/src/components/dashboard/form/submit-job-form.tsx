"use client"
import sendEmail from "@/src/utils/sendEmail";
import _ from "lodash";
import Multiselect from "multiselect-react-dropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import useSWR, { useSWRConfig } from "swr";
import { ThemeContext } from "../../../context/ThemeContext";
import { FormLoader, LoaderGrowing } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";
import { MultiSelect } from "./multi-select-dropdown";
import axios from "axios";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const newFeature = (url: string) => authAxios(url).then((res) => res.data);

const SubmitJobForm = ({ userData }: { userData: any }) => {
  const [isMailSent, setIsMailSent] = React.useState(false);
  const [emailType, setEmailType] = React.useState("");
  const Router = useRouter();

  const { data: filterData, error: filterError } = useSWR(
    "/admin/filters/retrives",
    fetcher,
    {
      refreshInterval: 0,
    }
  );
  const { data: companiesData, error: companiesError } = useSWR(
    "/companies/private",
    fetcher,
    {
      refreshInterval: 0,
    }
  );
  // package data fetched from server
  const { data: Data, error: packageError } = useSWR(
    `/packages/retrives`,
    newFeature,
    {
      refreshInterval: 0,
    }
  );
  const packageData = Data ? Data.data : [];
  // remove isApproved false from companiesData
  const ApprovedCompanies = _.filter(companiesData, (company) => {
    return company.status.isApproved && company.status.isActive;
  });
  const { categoryData } = React.useContext(ThemeContext) as any;
  const [companyName, setCompanyName] = React.useState("");
  const [JobHeaderImg, setJobHeaderImg] = React.useState("");
  const Package = userData?.package ? false : true;
  const jobForm = companyName ? false : (true as boolean);
  const [loading, setLoading] = React.useState(false);
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();

  

  // register submit job form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  }) as any;

  // select package form
  const { register: registerPackage, handleSubmit: handleSubmitPackage } =
    useForm({
      mode: "onChange",
    }) as any;

  // submit job form handler
  const onSubmit = async (data: any) => {
    const {
      jobTitle,
      jobDescription,
      applyLink,
      category,
      companyName,
      email,
      headerImage,
      hourlyrateMaximum,
      hourlyrateMinimum,
      location,
      jobTypes,
      region,
      salaryMaximum,
      salaryMinimum,
      specialTags,
    } = data;
    const formData = new FormData();
    formData.append("jobTitle", jobTitle); // return string
    formData.append("jobDescription", jobDescription); // return string
    formData.append("applyLink", applyLink); // return string
    // formData.append("category", category[0].categoryTitle); // return category title
    formData.append("company", companyName[0]._id); // return company id
    formData.append("email", email); // return company email
    if (data.headerImage) {
      formData.append("headerImage", headerImage[0]); // return image file
    }
    formData.append("hourlyrateMaximum", hourlyrateMaximum); // return number
    formData.append("hourlyrateMinimum", hourlyrateMinimum); // return number
    formData.append("location", location); // return string
    formData.append("jobTypes", jobTypes); // return array
    formData.append("region", region[0]); // return string
    formData.append("salaryMaximum", salaryMaximum); // return number
    formData.append("salaryMinimum", salaryMinimum); // return number
    formData.append("specialTags", specialTags); // return array

    try {
      await authAxios({
        method: "POST",
        url: "/jobs/retrives",
        data: formData,
      }).then((res) => {
        addToast(res.data.message, {
          appearance: "success",
          autoDismiss: true,
        });
        mutate("/jobs/private");
        setEmailType("JOB_PUBLISHED");
        setIsMailSent(true);
        reset();
        Router.push("/job/manages-jobs");
      });
    } catch (error: any) {
      if (error?.response?.data) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        addToast(error?.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  //  Send Email to the user
  useEffect(() => {
    if (isMailSent) {
      sendEmail(emailType);
      setIsMailSent(false);
    }
  }, [isMailSent]);

  // company log image upload preview handler
  function PreviewImage(e: any, setImage: any) {
    const file = e.target.files[0];
    const filePreview = URL.createObjectURL(file);
    setImage(filePreview);
  }

  const header_Image = register("headerImage");
  const company_name = register("companyName", {
    required: "Company name is required",
  });

  const onPackageSubmit = async (data: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "PUT",
        url: "/users/package",
        data: data,
      }).then((res) => {
        mutate("/users/retrives").then(() => {
          setLoading(false);
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
        });
      });
    } catch (error: any) {
      if (error?.response?.data) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      } else {
        addToast(error?.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      }
    }
  };

  const packageItem = registerPackage("packageId", {
    required: "Package is required",
  });

  const [category, setCategory] = React.useState<any>([]);
  useEffect(()=>{
    const f = async () => {
      const res = await axios.get("/api/v1/jobs/categories/retrives");
      setCategory(res.data.data);
    }
    f()
  },[])


  return (
    <section>
      <div className="rounded-lg shadow-lg bg-white mb-8">
        <div className="bg-themeDark rounded-lg py-3">
          <p className="text-lg2 font-semibold text-white px-6 sm:px-10">
            Select Company
          </p>
        </div>
        <div className="sm:px-5 py-10 mx-3 sm:mx-0 relative">
          {companiesError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p className="font-bold">Error</p>
              <p>{companiesError.message}</p>
            </div>
          )}
          {!companiesData && <LoaderGrowing />}
          <div className="flex flex-col sm:flex-row gap-8 ">
            {/* company */}
            <label className="w-full" htmlFor="addCompany">
              <p className="text-base font-normal text-themeDark pb-3">
                Add Company
              </p>
              <Multiselect
                customCloseIcon={
                  <svg
                    width="10"
                    height="10"
                    className="ml-2 cursor-pointer hover:text-red-500"
                    viewBox="0 0 10 10"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9M1 1L9 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                style={{
                  chips: {
                    backgroundColor: "#E8F7EE",
                    color: "#66737F",
                    borderRadius: "4px",
                    fontSize: "16px",
                    height: "33px",
                  },
                  searchBox: {
                    padding: "8px",
                    border: "1px solid #dee2e6",
                  },
                }}
                id="addCompany"
                {...company_name}
                setValue={setValue}
                name="companyName"
                emptyRecordMsg="No company found"
                placeholder="Select Company"
                singleSelect={true}
                selectionLimit={1}
                options={ApprovedCompanies}
                displayValue="companyName"
                onSelect={(selected, item) => {
                  setValue("companyName", selected);
                  setCompanyName(selected);
                }}
                onRemove={(selected, item) => {
                  setValue("companyName", selected);
                  setCompanyName(null as any);
                }}
              />
              {ApprovedCompanies.length === 0 && (
                <span className="text-red-400 text-sm italic !pt-1.5 block">
                  No company found, please add company first
                </span>
              )}
            </label>
          </div>
          {ApprovedCompanies.length < 1 && (
            <div className="pt-6">
              <Link legacyBehavior href="/company/add-company">
                <a className="bg-themePrimary inline-block text-white rounded-lg px-4 !py-3 shadow-themePrimary">
                  Add Company
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-lg shadow-lg bg-white relative">
        <div className="bg-themeDark rounded-lg py-3">
          <p className="text-lg2 font-semibold text-white px-6 sm:px-10">
            Job Details
          </p>
        </div>
        <div className="sm:px-5 py-10 mx-3 sm:mx-0">
          {companiesError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p className="font-bold">Error</p>
              <p>{companiesError.message}</p>
            </div>
          )}
          {!filterData && <LoaderGrowing />}
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row gap-8 ">
              {/* JobTitle */}
              <label className="w-full sm:w-1/2" htmlFor="jobTitle">
                <p className="text-base font-normal text-themeDark pb-3">
                  Job Title
                </p>
                <input
                  disabled={jobForm}
                  className={`w-full border ${
                    errors?.jobTitle ? "!border-red-400" : "border-gray"
                  } focus:outline-none h-12 px-3 rounded`}
                  type="text"
                  id="jobTitle"
                  {...register("jobTitle", {
                    required: "Job Title is required",
                  })}
                  placeholder="Jones Ferdinand"
                />
                {errors?.jobTitle && (
                  <p className="text-red-500 text-sm !py-1 italic">
                    {errors?.jobTitle.message}
                  </p>
                )}
              </label>
              {/* Location */}
              <label className="w-full sm:w-1/2" htmlFor="location">
                <p className="text-base font-normal text-themeDark pb-3">
                  Location{" "}
                  <span className="text-sm text-themeLight">(optional)</span>
                </p>
                <input
                  disabled={jobForm}
                  className="w-full border border-gray focus:outline-none h-12 px-3 rounded"
                  type="text"
                  id="location"
                  {...register("location")}
                  placeholder='e.g. "London"'
                />
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Job Region */}
              <label className="w-full sm:w-1/2" htmlFor="region">
                <p className="text-base font-normal text-themeDark pb-3">
                  Job Region
                </p>
                <MultiSelect
                  disabled={jobForm}
                  options={filterData?.region}
                  isObject={false}
                  name="region"
                  validationSyntax={true}
                  register={register}
                  setValue={setValue}
                  error={errors?.region}
                  emptyRecordMsg="No region found"
                  placeholder="Select Region"
                  singleSelect
                  forwardRef={undefined}
                  displayValue={undefined}
                  selectedValues={undefined}
                  className={undefined}
                />
                {errors?.region && (
                  <p className="text-red-500 text-sm !py-1 italic">
                    {errors?.region.message}
                  </p>
                )}
              </label>
              {/* Job Types */}
              <label className="w-full sm:w-1/2" htmlFor="jobTypes">
                <p className="text-base font-normal text-themeDark pb-3">
                  Job Type
                </p>

                <MultiSelect
                  disabled={jobForm}
                  options={filterData?.jobTypes}
                  isObject={false}
                  name="jobTypes"
                  validationSyntax={true}
                  error={errors?.jobTypes}
                  register={register}
                  setValue={setValue}
                  emptyRecordMsg="No job type found"
                  placeholder="Select Job Type"
                  forwardRef={undefined}
                  displayValue={undefined}
                  selectedValues={undefined}
                  singleSelect={undefined}
                  className={undefined}
                />
                {errors?.jobTypes && (
                  <p className="text-red-500 text-sm !py-1 italic">
                    {errors?.jobTypes.message}
                  </p>
                )}
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Job Category */}
              <label className="w-full sm:w-1/2" htmlFor="category">
                <p className="text-base font-normal text-themeDark pb-3">
                  Job Category
                </p>
                <MultiSelect
                  disabled={jobForm}
                  options={category}
                  displayValue="categoryTitle"
                  name="category"
                  validationSyntax={true}
                  register={register}
                  error={errors?.category}
                  setValue={setValue}
                  emptyRecordMsg="No category found"
                  placeholder="Select Category"
                  singleSelect
                  forwardRef={undefined}
                  selectedValues={undefined}
                  className={undefined}
                  isObject={undefined}
                />
                {errors?.category && (
                  <p className="text-red-500 text-sm !py-1 italic">
                    {errors?.category.message}
                  </p>
                )}
              </label>
              {/* Job Tags */}
              <label className="w-full sm:w-1/2" htmlFor="specialTags">
                <p className="text-base font-normal text-themeDark pb-3">
                  Job Tags
                </p>
                <MultiSelect
                  disabled={jobForm}
                  options={filterData?.tags}
                  isObject={false}
                  validationSyntax={true}
                  error={errors?.specialTags}
                  name="specialTags"
                  register={register}
                  setValue={setValue}
                  emptyRecordMsg="No tags found"
                  placeholder="Select Tags"
                  forwardRef={undefined}
                  displayValue={undefined}
                  selectedValues={undefined}
                  singleSelect={undefined}
                  className={undefined}
                />
                {errors?.specialTags && (
                  <p className="text-red-500 text-sm !py-1 italic">
                    {errors?.specialTags.message}
                  </p>
                )}
              </label>
            </div>

            {/* Job Description */}
            <label className="w-full" htmlFor="jobDescription">
              <p className="text-base font-normal text-themeDark pb-3">
                Description
              </p>
              <textarea
                disabled={jobForm}
                className={`w-full border ${
                  errors?.jobDescription ? "!border-red-400" : "border-gray"
                } focus:outline-none h-36 p-3 rounded`}
                type="text"
                id="jobDescription"
                {...register("jobDescription", {
                  required: "Description is required",
                })}
                placeholder="We are a team of expert designers and developers committed to rendering the best WordPress website designing services in a cost-effective practice. We are on a mission to help small business owners build their presence online. Our customer-centric approach ensures that the final product is unbeatable."
              />
              {errors?.jobDescription && (
                <p className="text-red-500 text-sm !py-1 italic">
                  {errors?.jobDescription.message}
                </p>
              )}
            </label>
            <div className="flex flex-col sm:flex-row gap-8">
              {/*  */}
              <label className="w-full sm:w-1/2" htmlFor="email">
                <p className="text-base font-normal text-themeDark pb-3">
                  Application Email/URL
                </p>
                <input
                  disabled={jobForm}
                  className={`w-full border ${
                    errors?.email ? "!border-red-400" : "border-gray"
                  } focus:outline-none h-12 px-3 rounded`}
                  type="email"
                  placeholder="info@youremail.com"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "invalid email address",
                    },
                  })}
                />
                {errors?.email && (
                  <p className="text-red-500 text-sm !py-1 italic">
                    {errors?.email.message}
                  </p>
                )}
              </label>
              {/* hourly rate Minimum */}
              <label className="w-full sm:w-1/2" htmlFor="hourlyrateMinimum">
                <p className="text-base font-normal text-themeDark pb-3">
                  Minimum Rate/h
                  <span className="text-sm text-themeLight">(optional)</span>
                </p>
                <input
                  disabled={jobForm}
                  className={`w-full border ${
                    errors?.hourlyrateMinimum
                      ? "!border-red-400"
                      : "border-gray"
                  } focus:outline-none h-12 px-3 rounded`}
                  type="text"
                  id="hourlyrateMinimum"
                  placeholder="40"
                  {...register("hourlyrateMinimum", {
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "This field only accepts numbers",
                    },
                  })}
                />
                {errors.hourlyrateMinimum && (
                  <p className="text-sm text-red-400 !py-1 italic">
                    {errors?.hourlyrateMinimum?.message}
                  </p>
                )}
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-8">
              {/* hourly rate Maximum */}
              <label className="w-full sm:w-1/2" htmlFor="hourlyrateMaximum">
                <p className="text-base font-normal text-themeDark pb-3">
                  Maximum Rate/h
                  <span className="text-sm text-themeLight">(optional)</span>
                </p>
                <input
                  disabled={jobForm}
                  className={`w-full border ${
                    errors?.hourlyrateMaximum
                      ? "!border-red-400"
                      : "border-gray"
                  } focus:outline-none h-12 px-3 rounded`}
                  type="text"
                  placeholder="60"
                  id="hourlyrateMaximum"
                  pattern="[0-9]*"
                  {...register("hourlyrateMaximum", {
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "This field only accepts numbers",
                    },
                  })}
                />
                {errors.hourlyrateMaximum && (
                  <p className="text-sm text-red-400 !py-1 italic">
                    {errors?.hourlyrateMaximum?.message}
                  </p>
                )}
              </label>
              {/* salary Minimum */}
              <label className="w-full sm:w-1/2" htmlFor="salaryMinimum">
                <p className="text-base font-normal text-themeDark pb-3">
                  Minimum Salary
                  <span className="text-sm text-themeLight">(optional)</span>
                </p>
                <input
                  disabled={jobForm}
                  className={`w-full border ${
                    errors?.salaryMinimum ? "!border-red-400" : "border-gray"
                  } focus:outline-none h-12 px-3 rounded`}
                  type="text"
                  placeholder="1500"
                  id="salaryMinimum"
                  pattern="[0-9]*"
                  {...register("salaryMinimum", {
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "This field only accepts numbers",
                    },
                  })}
                />
                {errors.salaryMinimum && (
                  <p className="text-sm text-red-400 !py-1 italic">
                    {errors?.salaryMinimum?.message}
                  </p>
                )}
              </label>
            </div>
            <div className=" flex flex-col sm:flex-row gap-8">
              {/* salary Maximum */}
              <label className="w-full sm:w-1/2" htmlFor="salaryMaximum">
                <p className="text-base font-normal text-themeDark pb-3">
                  Maximum Salary
                  <span className="text-sm text-themeLight">(optional)</span>
                </p>
                <input
                  disabled={jobForm}
                  className={`w-full border ${
                    errors?.salaryMaximum ? "!border-red-400" : "border-gray"
                  } focus:outline-none h-12 px-3 rounded`}
                  type="text"
                  placeholder="2000"
                  id="salaryMaximum"
                  {...register("salaryMaximum", {
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "This field only accepts numbers",
                    },
                  })}
                />
                {errors.salaryMaximum && (
                  <p className="text-sm text-red-400 !py-1 italic">
                    {errors?.salaryMaximum?.message}
                  </p>
                )}
              </label>
              {/* Apply Link */}
              <label className=" w-full sm:w-1/2" htmlFor="applyLink">
                <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                  External “Apply For Job” link
                  <span className="text-sm text-themeLight">(optional)</span>
                </p>
                <input
                  disabled={jobForm}
                  className={`w-full border ${
                    errors?.applyLink ? "!border-red-400" : "border-gray"
                  } focus:outline-none h-12 px-3 rounded`}
                  type="url"
                  placeholder="http://www.example.com"
                  id="applyLink"
                  {...register("applyLink", {
                    pattern: {
                      value:
                        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
                      message: "This field only accepts valid urls",
                    },
                  })}
                />
                {errors.applyLink && (
                  <p className="text-sm text-red-400 !py-1 italic">
                    {errors?.applyLink?.message}
                  </p>
                )}
              </label>
            </div>
            {/* Header Image */}
            <label className="w-full" htmlFor="headerImage">
              <p className="text-base font-normal text-themeDark !pb-1">
                Header Image
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <div className="border border-gray rounded !py-2 !px-3">
                {JobHeaderImg && (
                  <span className="!mb-6 w-2/3 items-center flex gap-3">
                    <ImageOpt
                      className="rounded-lg shadow-lg"
                      src={JobHeaderImg}
                      width={800}
                      height={400}
                      alt="Company Header Image"
                    />
                    <button
                      className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded hover:bg-red-500"
                      onClick={() => {
                        setJobHeaderImg(null as any);
                        setValue("headerImage", "");
                      }}
                    >
                      Remove
                    </button>
                  </span>
                )}
                <div className="flex gap-4 items-center">
                  <label
                    // disabled={jobForm }
                    className={`block ${
                      jobForm
                        ? "bg-themeLighterAlt hover:!bg-themeLighterAlt cursor-default"
                        : ""
                    } text-themeDark text-xss1 duration-300 ease-in-out py-1 px-3 border border-gray shadow-sm cursor-pointer hover:bg-themePrimary/20 hover:border-themePrimary/20 rounded`}
                    htmlFor="headerImage"
                  >
                    Select File
                    <input
                      disabled={jobForm}
                      className="hidden"
                      accept="image/*"
                      id="headerImage"
                      {...header_Image}
                      ref={header_Image.ref}
                      onBlur={header_Image.onBlur}
                      onChange={(e) => {
                        header_Image.onChange(e);
                        PreviewImage(e, setJobHeaderImg);
                      }}
                      type="file"
                    />
                  </label>
                  <span className="text-xss1 text-themeLighter">
                    Maximum file size: 100 MB.
                  </span>
                </div>
              </div>
            </label>
            <div className="pt-6">
              <button
                type="submit"
                disabled={jobForm || isSubmitting}
                className={`flex gap-2 items-center ${
                  isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
                } ${
                  jobForm ? "opacity-30" : "opacity-100"
                } text-white rounded-lg px-4 !py-3 shadow-themePrimary`}
              >
                {isSubmitting ? "Please wait..." : "Create New Job"}
                {/* loader */}
                {isSubmitting && <FormLoader />}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* package select popup */}
      {Package && (
        <div className={`absolute top-0 left-0 w-full h-full z-30`}>
          {/* popup box wrapper */}
          <div className="flexed top-0 left-0 bottom-0 right-0">
            <div className="grid w-full h-screen justify-center items-center z-40 !px-5">
              <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-w-[700px] w-full max-h-[600px]">
                <div className="bg-themePrimary text-themeLighterAlt px-6 py-6">
                  <h2 className="text-xl font-semibold text-center">
                    Select Package
                  </h2>
                  <p className="text-base text-center text-themeLighterAlt">
                    You need to select a package to post a job.
                  </p>
                </div>
                <form onSubmit={handleSubmitPackage(onPackageSubmit)}>
                  <div className="px-6 py-4">
                    {/* package list radio */}
                    <div className="grid grid-cols-1 gap-4">
                      {packageData.map((item: any, index: any) => (
                        <div
                          key={index}
                          className="flex items-center !gap-5 justify-center"
                        >
                          <input
                            className=""
                            type="radio"
                            name="packageId"
                            ref={packageItem.ref}
                            onBlur={packageItem.onBlur}
                            onChange={(e) => {
                              packageItem.onChange(e);
                              setValue("packageId", item._id);
                            }}
                            id={`packageId-${index}`}
                            value={item._id}
                            defaultChecked={index === 0}
                          />
                          <label
                            className="flex items-center"
                            htmlFor={`packageId-${index}`}
                          >
                            <div className="cursor-pointer">
                              <h3 className="text-lg font-semibold">
                                {item.packageName}
                              </h3>
                              <p className="text-sm text-themeDarker">
                                {item.shortDesc}
                              </p>
                            </div>
                          </label>
                          <div className="flex items-center justify-center">
                            <h3 className="text-lg font-semibold">
                              {item.pricing}
                            </h3>
                            <p className="text-sm text-themeDarker">$</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* list submit button */}
                    <div className="flex flex-wrap justify-between gap-4 mt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`${
                          loading
                            ? "bg-themeDarkerAlt"
                            : "bg-themePrimary hover:bg-themeDarkerAlt"
                        } flex items-center !gap-2 transition-all duration-300 ease-in-out text-white rounded-lg px-4 py-2 shadow-xl`}
                      >
                        {loading ? "Processing..." : "Choose Package"}
                        {/* loader */}
                        {/* {loading && <FormLoader />} */}
                      </button>
                      {/* redirect to package page */}
                      <Link legacyBehavior href="/packages/active-package">
                        <a className="bg-themeDarkerAlt hover:bg-themePrimary transition-all duration-300 ease-in-out text-white rounded-lg px-4 py-2 shadow-xl">
                          View Packages
                        </a>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-themeDarkerAlt w-full -z-10 h-full opacity-50"></div>
        </div>
      )}
    </section>
  );
};

export default SubmitJobForm;

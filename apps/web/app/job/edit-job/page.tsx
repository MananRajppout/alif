"use client";
import sendEmail from "@/src/utils/sendEmail";
import _ from "lodash";
import Multiselect from "multiselect-react-dropdown";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Suspense } from 'react';

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import useSWR, { useSWRConfig } from "swr";
import { MultiSelect } from "@/src/components/dashboard/form/multi-select-dropdown";
import Layout from "@/src/components/dashboard/layout";
import { FormLoader, LoaderGrowing } from "@/src/components/lib/loader";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import ImageOpt from "@/src/components/optimize/image";
import { authAxios } from "@/src/components/utils/axiosKits";
import { ThemeContext } from "@/src/context/ThemeContext";

const fetcher = (url: any) => authAxios(url).then((res) => res.data.data);

const EditJob = () => {
  const [isMailSent, setIsMailSent] = React.useState(false);
  //  Send Email to the user
  useEffect(() => {
    if (isMailSent) {
      sendEmail("JOB_PUBLISHED");
      setIsMailSent(false);
    }
  }, [isMailSent]);

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
  // remove isApproved false from companiesData
  const ApprovedCompanies = _.filter(companiesData, (company) => {
    return company.status.isApproved && company.status.isActive;
  });
  const { categoryData } = React.useContext(ThemeContext) as any;
  const [companyName, setCompanyName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [JobHeaderImg, setJobHeaderImg] = React.useState("");
  const jobForm = companyName ? false : true;
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();
  const router = useRouter();
  const query = useSearchParams();
  const active_id = query.get("active_id");
  const { data, error } = useSWR(
    active_id ? `/jobs/job/${active_id}` : null,
    fetcher,
    {
      refreshInterval: 0,
    }
  );
  const { data: user, status } = useSession();
  const userData = user?.user as any;
  const isCandidate = userData?.role.isCandidate;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
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

    console.log("Save changes clicked");

    const formData = new FormData();
    formData.append("jobTitle", jobTitle); // return string
    formData.append("jobDescription", jobDescription); // return string
    formData.append("applyLink", applyLink); // return string
    formData.append("category", category[0].categoryTitle); // return category title
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
      console.log("Save changes clicked 222");
      await authAxios({
        method: "PUT",
        url: `/jobs/job/${active_id}`,
        data: formData,
      }).then((res) => {
        addToast(res.data.message, {
          appearance: "success",
          autoDismiss: true,
        });
        mutate("/jobs/private");
        // send email to the user
        setIsMailSent(true);
        reset();
        router.push("/job/manages-jobs");
      });
    } catch (error: any) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  // company log image upload preview handler
  function PreviewImage(
    e: any,
    setImage: {
      (value: React.SetStateAction<string>): void;
      (arg0: string): void;
    }
  ) {
    const file = e.target.files[0];
    const filePreview = URL.createObjectURL(file);
    setImage(filePreview);
  }

  const header_Image = register("headerImage");
  const company_name = register("companyName", {
    required: "Company name is required",
  });

  // default value set
  React.useEffect(() => {
    if (data && categoryData) {
      const getCategoryName = _.find(categoryData, (category) => {
        return category.categoryTitle === data.category;
      });

      setCompanyName(data?.company ? [data?.company] : ("" as any));
      setValue("companyName", getCategoryName ? [getCategoryName] : "");
      setValue("jobTitle", data?.jobTitle);
      setValue("email", data?.email);
      setValue("jobDescription", data?.jobDescription);
      setValue("salaryMinimum", data?.salary?.minimum);
      setValue("salaryMaximum", data?.salary?.maximum);
      setValue("hourlyrateMinimum", data?.hourlyrate?.minimum);
      setValue("hourlyrateMaximum", data?.hourlyrate?.maximum);
      setValue("location", data?.location);
      setValue("applyLink", data?.applyLink ? data?.applyLink : "");
      setCategoryName(getCategoryName && [getCategoryName]);
      setValue("category", getCategoryName && [getCategoryName]);
      // setValue("headerImage", data?.headerImage);
      if (data?.avatar) {
        setJobHeaderImg(data?.avatar);
      }
      setValue("jobTypes", data?.jobTypes);
      setValue("specialTags", data?.specialTags);
      setValue("region", [data?.region]);
    }
  }, [data, setValue, categoryData]);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Edit Job. Edit your job. Edit your job details."
        />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {isCandidate && <UserGoBack />}
          {userData && status === "authenticated" && !isCandidate && (
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
                        selectedValues={companyName}
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
                      <Link href="/company/add-company" legacyBehavior>
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
                          <span className="text-sm text-themeLight">
                            (optional)
                          </span>
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
                          selectedValues={
                            data?.region ? [data?.region] : undefined
                          }
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
                          selectedValues={
                            data?.jobTypes ? data?.jobTypes : undefined
                          }
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
                          options={categoryData}
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
                          selectedValues={
                            categoryName ? categoryName : undefined
                          }
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
                          selectedValues={
                            data?.specialTags ? data?.specialTags : undefined
                          }
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
                          errors?.jobDescription
                            ? "!border-red-400"
                            : "border-gray"
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
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
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
                      <label
                        className="w-full sm:w-1/2"
                        htmlFor="hourlyrateMinimum"
                      >
                        <p className="text-base font-normal text-themeDark pb-3">
                          Minimum Rate/h
                          <span className="text-sm text-themeLight">
                            (optional)
                          </span>
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
                      <label
                        className="w-full sm:w-1/2"
                        htmlFor="hourlyrateMaximum"
                      >
                        <p className="text-base font-normal text-themeDark pb-3">
                          Maximum Rate/h
                          <span className="text-sm text-themeLight">
                            (optional)
                          </span>
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
                      <label
                        className="w-full sm:w-1/2"
                        htmlFor="salaryMinimum"
                      >
                        <p className="text-base font-normal text-themeDark pb-3">
                          Minimum Salary
                          <span className="text-sm text-themeLight">
                            (optional)
                          </span>
                        </p>
                        <input
                          disabled={jobForm}
                          className={`w-full border ${
                            errors?.salaryMinimum
                              ? "!border-red-400"
                              : "border-gray"
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
                      <label
                        className="w-full sm:w-1/2"
                        htmlFor="salaryMaximum"
                      >
                        <p className="text-base font-normal text-themeDark pb-3">
                          Maximum Salary
                          <span className="text-sm text-themeLight">
                            (optional)
                          </span>
                        </p>
                        <input
                          disabled={jobForm}
                          className={`w-full border ${
                            errors?.salaryMaximum
                              ? "!border-red-400"
                              : "border-gray"
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
                          <span className="text-sm text-themeLight">
                            (optional)
                          </span>
                        </p>
                        <input
                          disabled={jobForm}
                          className={`w-full border ${
                            errors?.applyLink
                              ? "!border-red-400"
                              : "border-gray"
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
                        <span className="text-sm text-themeDarkAlt">
                          (optional)
                        </span>
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
                    <div className="pt-6 z-50">
                      <button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className={`flex gap-2 items-center ${
                          isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
                        } ${
                          jobForm ? "opacity-30" : "opacity-100"
                        } text-white rounded-lg px-4 !py-3 shadow-themePrimary`}
                      >
                        {isSubmitting ? "Please wait..." : "Save Changes"}
                        {/* loader */}
                        {isSubmitting && <FormLoader />}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}
        </main>
      </Layout>
    </>
  );
};

export default function Page(){
  return (
    <Suspense fallback={<LoaderGrowing/>}>
      <EditJob />
    </Suspense>
  );
}



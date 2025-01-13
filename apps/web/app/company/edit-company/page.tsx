"use client"
import Head from "next/head";
import Router, { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import useSWR, { useSWRConfig } from "swr";
import Layout from "@/src/components/dashboard/layout";
import { FormLoader, LoaderGrowing } from "@/src/components/lib/loader";
import ImageOpt from "@/src/components/optimize/image";
import { authAxios } from "@/src/components/utils/axiosKits";
import { Suspense } from 'react';


const fetcher = (url: string) =>
  authAxios(url).then((res) => res.data.data.company);

const EditCompany = () => {
  const [CompanyHeaderImg, setCompanyHeaderImg] = React.useState("");
  const [LogoImg, setLogoImg] = React.useState("");
  const router = useRouter();
  const query = useSearchParams();
  const activeId = query.get("active_id");
  const { data, error } = useSWR(
    `/companies/company/${activeId}`,
    fetcher,
    {
      refreshInterval: 0,
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      companyName: data?.companyName,
      companyTagline: data?.companyTagline,
      phoneNumber: data?.phoneNumber,
      companyEmail: data?.companyEmail,
      companyWebsite: data?.companyWebsite,
      logoImage: data?.logoImage,
      description: data?.description,
      category: data?.category,
      location: data?.location,
      locationLatitude: data?.locationLatitude,
      locationLongitude: data?.locationLongitude,
      videoLink: data?.videoLink,
      linkedinLink: data?.linkedinLink,
      facebookLink: data?.facebookLink,
      twitterLink: data?.twitterLink,
      headerImage: data?.headerImage,
      avarageSalary: data?.avarageSalary,
      companySize: data?.companySize,
      revenue: data?.revenue,
      eatablishedDate: data?.eatablishedDate,
    },
  });
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();

  React.useEffect(() => {
    if (data && !isDirty) {
      setValue("companyName", data?.companyName);
      setValue("companyTagline", data?.companyTagline);
      setValue("phoneNumber", data?.phoneNumber);
      setValue("companyEmail", data?.companyEmail);
      setValue("companyWebsite", data?.companyWebsite);
      // setValue("logoImage", data?.logoImage); //
      setValue("description", data?.description);
      setValue("category", data?.category);
      setValue("location", data?.location);
      setValue("locationLatitude", data?.locationMap?.latitude);
      setValue("locationLongitude", data?.locationMap?.longitude);
      setValue("videoLink", data?.videoLink);
      setValue("linkedinLink", data?.socialLink?.linkedin);
      setValue("facebookLink", data?.socialLink?.facebook);
      setValue("twitterLink", data?.socialLink?.twitter);
      // setValue("headerImage", data?.headerImage); //
      setValue("avarageSalary", data?.avarageSalary);
      setValue("companySize", data?.companySize);
      setValue("revenue", data?.revenue);
      setValue("eatablishedDate", data?.eatablishedDate);

      setLogoImg(data?.logo);
      setCompanyHeaderImg(data?.thumb);
    }
  }, [data, setValue]);

  // submit form handler
  const submitHandler = async (data: any) => {
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("companyTagline", data.companyTagline);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("companyEmail", data.companyEmail);
    formData.append("companyWebsite", data.companyWebsite);
    if (data.logoImage) {
      formData.append("logoImage", data.logoImage[0]);
    }
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("location", data.location);
    formData.append("locationLatitude", data.locationLatitude);
    formData.append("locationLongitude", data.locationLongitude);
    formData.append("videoLink", data.videoLink);
    formData.append("linkedinLink", data.linkedinLink);
    formData.append("facebookLink", data.facebookLink);
    formData.append("twitterLink", data.twitterLink);
    if (data.headerImage) {
      formData.append("headerImage", data.headerImage[0]);
    }
    formData.append("avarageSalary", data.avarageSalary);
    formData.append("companySize", data.companySize);
    formData.append("revenue", data.revenue);
    formData.append("eatablishedDate", data.eatablishedDate);

    try {
      await authAxios({
        method: "PUT",
        url: `/companies/company/${activeId}`,
        data: formData,
      })
        .then((res: any) => {
          mutate("/companies/private").then(() => {
            addToast(res.data.message, {
              appearance: "success",
              autoDismiss: true,
            });
            router.push("/company/manages-companies");
          });
        })
        .catch((err: any) => {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        });
    } catch (error: any) {
      addToast(error.response.data.message, {
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
      (value: React.SetStateAction<string>): void;
      (arg0: string): void;
    }
  ) {
    const file = e.target.files[0];
    const filePreview = URL.createObjectURL(file);
    setImage(filePreview);
  }

  // register all input fields by using react-hook-form
  const companyName = register("companyName", { required: true });
  const companyTagline = register("companyTagline");
  const phoneNumber = register("phoneNumber");
  const companyEmail = register("companyEmail");
  const companyWebsite = register("companyWebsite");
  const logoImage = register("logoImage");
  const description = register("description", { required: true });
  const category = register("category");
  const location = register("location");
  const locationLatitude = register("locationLatitude");
  const locationLongitude = register("locationLongitude");
  const videoLink = register("videoLink");
  const linkedinLink = register("linkedinLink");
  const facebookLink = register("facebookLink");
  const twitterLink = register("twitterLink");
  const headerImage = register("headerImage");
  const avarageSalary = register("avarageSalary");
  const companySize = register("companySize");
  const revenue = register("revenue");
  const eatablishedDate = register("eatablishedDate");

  return (
    <>
      <Head>
        <title>Edit Company</title>
      </Head>

      <Layout>
        <main>
          <section className="rounded-lg shadow-lg bg-white relative">
            <div className="bg-themeDark rounded-lg !py-3">
              <p className="text-lg2 text-white px-6 sm:px-10">
                Company Details
              </p>
            </div>
            <div className="sm:px-5 py-10 mx-3 sm:mx-0">
              {error && <div>{error.message}</div>}
              {!data && <LoaderGrowing />}
              <form
                className="space-y-5"
                onSubmit={handleSubmit(submitHandler)}
              >
                <div className="flex flex-col sm:flex-row gap-8 ">
                  {/* company Name */}
                  <label className="w-full sm:w-1/2" htmlFor="companyName">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company Name
                    </p>
                    <input
                      className={`w-full border ${
                        errors?.companyName ? "!border-red-400" : "border-gray"
                      } focus:outline-none h-12 !px-3 rounded`}
                      type="text"
                      id="companyName"
                      name="companyName"
                      ref={companyName.ref}
                      onChange={(e) => companyName.onChange(e)}
                      onBlur={companyName.onBlur}
                      placeholder="Jones Ferdinand"
                    />
                    {errors?.companyName && (
                      <p className="text-red-400 text-sm italic">
                        Company Name is required
                      </p>
                    )}
                  </label>

                  {/* company tagline */}
                  <label className="w-full sm:w-1/2" htmlFor="companyTagline">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company Tagline{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="text"
                      id="companyTagline"
                      name="companyTagline"
                      ref={companyTagline.ref}
                      onChange={(e) => companyTagline.onChange(e)}
                      onBlur={companyTagline.onBlur}
                      placeholder="Company Tagline"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-8">
                  {/* company headquarters */}
                  <label className="w-full sm:w-1/2" htmlFor="location">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company Headquarters{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="text"
                      name="location"
                      ref={location.ref}
                      onChange={(e) => location.onChange(e)}
                      onBlur={location.onBlur}
                      id="location"
                      placeholder="Los Angeles"
                    />
                  </label>

                  {/* locationLatitude */}
                  <label className="w-full sm:w-1/2" htmlFor="locationLatitude">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Latitude{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="text"
                      id="locationLatitude"
                      name="locationLatitude"
                      ref={locationLatitude.ref}
                      onChange={(e) => locationLatitude.onChange(e)}
                      onBlur={locationLatitude.onBlur}
                      placeholder="Web Developer"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-8">
                  {/* locationLongitude */}
                  <label
                    className="w-full sm:w-1/2"
                    htmlFor="locationLongitude"
                  >
                    <p className="text-base font-normal text-themeDark pb-3">
                      Longitude{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="text"
                      id="locationLongitude"
                      name="locationLongitude"
                      ref={locationLongitude.ref}
                      onChange={(e) => locationLongitude.onChange(e)}
                      onBlur={locationLongitude.onBlur}
                      placeholder="London,UK"
                    />
                  </label>
                  {/* company logo */}
                  <label className="w-full sm:w-1/2" htmlFor="logoImage">
                    <p className="text-base font-normal text-themeDark !pb-3">
                      Company Logo{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <div className="border border-gray rounded !py-2 !px-3">
                      {LogoImg && (
                        <span className="!mb-3 items-center flex gap-3">
                          <ImageOpt
                            className="w-auto h-auto rounded-lg shadow-lg"
                            src={LogoImg}
                            width={100}
                            height={100}
                            alt="company logo"
                          />
                          <button
                            className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded hover:bg-red-500"
                            onClick={() => {
                              setLogoImg(null as any);
                              setValue("logoImage", "");
                            }}
                          >
                            Remove
                          </button>
                        </span>
                      )}
                      <div className="flex gap-4 items-center">
                        <label
                          className="block text-themeDark text-xss1 duration-300 ease-in-out py-1 px-3 border border-gray shadow-sm cursor-pointer hover:bg-themePrimary/20 hover:border-themePrimary/20 rounded"
                          htmlFor="logoImage"
                        >
                          Select File
                          <input
                            className="hidden"
                            id="logoImage"
                            accept="image/*"
                            type="file"
                            {...logoImage}
                            ref={logoImage.ref}
                            onBlur={logoImage.onBlur}
                            onChange={(e) => {
                              logoImage.onChange(e);
                              PreviewImage(e, setLogoImg);
                            }}
                          />
                        </label>
                        <span className="text-xss1 text-themeLighter">
                          Maximum file size: 100 MB.
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-8">
                  {/* videoLink */}
                  <label className="w-full sm:w-1/2" htmlFor="videoLink">
                    <p className="text-base font-normal text-themeDark pb-3">
                      video{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="text"
                      id="videoLink"
                      name="videoLink"
                      ref={videoLink.ref}
                      onChange={(e) => videoLink.onChange(e)}
                      onBlur={videoLink.onBlur}
                      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    />
                  </label>

                  {/* Since */}
                  <label className="w-full sm:w-1/2" htmlFor="eatablishedDate">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Since{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="date"
                      id="eatablishedDate"
                      name="eatablishedDate"
                      ref={eatablishedDate.ref}
                      onChange={(e) => eatablishedDate.onChange(e)}
                      onBlur={eatablishedDate.onBlur}
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-8">
                  {/* company website */}
                  <label className="w-full sm:w-1/2" htmlFor="companyWebsite">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company Website
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="url"
                      id="companyWebsite"
                      name="companyWebsite"
                      ref={companyWebsite.ref}
                      onChange={(e) => companyWebsite.onChange(e)}
                      onBlur={companyWebsite.onBlur}
                      placeholder="https://yourwebsite.com"
                    />
                  </label>

                  {/* Email */}
                  <label className="w-full sm:w-1/2" htmlFor="companyEmail">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Email{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="email"
                      id="companyEmail"
                      name="companyEmail"
                      ref={companyEmail.ref}
                      onChange={(e) => companyEmail.onChange(e)}
                      onBlur={companyEmail.onBlur}
                      placeholder="info@youremail.com"
                    />
                  </label>
                </div>
                <div className=" flex flex-col sm:flex-row gap-8">
                  {/* Phone number */}
                  <label className="w-full sm:w-1/2" htmlFor="phoneNumber">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Phone Number
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      ref={phoneNumber.ref}
                      onChange={(e) => phoneNumber.onChange(e)}
                      onBlur={phoneNumber.onBlur}
                      placeholder="Your Phone Number"
                    />
                  </label>

                  {/* Facebook Url */}
                  <label className=" w-full sm:w-1/2" htmlFor="facebookLink">
                    <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                      Facebook URL
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="url"
                      id="facebookLink"
                      name="facebookLink"
                      ref={facebookLink.ref}
                      onChange={(e) => facebookLink.onChange(e)}
                      onBlur={facebookLink.onBlur}
                      placeholder="https://facebook.com/yourprofile"
                    />
                  </label>
                </div>
                <div className=" flex flex-col sm:flex-row gap-8">
                  {/* Twitter Url */}
                  <label className=" w-full sm:w-1/2" htmlFor="twitterLink">
                    <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                      Twitter URL
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="url"
                      id="twitterLink"
                      name="twitterLink"
                      ref={twitterLink.ref}
                      onChange={(e) => twitterLink.onChange(e)}
                      onBlur={twitterLink.onBlur}
                      placeholder="https://twitter.com/yourprofile"
                    />
                  </label>

                  {/* LinkedIn Url */}
                  <label className=" w-full sm:w-1/2" htmlFor="linkedinLink">
                    <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                      Linkedin URL
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <input
                      className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                      type="url"
                      id="linkedinLink"
                      name="linkedinLink"
                      ref={linkedinLink.ref}
                      onChange={(e) => linkedinLink.onChange(e)}
                      onBlur={linkedinLink.onBlur}
                      placeholder="https://linkedin.com/yourprofile"
                    />
                  </label>
                </div>
                <div className=" flex flex-col sm:flex-row gap-8">
                  {/* company size */}
                  <label className="w-full sm:w-1/2" htmlFor="companySize">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company Size{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <select
                      aria-label="Default select example"
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.companySize ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                      defaultValue={""}
                      id="companySize"
                      name="companySize"
                      ref={companySize.ref}
                      onChange={(e) => companySize.onChange(e)}
                      onBlur={companySize.onBlur}
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-500">101-500</option>
                    </select>
                  </label>

                  {/* average Salary */}
                  <label className=" w-full sm:w-1/2" htmlFor="avarageSalary">
                    <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                      Average Salary{" "}
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <select
                      aria-label="Default select example"
                      className={`appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                      defaultValue={""}
                      id="avarageSalary"
                      name="avarageSalary"
                      ref={avarageSalary.ref}
                      onChange={(e) => avarageSalary.onChange(e)}
                      onBlur={avarageSalary.onBlur}
                    >
                      <option value="">Select Salary</option>
                      <option value="0-10,000">0-10,000</option>
                      <option value="10,000-50,000">10,000-50,000</option>
                      <option value="50,000-100,000">50,000-100,000</option>
                    </select>
                  </label>
                </div>
                <div className=" flex flex-col sm:flex-row gap-8">
                  {/* company revenue */}
                  <label className="w-full sm:w-1/2" htmlFor="revenue">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company Revenue
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <select
                      aria-label="Default select example"
                      className={`appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                      defaultValue={""}
                      id="revenue"
                      name="revenue"
                      ref={revenue.ref}
                      onChange={(e) => revenue.onChange(e)}
                      onBlur={revenue.onBlur}
                    >
                      <option value="">Select Revenue</option>
                      <option value="0-10,000">0-10,000</option>
                      <option value="10,000-50,000">10,000-50,000</option>
                      <option value="50,000-100,000">50,000-100,000</option>
                    </select>
                  </label>

                  {/* company category */}
                  <label className="w-full sm:w-1/2" htmlFor="category">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company category
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <select
                      aria-label="Default select example"
                      className={`appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                      defaultValue={""}
                      id="category"
                      name="category"
                      ref={category.ref}
                      onChange={(e) => category.onChange(e)}
                      onBlur={category.onBlur}
                    >
                      <option value="">Select Category</option>
                      <option>Construction</option>
                      <option>Engineering</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Hospitality</option>
                      <option>IT</option>
                      <option>Legal</option>
                      <option>Manufacturing</option>
                      <option>Marketing</option>
                    </select>
                  </label>
                </div>

                {/* Header Image */}
                <div>
                  <label className="w-full" htmlFor="headerImage">
                    <p className="text-base font-normal text-themeDark !pb-1">
                      Header Image
                      <span className="text-sm text-themeDarkAlt">
                        (optional)
                      </span>
                    </p>
                    <div className="border border-gray rounded !py-2 !px-3">
                      {CompanyHeaderImg && (
                        <span className="!mb-6 w-2/3 items-center flex gap-3">
                          <ImageOpt
                            className="rounded-lg shadow-lg"
                            src={CompanyHeaderImg}
                            width={800}
                            height={400}
                            alt="company logo"
                          />
                          <button
                            className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded hover:bg-red-500"
                            onClick={() => {
                              setCompanyHeaderImg(null as any);
                              setValue("headerImage", "");
                            }}
                          >
                            Remove
                          </button>
                        </span>
                      )}
                      <div className="flex gap-4 items-center">
                        <label
                          className="block text-themeDark text-xss1 duration-300 ease-in-out py-1 px-3 border border-gray shadow-sm cursor-pointer hover:bg-themePrimary/20 hover:border-themePrimary/20 rounded"
                          htmlFor="headerImage"
                        >
                          Select File
                          <input
                            className="hidden"
                            accept="image/*"
                            id="headerImage"
                            {...headerImage}
                            ref={headerImage.ref}
                            onBlur={headerImage.onBlur}
                            onChange={(e) => {
                              headerImage.onChange(e);
                              PreviewImage(e, setCompanyHeaderImg);
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
                </div>

                {/* company description required */}
                <div>
                  <label className="w-full" htmlFor="description">
                    <p className="text-base font-normal text-themeDark pb-3">
                      Company Description
                    </p>
                    <textarea
                      className={`w-full border border-gray ${
                        errors?.description ? "!border-red-400" : ""
                      } focus:outline-none h-36 !p-3 rounded`}
                      // type="text"
                      id="description"
                      name="description"
                      ref={description.ref}
                      onChange={(e) => description.onChange(e)}
                      onBlur={description.onBlur}
                      placeholder="We are a team of expert designers and developers committed to rendering the best WordPress website designing services in a cost-effective practice. We are on a mission to help small business owners build their presence online. Our customer-centric approach ensures that the final product is unbeatable."
                    />
                    {errors?.description && (
                      <span className="text-sm text-red-400">
                        Company Description is required
                      </span>
                    )}
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className={`${
                      isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
                    } text-white ${
                      isDirty ? "opacity-100" : "opacity-30"
                    } rounded-lg px-4 flex gap-1 items-center !py-3 shadow-themePrimary`}
                  >
                    {isSubmitting ? "Please wait..." : "Save Changes"}
                    {isSubmitting && <FormLoader />}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};

export default function Page(){
  return (
    <Suspense fallback={<LoaderGrowing/>}>
      <EditCompany />
    </Suspense>
  );
}



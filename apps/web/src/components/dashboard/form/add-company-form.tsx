"use client"
import sendEmail from "@/src/utils/sendEmail";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import { useSWRConfig } from "swr";
import { FormLoader } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";

const AddCompanyForm = () => {
  const [CompanyHeaderImg, setCompanyHeaderImg] = React.useState("");
  const [LogoImg, setLogoImg] = React.useState("");
  const [isMailSent, setIsMailSent] = React.useState(false);
  const [emailType, setEmailType] = React.useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();
  const router = useRouter();

  // [x] submit form handler
  const submitHandler = async (data: any) => {
    const formData = new FormData();

    formData.append("companyName", data.companyName);
    formData.append("companyTagline", data.companyTagline);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("companyEmail", data.companyEmail);
    formData.append("companyWebsite", data.companyWebsite);

    // Check if logoImage is provided and convert it to Blob
    if (data.logoImage && data.logoImage[0]) {
      const logoBlob = new Blob([data.logoImage[0]], { type: data.logoImage[0].type });
      formData.append("logoImage", logoBlob, data.logoImage[0].name);
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

    // Check if headerImage is provided and convert it to Blob
    if (data.headerImage && data.headerImage[0]) {
      const headerBlob = new Blob([data.headerImage[0]], { type: data.headerImage[0].type });
      formData.append("headerImage", headerBlob, data.headerImage[0].name);
    }

    formData.append("averageSalary", data.averageSalary);
    formData.append("companySize", data.companySize);
    formData.append("revenue", data.revenue);
    formData.append("establishedDate", data.establishedDate);

    try {
      await authAxios({
        method: "post",
        url: "/companies/retrives",
        data: formData,
      }).then((res) => {
        mutate("/companies/private");
        addToast(res.data.message, {
          appearance: "success",
          autoDismiss: true,
        });
        setEmailType("COMPANY_PUBLISHED");
        setIsMailSent(true);
        router.push("/company/manages-companies");
      }).catch((err) => {
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

  //  Send Email to the user
  useEffect(() => {
    if (isMailSent) {
      sendEmail(emailType);
      setIsMailSent(false);
    }
  }, [isMailSent]);

  // [x] company log image upload preview handler
  function PreviewImage(e: any, setImage: any) {
    const file = e.target.files[0];
    const filePreview = URL.createObjectURL(file);
    setImage(filePreview);
  }

  const logoImage = register("logoImage");
  const headerImage = register("headerImage");

  return (
    <section className="rounded-lg shadow-lg bg-white">
      <div className="bg-themeDark rounded-lg !py-3">
        <p className="text-lg2 text-white px-6 sm:px-10">Company Details</p>
      </div>
      <div className="sm:px-5 py-10 mx-3 sm:mx-0">
        <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
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
                {...register("companyName", { required: true })}
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
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="companyTagline"
                {...register("companyTagline")}
                placeholder="Company Tagline"
              />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            {/* company headquarters */}
            <label className="w-full sm:w-1/2" htmlFor="location">
              <p className="text-base font-normal text-themeDark pb-3">
                Company Headquarters{" "}
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                {...register("location")}
                id="location"
                placeholder="Los Angeles"
              />
            </label>

            {/* locationLatitude */}
            <label className="w-full sm:w-1/2" htmlFor="locationLatitude">
              <p className="text-base font-normal text-themeDark pb-3">
                Latitude{" "}
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="locationLatitude"
                {...register("locationLatitude")}
                placeholder="Web Developer"
              />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            {/* locationLongitude */}
            <label className="w-full sm:w-1/2" htmlFor="locationLongitude">
              <p className="text-base font-normal text-themeDark pb-3">
                Longitude{" "}
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="locationLongitude"
                {...register("locationLongitude")}
                placeholder="London,UK"
              />
            </label>
            {/* company logo */}
            <label className="w-full sm:w-1/2" htmlFor="logoImage">
              <p className="text-base font-normal text-themeDark !pb-3">
                Company Logo{" "}
                <span className="text-sm text-themeDarkAlt">(optional)</span>
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
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="videoLink"
                {...register("videoLink")}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              />
            </label>

            {/* Since */}
            <label className="w-full sm:w-1/2" htmlFor="eatablishedDate">
              <p className="text-base font-normal text-themeDark pb-3">
                Since{" "}
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="date"
                id="eatablishedDate"
                {...register("eatablishedDate")}
              />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            {/* company website */}
            <label className="w-full sm:w-1/2" htmlFor="companyWebsite">
              <p className="text-base font-normal text-themeDark pb-3">
                Company Website
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="url"
                id="companyWebsite"
                {...register("companyWebsite")}
                placeholder="https://yourwebsite.com"
              />
            </label>

            {/* Email */}
            <label className="w-full sm:w-1/2" htmlFor="companyEmail">
              <p className="text-base font-normal text-themeDark pb-3">
                Email{" "}
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="email"
                id="companyEmail"
                {...register("companyEmail")}
                placeholder="info@youremail.com"
              />
            </label>
          </div>
          <div className=" flex flex-col sm:flex-row gap-8">
            {/* Phone number */}
            <label className="w-full sm:w-1/2" htmlFor="phoneNumber">
              <p className="text-base font-normal text-themeDark pb-3">
                Phone Number
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="Your Phone Number"
              />
            </label>

            {/* Facebook Url */}
            <label className=" w-full sm:w-1/2" htmlFor="facebookLink">
              <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                Facebook URL
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="url"
                id="facebookLink"
                {...register("facebookLink")}
                placeholder="https://facebook.com/yourprofile"
              />
            </label>
          </div>
          <div className=" flex flex-col sm:flex-row gap-8">
            {/* Twitter Url */}
            <label className=" w-full sm:w-1/2" htmlFor="twitterLink">
              <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                Twitter URL
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="url"
                id="twitterLink"
                {...register("twitterLink")}
                placeholder="https://twitter.com/yourprofile"
              />
            </label>

            {/* LinkedIn Url */}
            <label className=" w-full sm:w-1/2" htmlFor="linkedinLink">
              <p className="text-base font-normal text-themeDark pb-3 whitespace-nowrap">
                Linkedin URL
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="url"
                id="linkedinLink"
                {...register("linkedinLink")}
                placeholder="https://linkedin.com/yourprofile"
              />
            </label>
          </div>
          <div className=" flex flex-col sm:flex-row gap-8">
            {/* company size */}
            <label className="w-full sm:w-1/2" htmlFor="companySize">
              <p className="text-base font-normal text-themeDark pb-3">
                Company Size{" "}
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <select
                aria-label="Default select example"
                className={`appearance-none block w-full text-themeDark ${
                  errors?.companySize ? "!border-red-400" : ""
                } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                defaultValue={""}
                id="companySize"
                {...register("companySize")}
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
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <select
                aria-label="Default select example"
                className={`appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                defaultValue={""}
                id="avarageSalary"
                {...register("avarageSalary")}
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
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <select
                aria-label="Default select example"
                className={`appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                defaultValue={""}
                id="revenue"
                {...register("revenue")}
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
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <select
                aria-label="Default select example"
                className={`appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none  h-12 focus:bg-white`}
                defaultValue={""}
                id="category"
                {...register("category")}
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
                <span className="text-sm text-themeDarkAlt">(optional)</span>
              </p>
              <div className="border border-gray rounded !py-2 !px-3">
                {CompanyHeaderImg && (
                  <span className="!mb-6 w-2/3 items-center flex gap-3">
                    <ImageOpt
                      className="rounded-lg shadow-lg"
                      src={CompanyHeaderImg}
                      width={800}
                      height={400}
                      alt="Company Header Image"
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
                type={"text"}
                id="description"
                {...(register("description", {
                  required: true,
                }) as any)}
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
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
              } text-white rounded-lg px-4 flex gap-1 items-center !py-3 shadow-themePrimary`}
            >
              {isSubmitting ? "Please wait..." : "Submit Company"}
              {isSubmitting && (
                <FormLoader className="w-5 h-5 text-themePrimary ml-2" />
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCompanyForm;

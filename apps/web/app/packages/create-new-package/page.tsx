"use client"
import { FormLoader } from "@/src/components/lib/loader";
import _ from "lodash";
import { useSession } from "next-auth/react";
import Head from "next/head";
import {useRouter} from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsDashLg } from "react-icons/bs";
import { useToasts } from "@/src/components/toast/toast";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import { authAxios } from "@/src/components/utils/axiosKits";

const CreateNewPackage = () => {
  const { data, status } = useSession();
  const router = useRouter();
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: {
      isAdmin?: boolean;
    };
  }

  const userData = data?.user as User;
  const isAdmin = userData?.role?.isAdmin;
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      Title: "Basic Package",
      subtitle: "Our best deal",
      subTitleStatus: true,
      shortDesc:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A odio pretium at senectus.",
      Frequency: "Monthly",
      Price: "50",
      totalJobs: "10",
      featuredJobs: "5",
      validity: "30",
      feature: [
        {
          id: "4",
          name: "Premium Support",
          details: "24/7",
        },
      ],
      ButtonText: "Get Started",
    },
  });

  // feature filed array
  const {
    fields: feature,
    append: featureAppend,
    remove: featureRemove,
  } = useFieldArray({
    control,
    name: "feature",
  });

  // [x] Package submit form handler
  const onSubmit = async (data: any) => {
    try {
      await authAxios({
        method: "POST",
        url: `/packages/retrives`,
        data: {
          packageName: data.Title,
          subtitle: data.subtitle,
          subTitleStatus: data.subTitleStatus,
          shortDesc: data.shortDesc,
          pricing: data.Price,
          totalJobs: data.totalJobs,
          featuredJobs: data.featuredJobs,
          validity: data.validity,
          frequency: data.Frequency,
          services: data.feature,
          buttonText: data.ButtonText,
        },
      }).then((res: any) => {
        if (res.status === 200 || res.status === 201) {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          router.push("/packages");
          // sleep 1 second;
          new Promise((resolve) => setTimeout(resolve, 1000));
          reset();
        }
      });
    } catch (error: any) {
      if (error.response?.data) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  React.useEffect(() => {
    watch();
  });

  return (
    <>
      <Head>
        <meta name="description" content="Create new package" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {userData && !isAdmin && status === "authenticated" && <UserGoBack />}
          {userData && status === "authenticated" && isAdmin && (
            <section className="mb-6">
              <div className="shadow-lg bg-white rounded-xl relative">
                <div className="h-16 bg-themeDark flex items-center px-10 rounded-lg">
                  <p className="text-xxs text-white">
                    Manage Your Pricing Table
                  </p>
                </div>
                <div className="mx-auto py-10 px-6 lg:px-8">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid lg:grid-cols-2 grid-cols-1 sm:grid-cols-1 gap-4 border-b border-gray pb-10 mb-10">
                      {/* Title */}
                      <div>
                        <label
                          className=" text-themeDark !mb-2"
                          htmlFor="Title"
                        >
                          Title
                        </label>
                        <input
                          id="Title"
                          type="text"
                          {...register("Title", {
                            required: true,
                          })}
                          defaultValue="Basic Package"
                          placeholder="Basic Package"
                          className={`w-full border ${
                            errors?.Title ? "!border-red-400" : "border-gray"
                          } rounded-lg  focus:right-0 focus:outline-0 !px-4 !py-2`}
                        />
                        {errors?.Title && (
                          <span className="text-red-400 text-sm italic">
                            Title is required
                          </span>
                        )}
                      </div>
                      {/* Subtitle */}
                      <div>
                        <label
                          className=" text-themeDark !mb-2"
                          htmlFor="Subtitle"
                        >
                          Subtitle
                        </label>
                        <input
                          id="Subtitle"
                          type="text"
                          disabled={!watch("subTitleStatus")}
                          {...register("subtitle", {
                            required: "Subtitle is required",
                          })}
                          defaultValue="Our best deal"
                          placeholder="Our best deal"
                          className={`w-full border ${
                            errors?.subtitle ? "!border-red-400" : "border-gray"
                          } rounded-lg  focus:right-0 focus:outline-0 !px-4 !py-2`}
                        />
                        {errors.subtitle && (
                          <span className="text-red-500 text-sm italic">
                            {errors.subtitle.message}
                          </span>
                        )}
                      </div>
                      {/* Short Description */}
                      <div>
                        <label
                          className=" text-themeDark !mb-2"
                          htmlFor="shortDesc"
                        >
                          Short Description
                        </label>
                        <input
                          id="shortDesc"
                          type="text"
                          {...register("shortDesc", {
                            required: "Short Description is required",
                          })}
                          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                          placeholder="Type your short description here"
                          className={`w-full border ${
                            errors?.shortDesc
                              ? "!border-red-400"
                              : "border-gray"
                          } rounded-lg  focus:right-0 focus:outline-0 !px-4 !py-2`}
                        />
                        {errors.shortDesc && (
                          <span className="text-red-500 text-sm italic">
                            {errors.shortDesc.message}
                          </span>
                        )}
                      </div>
                      {/* Price and Frequency */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className=" text-themeDark !mb-2"
                            htmlFor="Price"
                          >
                            Price
                          </label>
                          <input
                            id="Price"
                            type="number"
                            {...register("Price", {
                              required: "Price is required",
                              pattern: {
                                value: /^[0-9]*$/,
                                message: "Price must be a number",
                              },
                              minLength: {
                                value: 1,
                                message: "Price must be at least 1",
                              },
                            })}
                            defaultValue="10"
                            placeholder="100"
                            className={`w-full border ${
                              errors?.Price ? "!border-red-400" : "border-gray"
                            } rounded-lg  focus:right-0 focus:outline-0 !px-4 !py-2`}
                          />
                          {errors.Price && (
                            <span className="text-red-500 text-sm italic">
                              {errors.Price.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <label
                            className=" text-themeDark !mb-2"
                            htmlFor="Frequency"
                          >
                            Frequency
                          </label>
                          <input
                            id="Frequency"
                            type="text"
                            {...register("Frequency", {
                              required: "Frequency is required",
                            })}
                            defaultValue="Monthly"
                            placeholder="monthly"
                            className={`w-full border ${
                              errors?.Frequency
                                ? "!border-red-400"
                                : "border-gray"
                            } rounded-lg  focus:right-0 focus:outline-0 !px-4 !py-2`}
                          />
                          {errors.Frequency && (
                            <span className="text-red-500 text-sm italic">
                              {errors.Frequency.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <div className="flex flex-wrap gap-3 items-center mb-7">
                          <button
                            type="button"
                            onClick={() =>
                              featureAppend({
                                id: `${feature.length + 1}`,
                                name: "",
                                details: "",
                              })
                            }
                            className="block bg-transparent transition-all duration-300 ease-in-out hover:text-white hover:!bg-themePrimary !border-themePrimary text-themePrimary border px-10 !py-3 rounded-lg"
                          >
                            Add Feature
                          </button>
                          {/* add Pricing Plan hidden */}
                          {/* <button
                        type="button"
                        className="block bg-transparent transition-all duration-300 ease-in-out hover:text-white hover:!bg-themePrimary !border-themePrimary text-themePrimary border px-10 !py-3 rounded-lg"
                      >
                        Add Pricing Plan
                      </button> */}
                          <div className="flex justify-center text-nowrap gap-2">
                            <div className="form-check">
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  {...register("subTitleStatus")}
                                  defaultChecked
                                />
                                <span className="slider round"></span>
                              </label>
                            </div>
                            <span className="text-xs text-themeLight">
                              Enable Subtitle
                            </span>
                          </div>
                        </div>
                        {/* Job Posting */}
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 !mb-4">
                          <div>
                            <label
                              className=" text-themeDark !mb-2"
                              htmlFor="JobPosting"
                            >
                              Service Name
                            </label>
                            <input
                              id="JobPosting"
                              type="text"
                              disabled
                              value="Job Posting"
                              placeholder="Job Posting"
                              className={`w-full border border-gray focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                            />
                          </div>
                          <div>
                            <div>
                              <label
                                className=" text-themeDark !mb-2"
                                htmlFor="TotalJobs"
                              >
                                Service Details
                              </label>
                              <input
                                id="TotalJobs"
                                type="text"
                                placeholder="10"
                                {...register(`totalJobs`, {
                                  required: "Total Jobs is required",
                                  pattern: {
                                    value: /^[0-9]*$/,
                                    message: "Total Jobs must be a number",
                                  },
                                })}
                                className={`w-full border ${
                                  errors?.totalJobs
                                    ? "!border-red-400"
                                    : "border-gray"
                                } focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                              />
                              {errors.totalJobs && (
                                <span className="text-red-500 text-sm italic">
                                  {errors.totalJobs.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Featured Job */}
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 !mb-4">
                          <div>
                            <label
                              className=" text-themeDark !mb-2"
                              htmlFor="FeaturedJobs"
                            >
                              Service Name
                            </label>
                            <input
                              id="FeaturedJobs"
                              type="text"
                              disabled
                              value="Featured Jobs"
                              className={`w-full border border-gray focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                            />
                          </div>
                          <div>
                            <div>
                              <label
                                className=" text-themeDark !mb-2"
                                htmlFor="FeaturedJobCount"
                              >
                                Service Details
                              </label>
                              <input
                                id="FeaturedJobCount"
                                type="text"
                                placeholder="5"
                                {...register(`featuredJobs`, {
                                  required: "Featured Jobs is required",
                                  pattern: {
                                    value: /^[0-9]*$/,
                                    message: "Featured Jobs must be a number",
                                  },
                                })}
                                className={`w-full border ${
                                  errors?.featuredJobs
                                    ? "!border-red-400"
                                    : "border-gray"
                                } focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                              />
                              {errors.featuredJobs && (
                                <span className="text-red-500 text-sm italic">
                                  {errors.featuredJobs.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Job Displayed */}
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 !mb-4">
                          <div>
                            <label
                              className=" text-themeDark !mb-2"
                              htmlFor="JobDisplayed"
                            >
                              Service Name
                            </label>
                            <input
                              id="JobDisplayed"
                              type="text"
                              disabled
                              value="Job Displayed"
                              className={`w-full border border-gray focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                            />
                          </div>
                          <div>
                            <div>
                              <label
                                className=" text-themeDark !mb-2"
                                htmlFor="JobValidity"
                              >
                                Service Details
                              </label>
                              <div className="relative grid items-center">
                                <input
                                  id="JobValidity"
                                  type="text"
                                  placeholder="5"
                                  {...register(`validity`, {
                                    required: "Validity is required",
                                    pattern: {
                                      value: /^[0-9]*$/,
                                      message: "Validity must be a number",
                                    },
                                  })}
                                  className={`w-full border ${
                                    errors?.validity
                                      ? "!border-red-400"
                                      : "border-gray"
                                  } focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                                />
                                <span className="text-themeLighter absolute right-3">
                                  / Days
                                </span>
                              </div>
                              {errors.validity && (
                                <span className="text-red-500 text-sm italic">
                                  {errors.validity.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="border-b border-gray pb-6 mb-10">
                          {_.map(feature, (field, index) => (
                            <div
                              className="grid lg:grid-cols-2 grid-cols-1 gap-4 !mb-4"
                              key={field.id}
                            >
                              <div>
                                <label
                                  className=" text-themeDark !mb-2"
                                  htmlFor="ServiceName"
                                >
                                  Service Name
                                </label>
                                <input
                                  id="ServiceName"
                                  type="text"
                                  {...register(
                                    `feature[${index}].name` as any,
                                    {
                                      required: true,
                                    },
                                  )}
                                  placeholder="Job Posting"
                                  className={`w-full border ${
                                    errors?.feature?.[index]?.name
                                      ? "!border-red-400"
                                      : "border-gray"
                                  } focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                                />
                                {errors.feature &&
                                  errors.feature[index] &&
                                  (errors.feature[index] as any).name && (
                                    <span className="text-red-500 text-sm italic">
                                      Service Name is required
                                    </span>
                                  )}
                              </div>
                              <div className="flex gap-3 items-end">
                                <div>
                                  <label
                                    className=" text-themeDark !mb-2"
                                    htmlFor="ServiceDetails"
                                  >
                                    Service Details
                                  </label>
                                  <input
                                    id="ServiceDetails"
                                    type="text"
                                    placeholder="10"
                                    {...register(
                                      `feature[${index}].details` as any,
                                      {
                                        required: true,
                                      },
                                    )}
                                    className={`w-full border ${
                                      errors?.feature?.[index]?.details
                                        ? "!border-red-400"
                                        : "border-gray"
                                    } focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                                  />
                                  {errors.feature &&
                                    errors.feature[index] &&
                                    (errors.feature[index] as any).details && (
                                      <span className="text-red-500 text-sm italic">
                                        Service Details is required
                                      </span>
                                    )}
                                </div>
                                {feature.length > 0 && (
                                  <span
                                    className="!p-2 transition-all rounded duration-300 ease-in-out text-red-300 hover:text-white hover:bg-red-600 !mb-2 cursor-pointer"
                                    onClick={() => featureRemove(index)}
                                  >
                                    <BsDashLg />
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                          <div>
                            <div>
                              <label
                                className=" text-themeDark !mb-2"
                                htmlFor="ButtonText"
                              >
                                Button Text
                              </label>
                              <input
                                id="ButtonText"
                                type="text"
                                defaultValue={"Get Started"}
                                {...register("ButtonText")}
                                placeholder="Get Started"
                                className="w-full border border-gray focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2"
                              />
                            </div>
                            <div>
                              <button
                                type="submit"
                                className="flex gap-2 items-center mt-10 bg-themePrimary transition-all duration-300 ease-in-out hover:!bg-themeDarkerAlt hover:!border-themeDarkerAlt !border-themePrimary shadow-themePrimary text-white border px-10 !py-3 rounded-lg"
                              >
                                {isSubmitting
                                  ? "Please wait..."
                                  : "Save Pricing Plan"}
                                {isSubmitting && <FormLoader />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="w-96 mx-auto !mb-10">
                          <h3 className="text-themeDark text-lg font-semibold !mb-4">
                            Instant Preview
                          </h3>
                          <div className="shadow rounded-lg overflow-auto h-fit">
                            {/* Heading */}
                            {watch("subTitleStatus") && (
                              <div className="w-full !py-1.5 text-sm text-center text-white bg-themePrimary">
                                {watch("subtitle")}
                              </div>
                            )}
                            {/* Body */}
                            <div className="!p-6">
                              <h1 className="text-xxl2 font-semibold mb-6">
                                ${watch("Price")}
                                <span className="text-xs text-themeLight">
                                  /{watch("Frequency")}
                                </span>
                              </h1>
                              <h3 className="text-lg text-themeDarkerAlt font-semibold !mb-5">
                                {watch("Title")}
                              </h3>
                              <p className="text-sm text-themeLight !mb-5">
                                {watch("shortDesc")}
                              </p>
                              <hr className="!border-gray !mb-8" />
                              <ul>
                                <li className="!mb-4 flex justify-between gap-3">
                                  <span className="text-xs text-themeLight">
                                    Job Posting
                                  </span>
                                  <span className="text-xs text-themeLight">
                                    {watch("totalJobs")}
                                  </span>
                                </li>
                                <li className="!mb-4 flex justify-between gap-3">
                                  <span className="text-xs text-themeLight">
                                    Featured Job
                                  </span>
                                  <span className="text-xs text-themeLight">
                                    {watch("featuredJobs")}
                                  </span>
                                </li>
                                <li className="!mb-4 flex justify-between gap-3">
                                  <span className="text-xs text-themeLight">
                                    Job Displayed
                                  </span>
                                  <span className="text-xs text-themeLight">
                                    {watch("validity")}
                                    /days
                                  </span>
                                </li>
                                {_.map(
                                  watch("feature"),
                                  (field, index) =>
                                    (field.name || field.details) && (
                                      <li
                                        className="!mb-4 flex justify-between gap-3"
                                        key={field.id}
                                      >
                                        <span className="text-xs text-themeLight">
                                          {field.name}
                                        </span>
                                        <span className="text-xs text-themeLight">
                                          {field.details}
                                        </span>
                                      </li>
                                    ),
                                )}
                              </ul>
                              <button
                                type="button"
                                className="block w-full mt-10 !mb-4 bg-themePrimary transition-all duration-300 ease-in-out hover:!bg-themeDarkerAlt hover:!border-themeDarkerAlt !border-themePrimary text-white border px-10 !py-3 rounded-lg"
                              >
                                {watch("ButtonText")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default CreateNewPackage;

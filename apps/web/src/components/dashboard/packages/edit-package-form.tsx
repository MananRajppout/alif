"use client"
import _ from "lodash";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsDashLg } from "react-icons/bs";
import { useToasts } from "@/src/components/toast/toast";
import useSWR from "swr";
import { FormLoader, LoaderGrowing } from "../../lib/loader";
import { authAxios } from "../../utils/axiosKits";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const EditPackageForm = () => {
  const router = useRouter();
  const params = useParams()
  const { data, error } = useSWR(
    `/packages/package/${params.active_id}`,
    fetcher
  );
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm({
    mode: "onChange",
  }) as any;

  React.useEffect(() => {
    if (data && !isDirty) {
      setValue("Title", data?.packageName);
      setValue("subtitle", data?.subtitle);
      setValue("subTitleStatus", data?.subTitleStatus);
      setValue("shortDesc", data?.shortDesc);
      setValue("Price", data?.pricing);
      setValue("totalJobs", data?.totalJobs);
      setValue("featuredJobs", data?.featuredJobs);
      setValue("validity", data?.validity);
      setValue("Frequency", data?.frequency);
      setValue("feature", data?.services);
      setValue("ButtonText", data?.buttonText);
    }
  }, [data, setValue, isDirty]);

  // feature filed array
  const {
    fields: feature,
    append: featureAppend,
    remove: featureRemove,
  } = useFieldArray({
    control,
    name: "feature",
  }) as any;

  // [x] Package update submit form handler
  const onSubmit = async (data: any) => {
    try {
      await authAxios({
        method: "PUT",
        url: `/packages/package/${params.active_id}`,
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
      }).then((res) => {
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
    <section className="mb-6">
      <div className="shadow-lg bg-white rounded-xl relative overflow-auto">
        <div className="h-16 bg-themeDark flex items-center px-10 rounded-lg">
          <p className="text-xxs text-white">Manage Your Pricing Table</p>
        </div>
        <div className="mx-auto py-10 px-6 lg:px-8 relative">
          {/* Loader */}
          {!data && <LoaderGrowing />}
          {error && (
            <div className="w-full lg:w-2/4 mx-auto h-40 flex justify-center items-center">
              <div className="text-center">
                <h3 className="text-lg mb-2 font-semibold text-red-400">
                  Failed to load data ☹️
                </h3>
                <p className="text-themeLight">
                  Check Your internat connection OR api response issue.
                </p>
              </div>
            </div>
          )}
          {!error && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid lg:grid-cols-2 grid-cols-1 sm:grid-cols-1 gap-4 border-b border-gray pb-10 mb-10">
                {/* Title */}
                <div>
                  <label className=" text-themeDark !mb-2" htmlFor="Title">
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
                  <label className=" text-themeDark !mb-2" htmlFor="Subtitle">
                    Subtitle
                  </label>
                  <input
                    id="Subtitle"
                    disabled={!watch("subTitleStatus")}
                    type="text"
                    {...register("subtitle", {
                      required: "Subtitle is required",
                    })}
                    defaultValue={data?.subtitle}
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
                  <label className=" text-themeDark !mb-2" htmlFor="shortDesc">
                    Short Description
                  </label>
                  <input
                    id="shortDesc"
                    type="text"
                    {...register("shortDesc", {
                      required: "Short Description is required",
                    })}
                    placeholder="Type your short description here"
                    className={`w-full border ${
                      errors?.shortDesc ? "!border-red-400" : "border-gray"
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
                    <label className=" text-themeDark !mb-2" htmlFor="Price">
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
                        errors?.Frequency ? "!border-red-400" : "border-gray"
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
                    {_.map(feature, (field: any, index: any) => (
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
                            {...register(`feature[${index}].name`, {
                              required: true,
                            })}
                            placeholder="Job Posting"
                            className={`w-full border ${
                              errors?.feature?.[index]?.name
                                ? "!border-red-400"
                                : "border-gray"
                            } focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                          />
                          {errors.feature &&
                            errors.feature[index] &&
                            errors.feature[index].name && (
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
                              œ
                              type="text"
                              placeholder="10"
                              {...register(`feature[${index}].details`, {
                                required: true,
                              })}
                              className={`w-full border ${
                                errors?.feature?.[index]?.details
                                  ? "!border-red-400"
                                  : "border-gray"
                              } focus:right-0 focus:outline-0 rounded-lg !px-4 !py-2`}
                            />
                            {errors.feature &&
                              errors.feature[index] &&
                              errors.feature[index].details && (
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
                          disabled={isDirty && isValid ? false : true}
                          className={`flex gap-2 items-center mt-10 ${
                            isDirty && isValid
                              ? isSubmitting
                                ? "bg-themeDarkerAlt !border-themeDarkerAlt "
                                : "hover:!bg-themeDarkerAlt hover:!border-themeDarkerAlt"
                              : " opacity-50 bg-themePrimary border-themePrimary text-white"
                          }  transition-all bg-themePrimary duration-300 ease-in-out  border px-10 !py-3 rounded-lg text-white`}
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
                          {watch("subtitle") || data?.subtitle}
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
                              )
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
          )}
        </div>
      </div>
    </section>
  );
};

export default EditPackageForm;

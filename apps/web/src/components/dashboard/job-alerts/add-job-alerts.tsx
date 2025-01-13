"use client"
import _ from "lodash";
import  { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import useSWR from "swr";
import { ThemeContext } from "../../../context/ThemeContext";
import { FormLoader, LoaderGrowing } from "../../lib/loader";
import { Axios, authAxios } from "../../utils/axiosKits";
import { MultiSelect } from "../form/multi-select-dropdown";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);

const AddJobAlerts = () => {
  const { data: filterData, error: filterError } = useSWR(
    "/admin/filters/retrives",
    fetcher
  );
  const { categoryData } = React.useContext(ThemeContext) as any;
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({});
  
  const Router = useRouter();
  const onSubmitHandler = async (data: any) => {
    const newData = {
      name: data.alertName,
      keyword: data.keyword,
      region: data.region[0],
      category: data.category[0].categoryTitle,
      tags: data.tags,
      type: data.type,
      emailFrequency: data.frequency,
    };
    try {
      await authAxios({
        method: "POST",
        url: "/jobs/alerts/retrives",
        data: newData,
      }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          // 600 millisecond delay
          new Promise((resolve) => setTimeout(resolve, 600));
          reset();
          Router.push("/job/job-alerts");
        }
      });
    } catch (error: any) {
      if (error?.response?.data) {
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

  return (
    <>
      <section className="mb-6">
        <div className="rounded-lg shadow-lg bg-white">
          <div className="bg-themeDark rounded-lg !py-3">
            <p className="text-lg2 text-white px-6 sm:px-10">Add New Alert</p>
          </div>
          <div className="sm:px-5 py-5 mx-3 sm:mx-0">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="relative">
              {!filterData && <LoaderGrowing />}
              {filterError ? (
                <div className="text-center text-red-600">
                  <p>{filterError.message}</p>
                </div>
              ) : (
                <>
                  {/* form  */}
                  <div>
                    <div className="flex flex-wrap">
                      {/* Name */}
                      <div className="w-full md:w-3/6 px-3 md:py-2">
                        <label
                          className="block tracking-wide text-gray-700 text-xxs mb-2"
                          htmlFor="grid-first-name"
                        >
                          Alert Name
                        </label>
                        <input
                          className={`appearance-none block w-full text-gray-700 border border-gray ${
                            errors?.alertName ? "!border-red-400" : ""
                          } rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                          id="grid-first-name"
                          type="text"
                          placeholder="Restaurant Dishwasher"
                          {...register("alertName", {
                            required: true,
                          })}
                        />
                        {errors?.alertName && (
                          <p className="text-red-400 text-sm italic py-2">
                            This field is required
                          </p>
                        )}
                      </div>

                      {/* Keyword */}
                      <div className="w-full md:w-3/6 px-3 md:py-2">
                        <label
                          className="block tracking-wide text-gray-700 text-xxs mb-2"
                          htmlFor="grid-last-name"
                        >
                          Keyword
                        </label>
                        <input
                          className={`appearance-none block w-full text-gray-700 border border-gray ${
                            errors?.keyword ? "!border-red-400" : ""
                          } rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                          id="grid-first-name"
                          type="text"
                          placeholder='"Restaurant Dishwasher" (optionally add a keyword to match hobs against)'
                          {...register("keyword", {
                            required: true,
                          })}
                        />
                        {errors?.keyword && (
                          <p className="text-red-400 text-sm italic py-2">
                            This field is required
                          </p>
                        )}
                      </div>

                      {/* Region Name */}
                      <div className="w-full md:w-3/6 px-3 md:py-2">
                        <label
                          className="block tracking-wide text-gray-700 text-xxs mb-2"
                          htmlFor="grid-last-name"
                        >
                          Job Region
                        </label>
                        <MultiSelect
                          options={filterData?.region}
                          name="region"
                          isObject={false}
                          validationSyntax={{
                            required: true,
                          }}
                          error={errors?.region}
                          register={register}
                          setValue={setValue}
                          emptyRecordMsg="No Region Found"
                          placeholder="Add Region..."
                          singleSelect
                          forwardRef={undefined}
                          displayValue={undefined}
                          selectedValues={undefined}
                          disabled={undefined}
                          className={undefined}
                        />
                        {errors?.region && (
                          <p className="text-red-400 text-sm italic py-2">
                            This field is required
                          </p>
                        )}
                      </div>

                      {/* Categories */}
                      <div className="w-full md:w-3/6 px-3 md:py-2">
                        <label
                          className="block tracking-wide text-gray-700 text-xxs mb-2"
                          htmlFor="grid-last-name"
                        >
                          Categories
                        </label>
                        <MultiSelect
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
                          selectedValues={undefined}
                          disabled={undefined}
                          className={undefined}
                          isObject={undefined}
                        />
                        {errors?.region && (
                          <p className="text-red-400 text-sm italic py-2">
                            This field is required
                          </p>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="w-full md:w-3/6 px-3 md:py-2">
                        <label
                          className="block tracking-wide text-gray-700 text-xxs mb-2"
                          htmlFor="grid-last-name"
                        >
                          Tags
                        </label>
                        <MultiSelect
                          options={filterData?.tags}
                          isObject={false}
                          name="tags"
                          validationSyntax={{
                            required: true,
                          }}
                          error={errors?.tags}
                          register={register}
                          setValue={setValue}
                          emptyRecordMsg="No tags found"
                          placeholder="Add Tags..."
                          forwardRef={undefined}
                          displayValue={undefined}
                          selectedValues={undefined}
                          disabled={undefined}
                          singleSelect={undefined}
                          className={undefined}
                        />
                        {errors?.tags && (
                          <p className="text-red-400 text-sm italic py-2">
                            This field is required
                          </p>
                        )}
                      </div>

                      {/* Types */}
                      <div className="w-full md:w-3/6 px-3 md:py-2">
                        <label
                          className="block tracking-wide text-gray-700 text-xxs mb-2"
                          htmlFor="grid-last-name"
                        >
                          Job Type
                        </label>
                        <MultiSelect
                          options={filterData?.jobTypes}
                          isObject={false}
                          name="type"
                          validationSyntax={true}
                          error={errors?.type}
                          register={register}
                          setValue={setValue}
                          emptyRecordMsg="No job type found"
                          placeholder="Select Job Type"
                          forwardRef={undefined}
                          displayValue={undefined}
                          selectedValues={undefined}
                          disabled={undefined}
                          singleSelect={undefined}
                          className={undefined}
                        />
                        {errors?.type && (
                          <p className="text-red-400 text-sm italic py-2">
                            This field is required
                          </p>
                        )}
                      </div>

                      {/* Email Frequency */}
                      <div className="w-full md:w-3/6 px-3 md:py-2">
                        <label
                          className="block tracking-wide text-gray-700 text-xxs mb-2"
                          htmlFor="grid-last-name"
                        >
                          Email Frequency
                        </label>
                        <select
                          aria-label="Default select example"
                          className={`appearance-none block w-full text-gray-700 border border-gray ${
                            errors?.frequency ? "!border-red-400" : ""
                          } rounded py-2.5 px-3 svg_icon leading-tight focus:outline-none focus:bg-white`}
                          defaultValue={""}
                          {...register("frequency", {
                            required: true,
                          })}
                        >
                          <option value="">Select Frequency</option>
                          {_.map(
                            ["Daily", "Weekly", "Fortnightly", "Monthly"],
                            (item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            )
                          )}
                        </select>
                        {errors?.frequency && (
                          <p className="text-red-400 text-sm italic py-2">
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Submit button */}
                  <div className="mt-6 px-3 pb-3">
                    <button
                      type="submit"
                      className={`py-2.5 flex gap-2 items-center px-8 ${
                        isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
                      } rounded-lg shadow-themePrimary text-white font-medium text-xxs`}
                    >
                      {isSubmitting ? "Please wait..." : "Save Alert"}
                      {isSubmitting && <FormLoader />}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddJobAlerts;

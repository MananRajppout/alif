"use client"
import theme_config from "@/theme_config";
import { FormLoader } from "../../lib/loader";

type CompanyEmailSettingProps = {
  handleSubmit: any;
  onConfirmationEmailSubmit: any;
  isDirty: any;
  isSubmitting: any;
  register: any;
  errors: any;
};

const CompanyEmailSetting = ({
  handleSubmit,
  onConfirmationEmailSubmit,
  isDirty,
  isSubmitting,
  register,
  errors,
}: CompanyEmailSettingProps) => {
  const { site_name } = theme_config;
  return (
    <form onSubmit={handleSubmit(onConfirmationEmailSubmit)}>
      <div className="grid gap-7 sm:flex sm:gap-10 pb-4">
        {/* Sender Name */}
        <label className="w-full sm:w-2/4" htmlFor="">
          <p className="text-xs text-themeDark font-normal pb-2">Sender Name</p>
          <input
            className="w-full border border-gray h-12 rounded px-4 focus:outline-none"
            type="text"
            placeholder={site_name || "Your Company Name"}
            {...register("senderAddress", {
              required: true,
            })}
          />
          {errors.senderAddress && (
            <span className="text-red-400 text-sm italic">
              This field is required
            </span>
          )}
        </label>
        {/* Sender Email */}
        <label className="w-full sm:w-2/4" htmlFor="">
          <p className="text-xs text-themeDark font-normal pb-2">
            Sender Email
          </p>
          <input
            className="w-full border border-gray h-12 rounded px-4 focus:outline-none"
            type="text"
            placeholder="info@youremail.com"
            {...register("senderEmail", {
              required: true,
            })}
          />
          {errors.senderEmail && (
            <span className="text-red-400 text-sm italic">
              This field is required
            </span>
          )}
        </label>
      </div>
      {/* Subject */}
      <div className="w-full pb-4">
        <p className="text-xs text-themeDark font-normal pb-2">Subject</p>
        <input
          className="w-full border border-gray h-12 rounded px-4 focus:outline-none"
          type="text"
          placeholder="Confirm your registration"
          {...register("subject", { required: true })}
        />
        {errors.subject && (
          <span className="text-red-400 text-sm italic">
            This field is required
          </span>
        )}
      </div>
      {/* Email Contents */}
      <div className="w-full pb-8">
        <p className="text-xs text-themeDark font-normal pb-2">
          Email Contents
        </p>
        <textarea
          className="w-full border border-gray h-36 rounded px-4 pt-3 focus:outline-none"
          type="text"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="text-red-400 text-sm italic">
            This field is required
          </span>
        )}
      </div>
      <div>
        <button
          disabled={!isDirty || isSubmitting}
          className={`text-white flex justify-center items-center gap-3 shadow-themePrimary !py-3.5 px-4 rounded-lg ${
            isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
          }  ${isDirty ? "opacity-100" : "opacity-30"} `}
          type="submit"
          // value="Save &amp; Change"
        >
          {/* Save &amp; Change */}
          {isSubmitting ? "Please wait..." : "Save & Change"}
          {isSubmitting && <FormLoader />}
        </button>
      </div>
    </form>
  );
};

export default CompanyEmailSetting;

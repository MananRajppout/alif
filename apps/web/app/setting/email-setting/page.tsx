"use client"
import CompanyEmailSetting from "@/src/components/dashboard/form/company-email-setting";
import ConfirmEmailSetting from "@/src/components/dashboard/form/confirm-email-setting";
import JobEmailSetting from "@/src/components/dashboard/form/job-email-setting";
import ResetPassEmailSetting from "@/src/components/dashboard/form/reset-pass-email-setting";
import ResumeEmailSettings from "@/src/components/dashboard/form/resume-email-settings";
import ReviewEmailSetting from "@/src/components/dashboard/form/review-email-setting";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import Layout from "@/src/components/dashboard/layout";
import { Loader, LoaderGrowing } from "@/src/components/lib/loader";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import { authAxios } from "@/src/components/utils/axiosKits";

export default function Settings() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isAdmin = userData?.role.isAdmin;
  const [toggleState, setToggleState] = React.useState(1);
  const [nestedState, setNestedState] = React.useState(1);
  const [emailType, setEmailType] = React.useState("CONFIRMATION_EMAIL");
  const [emailData, setEmailData] = React.useState(null) as any;
  const [loading, setLoading] = React.useState(false);
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitted, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      senderAddress: emailData?.senderAddress,
      senderEmail: emailData?.senderEmail,
      subject: emailData?.subject,
      message: emailData?.message,
      emailType: emailData?.emailType,
    },
  }) as any;
  React.useEffect(() => {
    setValue("senderAddress", emailData?.senderAddress);
    setValue("senderEmail", emailData?.senderEmail);
    setValue("subject", emailData?.subject);
    setValue("message", emailData?.message);
    setValue("emailType", emailData?.emailType);
  }, [emailData, setValue]);

  // [x] Confirmation Email submit
  const onConfirmationEmailSubmit = async (data: any) => {
    const inputData = {
      ...data,
      emailType,
    };
    try {
      await authAxios({
        method: "PUT",
        url: `/notifications/notification/${emailType}`,
        data: inputData,
      }).then((res) => {
        addToast(res.data.message, {
          appearance: "success",
          autoDismiss: true,
        });
      });
    } catch (error: any) {
      addToast(error.response?.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  // [x] Get data by email type
  const getDataByEmailType = async (type: string) => {
    setLoading(true);
    try {
      await authAxios({
        method: "GET",
        url: `/notifications/notification/${type}`,
      }).then((res) => {
        setEmailData(res.data.data[0]);
        setLoading(false);
      });
    } catch (error: any) {
      addToast(error.response?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (emailType == "CONFIRMATION_EMAIL") {
      setLoading(true);
      try {
        authAxios({
          method: "GET",
          url: `/notifications/notification/${emailType}`,
        }).then((res) => {
          setEmailData(res.data.data[0]);
          setLoading(false);
        });
      } catch (error: any) {
        addToast(error.response?.data?.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      }
    }
  }, []);

  if (status === "unauthenticated") return <UserNotLogin />;

  if (userData && !isAdmin) return <UserGoBack />;

  if (userData && status === "authenticated" && isAdmin) {
    return (
      <>
        <Head>
          <meta
            name="description"
            content="Email Settings for confirmation, reset password, job, resume, company, review"
          />
        </Head>

        <Layout>
          <main>
            <section className="rounded-lg shadow-lg bg-white">
              <div className="h-16 bg-themeDark flex items-center px-10 rounded-lg">
                <p className="text-xxs text-white">Email Settings</p>
              </div>
              <div className="p-10">
                <ul
                  id="tabs"
                  className="inline-flex flex-wrap w-full !pb-3 gap-6"
                >
                  {/* Confirm Email Settings */}
                  <li
                    className={` text-base font-normal border border-gray py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-themePrimary hover:text-white hover:border-themePrimary  ${
                      toggleState === 1
                        ? "bg-themePrimary text-white"
                        : "text-themeDark "
                    }`}
                    onClick={() => {
                      setToggleState(1);
                      setNestedState(1);
                      setEmailType("CONFIRMATION_EMAIL");
                      getDataByEmailType("CONFIRMATION_EMAIL");
                    }}
                  >
                    Confirm Email Settings
                  </li>
                  {/* Reset Password */}
                  <li
                    className={`text-base font-normal border border-gray py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-themePrimary hover:text-white hover:border-themePrimary  ${
                      toggleState === 2
                        ? "bg-themePrimary text-white"
                        : "text-themeDark "
                    }`}
                    onClick={() => {
                      setToggleState(2);
                      setNestedState(1);
                      setEmailType("RESET_PASSWORD");
                      getDataByEmailType("RESET_PASSWORD");
                    }}
                  >
                    Reset Password
                  </li>
                  {/* Job Email Setting */}
                  <li
                    className={` text-base font-normal border  py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-themePrimary hover:text-white hover:border-themePrimary  ${
                      toggleState === 3
                        ? "bg-themePrimary text-white border-themePrimary"
                        : "text-themeDark border-gray"
                    }`}
                    onClick={() => {
                      setToggleState(3);
                      setNestedState(1);
                      setEmailType("JOB_PUBLISHED");
                      getDataByEmailType("JOB_PUBLISHED");
                    }}
                  >
                    Job Email Setting
                  </li>
                  {/* Resume Email Setting */}
                  <li
                    className={`text-base font-normal border border-gray py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-themePrimary hover:text-white hover:border-themePrimary  ${
                      toggleState === 4
                        ? "bg-themePrimary text-white"
                        : "text-themeDark "
                    }`}
                    onClick={() => {
                      setToggleState(4);
                      setNestedState(1);
                      setEmailType("RESUME_PUBLISHED");
                      getDataByEmailType("RESUME_PUBLISHED");
                    }}
                  >
                    Resume Email Setting
                  </li>
                  {/* Company Email Setting */}
                  <li
                    className={`text-base font-normal border border-gray py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-themePrimary hover:text-white hover:border-themePrimary  ${
                      toggleState === 5
                        ? "bg-themePrimary text-white"
                        : "text-themeDark "
                    }`}
                    onClick={() => {
                      setToggleState(5);
                      setNestedState(1);
                      setEmailType("COMPANY_PUBLISHED");
                      getDataByEmailType("COMPANY_PUBLISHED");
                    }}
                  >
                    Company Email Setting
                  </li>
                  {/* Reviews Notification */}
                  <li
                    className={`text-base font-normal border border-gray py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-themePrimary hover:text-white hover:border-themePrimary  ${
                      toggleState === 6
                        ? "bg-themePrimary text-white"
                        : "text-themeDark "
                    }`}
                    onClick={() => {
                      setToggleState(6);
                      setNestedState(1);
                      setEmailType("REVIEW_PUBLISHED");
                      getDataByEmailType("REVIEW_PUBLISHED");
                    }}
                  >
                    Reviews Notification
                  </li>
                </ul>
                <hr className="my-6 border-gray" />
                {/* {!loading && ( */}
                <div id="tab-contents ">
                  {/* tab 1 Confirm Email Settings */}
                  {toggleState === 1 && (
                    <div id="first" className="relative">
                      {loading && <LoaderGrowing />}
                      <ConfirmEmailSetting
                        handleSubmit={handleSubmit}
                        onConfirmationEmailSubmit={onConfirmationEmailSubmit}
                        errors={errors}
                        register={register}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}
                  {/* tab 2 Reset Password */}
                  {toggleState === 2 && (
                    <div id="second" className="relative">
                      {loading && <LoaderGrowing />}
                      <ResetPassEmailSetting
                        handleSubmit={handleSubmit}
                        onConfirmationEmailSubmit={onConfirmationEmailSubmit}
                        errors={errors}
                        register={register}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}
                  {/* tab 3 Job Email Setting Nested*/}
                  {toggleState === 3 && (
                    <div id="third" className="relative">
                      {loading && <LoaderGrowing />}
                      {/* nested tabs here */}
                      <div className="pt-3">
                        <ul className="inline-flex flex-wrap w-full pb-14 gap-8">
                          {/* New Job Published */}
                          <li
                            className={`${
                              nestedState === 1
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(1);
                              setEmailType("JOB_PUBLISHED");
                              getDataByEmailType("JOB_PUBLISHED");
                            }}
                          >
                            New Job Published
                          </li>
                          {/* Job Drafted */}
                          <li
                            className={`${
                              nestedState === 2
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(2);
                              setEmailType("JOB_DRAFTED");
                              getDataByEmailType("JOB_DRAFTED");
                            }}
                          >
                            Job Drafted
                          </li>
                          {/* Job Approved */}
                          <li
                            className={`${
                              nestedState === 3
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(3);
                              setEmailType("JOB_APPROVED");
                              getDataByEmailType("JOB_APPROVED");
                            }}
                          >
                            Job Approved
                          </li>
                          {/* Job Rejected */}
                          <li
                            className={`${
                              nestedState === 4
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(4);
                              setEmailType("JOB_REJECTED");
                              getDataByEmailType("JOB_REJECTED");
                            }}
                          >
                            Job Rejected
                          </li>
                          {/* Job Activeted */}
                          <li
                            className={`${
                              nestedState === 5
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(5);
                              setEmailType("JOB_ACTIVATED");
                              getDataByEmailType("JOB_ACTIVATED");
                            }}
                          >
                            Job Activeted
                          </li>
                          {/* Job Expired */}
                          <li
                            className={`${
                              nestedState === 6
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(6);
                              setEmailType("JOB_EXPIRED");
                              getDataByEmailType("JOB_EXPIRED");
                            }}
                          >
                            Job Expired
                          </li>
                          {/* Job Featured */}
                          <li
                            className={`${
                              nestedState === 7
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(7);
                              setEmailType("JOB_FEATURED");
                              getDataByEmailType("JOB_FEATURED");
                            }}
                          >
                            Job Featured
                          </li>
                          {/* Job Non-Featured */}
                          <li
                            className={`${
                              nestedState === 8
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(8);
                              setEmailType("JOB_NON-FEATURED");
                              getDataByEmailType("JOB_NON-FEATURED");
                            }}
                          >
                            Job Non-Featured
                          </li>
                          {/* Job Deleted */}
                          <li
                            className={`${
                              nestedState === 9
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(9);
                              setEmailType("JOB_DELETED");
                              getDataByEmailType("JOB_DELETED");
                            }}
                          >
                            Job Deleted
                          </li>
                        </ul>
                      </div>
                      {/* end nested tabs here */}
                      {/* Job Email Setting form */}
                      <JobEmailSetting
                        handleSubmit={handleSubmit}
                        onConfirmationEmailSubmit={onConfirmationEmailSubmit}
                        errors={errors}
                        register={register}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}
                  {/* tab 4 Resume Email Setting*/}
                  {toggleState === 4 && (
                    <div id="fourth" className="relative">
                      {loading && <LoaderGrowing />}
                      {/* nested tabs here */}
                      <div className="pt-3">
                        <ul className="inline-flex flex-wrap w-full pb-14 gap-8">
                          {/* Resume Published */}
                          <li
                            className={`${
                              nestedState === 1
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(1);
                              setEmailType("RESUME_PUBLISHED");
                              getDataByEmailType("RESUME_PUBLISHED");
                            }}
                          >
                            Resume Published
                          </li>
                          {/* Resume Drafted */}
                          <li
                            className={`${
                              nestedState === 2
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(2);
                              setEmailType("RESUME_DRAFTED");
                              getDataByEmailType("RESUME_DRAFTED");
                            }}
                          >
                            Resume Drafted
                          </li>
                          {/* Resume Approved */}
                          <li
                            className={`${
                              nestedState === 3
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(3);
                              setEmailType("RESUME_APPROVED");
                              getDataByEmailType("RESUME_APPROVED");
                            }}
                          >
                            Resume Approved
                          </li>
                          {/* Resume Rejected */}
                          <li
                            className={`${
                              nestedState === 4
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(4);
                              setEmailType("RESUME_REJECTED");
                              getDataByEmailType("RESUME_REJECTED");
                            }}
                          >
                            Resume Rejected
                          </li>
                          {/* Resume Activated */}
                          <li
                            className={`${
                              nestedState === 5
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(5);
                              setEmailType("RESUME_ACTIVATED");
                              getDataByEmailType("RESUME_ACTIVATED");
                            }}
                          >
                            Resume Activated
                          </li>
                          {/*Resume Expired */}
                          <li
                            className={`${
                              nestedState === 6
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(6);
                              setEmailType("RESUME_EXPIRED");
                              getDataByEmailType("RESUME_EXPIRED");
                            }}
                          >
                            Resume Expired
                          </li>
                          {/* Resume Deleted */}
                          <li
                            className={`${
                              nestedState === 7
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(7);
                              setEmailType("RESUME_DELETED");
                              getDataByEmailType("RESUME_DELETED");
                            }}
                          >
                            Resume Deleted
                          </li>
                        </ul>
                      </div>
                      {/* end nested tabs here */}
                      {/* Resume Email Setting Form  */}
                      <ResumeEmailSettings
                        handleSubmit={handleSubmit}
                        onConfirmationEmailSubmit={onConfirmationEmailSubmit}
                        errors={errors}
                        register={register}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}
                  {/* tab 5 Company Email Setting*/}
                  {toggleState === 5 && (
                    <div id="fifth" className="relative">
                      {loading && <LoaderGrowing />}
                      {/* nested tabs here */}
                      <div className="pt-3">
                        <ul className="inline-flex flex-wrap w-full pb-14 gap-8">
                          {/*  Published */}
                          <li
                            className={`${
                              nestedState === 1
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(1);
                              setEmailType("COMPANY_PUBLISHED");
                              getDataByEmailType("COMPANY_PUBLISHED");
                            }}
                          >
                            Company Published
                          </li>
                          {/* Company Drafted */}
                          <li
                            className={`${
                              nestedState === 2
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(2);
                              setEmailType("COMPANY_DRAFTED");
                              getDataByEmailType("COMPANY_DRAFTED");
                            }}
                          >
                            Company Drafted
                          </li>
                          {/* Company Approved */}
                          <li
                            className={`${
                              nestedState === 3
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(3);
                              setEmailType("COMPANY_APPROVED");
                              getDataByEmailType("COMPANY_APPROVED");
                            }}
                          >
                            Company Approved
                          </li>
                          {/* Company Rejected */}
                          <li
                            className={`${
                              nestedState === 4
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(4);
                              setEmailType("COMPANY_REJECTED");
                              getDataByEmailType("COMPANY_REJECTED");
                            }}
                          >
                            Company Rejected
                          </li>
                          {/* Company Activated */}
                          <li
                            className={`${
                              nestedState === 5
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(5);
                              setEmailType("COMPANY_ACTIVATED");
                              getDataByEmailType("COMPANY_ACTIVATED");
                            }}
                          >
                            Company Activated
                          </li>
                          {/*Company Expired */}
                          <li
                            className={`${
                              nestedState === 6
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(6);
                              setEmailType("COMPANY_EXPIRED");
                              getDataByEmailType("COMPANY_EXPIRED");
                            }}
                          >
                            Company Expired
                          </li>
                          {/* Company Deleted */}
                          <li
                            className={`${
                              nestedState === 7
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(7);
                              setEmailType("COMPANY_DELETED");
                              getDataByEmailType("COMPANY_DELETED");
                            }}
                          >
                            Company Deleted
                          </li>
                        </ul>
                      </div>
                      <CompanyEmailSetting
                        handleSubmit={handleSubmit}
                        onConfirmationEmailSubmit={onConfirmationEmailSubmit}
                        errors={errors}
                        register={register}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}
                  {/* tab 5 Reviews Notification*/}
                  {toggleState === 6 && (
                    <div id="sixth" className="relative">
                      {loading && <LoaderGrowing />}
                      {/* nested tabs here */}
                      <div className="pt-3">
                        <ul className="inline-flex flex-wrap w-full pb-14 gap-8">
                          {/* Review Submitted */}
                          <li
                            className={`${
                              nestedState === 1
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(1);
                              setEmailType("REVIEW_PUBLISHED");
                              getDataByEmailType("REVIEW_PUBLISHED");
                            }}
                          >
                            Review Submitted
                          </li>
                          {/* Review Pending Approval */}
                          <li
                            className={`${
                              nestedState === 2
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(2);
                              setEmailType("REVIEW_APPROVED");
                              getDataByEmailType("REVIEW_APPROVED");
                            }}
                          >
                            Review Pending Approval
                          </li>
                          {/* Report Review ( admin ) */}
                          <li
                            className={`${
                              nestedState === 3
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(3);
                              setEmailType("REVIEW_REPORTED");
                              getDataByEmailType("REVIEW_REPORTED");
                            }}
                          >
                            Report Review ( admin )
                          </li>
                          {/* Review Deleted */}
                          <li
                            className={`${
                              nestedState === 4
                                ? "text-themePrimary"
                                : "text-themeDarkAlt"
                            } text-base font-normal cursor-pointer transition duration-300 ease-in-out hover:text-themePrimary`}
                            onClick={() => {
                              setNestedState(4);
                              setEmailType("REVIEW_DELETED");
                              getDataByEmailType("REVIEW_DELETED");
                            }}
                          >
                            Review Deleted
                          </li>
                        </ul>
                      </div>
                      {/* end nested tabs here */}
                      {/* Reviews Notification Form  */}
                      <ReviewEmailSetting
                        handleSubmit={handleSubmit}
                        onConfirmationEmailSubmit={onConfirmationEmailSubmit}
                        errors={errors}
                        register={register}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}
                </div>
                {/* )} */}
              </div>
            </section>
          </main>
        </Layout>
      </>
    );
  }

  return <Loader />;
}

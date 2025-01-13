"use client"
import { ClockIcon, DollarIcon, OfficeBag, RegionIcon } from "@/src/icons";
import _ from "lodash";
import millify from "millify";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import useSWR, { useSWRConfig } from "swr";
import { ThemeContext } from "../../../context/ThemeContext";
import { FormLoader, LoaderGrowing } from "../../lib/loader";
import PopupModule from "../../lib/popup-modal";
import Image from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const CandidateInfo = ({ data }: { data: any }) => {
  const { LoginPopupHandler } = React.useContext(ThemeContext) as any;
  const router = useRouter();
  const { data: userData, status } = useSession();
  //@ts-ignore
  const isCandidate = userData?.user?.role.isCandidate;
  const params = useParams()
  const { id } = params;
  const { addToast } = useToasts();
  const { mutate } = useSWRConfig();
  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  // message data fetch using swr and fetcher
  const { data: messageList } = useSWR(`/messages/retrives`, fetcher, {
    refreshInterval: 0,
  });
  // filter message data by job id
  const isMessageList =
    messageList &&
    _.filter(messageList, (item) => {
      return (
        item.job?._id === watch("job") &&
        item.members?.candidate?._id === data?.data?.user
      );
    }).length > 0;
  // check isBookmark true or false
  const { data: bookmarkData } = useSWR(
    id ? `/bookmarks/bookmark/${id}` : null,
    fetcher,
    {
      refreshInterval: 0,
    },
  );
  // user job data from swr
  const { data: userJobData, error: userJobError } = useSWR(
    userData?.user && !isCandidate ? `/jobs/private` : null,
    fetcher,
    {
      refreshInterval: 0,
    },
  );
  const [bookmark, setBookmark] = React.useState(false);
  const [interview, setInterview] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register: bookmarkRegister,
    handleSubmit: bookmarkHandleSubmit,
    reset: bookmarkReset,
    formState: {
      errors: bookmarkErrors,
      isSubmitting: bookmarkIsSubmitting,
      reset,
    },
  } = useForm({
    mode: "onChange",
  }) as any;

  // resume bookmark submit form
  const resumeBookmarkSubmit = async (data: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "post",
        url: "/bookmarks/retrives",
        data: {
          resume: params.id,
          note: data.note,
        },
      }).then((res) => {
        mutate(`/bookmarks/bookmark/${params.id}`).then(() => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setBookmark(!bookmark);
          bookmarkReset();
          setLoading(false);
        });
      });
    } catch (error: any) {
      addToast(error.responsive.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  // remove bookmark function
  const removeBookmark = async () => {
    setLoading(true);
    try {
      await authAxios({
        method: "DELETE",
        url: `/bookmarks/bookmark/${params.id}`,
      })
        .then((res) => {
          mutate(`/bookmarks/bookmark/${params.id}`).then(() => {
            addToast(res.data.message, {
              appearance: "success",
              autoDismiss: true,
            });
            setLoading(false);
          });
        })
        .catch((error) => {
          addToast(error.responsive.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        });
    } catch (error: any) {
      addToast(error.responsive.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  // interview submit form
  const interviewSubmit = async (formData: any) => {
    const newData = {
      job: formData?.job,
      time: new Date(),
      members: {
        candidate: data?.data?.user,
        //@ts-ignore
        employer: userData?.user?._id,
      },
      messages: [
        {
          //@ts-ignore
          sender: userData?.user?._id,
          reciver: data?.data?.user,
          message: formData?.message,
          timestamp: new Date(),
        },
      ],
    };

    try {
      await authAxios({
        method: "POST",
        url: "/messages/retrives",
        data: newData,
      }).then((res) => {
        addToast(res.data.message, {
          appearance: "success",
          autoDismiss: true,
        });
        setInterview(!interview);
        resetForm();
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

  const jobApprovedFilter = _.filter(userJobData, (job) => {
    return (
      job.status.isActive && job.status.isApproved && job.status.isPublished
    );
  });

  return (
    <>
      <section className="pt-12 pb-20 bg-light">
        <div className="container">
          <div className="lg:grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <div className="px-6 py-6 rounded-md bg-white mb-6 relative">
                {/* Bookmark */}
                {
                  //@ts-ignore
                userData?.user?._id !== data?.data?.user && (
                  <button
                    onClick={() => {
                      if (bookmarkData?.isBookmark) {
                        // remove bookmark
                        sweetAlert({
                          title: "Are you sure?",
                          text: "You want to remove this resume from your bookmark?",
                          icon: "warning",
                          buttons: true as any,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            removeBookmark();
                          }
                        });
                      } else {
                        setBookmark(!bookmark);
                      }
                    }}
                    className={`!p-2 z-50 group flex absolute top-0 right-0 justify-center items-center gap-2 mb-2 leading-4 rounded-md transition-all`}
                  >
                    {" "}
                    {bookmarkData?.isBookmark ? (
                      <AiFillHeart
                        className={`text-themePrimary group-hover:text-themeLight text-lg`}
                      />
                    ) : (
                      <AiOutlineHeart
                        className={`text-themeLight group-hover:text-themePrimary text-lg`}
                      />
                    )}
                  </button>
                )}

                {(data?.data?.loading || loading) && <LoaderGrowing />}
                <div className="relative bg-white pb-6">
                  <span className="left-0 top-0 absolute bg-themePrimary text-white py-1 px-2 rounded-md text-xss1 font-normal">
                    Open To Work
                  </span>
                  <div className="text-center pt-2 pb-3">
                    <div className="flex justify-center mb-3 mt-8 md:mt-2">
                      <Image
                        width={144}
                        height={144}
                        className="rounded-full w-26 h-26 md:w-36 md:h-36 p-2 border border-solid border-gray"
                        src={
                          data?.data?.photo
                            ? data?.data?.photo
                            : "/assets/img/profile-pic.png"
                        }
                        alt="img"
                      />
                    </div>
                    <h3 className="text-lg font-normal text-black leading-6 my-2">
                      {data?.data?.name}
                    </h3>
                    <p className="text-grayLight text-xss1 font-normal">
                      {data?.data?.professionalTitle}
                    </p>
                  </div>
                  <div className="border-gray border-b border-solid ml-2 mr-2 pb-4">
                    <ul className="flex gap-2 justify-center flex-wrap ">
                      {_.map(
                        data?.data?.skills,
                        (item, index) =>
                          item && (
                            <li key={index}>
                              <span className="text-deep text-xsss font-normal py-0.5 px-2 rounded-sm border border-solid border-gray">
                                {item}
                              </span>
                            </li>
                          ),
                      )}
                    </ul>
                  </div>
                </div>
                <ul className="border-b border-solid border-gray pb-2 mb-6 ml-2 mr-2">
                  {data?.data?.industry && (
                    <li className="flex gap-3 items-center flex-wrap mb-3">
                      <div className="">
                        <OfficeBag
                          className="w-[50px] h-[50px] text-themePrimary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="">
                        <h5 className="text-base font-medium text-black leading-5 mb-0">
                          Industry
                        </h5>
                        <p className="text-grayLight text-sm">
                          {data?.data?.industry}
                        </p>
                      </div>
                    </li>
                  )}
                  {data?.data?.region && (
                    <li className="flex gap-3 items-center flex-wrap mb-3">
                      <div className="">
                        <RegionIcon
                          className="w-[50px] h-[50px] text-themePrimary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="">
                        <h5 className="text-base font-medium text-black leading-5 mb-0">
                          Region
                        </h5>
                        <p className="text-grayLight text-sm">
                          {data?.data?.region}
                        </p>
                      </div>
                    </li>
                  )}
                  {data?.data?.location && (
                    <li className="flex gap-3 items-center flex-wrap mb-3">
                      <div className="">
                        <ClockIcon
                          className="w-[50px] h-[50px] text-themePrimary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="">
                        <h5 className="text-base font-medium text-black leading-5 mb-0">
                          Location
                        </h5>
                        <p className="text-grayLight text-sm">
                          {data?.data?.location}
                        </p>
                      </div>
                    </li>
                  )}
                  {data?.data?.workingRate && (
                    <li className="flex gap-3 items-center flex-wrap mb-3">
                      <div className="">
                        <DollarIcon
                          className="w-[50px] h-[50px] text-themePrimary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="">
                        <h5 className="text-base font-medium text-black leading-5 mb-0">
                          Working Rate
                        </h5>
                        <p className="text-grayLight text-sm">
                          {/* millify add */}
                          {millify(data?.data?.workingRate, {
                            precision: 3,
                          })}{" "}
                          / hourly
                        </p>
                      </div>
                    </li>
                  )}
                </ul>

                {
                  //@ts-ignore
                userData?.user?._id !== data?.data?.user && !isCandidate && (
                  <div className="text-center mb-3 px-1">
                    <button
                      type="button"
                      onClick={() => setInterview(!interview)}
                      className="w-full text-white text-xxs font-medium transition-all bg-themePrimary px-6 py-3 rounded-md hover:bg-black"
                    >
                      Invite for Interview
                    </button>
                  </div>
                )}
                {data?.data?.file && (
                  <div className="text-center pb-3 px-1">
                    <a
                      target={`_blank`}
                      rel="noopener noreferrer"
                      href={data?.data?.file}
                      className="w-full block text-deep text-xxs font-medium transition-all bg-light px-6 py-3 rounded-md hover:text-white hover:!bg-black"
                    >
                      Download My CV
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-8">
              <div className="px-7 pt-6 pb-2 rounded-md bg-white relative">
                {data?.data?.loading && <LoaderGrowing />}
                <h4 className="text-lg2 font-bold text-black leading-6 mb-4">
                  About Me
                </h4>
                <div className="mb-8">
                  <div className="text-xs text-deep font-normal leading-6 mb-6">
                    {data?.data?.resumeContent}
                  </div>
                </div>
                {data?.data?.url.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg2 font-bold text-black leading-6 mb-6 -ml-2">
                      Urls
                    </h4>
                    <ol className="relative border-l border-themePrimary dark:border-themePrimary pl-4">
                      {_.map(data?.data?.url, (item, index) => {
                        return (
                          <li className="mb-10 ml-4" key={index}>
                            <div className="absolute z-1 w-5 h-5 bg-themePrimary/50 flex justify-center items-center rounded-full -left-2.5">
                              <span className="w-1.5 h-1.5 bg-themePrimary rounded-full" />
                            </div>
                            <h3 className="text-lg2 font-normal text-black leading-6 !mb-3">
                              <a
                                target={`_blank`}
                                className="hover:text-themePrimary transition-all duration-300 ease-in-out"
                                href={item.url}
                              >
                                {item.name}
                              </a>
                            </h3>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
                {data?.data?.education.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg2 font-bold text-black leading-6 mb-6 -ml-2">
                      Education
                    </h4>
                    <ol className="relative border-l border-themePrimary dark:border-themePrimary pl-4">
                      {_.map(data?.data?.education, (item, index) => {
                        const startDate = new Date(
                          item.startDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                        });
                        const endDate = new Date(
                          item.endDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                        });
                        return (
                          <li className="mb-10 ml-4" key={index}>
                            <div className="absolute z-1 w-5 h-5 bg-themePrimary/50 flex justify-center items-center rounded-full -left-2.5">
                              <span className="w-1.5 h-1.5 bg-themePrimary rounded-full" />
                            </div>
                            <time className="mb-1 text-xs font-normal leading-6 text-deep">
                              {startDate} - {endDate}
                            </time>
                            <h3 className="text-lg2 font-normal text-black leading-6 !mb-3">
                              {item.schoolName}
                            </h3>
                            <p className="!mb-1 text-xs font-normal text-deep leading-6">
                              {item.qualifications}
                            </p>
                            {item.notes && (
                              <p className="!mb-4 text-sm font-normal text-deep leading-6">
                                Note: {item.notes}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
                {data?.data?.experience.length > 0 && (
                  <div className="mb-0">
                    <h4 className="text-lg2 font-bold text-black leading-6 mb-6 -ml-2">
                      Experience
                    </h4>
                    <ol className="relative border-l border-themePrimary dark:border-themePrimary pl-4">
                      {_.map(data?.data?.experience, (item, index) => {
                        const startDate = new Date(
                          item.startDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                        });
                        const endDate = new Date(
                          item.endDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                        });
                        return (
                          <li className="mb-10 ml-4">
                            <div className="absolute z-1 w-5 h-5 bg-themePrimary/50 flex justify-center items-center rounded-full -left-2.5">
                              <span className="w-1.5 h-1.5 bg-themePrimary rounded-full" />
                            </div>
                            <time className="!mb-1 text-xs font-normal leading-6 text-deep">
                              {startDate} - {endDate}
                            </time>
                            <h3 className="text-lg2 font-normal text-black leading-6 !mb-2">
                              {item.jobTitle}
                            </h3>
                            <p className="!mb-4 text-xs font-normal text-black leading-6">
                              {item.employerName}
                              {item.notes && (
                                <>
                                  <br />
                                  <span className="text-xs font-normal text-black leading-6">
                                    Note: {item.notes}
                                  </span>
                                </>
                              )}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Bookmark popup */}
      <PopupModule
        PopupTitle="Bookmark Details"
        Popup={bookmark}
        PopupHandler={() => {
          setBookmark(!bookmark);
        }}
      >
        {status === "authenticated" ? (
          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={bookmarkHandleSubmit(resumeBookmarkSubmit)}
          >
            <div className="mb-6">
              <label
                className="block mb-2 text-themeDarker font-normal"
                htmlFor="note"
              >
                Bookmark Note:
              </label>
              <textarea
                className={`appearance-none block w-full !p-3 leading-5 text-themeDarker border ${
                  bookmarkErrors?.note ? "!border-red-500" : "border-gray"
                } placeholder:font-normal h-40 placeholder:text-xss1 rounded placeholder-themeDarkAlt focus:outline-none focus:ring-2 focus:ring-themePrimary focus:ring-opacity-50`}
                id="note"
                {...bookmarkRegister("note")}
                placeholder="Note"
              />
              {bookmarkErrors?.note && (
                <span className="text-red-400 text-sm italic">
                  This field is required
                </span>
              )}
            </div>
            <button
              className={`!py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out mb-6 w-full text-base text-white font-normal text-center leading-6 ${
                bookmarkIsSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
              } rounded-md hover:bg-black`}
              type="submit"
              disabled={bookmarkIsSubmitting}
            >
              {bookmarkIsSubmitting ? "Please wait..." : "Add Bookmark"}
              {bookmarkIsSubmitting && <FormLoader />}
            </button>
          </form>
        ) : (
          <div className="text-center grid justify-center items-center h-40">
            <div>
              <p className="text-xxs text-themeLighter !mb-4">
                You must be logged in to bookmark this job.
              </p>
              <button
                className="bg-themePrimary text-white px-10 !py-3 hover:bg-themeDarkerAlt transition-all duration-300 ease-in-out rounded text-base font-normal"
                onClick={() => {
                  LoginPopupHandler();
                  setBookmark(!bookmark);
                }}
              >
                Login Now
              </button>
            </div>
          </div>
        )}
      </PopupModule>

      {/* Interview popup */}
      <PopupModule
        PopupTitle="Send Interview Message"
        Popup={interview}
        PopupHandler={() => {
          setInterview(!interview);
        }}
      >
        {status === "authenticated" ? (
          <form
            className="grid grid-cols-1 gap-1.5"
            onSubmit={handleSubmit(interviewSubmit)}
          >
            {/* Job Select Dropdown */}
            <div className="!mb-3">
              {/* <label
                className="block mb-2 text-themeDarker font-normal"
                htmlFor="job"
              >
                Select Job
              </label> */}
              <select
                className={`appearance-none block w-full !p-3 leading-5 text-themeDarker border ${
                  errors?.job ? "!border-red-500" : "border-gray"
                } rounded placeholder-themeDarkAlt focus:outline-none`}
                id="job"
                {...register("job")}
              >
                <option value="">Select Job</option>
                {userJobData &&
                jobApprovedFilter?.length > 0 &&
                userJobData?.length > 0 ? (
                  _.map(userJobData, (item, index) => {
                    return (
                      item.status.isApproved &&
                      item.status.isActive &&
                      item.status.isPublished && (
                        <option value={item._id} key={index}>
                          {item.jobTitle}
                        </option>
                      )
                    );
                  })
                ) : (
                  <option value="" disabled>
                    No Jobs Found
                  </option>
                )}
                {userJobError && (
                  <option value="" disabled>
                    {userJobError}
                  </option>
                )}
              </select>
              {errors?.job && (
                <span className="text-red-400 text-sm italic">
                  This field is required
                </span>
              )}
              {jobApprovedFilter?.length === 0 && (
                <span className="text-red-400 text-sm italic">
                  {`You don't have any approved jobs.`}
                </span>
              )}
              {isMessageList && (
                <span className="text-red-400 text-sm italic">
                  This candidate has already been contacted for this job. Please
                  select another job.
                </span>
              )}
            </div>
            {/* Message textarea */}
            <div className="mb-6">
              {/* <label
                className="block mb-2 text-themeDarker font-normal"
                htmlFor="message"
              >
                Message
              </label> */}
              <textarea
                disabled={
                  jobApprovedFilter?.length === 0 ||
                  watch("job") === "" ||
                  isMessageList
                }
                className={`appearance-none block w-full !p-3 leading-5 text-themeDarker border ${
                  errors?.message ? "!border-red-500" : "border-gray"
                } placeholder:font-normal h-40 placeholder:text-xss1 rounded placeholder-themeDarkAlt focus:outline-none`}
                id="message"
                {...register("message", {
                  required: true,
                })}
                placeholder="Message"
              />
              {errors?.message && (
                <span className="text-red-400 text-sm italic">
                  This field is required
                </span>
              )}
            </div>
            <button
              className={`!py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out mb-6 w-full text-base text-white font-normal text-center leading-6 ${
                isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
              } rounded-md ${
                jobApprovedFilter?.length === 0 ||
                watch("job") === "" ||
                isMessageList
                  ? "opacity-50 !bg-themeLight"
                  : "opacity-100"
              } hover:bg-black`}
              type="submit"
              disabled={
                jobApprovedFilter?.length === 0 ||
                watch("job") === "" ||
                isSubmitting ||
                isMessageList
              }
            >
              {isSubmitting ? "Please wait..." : "Send Message"}
              {isSubmitting && <FormLoader />}
            </button>
          </form>
        ) : (
          <div className="text-center grid justify-center items-center h-40">
            <div>
              <p className="text-xxs text-themeLighter !mb-4">
                You must be logged in to send an interview message.
              </p>
              <button
                className="bg-themePrimary text-white px-10 !py-3 hover:bg-themeDarkerAlt transition-all duration-300 ease-in-out rounded text-base font-normal"
                onClick={() => {
                  LoginPopupHandler();
                  setInterview(!interview);
                }}
              >
                Login Now
              </button>
            </div>
          </div>
        )}
      </PopupModule>
    </>
  );
};

export default CandidateInfo;

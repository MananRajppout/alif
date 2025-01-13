"use client"
import sendEmail from "@/src/utils/sendEmail";
import _, { capitalize } from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import { HiChevronDown } from "react-icons/hi";
import { MdClose, MdOutlineFactCheck } from "react-icons/md";
import { RiCheckboxCircleLine, RiEyeOffLine } from "react-icons/ri";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import useSWR, { useSWRConfig } from "swr";
import { LoaderGrowing } from "../../lib/loader";
import { authAxios } from "../../utils/axiosKits";
import Pagination from "../pagination";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const AllResumes = () => {
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();
  const { data: userData  } = useSession();
  //@ts-ignore
  const isAdmin = userData?.user?.role.isAdmin;
  const { data, error } = useSWR("/resumes/retrives", fetcher);
  const [loading, setLoading] = React.useState(false);

  const [isMailSent, setIsMailSent] = React.useState(false);
  const [emailType, setEmailType] = React.useState("");

  // get current pages
  const [currentPage, setCurrentPage] = React.useState(1);
  const [ShowPerPage, setShowPerPage] = React.useState(10);
  const indexOfLastPost = currentPage * ShowPerPage;
  const indexOfFirstPost = indexOfLastPost - ShowPerPage;
  const currentPosts = data
    ? data?.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  // [x] delete resume function here
  const deleteResume = (id: any) => {
    sweetAlert({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      buttons: true as any,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          authAxios
            .delete(`/resumes/resume/${id}`)
            .then((res) => {
              return mutate("/resumes/retrives").then(() => {
                addToast(res.data.message, {
                  appearance: "success",
                  autoDismiss: true,
                });
                setLoading(false);
                setEmailType("RESUME_DELETED");
                setIsMailSent(true);
              }, 1000 as any);
            })
            .catch((err) => {
              addToast(err?.response?.data?.message, {
                appearance: "error",
                autoDismiss: true,
              });
              setLoading(false);
            });
        } catch (error: any) {
          addToast(error?.response?.data?.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        }
      }
    });
  };

  // [x] approve resume function here
  const approveResume = (id: any) => {
    sweetAlert({
      title: "Are you sure?",
      text: "You want to approve this resume?",
      icon: "warning",
      buttons: true as any,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          authAxios({
            method: "PUT",
            url: `/admin/resumes/status/${id}`,
            data: {
              status: "approved",
            },
          })
            .then((res) => {
              return mutate("/resumes/retrives").then(() => {
                addToast(res.data.message, {
                  appearance: "success",
                  autoDismiss: true,
                });
                setLoading(false);
                setEmailType("RESUME_APPROVED");
                setIsMailSent(true);
              }, 1000 as any);
            })
            .catch((err) => {
              addToast(capitalize(err.response?.data?.message), {
                appearance: "error",
                autoDismiss: true,
              });
              setLoading(false);
            });
        } catch (error: any) {
          addToast(capitalize(error.response?.data?.message), {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        }
      }
    });
  };

  // [x] rejected resume function here
  const rejectedResume = (id: any) => {
    sweetAlert({
      title: "Are you sure?",
      text: "You want to rejected this resume?",
      icon: "warning",
      buttons: true as any,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          authAxios({
            method: "PUT",
            url: `/admin/resumes/status/${id}`,
            data: {
              status: "rejected",
            },
          })
            .then((res) => {
              return mutate("/resumes/retrives").then(() => {
                addToast(res.data.message, {
                  appearance: "success",
                  autoDismiss: true,
                });
                setLoading(false);
                setEmailType("RESUME_REJECTED");
                setIsMailSent(true);
              }, 1000 as any);
            })
            .catch((err) => {
              addToast(capitalize(err.response.data.message), {
                appearance: "error",
                autoDismiss: true,
              });
              setLoading(false);
            });
        } catch (error: any) {
          addToast(capitalize(error.response?.data?.message), {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        }
      }
    });
  };

  // [x] enable resume function start
  const enableResume = async (id: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "PUT",
        url: `/admin/resumes/status/${id}`,
        data: {
          status: "published",
        },
      })
        .then((res) => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          mutate(`/resumes/retrives`).then(() => {
            setLoading(false);
            setEmailType("RESUME_ACTIVATED");
            setIsMailSent(true);
          }, 1000 as any);
        })
        .catch((err) => {
          addToast(err.response?.data?.message, {
            appearance: "error",
            autoDismiss: true,
          });
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

  // [x] disable resume function start
  const disableResume = async (id: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "PUT",
        url: `/admin/resumes/status/${id}`,
        data: {
          status: "draft",
        },
      })
        .then((res) => {
          return mutate(`/resumes/retrives`).then(() => {
            addToast(res.data.message, {
              appearance: "success",
              autoDismiss: true,
            });
            setLoading(false);
          }, 700 as any);
        })
        .catch((err) => {
          addToast(err.response?.data?.message, {
            appearance: "error",
            autoDismiss: true,
          });
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

  useEffect(() => {
    if (isMailSent) {
      sendEmail(emailType);
      setIsMailSent(false);
    }
  }, [isMailSent]);

  const handlePageChange = (data: { selected: number }) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <section className="mb-6">
      {/* button here */}

      <div className="pb-6 text-right">
        <button className="!py-3 px-8 bg-themePrimary rounded-lg shadow-themePrimary">
          <Link legacyBehavior href="/resume/add-resume">
            <a className="text-white font-medium text-xxs">Add Resume</a>
          </Link>
        </button>
      </div>
      <>
        {/* table start here */}
        <div className="shadow-lg bg-white rounded-lg mb-10 overflow-x-auto overflow-y-hidden hidden md:block relative">
          {!data && !error && (
            <div className="relative min-h-40">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Name
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Title
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      {/* Location */}
                      Status
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Categories
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Date Posted
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark rounded-tr-lg rounded-br-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <LoaderGrowing />
                </tbody>
              </table>
            </div>
          )}
          {error && (
            <div className="w-full lg:w-2/4 mx-auto h-40 bg-white shadow rounded-lg flex justify-center items-center">
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
          {/* table data for desktop */}
          {data && !error && (
            <>
              {loading && <LoaderGrowing />}
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Name
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Title
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      {/* Location */}
                      Status
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Categories
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Date Posted
                    </th>
                    <th className="text-left whitespace-nowrap bg-themeDark rounded-tr-lg rounded-br-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    <>
                      {_.map(currentPosts, (item, index) => (
                        <TableItem
                          key={index}
                          item={item}
                          deleteResume={deleteResume}
                          approveResume={approveResume}
                          rejectedResume={rejectedResume}
                          enableResume={enableResume}
                          disableResume={disableResume}
                        />
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td
                        className="text-center whitespace-nowrap rounded-tr-lg rounded-br-lg px-4 py-6 leading-9 text-lg2 font-medium text-themeLight"
                        colSpan={"6" as any}
                      >
                        No data found ☹️
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* table data for mobile */}
        <div className="block md:hidden">
          {!data && !error && (
            <div className="p-4 mb-4 shadow rounded-lg bg-white">
              <LoaderGrowing />
            </div>
          )}
          {data &&
            !error &&
            (data.length > 0 ? (
              <>
                {_.map(currentPosts, (item, index) => (
                  <div
                    key={index}
                    className={`p-4 mb-4 shadow rounded-lg ${
                      //@ts-ignore
                      userData?.user?._id === item.user && isAdmin
                        ? "bg-themePrimary/5"
                        : "bg-white"
                    }`}
                  >
                    <MobileTable
                      item={item}
                      deleteResume={deleteResume}
                      disableResume={disableResume}
                      enableResume={enableResume}
                      rejectedResume={rejectedResume}
                      approveResume={approveResume}
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center p-8 mb-4 shadow rounded-lg bg-white">
                <h3 className="text-lg font-semibold text-red-400">
                  No data found ☹️
                </h3>
              </div>
            ))}
        </div>

        {data && !error && data.length > 0 && (
          <div>
            <Pagination
              setShowPerPage={setShowPerPage}
              totalCount={data?.length}
              showPerPage={ShowPerPage}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </>
      {/* end table start here */}
    </section>
  );
};

const TableItem = ({
  item,
  deleteResume,
  approveResume,
  rejectedResume,
  enableResume,
  disableResume,
}: {
  item: any;
  deleteResume: any;
  approveResume: any;
  rejectedResume: any;
  enableResume: any;
  disableResume: any;
}) => {
  const { data: userData } = useSession() as any;
  const isAdmin = userData?.user?.role.isAdmin;
  const [isOpen, setIsOpen] = React.useState(false);
  const DateFormate = new Date(item?.updatedAt);
  const date = DateFormate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const toggle = () => setIsOpen(!isOpen);

  return (
    <tr
      className={`border-b border-gray ${
        userData?.user?._id === item.user && isAdmin ? "bg-themePrimary/5" : ""
      } w-full align-top last-of-type:border-none`}
    >
      <td className="w-60 text-themeDark text-base  pl-6 py-4 align-middle">
        {item.name}
      </td>
      <td className="text-themeDark text-base  px-3 py-4 align-middle">
        {item.professionalTitle}
      </td>
      <td className="text-themeDark text-base px-3 py-4 align-middle">
        {/* {item.location} */}
        <span className="inline-grid gap-3">
          {item.status?.isPublished ? (
            <span className="bg-green-500 text-white px-3 py-0.5 rounded shadow-sm text-center text-xs">
              Enabled
            </span>
          ) : (
            <span className="bg-red-400 text-white px-3 py-0.5 rounded shadow-sm text-center text-xs">
              Disable
            </span>
          )}
          {item.status?.isApproved ? (
            <span className="bg-green-500 text-white px-3 py-0.5 rounded shadow-sm text-center text-xs">
              Approved
            </span>
          ) : (
            <span className="bg-themeSecondary text-white px-3 py-0.5 rounded shadow-sm text-center text-xs">
              Pending
            </span>
          )}
        </span>
      </td>
      <td className="text-themeDark text-base  px-3 py-4 align-middle">
        {item.category}
      </td>
      <td className="text-themeDark text-base  px-3 py-4 align-middle">
        <span className="text-themeDark whitespace-nowrap bg-themePrimary/20 rounded-lg font-semibold px-3 py-1 text-sm">
          {date}
        </span>
      </td>
      <td className="w-48 text-themeDark text-base pl-3 pr-6 py-4 align-middle   whitespace-nowrap">
        <div>
          <button
            className={`flex ${
              isOpen ? "mb-2" : ""
            } items-center transition-all duration-300 ease-in-out gap-2 cursor-pointer`}
            onClick={toggle}
          >
            <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
              <RiCheckboxCircleLine className="w-6 h-6 text-themePrimary" />
            </span>
            <span>Show Results</span>
            <span
              className={`transition duration-200 ease-in-out ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <HiChevronDown />
            </span>
          </button>

          {/* dropdown items */}
          <div
            className={`grid duration - 300 ease -in -out ${
              isOpen
                ? "opacity-100 h-full gap-2 visible"
                : "opacity-0 h-0 invisible"
            }`}
          >
            {/* Edit */}
            <Link legacyBehavior href={`/resume/edit-resume?active_id=${item._id}`} passHref>
              <div className="flex items-center gap-2 text-themeDarker hover:text-themePrimary transition-all duration-300 ease-in-out group cursor-pointer ">
                <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                  <AiOutlineEdit className="w-6 h-6 text-themePrimary group-hover:text-themePrimary transition-all duration-300 ease-in-out" />
                </span>
                <span>Edit</span>
              </div>
            </Link>
            {/* Disable */}
            {
            // @ts-ignore
            userData?.user?._id === item.user && (
              <div>
                {item.status?.isPublished ? (
                  <div
                    className="flex items-center group cursor-pointer hover:text-red-500 gap-2"
                    onClick={() => disableResume(item._id)}
                  >
                    <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                      <RiEyeOffLine className="w-6 h-6 text-themeDark group-hover:text-red-500" />
                    </span>
                    <span>Disable</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center group cursor-pointer hover:text-themePrimary gap-2"
                    onClick={() => enableResume(item._id)}
                  >
                    <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                      <AiOutlineEye className="w-6 h-6 text-themeDark group-hover:text-themePrimary" />
                    </span>
                    <span>Enabled</span>
                  </div>
                )}
              </div>
            )}
            {/* Approved */}
            {userData?.user &&
              isAdmin &&
              (item.status?.isApproved ? (
                <div
                  className="flex items-center gap-2 cursor-pointer group text-themeDarker hover:text-red-400 transition-all duration-300 ease-in-out"
                  onClick={() => rejectedResume(item._id)}
                >
                  <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                    <MdClose className="w-6 h-6 text-themeDarker group-hover:text-red-400 transition-all duration-300 ease-in-out" />
                  </span>
                  <span>Rejected</span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 cursor-pointer group text-themeDarker hover:text-themePrimary transition-all duration-300 ease-in-out"
                  onClick={() => approveResume(item._id)}
                >
                  <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                    <MdOutlineFactCheck className="w-6 h-6 text-text-themeDarker group-hover:text-themePrimary transition-all duration-300 ease-in-out" />
                  </span>
                  <span>Approved</span>
                </div>
              ))}
            {/* Delete */}
            <div
              className="flex items-center gap-2 cursor-pointer group hover:text-red-400 transition-all duration-300 ease-in-out"
              onClick={() => deleteResume(item._id)}
            >
              <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                <CgTrash className="w-6 h-6 text-themePrimary group-hover:text-red-400 transition-all duration-300 ease-in-out" />
              </span>
              <span>Delete</span>
            </div>
          </div>
          {/* end dropdown items */}
        </div>
      </td>
    </tr>
  );
};

const MobileTable = ({
  item,
  deleteResume,
  approveResume,
  rejectedResume,
  enableResume,
  disableResume,
}: {
  item: any;
  deleteResume: any;
  approveResume: any;
  rejectedResume: any;
  enableResume: any;
  disableResume: any;
}) => {
  const { data: userData } = useSession() as any;
  const isAdmin = userData?.user?.role.isAdmin;
  const DateFormate = new Date(item.updatedAt);
  const date = DateFormate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="relative">
      <div className="flex flex-wrap justify-between mb-3">
        <div className="text-themeDark text-xss1 bg-themePrimary/20 rounded-lg px-3 py-1.5 inline-block">
          {date}
        </div>
        <div className="flex gap-2 items-center">
          {item.status?.isPublished ? (
            <span className="bg-green-500 text-white px-3 py-0.5 rounded shadow-sm text-center text-sm">
              Enable
            </span>
          ) : (
            <span className="bg-red-400 text-white px-3 py-0.5 rounded shadow-sm text-center text-sm">
              Disable
            </span>
          )}
          {item.status?.isApproved ? (
            <span className="bg-green-500 text-white px-3 py-0.5 rounded shadow-sm text-center text-sm">
              Approved
            </span>
          ) : (
            <span className="bg-themeSecondary text-white px-3 py-0.5 rounded shadow-sm text-center text-sm">
              Pending
            </span>
          )}
        </div>
      </div>
      <h3 className="text-lg2 font-medium mb-2">{item.name}</h3>
      <div className="text-themeDark text-xss1">
        <strong>Categories:</strong> {item.category}
      </div>
      <div className="text-themeDark text-xss1 mb-4">
        <strong>Location:</strong> {item.location}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-3">
        {/* Email */}
        {/* <div className="flex items-center gap-2">
          <div className="bg-orange-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
            <AiOutlineMail className="text-xxs text-themeDarker" />
            <span className="text-themeDarker">Email</span>
          </div>
        </div> */}
        {/* Edit */}
        <div className="flex items-center gap-2">
          <Link legacyBehavior href={`/resume/edit-resume?active_id=${item._id}`} passHref>
            <div className="bg-themePrimary/20 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
              <AiOutlineEdit className="text-xxs text-themeDarker" />
              <span className="text-themeDarker text-sm">Edit</span>
            </div>
          </Link>
        </div>
        {/* Disable */}
        {userData?.user?._id === item.user && (
          <div className="flex items-center gap-2">
            {item.status?.isPublished ? (
              <div
                className="bg-indigo-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg"
                onClick={() => disableResume(item._id)}
              >
                <RiEyeOffLine className="text-xxs text-themeDarker" />
                <span className="text-themeDarker text-sm">Disable</span>
              </div>
            ) : (
              <div
                className="bg-indigo-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg"
                onClick={() => enableResume(item._id)}
              >
                <AiOutlineEye className="text-xxs text-themeDarker" />
                <span className="text-themeDarker text-sm">Enable</span>
              </div>
            )}
          </div>
        )}
        {/* Approved */}
        {userData?.user &&
          isAdmin &&
          (item.status?.isApproved ? (
            <div className="flex items-center gap-2">
              <div
                className="bg-indigo-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg"
                onClick={() => rejectedResume(item._id)}
              >
                <MdClose className="text-xxs text-themeDarker" />
                <span className="text-themeDarker text-sm">Rejected</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="bg-indigo-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg"
                onClick={() => approveResume(item._id)}
              >
                <MdOutlineFactCheck className="text-xxs text-themeDarker" />
                <span className="text-themeDarker text-sm">Approve</span>
              </div>
            </div>
          ))}
        {/* Delete */}
        <div
          className="flex items-center gap-2"
          onClick={() => deleteResume(item._id)}
        >
          <div className="bg-red-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
            <CgTrash className="text-xxs text-themeDarker" />
            <span className="text-themeDarker text-sm">Delete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllResumes;

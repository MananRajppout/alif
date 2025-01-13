"use client";
import sendEmail from "@/src/utils/sendEmail";
import _, { capitalize } from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import { HiChevronDown } from "react-icons/hi";
import { MdClose, MdOutlineFactCheck } from "react-icons/md";
import {
  RiCheckboxCircleLine,
  RiEyeOffLine,
  RiStarFill,
  RiStarHalfLine,
} from "react-icons/ri";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import useSWR, { useSWRConfig } from "swr";
import { LoaderGrowing } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";
import Pagination from "../pagination";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const AllEvents = () => {
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR("/events/private", fetcher);
  const [loading, setLoading] = React.useState(false);
  const { addToast } = useToasts();
  const { data: userData } = useSession() as {
    data: { user: { _id?: string; role?: { isAdmin?: boolean } } };
  };
  const isAdmin = userData?.user?.role?.isAdmin;
  const [isMailSent, setIsMailSent] = React.useState(false);
  const [emailType, setEmailType] = React.useState("");

  const deleteCategory = (id: any) => {
    sweetAlert({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    } as any).then((willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          authAxios
            .post(`/events/delete/${id}`)
            .then((res) => {
              mutate("/events/private").then(() => {
                addToast(capitalize(res.data.message), {
                  appearance: "success",
                  autoDismiss: true,
                });
                setLoading(false);

              });
            })
            .catch((err) => {
              addToast(err?.response?.data?.message, {
                appearance: "error",
                autoDismiss: true,
              });
              setLoading(false);
            });
        } catch (error: any) {
          addToast(error.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        }
      }
    });
  };

  const enableJob = async (id: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "POST",
        url: `/events/enable/${id}`,
        data: {
          status: "published",
        },
      })
        .then((res) => {
          mutate("/events/private");
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setLoading(false);

        })
        .catch((err) => {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        });
    } catch (error: any) {
      addToast(error.response.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  // [x] disable job function start
  const disableJob = async (id: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "POST",
        url: `/events/disable/${id}`,
        data: {
          status: "draft",
        },
      })
        .then((res) => {
          mutate("/events/private");

          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setLoading(false);
          
        })
        .catch((err) => {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        });
    } catch (error: any) {
      addToast(error.response.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  //  Send Email to the user
  useEffect(() => {
    if (isMailSent) {
      sendEmail(emailType);
      setIsMailSent(false);
    }
  }, [isMailSent]);
  // get current pages
  const [currentPage, setCurrentPage] = React.useState(1);
  const [ShowPerPage, setShowPerPage] = React.useState(10);
  const indexOfLastPost = currentPage * ShowPerPage;
  const indexOfFirstPost = indexOfLastPost - ShowPerPage;
  const currentPosts = data
    ? data?.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const handlePageChange = (data: { selected: number }) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <section className="mb-6">
      <div className="pb-6 text-right">
        <button className="!py-3 px-8 bg-themePrimary rounded-lg shadow-themePrimary">
          <Link legacyBehavior href="/event/submit-event">
            <a className="text-white font-medium text-xxs">Add Event</a>
          </Link>
        </button>
      </div>

      <div className="shadow-lg bg-white rounded-lg mb-10 overflow-x-auto overflow-y-hidden hidden md:block relative">
        {!data && !error && (
          <div className="relative min-h-40">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Event Name
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Status
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
                Check Your internet connection OR api response issue.
              </p>
            </div>
          </div>
        )}
        {data && !error && (
          <>
            {loading && <LoaderGrowing />}
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Event Name
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Status
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
                        approveCompany={() => {}}
                        rejectedCompany={() => {}}
                        deleteCategory={deleteCategory}
                        disableJob={disableJob}
                        enableJob={enableJob}
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
          <div className="p-4 mb-4 h-60 relative shadow rounded-lg bg-white">
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
                  className={`p-4 mb-4 shadow rounded-lg relative  ${
                    userData?.user?._id === item.user && isAdmin
                      ? "bg-themePrimary/5"
                      : "bg-white"
                  }`}
                >
                  {loading && <LoaderGrowing />}
                  <MobileTable
                    item={item}
                    rejectedCompany={() => {}}
                    approveCompany={() => {}}
                    deleteCategory={deleteCategory}
                    disableJob={disableJob}
                    enableJob={enableJob}
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
      {/* end table start here */}
    </section>
  );
};

const TableItem = ({
  item,
  deleteCategory,
  enableJob,
  disableJob,
}: {
  item: any;
  deleteCategory: any;
  approveCompany: any;
  rejectedCompany: any;
  enableJob: any;
  disableJob: any;
}) => {
  const { data: userData } = useSession();
  //@ts-ignore

  const isAdmin = userData?.user?.role.isAdmin;
  const [isOpen, setIsOpen] = React.useState(false);
  const DateFormate = new Date(item.updatedAt);
  const date = DateFormate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const toggle = () => setIsOpen(!isOpen);

  return (
    <tr
      className={`border-b ${
        //@ts-ignore

        userData?.user?._id === item.user && isAdmin ? "bg-themePrimary/5" : ""
      } w-full border-gray align-top last-of-type:border-none`}
    >
      <td className="text-themeDark text-base pl-6 py-4 align-middle">
        <div className="flex gap-4 items-center">
          <div>
            <ImageOpt
              width={100}
              height={100}
              className="rounded-lg"
              src={
                item?.displayImage
                  ? item.displayImage
                  : "/assets/img/avatar.png"
              }
            />
          </div>
          <div>
            <p className="text-lg2 text-themeDark font-bold">
              {item.eventName}
            </p>
          </div>
        </div>
      </td>
      <td className="text-themeDark text-base  px-3 py-4 align-middle">
        <div className="text-left flex gap-3">
          <span className="inline-grid gap-3">
            {item.status.isPublished ? (
              <span className="bg-green-500 text-white px-3 py-0.5 rounded shadow-sm text-center text-xs">
                Enabled
              </span>
            ) : (
              <span className="bg-red-400 text-white px-3 py-0.5 rounded shadow-sm text-center text-xs">
                Disable
              </span>
            )}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 align-middle">
        <span className="text-themeDark whitespace-nowrap bg-themePrimary/20 rounded-lg font-semibold px-3 py-1 text-sm">
          {date}
        </span>
      </td>
      <td className="w-48 text-themeDark text-base pl-3 pr-6 py-4 align-middle whitespace-nowrap">
        <div>
          <button
            className={`flex ${
              isOpen ? "mb-2" : ""
            } items-center transition-all duration-300 ease-in-out gap-2 cursor-pointer`}
            onClick={toggle}
          >
            <span className="w-9 h-9 bg-[#1caf5721] flex items-center justify-center rounded-lg">
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
            className={`grid duration-300 ease-in-out ${
              isOpen
                ? "opacity-100 h-full gap-2 visible"
                : "opacity-0 h-0 invisible"
            }`}
          >
            {/* Edit */}
            <Link
              legacyBehavior
              href={`/event/edit-event?active_id=${item._id}`}
            >
              <a className="flex items-center gap-2 text-themeDarker hover:text-themePrimary transition-all duration-300 ease-in-out group">
                <span className="w-9 h-9 bg-[#1caf5721] flex items-center justify-center rounded-lg">
                  <AiOutlineEdit className="w-6 h-6 text-themeDarker group-hover:text-themePrimary transition-all duration-300 ease-in-out" />
                </span>
                <span>Edit</span>
              </a>
            </Link>

            {
              //@ts-ignore

              userData?.user?._id === item.user && (
                <div>
                  {item.status.isPublished ? (
                    <div
                      className="flex items-center group cursor-pointer hover:text-red-500 gap-2"
                      onClick={() => disableJob(item._id)}
                    >
                      <span className="w-9 h-9 bg-[#1caf5721] flex items-center justify-center rounded-lg">
                        <RiEyeOffLine className="w-6 h-6 text-themeDark group-hover:text-red-500" />
                      </span>
                      <span>Disable</span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center group cursor-pointer hover:text-themePrimary gap-2"
                      onClick={() => enableJob(item._id)}
                    >
                      <span className="w-9 h-9 bg-[#1caf5721] flex items-center justify-center rounded-lg">
                        <AiOutlineEye className="w-6 h-6 text-themeDark group-hover:text-themePrimary" />
                      </span>
                      <span>Enabled</span>
                    </div>
                  )}
                </div>
              )
            }
            {/* Approved */}

            {/* Delete */}
            <div
              className="flex items-center gap-2 cursor-pointer group text-themeDarker hover:text-red-400 transition-all duration-300 ease-in-out"
              onClick={() => deleteCategory(item._id)}
            >
              <span className="w-9 h-9 bg-[#1caf5721] flex items-center justify-center rounded-lg">
                <CgTrash className="w-6 h-6 text-themeDarker group-hover:text-red-400 transition-all duration-300 ease-in-out" />
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
  deleteCategory,
  approveCompany,
  rejectedCompany,
  enableJob,
  disableJob,
}: any) => {
  const { data: userData } = useSession();
  //@ts-ignore
  const isAdmin = userData?.user?.role.isAdmin;
  const DateFormate = new Date(item.updatedAt);
  const date = DateFormate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
        <span className="text-themeDark bg-themePrimary/20 rounded-lg font-semibold px-3 py-1 text-sm">
          {date}
        </span>
        <div className="flex gap-2 items-center">
          {item.status.isPublished ? (
            <span className="bg-green-500 text-white px-3 py-0.5 rounded shadow-sm text-center text-sm">
              Enable
            </span>
          ) : (
            <span className="bg-red-400 text-white px-3 py-0.5 rounded shadow-sm text-center text-sm">
              Disable
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap  gap-4">
        <div className="mt-3">
          <ImageOpt
            width={100}
            height={100}
            alt="img"
            className="rounded-lg"
            src={item?.displayImage ?? "/assets/img/avatar.png"}
          />
        </div>
        <div>
          <p className="text-lg2 text-themeDark font-bold">
            {item.companyName}
          </p>
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-3">
            {/* Edit */}
            <div className="flex items-center gap-2">
              <Link
                legacyBehavior
                href={`/event/edit-event?active_id=${item._id}`}
              >
                <a className="bg-themePrimary/20 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
                  <AiOutlineEdit className="text-xxs text-themeDarker transition-all duration-300 ease-in-out" />
                  <span className="text-themeDarker text-sm">Edit</span>
                </a>
              </Link>
            </div>
            {/* Disable */}
            {
              //@ts-ignore

              userData?.user?._id === item.user && (
                <div className="flex items-center gap-2">
                  {item.status.isPublished ? (
                    <div
                      className="bg-indigo-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg"
                      onClick={() => disableJob(item._id)}
                    >
                      <RiEyeOffLine className="text-xxs text-themeDarker" />
                      <span className="text-themeDarker text-sm">Disable</span>
                    </div>
                  ) : (
                    <div
                      className="bg-indigo-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg"
                      onClick={() => enableJob(item._id)}
                    >
                      <AiOutlineEye className="text-xxs text-themeDarker" />
                      <span className="text-themeDarker text-sm">Enable</span>
                    </div>
                  )}
                </div>
              )
            }
            {/* Approved */}

            {/* Delete */}
            <div className="flex items-center gap-2">
              <div
                className="bg-red-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center cursor-pointer rounded-lg"
                onClick={() => deleteCategory(item._id)}
              >
                <CgTrash className="text-xxs text-themeDarker" />
                <span className="text-themeDarker text-sm">Delete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEvents;

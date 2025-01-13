"use client"
import _ from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import { HiChevronDown } from "react-icons/hi";
import { RiCheckboxCircleLine, RiEyeOffLine } from "react-icons/ri";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import useSWR, { useSWRConfig } from "swr";
import { LoaderGrowing } from "../../lib/loader";
import { authAxios } from "../../utils/axiosKits";
import Pagination from "../pagination";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const JobAlertsInfo = () => {
  const { data, error } = useSWR("/jobs/alerts/retrives", fetcher);
  const [loading, setLoading] = React.useState(false);
  const { data: userData } = useSession() as any;
  const isAdmin = userData?.user?.role.isAdmin;
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();

  // [x] delete category function here
  const deleteJobAlert = (id: any) => {
    setLoading(true);
    sweetAlert({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      buttons: true as any,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        try {
          authAxios({
            method: "DELETE",
            url: `/jobs/alerts/alert/${id}`,
          }).then((res) => {
            return mutate("/jobs/alerts/retrives").then(() => {
              addToast(res.data.message, {
                appearance: "success",
                autoDismiss: true,
              });
              setLoading(false);
            }, 1000 as any);
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
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  };

  // [x] delete category function here
  const sendEmail = (id: any) => {
    setLoading(true);
    sweetAlert({
      title: "Are you sure?",
      text: "You want to send email?",
      icon: "warning",
      buttons: true as any,
    }).then((willDelete) => {
      if (willDelete) {
        try {
          authAxios({
            method: "GET",
            url: `/user/alert/job/email/${id}`,
          }).then((res) => {
            addToast(res.data.message, {
              appearance: "success",
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

  // [x] enable job function start
  const enableJob = async (id: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "PATCH",
        url: `/jobs/alerts/alert/${id}`,
        data: {
          active: true,
        },
      }).then((res) => {
        return mutate(`/jobs/alerts/retrives`).then(() => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setLoading(false);
        }, 1000 as any);
      });
    } catch (error: any) {
      if (error?.response) {
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
      setLoading(false);
    }
  };

  // [x] disable job function start
  const disableJob = async (id: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "PATCH",
        url: `/jobs/alerts/alert/${id}`,
        data: {
          active: false,
        },
      }).then((res) => {
        return mutate(`/jobs/alerts/retrives`).then(() => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setLoading(false);
        }, 1000 as any);
      });
    } catch (error: any) {
      if (error.response.data.message) {
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
      setLoading(false);
    }
  };

  // get current pages
  const [currentPage, setCurrentPage] = React.useState(1);
  const [ShowPerPage, setShowPerPage] = React.useState(10);
  const indexOfLastPost = currentPage * ShowPerPage;
  const indexOfFirstPost = indexOfLastPost - ShowPerPage;
  const currentAlerts = data
    ? data?.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const handlePageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };
  return (
    <section className="mb-6">
      {/* button here */}

      <div className="pb-6 text-right">
        <button className="!py-3 px-8 bg-themePrimary rounded-lg shadow-themePrimary">
          <Link href="/job/add-new-alert" legacyBehavior>
            <a className="text-white font-medium text-xxs">Add New Alert</a>
          </Link>
        </button>
      </div>

      {/* table start here */}
      {/* table data for desktop */}
      <div className="shadow-lg bg-white rounded-lg mb-10 overflow-x-auto overflow-y-hidden hidden md:block relative">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Alert Name
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Keywords
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Categories
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Tags
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Location
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Frequency
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Status
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark rounded-tr-lg rounded-br-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td
                  className="text-center whitespace-nowrap rounded-tr-lg rounded-br-lg px-4 py-6 leading-9 text-lg2 font-medium text-themeLight"
                  colSpan={"8" as any}
                >
                  <p className="text-center text-red-400">
                    Something went wrong. Please try again later.
                  </p>
                </td>
              </tr>
            )}
            {loading && <LoaderGrowing />}
            {!data && (
              <div className="w-full h-80">
                <LoaderGrowing />
              </div>
            )}
            {data &&
              !error &&
              (data.length > 0 ? (
                <>
                  {_.map(currentAlerts, (item, index) => (
                    <TableItem
                      key={index}
                      item={item}
                      deleteJobAlert={deleteJobAlert}
                      sendEmail={sendEmail}
                      disableJob={disableJob}
                      enableJob={enableJob}
                    />
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    className="text-center whitespace-nowrap rounded-tr-lg rounded-br-lg px-4 py-6 leading-9 text-lg2 font-medium text-themeLight"
                    colSpan={"8" as any}
                  >
                    No data found ☹️
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* table data for mobile */}
      <div className="block md:hidden">
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
        {!data && (
          <div className="w-full lg:w-2/4 mx-auto h-40 bg-white shadow rounded-lg flex justify-center items-center relative">
            <div className="text-center">
              <LoaderGrowing />
            </div>
          </div>
        )}
        {data && data.length > 0 ? (
          <>
            {_.map(currentAlerts, (item, index) => (
              <div
                key={index}
                className={`p-4 mb-4 shadow rounded-lg relative ${
                  userData?.user?._id === item.user && isAdmin
                    ? "bg-themePrimary/5"
                    : "bg-white"
                }`}
              >
                {loading && <LoaderGrowing />}
                <MobileTable
                  item={item}
                  deleteJobAlert={deleteJobAlert}
                  sendEmail={sendEmail}
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
        )}
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
  deleteJobAlert,
  sendEmail,
  enableJob,
  disableJob,
}: {
  item: any;
  deleteJobAlert: any;
  sendEmail: any;
  enableJob: any;
  disableJob: any;
}) => {
  const { data: userData } = useSession() as any;
  const isAdmin = userData?.user?.role.isAdmin;
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <tr
      className={`border-b ${
        userData?.user?._id === item.user && isAdmin ? "bg-themePrimary/5" : ""
      } border-gray w-full align-top last-of-type:border-none`}
    >
      <td className="text-themeDark text-base  pl-6 py-4 align-middle">
        {item.name}
      </td>
      <td className="text-themeDark text-base  px-3 py-4 align-middle">
        {item.keyword}
      </td>
      <td className="text-themeDark text-base px-3 py-4 align-middle">
        {item.category}
      </td>
      <td className="text-themeDark text-base  px-3 py-4 align-middle">
        {item.tags.join(",")}
      </td>
      <td className="text-themeDark text-base px-3 py-4 align-middle">
        {item.region}
      </td>
      <td className="text-themeDark text-base  px-4 py-4 align-middle">
        {item.emailFrequency}
      </td>
      <td className="text-base  px-3 py-4 align-middle">
        {item.active ? (
          <span className="text-green-400">Enabled</span>
        ) : (
          <span className="text-red-400">Disable</span>
        )}
      </td>
      <td className="text-themeDark text-base pl-3 py-4 align-middle   whitespace-nowrap">
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
            className={`grid duration-300 ease-in-out ${
              isOpen
                ? "opacity-100 h-full gap-2 visible"
                : "opacity-0 h-0 invisible"
            }`}
          >
            {/* Email hidden */}
            {/* <div
              className="flex items-center  cursor-pointer gap-2 text-themeDarker hover:text-themePrimary transition-all duration-300 ease-in-out group"
              onClick={() => sendEmail(item._id)}
            >
              <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                <AiOutlineMail className="w-6 h-6 text-themeDarker group-hover:text-themePrimary transition-all duration-300 ease-in-out" />
              </span>
              <span>Email</span>
            </div> */}
            {/* Edit */}
            <Link legacyBehavior href={`/job/edit-job-alert?active_id=${item._id}`}>
              <a className="flex items-center gap-2 text-themeDarker hover:text-themePrimary transition-all duration-300 ease-in-out group">
                <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                  <AiOutlineEdit className="w-6 h-6 text-themeDarker group-hover:text-themePrimary transition-all duration-300 ease-in-out" />
                </span>
                <span>Edit</span>
              </a>
            </Link>
            {/* Disable */}
            {userData?.user?._id === item.user && (
              <div>
                {item.active ? (
                  <div
                    className="flex items-center group cursor-pointer hover:text-red-500 gap-2"
                    onClick={() => disableJob(item._id)}
                  >
                    <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                      <RiEyeOffLine className="w-6 h-6 text-themeDark group-hover:text-red-500" />
                    </span>
                    <span>Disable</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center group cursor-pointer hover:text-themePrimary gap-2"
                    onClick={() => enableJob(item._id)}
                  >
                    <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                      <AiOutlineEye className="w-6 h-6 text-themeDark group-hover:text-themePrimary" />
                    </span>
                    <span>Enabled</span>
                  </div>
                )}
              </div>
            )}
            {/* Delete */}
            <div
              className="flex items-center gap-2 cursor-pointer group text-themeDarker hover:text-red-400 transition-all duration-300 ease-in-out"
              onClick={() => deleteJobAlert(item._id)}
            >
              <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
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
  deleteJobAlert,
  sendEmail,
  enableJob,
  disableJob,
}: {
  item: any;
  deleteJobAlert: any;
  sendEmail: any;
  enableJob: any;
  disableJob: any;
}) => {
  const { data: userData } = useSession() as any;
  const isAdmin = userData?.user?.role.isAdmin;
  return (
    <div className="relative">
      <div className="flex flex-wrap justify-between mb-3">
        {item.active ? (
          <div className="bg-themePrimary/20 text-themeDark text-xss rounded-lg px-3 py-1.5 inline-block">
            Enabled
          </div>
        ) : (
          <div className="bg-red-400 text-white text-xss rounded-lg px-3 py-1.5 inline-block">
            Disabled
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">{item.name}</h3>
      <div className="text-themeDark text-xss1">
        <strong>Keyword:</strong> {item.keyword}
      </div>
      <div className="text-themeDark text-xss1">
        <strong>Categories:</strong> {item.category}
      </div>
      <div className="text-themeDark text-xss1">
        <strong>Tags:</strong> {item.tags.join(",")}
      </div>
      <div className="text-themeDark text-xss1 mb-4">
        <strong>Location:</strong> {item.region}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-3">
        {/* Email hidden */}
        {/* <div
          className="flex items-center gap-2"
          onClick={() => sendEmail(item._id)}
        >
          <div className="bg-orange-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
            <AiOutlineMail className="text-xxs text-themeDarker" />
            <span className="text-themeDarker text-sm">Email</span>
          </div>
        </div> */}
        {/* Edit */}
        <div className="flex items-center gap-2">
          <Link legacyBehavior href={`/job/edit-job-alert?active_id=${item._id}`}>
            <a className="bg-themePrimary/20 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
              <AiOutlineEdit className="text-xxs text-themeDarker" />
              <span className="text-themeDarker text-sm">Edit</span>
            </a>
          </Link>
        </div>
        {/* Disable */}
        {

        userData?.user?._id === item.user && (
          <div className="flex items-center gap-2">
            {item.active ? (
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
        )}
        {/* Delete */}
        <div
          className="flex items-center gap-2"
          // onClick={() => deleteJob(item._id) as any}
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

export default JobAlertsInfo;

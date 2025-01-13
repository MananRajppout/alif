"use client"
import _ from "lodash";
import { useParams } from "next/navigation";
import React from "react";
import { FiFile } from "react-icons/fi";
import { useToasts } from "@/src/components/toast/toast";
import useSWR, { useSWRConfig } from "swr";
import { LoaderGrowing } from "../../lib/loader";
import PopupModule from "../../lib/popup-modal";
import { authAxios } from "../../utils/axiosKits";
import Pagination from "../pagination";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const ApplicationsByJob = () => {
  const params = useParams();
  const id = params.id;
  const { data: applicationData, error } = useSWR(
    id ? `/jobs/apply/job/${id}` : null,
    fetcher
  );
  const data = applicationData?.applications;
  const [loading, setLoading] = React.useState(false);
  // get current pages
  const [currentPage, setCurrentPage] = React.useState(1);
  const [ShowPerPage, setShowPerPage] = React.useState(10);
  const indexOfLastPost = currentPage * ShowPerPage;
  const indexOfFirstPost = indexOfLastPost - ShowPerPage;
  const currentPosts = data
    ? data?.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const handlePageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <section className="mb-6">
      {/* table start here */}
      {/* table data for desktop */}
      <div className="shadow-lg bg-white rounded-lg mb-10 overflow-x-auto overflow-y-hidden hidden md:block relative">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Job Title
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Cover Letter
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                CV
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                Email
              </th>
              <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium w-40">
                Status
              </th>
            </tr>
          </thead>
          {!data && !error && (
            <div className="w-full h-80">
              <LoaderGrowing />
            </div>
          )}
          {loading && <LoaderGrowing />}
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
            {data &&
              !error &&
              (data.length > 0 ? (
                <>
                  {_.map(currentPosts, (item, index) => (
                    <TableItem
                      key={index}
                      item={item}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    className="text-center whitespace-nowrap rounded-tr-lg rounded-br-lg px-4 py-6 leading-9 text-lg2 font-medium text-themeLight"
                    colSpan={"5" as any}
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
                  className={`p-4 mb-4 shadow rounded-lg relative bg-white`}
                >
                  <MobileTable
                    item={item}
                    loading={loading}
                    setLoading={setLoading}
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
  loading,
  setLoading,
}: {
  item: any;
  loading: any;
  setLoading: any;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { addToast } = useToasts();
  const { mutate } = useSWRConfig();

  const updateApplicationStatus = async (status: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "PUT",
        url: `/jobs/apply/job/${item._id}`,
        data: status,
      }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          mutate(`/jobs/apply/job/${item.jobItem}`).then(() => {
            setLoading(false);
          });
        }
      });
    } catch (error: any) {
      if (error?.response?.data?.message) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      } else {
        addToast(error?.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      }
    }
  };

  return (
    <>
      <tr
        className={`border-b w-full border-gray align-top last-of-type:border-none`}
      >
        <td className="text-themeDark text-base pl-6 py-4 align-middle">
          {/* <Link href={item?.user ? `/resume/${item?.user}` : "#"}> */}
          <p className="text-lg2 text-themeDark  transition-all duration-200 ease-in-out font-bold">
            {item?.fullName}
          </p>
          {/* </Link> */}
        </td>
        <td className="text-themeDark text-base pl-6 py-4 align-middle">
          {item?.coverLetter && (
            <div>
              <button
                onClick={toggle}
                className="text-themeDark whitespace-nowrap !mt-2 inline-block hover:text-white hover:bg-themePrimary transition-all duration-300 ease-in-out bg-themePrimary/10 rounded text-sm !px-4 !py-1"
              >
                Read Cover Letter
              </button>
            </div>
          )}
        </td>
        <td className="text-themeDark text-base pl-6 py-4 align-middle">
          {item?.cvFile && (
            <div>
              <a
                href={item?.cvFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-themeDark whitespace-nowrap !mt-2 inline-block hover:text-white hover:bg-themePrimary transition-all duration-300 ease-in-out bg-themePrimary/10 rounded text-sm !px-4 !py-1"
              >
                View CV
              </a>
            </div>
          )}
        </td>
        <td className="text-themeDark text-base pl-6 py-4 align-middle">
          <p className="text-base text-themeDark">{item?.email}</p>
        </td>
        <td className="text-themeDark text-base  px-3 py-4 align-middle">
          <select
            className={`border !border-themePrimary cursor-pointer ${
              item?.status === "Selected" ? "!bg-themePrimary !text-white" : ""
            } focus:outline-none text-themePrimary bg-transparent flex justify-between items-center gap-2 !px-3 py-2 rounded text-center text-xs`}
            onChange={(e) => {
              const { value } = e.target;
              const data = {
                status: value,
              };
              updateApplicationStatus(data);
            }}
          >
            <option selected={item?.status === "Pending"} value="Pending">
              In Progress
            </option>
            <option selected={item?.status === "Selected"} value="Selected">
              Selected
            </option>
            <option selected={item?.status === "Rejected"} value="Rejected">
              Rejected
            </option>
            <option selected={item?.status === "Interview"} value="Interview">
              Interview
            </option>
            <option
              selected={item?.status === "Shortlisted"}
              value="Shortlisted"
            >
              Shortlisted
            </option>
          </select>
        </td>
      </tr>
      <PopupModule
        PopupTitle={"Cover Latter"}
        Popup={isOpen}
        PopupHandler={toggle}
      >
        <p className="text-base text-themeLight">{item?.coverLetter}</p>
      </PopupModule>
    </>
  );
};

const MobileTable = ({
  item,
  loading,
  setLoading,
}: {
  item: any;
  loading: any;
  setLoading: any;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  function ApplicationStatus() {
    switch (item?.status) {
      case "Selected":
        return (
          <span className="border !border-themePrimary text-white bg-themePrimary !px-3 py-1 rounded text-center text-xs">
            Selected
          </span>
        );

      case "Rejected":
        return (
          <span className="border !border-red-400 text-wite bg-red-400 !px-3 py-1 rounded text-center text-xs">
            Rejected
          </span>
        );

      case "Pending":
        return (
          <span className="border !border-themePrimary text-themePrimary bg-transparent !px-3 py-1 rounded text-center text-xs">
            In Progress
          </span>
        );

      case "Interview":
        return (
          <span className="border !border-themePrimary text-themePrimary bg-transparent !px-3 py-1 rounded text-center text-xs">
            Interview
          </span>
        );

      case "Shortlisted":
        return (
          <span className="border !border-themePrimary text-themePrimary bg-transparent !px-3 py-1 rounded text-center text-xs">
            Shortlisted
          </span>
        );

      default:
        return (
          <span className="border !border-themePrimary text-themePrimary bg-transparent !px-3 py-1 rounded text-center text-xs">
            In Progress
          </span>
        );
    }
  }

  return (
    <>
      <div className="relative">
        <div className="!mb-3">{ApplicationStatus()}</div>
        <div className="">
          <p className="text-lg2 text-themeDark font-bold">{item?.fullName}</p>
          <span className="text-themeDark">{item?.email}</span>
          <div>
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-3">
              {/* Disable */}
              {item?.coverLetter && (
                <div className="flex items-center gap-2">
                  <button
                    className="bg-themePrimary/20 shadow-sm flex gap-2 py-2 px-3 items-center justify-center cursor-pointer rounded-lg"
                    onClick={toggle}
                  >
                    <FiFile className="text-xxs text-themeDarker" />
                    <span className="text-themeDarker text-sm">
                      View Cover Latter
                    </span>
                  </button>
                </div>
              )}
              {/* View CV */}
              {item?.cvFile && (
                <div className="flex items-center gap-2">
                  <a
                    className="bg-themePrimary/20 shadow-sm flex gap-2 py-2 px-3 items-center justify-center cursor-pointer rounded-lg"
                    href={item?.cvFile}
                  >
                    <FiFile className="text-xxs text-themeDarker" />
                    <span className="text-themeDarker text-sm">View CV</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PopupModule
        PopupTitle={"Cover Latter"}
        Popup={isOpen}
        PopupHandler={toggle}
      >
        <p className="text-base text-themeLight">{item?.coverLetter}</p>
      </PopupModule>
    </>
  );
};

export default ApplicationsByJob;

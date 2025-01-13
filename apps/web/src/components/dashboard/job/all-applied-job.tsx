"use client"
import _ from "lodash";
import Link from "next/link";
import React from "react";
import { FiFile } from "react-icons/fi";
import useSWR from "swr";
import { LoaderGrowing } from "../../lib/loader";
import PopupModule from "../../lib/popup-modal";
import { authAxios } from "../../utils/axiosKits";
import Pagination from "../pagination";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const AllApplications = () => {
  const { data, error } = useSWR("jobs/apply/retrives", fetcher);

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
      <div className="shadow rounded-lg bg-white mb-10 overflow-x-auto overflow-y-hidden hidden md:block relative">
        {!data && !error && (
          <div className="relative min-h-40">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Company Name
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
                Check Your internat connection OR api response issue.
              </p>
            </div>
          </div>
        )}
        {data && !error && (
          <>
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
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium w-48">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  <>
                    {_.map(currentPosts, (item, index) => (
                      <TableItem key={index} item={item} />
                    ))}
                  </>
                ) : (
                  <tr>
                    {/* <td
											className="text-center whitespace-nowrap rounded-tr-lg rounded-br-lg px-4 py-6 leading-9 text-lg2 font-medium text-themeLight"
											colSpan="5">
											No data found ☹️
										</td> */}
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
                  className={`p-4 mb-4 shadow rounded-lg relative bg-white`}
                >
                  <MobileTable item={item} />
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

const TableItem = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <tr
        className={`border-b w-full border-gray align-top last-of-type:border-none`}
      >
        <td className="text-themeDark text-base pl-6 py-4 align-middle">
          <Link legacyBehavior
            href={item?.jobItem?.jobTitle ? `/job/${item?.jobItem?._id}` : "#"}
          >
            <a className="text-lg2 text-themeDark hover:text-themePrimary transition-all duration-200 ease-in-out font-bold">
              {item?.jobItem?.jobTitle}
            </a>
          </Link>
          <br />
          <span className="text-sm text-themeLight">
            Name: {item?.fullName}
          </span>
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
          <div className="text-left flex gap-3">
            <span className="inline-grid gap-3">
              <span className="border !border-themePrimary text-themePrimary bg-transparent !px-6 py-2 rounded text-center text-xs">
                Applied
              </span>
            </span>
          </div>
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

const MobileTable = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <>
      <div className="relative">
        <div className="!mb-3">
          <span className="border !border-themePrimary text-themePrimary bg-transparent !px-3 py-1 rounded text-center text-xs">
            Applied
          </span>
        </div>
        <div className="">
          <p className="text-lg2 text-themeDark font-bold">
            {item?.jobItem?.jobTitle}
          </p>
          <p className="text-themeDark">Name: {item?.fullName}</p>
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

export default AllApplications;

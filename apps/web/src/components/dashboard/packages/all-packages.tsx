"use client"
import _, { capitalize } from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import { HiChevronDown } from "react-icons/hi";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import useSWR, { useSWRConfig } from "swr";
import { LoaderGrowing } from "../../lib/loader";
import { authAxios } from "../../utils/axiosKits";
import Pagination from "../pagination";

const fetcher = (url: string) => authAxios(url).then((res) => res.data);

const AllPackages = () => {
  const { mutate } = useSWRConfig();
  const { data: packageData, error } = useSWR("/packages/retrives", fetcher);
  const data = packageData?.data;
  const [loading, setLoading] = React.useState(false);
  const { addToast } = useToasts();
  interface User {
    _id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: {
      isAdmin: boolean;
    } | null;
  }

  const { data: userData } = useSession() as unknown as { data: { user: User } };
  const isAdmin = userData?.user?.role?.isAdmin;

  // [x] delete category function here
  const deletePackage = (id: any) => {
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
          authAxios.delete(`/packages/package/${id}`).then((res) => {
            return mutate("/packages/retrives").then(() => {
              addToast(capitalize(res.data.message), {
                appearance: "success",
                autoDismiss: true,
              });
              setLoading(false);
            }, 1000 as any);
          });
        } catch (error: any) {
          addToast(error.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  };

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
        {!data && !error && (
          <div className="relative min-h-40">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Packages
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Package Type
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Packages Info
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
        {data && !error && (
          <>
            {loading && <LoaderGrowing />}
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Packages
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Packages Type
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Packages Info
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
                        deletePackage={deletePackage}
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
                  <MobileTable item={item} deletePackage={deletePackage} />
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
  deletePackage,
}: {
  item: any;
  deletePackage: any;
}) => {
  const { data: userData } = useSession();
  //@ts-ignore
  const isAdmin = userData?.user?.role?.isAdmin;
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
        // @ts-ignore
        userData?.user?._id === item.user && isAdmin ? "bg-themePrimary/5" : ""
      } w-full border-gray align-top last-of-type:border-none`}
    >
      <td className="text-themeDark text-base pl-6 py-4 align-middle">
        <p className="text-xxs text-themeDark font-semibold">
          {item.packageName}
        </p>
      </td>
      <td className="text-themeDark text-base  px-3 py-4 align-middle">
        <p className="text-sm text-themeDark">
          <span className="text-lg2 font-semibold">${item.pricing}</span>
          {"/ "}
          {item.frequency}
        </p>
      </td>
      <td className="px-3 py-4 align-middle">
        <ul>
          <li className="text-themeDark text-base">
            <span className="text-xs text-themeDark">Job Posting:</span>{" "}
            <span className="text-sm text-themePrimary">{item.totalJobs}</span>
          </li>
          <li className="text-themeDark text-base">
            <span className="text-xs text-themeDark">Featured Job:</span>{" "}
            <span className="text-sm text-themePrimary">
              {item.featuredJobs}
            </span>
          </li>
          <li className="text-themeDark text-base">
            <span className="text-xs text-themeDark">Job Displayed:</span>{" "}
            <span className="text-sm text-themePrimary">
              {item.validity}/days
            </span>
          </li>
          {_.map(item.services, (service, index) => (
            <li className="text-themeDark text-base" key={index}>
              <span className="text-xs text-themeDark">{service.name}:</span>{" "}
              <span className="text-sm text-themePrimary">
                {service.details}
              </span>
            </li>
          ))}
        </ul>
      </td>
      <td className="w-48 text-themeDark text-base pl-3 pr-6 py-4 align-middle whitespace-nowrap">
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
            {/* Edit */}
            <Link legacyBehavior href={`/packages/edit-package?active_id=${item._id}`} >
              <a className="flex items-center gap-2 text-themeDarker hover:text-themePrimary transition-all duration-300 ease-in-out group">
                <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                  <AiOutlineEdit className="w-6 h-6 text-themeDarker group-hover:text-themePrimary transition-all duration-300 ease-in-out" />
                </span>
                <span>Edit</span>
              </a>
            </Link>
            {/* Delete */}
            <div
              className="flex items-center gap-2 cursor-pointer group text-themeDarker hover:text-red-400 transition-all duration-300 ease-in-out"
              onClick={() => deletePackage(item._id)}
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
  deletePackage,
}: {
  item: any;
  deletePackage: any;
}) => {
  const DateFormate = new Date(item.updatedAt);
  const date = DateFormate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="relative">
      <div>
        <div className="flex flex-wrap gap-3 justify-between">
          <div>
            <p className="text-lg2 text-themeDark font-bold">
              {item.packageName}
            </p>
            <p className="text-sm text-themeDark !mt-2">
              <span className="text-themeLight font-medium">Type:</span>{" "}
              <span className="text-xxs font-semibold">${item.pricing}</span>/
              {item.frequency}
            </p>
          </div>
          <div>
            <p className="text-sm text-themeLight font-semibold">Services:</p>
            <ul>
              <li className="text-themeDark text-xs">
                <span className="text-xs text-themeDark">Job Posting:</span>{" "}
                <span className="text-sm text-themePrimary">
                  {item.totalJobs}
                </span>
              </li>
              <li className="text-themeDark text-xs">
                <span className="text-xs text-themeDark">Featured Job:</span>{" "}
                <span className="text-sm text-themePrimary">
                  {item.featuredJobs}
                </span>
              </li>
              <li className="text-themeDark text-xs">
                <span className="text-xs text-themeDark">Job Displayed:</span>{" "}
                <span className="text-sm text-themePrimary">
                  {item.validity}/days
                </span>
              </li>
              {_.map(item.services, (service, index) => (
                <li className="text-themeDark text-xs" key={index}>
                  <span className="text-xs text-themeDark">
                    {service.name}:
                  </span>{" "}
                  <span className="text-sm text-themePrimary">
                    {service.details}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-3">
          {/* Edit */}
          <div className="flex items-center gap-2">
            <Link legacyBehavior href={`/packages/edit-package?active_id=${item._id}`}>
              <a className="bg-themePrimary/20 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
                <AiOutlineEdit className="text-xxs text-themeDarker transition-all duration-300 ease-in-out" />
                <span className="text-themeDarker text-sm">Edit</span>
              </a>
            </Link>
          </div>
          {/* Delete */}
          <div className="flex items-center gap-2">
            <div
              className="bg-red-200 shadow-sm flex gap-2 py-2 px-3 items-center justify-center cursor-pointer rounded-lg"
              onClick={() => deletePackage(item._id)}
            >
              <CgTrash className="text-xxs text-themeDarker" />
              <span className="text-themeDarker text-sm">Delete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPackages;

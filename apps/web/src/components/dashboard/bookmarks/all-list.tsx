"use client";
import { ThemeContext } from "@/src/context/ThemeContext";
import _ from "lodash";
import Link from "next/link";
import React, { useContext } from "react";
import { BsFillBookmarkHeartFill } from "react-icons/bs";
import { CgTrash } from "react-icons/cg";
import { useToasts } from "../../toast/toast";
import sweetAlert from "sweetalert";
import { LoaderGrowing } from "../../lib/loader";
import { authAxios } from "../../utils/axiosKits";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const AllList = () => {
  const { addToast } = useToasts();
  const { bookmarkData, bookmarkError, bookmarkMutate } =
    useContext(ThemeContext);
  const [loading, setLoading] = React.useState(false);

  // delete bookmarks by id and update data
  function onRemove(id: any, itemID: any) {
    setLoading(true);
    sweetAlert({
      title: "Are you sure?",
      text: "You want to delete this bookmark?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    } as any).then((willDelete) => {
      if (willDelete) {
        try {
          authAxios({
            method: "DELETE",
            url: `/bookmarks/bookmark/${id}`,
          }).then((res) => {
            bookmarkMutate().then(() => {
              addToast(res.data.message, {
                appearance: "success",
                autoDismiss: true,
              });
              setLoading(false);
            });
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
  }

  return (
    <section className="mb-6 shadow-lg bg-white rounded-xl">
      <div className="h-16 bg-themeDark flex items-center px-10 rounded-lg">
        <p className="text-xxs text-white">All Bookmarks</p>
      </div>
      <div className="py-5 relative">
        {/* item 1 */}
        {/* {AllListMenu.map((resume, index) => ( */}
        {!bookmarkData && (
          <div className="h-80 flex justify-center items-center text-center">
            <LoaderGrowing />
          </div>
        )}
        {loading && <LoaderGrowing />}
        {bookmarkError && <div>Error</div>}
        {bookmarkData?.length === 0 && (
          <div className="h-80 flex justify-center items-center text-center">
            <h2 className="text-4xl font-semibold">
              No Bookmark Data Found ☹️
            </h2>
          </div>
        )}
        {bookmarkData && (
          <>
            {_.map(bookmarkData, (bookmark, index) => (
              <div
                className="flex gap-3 items-center justify-between py-3 px-5 md:px-8 border-b border-gray last-of-type:border-b-0 hover:bg-themeLighterAlt transition-all duration-300 ease-in-out group"
                key={index}
              >
                <Link
                  legacyBehavior
                  href={
                    bookmark.job
                      ? `/job/${bookmark.job?._id}`
                      : bookmark.company
                        ? `/company/${bookmark.company?._id}`
                        : bookmark.resume
                          ? `/resume/${bookmark.resume?._id}`
                          : `/bookmarks`
                  }
                  key={index}
                >
                  <a className="block w-full">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div>
                        <BsFillBookmarkHeartFill className="w-8 h-8 text-themePrimary" />
                      </div>
                      <div className="w-full">
                        <span className="text-xs text-themeLight">
                          {bookmark.createdAt}
                        </span>
                        {/* <span className="text-xs text-themeLight">1 hour ago</span> */}
                        <div className="text-base text-themeDarker flex gap-3 items-center justify-between w-full">
                          {bookmark.job && (
                            <div>
                              <Link
                                legacyBehavior
                                href={`/job/${bookmark.job?._id}`}
                              >
                                <a className="group-hover:text-themePrimary relative pr-2 line-clamp-1">
                                  {bookmark.job?.jobTitle}
                                </a>
                              </Link>
                              <p className="text-sm text-themeLighter line-clamp-1">
                                Note: {bookmark?.note}
                              </p>
                            </div>
                          )}
                          {bookmark.job === null && (
                            <div>
                              <p className="text-themeLighter relative pr-2">
                                Job removed
                                <span className="bg-themePrimary/20 text-themeDarker rounded shadow-sm text-xss !px-2 absolute left-full -top-1">
                                  Job
                                </span>
                              </p>
                              <p className="text-sm text-themeLighter line-clamp-1">
                                Note: {bookmark?.note}
                              </p>
                            </div>
                          )}
                          {bookmark.job && (
                            <span className="bg-themePrimary/20 text-themeDarker rounded shadow-sm text-xss !px-2">
                              Job
                            </span>
                          )}
                          {bookmark.company && (
                            <div>
                              <Link
                                legacyBehavior
                                href={`/company/${bookmark.company?._id}`}
                              >
                                <a className="group-hover:text-themePrimary relative pr-2 line-clamp-1">
                                  {bookmark.company?.companyName}{" "}
                                  <span className="bg-indigo-200 text-themeDarker rounded shadow-sm text-xss !px-2 absolute left-full -top-1">
                                    Company
                                  </span>
                                </a>
                              </Link>
                              <p className="text-sm text-themeLighter line-clamp-1">
                                Note: {bookmark?.note}
                              </p>
                            </div>
                          )}
                          {bookmark.company === null && (
                            <div>
                              <p className="text-themeLighter relative pr-2 line-clamp-1">
                                Company removed
                              </p>
                              <p className="text-sm text-themeLighter line-clamp-1">
                                Note: {bookmark?.note}
                              </p>
                            </div>
                          )}
                          {bookmark.company && (
                            <span className="bg-indigo-200 text-themeDarker rounded shadow-sm text-xss !px-2">
                              Company
                            </span>
                          )}
                          {bookmark.resume && (
                            <div>
                              <Link
                                legacyBehavior
                                href={`/resume/${bookmark.resume?._id}`}
                              >
                                <a className="group-hover:text-themePrimary relative pr-2 line-clamp-1">
                                  {bookmark.resume?.name}
                                </a>
                              </Link>
                              <p className="text-sm text-themeLighter line-clamp-1">
                                Note: {bookmark?.note}
                              </p>
                            </div>
                          )}
                          {bookmark.resume && (
                            <span className="bg-themeSecondary text-themeDarker rounded shadow-sm text-xss !px-2">
                              Resume
                            </span>
                          )}
                          {bookmark.resume === null && (
                            <div>
                              <p className="text-themeLighter relative pr-2">
                                Resume removed
                                <span className="bg-themeSecondary text-themeDarker rounded shadow-sm text-xss !px-2 absolute left-full -top-1">
                                  Resume
                                </span>
                              </p>
                              <p className="text-sm text-themeLighter line-clamp-1">
                                Note: {bookmark?.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
                <div className="flex-none flex justify-center items-center w-10">
                  <button
                    onClick={() =>
                      onRemove(
                        bookmark?.job?._id ||
                          bookmark?.resume?._id ||
                          bookmark?.company?._id,
                        bookmark?._id
                      )
                    }
                    className="cursor-pointer"
                  >
                    <CgTrash className="text-2xl text-themeLight hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default AllList;

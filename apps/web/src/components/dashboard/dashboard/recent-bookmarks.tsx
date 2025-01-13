"use client"
import { ThemeContext } from "@/src/context/ThemeContext";
import _ from "lodash";
import Link from "next/link";
import React from "react";
import { BsFillBookmarkHeartFill } from "react-icons/bs";

const ResumeBookmarks = () => {
  const { bookmarkData, bookmarkError } = React.useContext(ThemeContext);
  if (!bookmarkData) {
    return (
      <div>
        <div className="shadow-lg rounded-lg h-full bg-white relative overflow-hidden">
          <div className="px-5 md:px-10 pt-5 pb-3 border-b border-gray">
            <h2 className="text-lg2 font-semibold">Recent Bookmarks</h2>
          </div>
        </div>
      </div>
    );
  }

  // if error
  if (bookmarkError) {
    return <div>failed to load</div>;
  }

  // if data
  return (
    <div className="shadow-lg rounded-lg h-full bg-white relative overflow-hidden">
      <div className="px-5 md:px-10 pt-5 pb-3 border-b border-gray">
        <h2 className="text-lg2 font-semibold">Recent Bookmarks</h2>
      </div>
      <div className="pb-5">
        {bookmarkData && (
          <>
            {_.map(
              _.slice(bookmarkData, 0, 5),
              (bookmark: any, index: number) => (
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
                  <a className="block py-3 px-5 md:px-8  border-b border-gray last-of-type:border-b-0 hover:bg-themeLighterAlt cursor-pointer transition-all duration-300 ease-in-out w-full group">
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
                              <Link legacyBehavior href={`/job/${bookmark.job?._id}`}>
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
                              <Link legacyBehavior href={`/company/${bookmark.company?._id}`}>
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
                              <Link legacyBehavior href={`/resume/${bookmark.resume?._id}`}>
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
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeBookmarks;

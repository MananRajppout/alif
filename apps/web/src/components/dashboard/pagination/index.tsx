"use client"
import React from "react";
import ReactPaginate from "react-paginate";
import { ThemeContext } from "../../../context/ThemeContext";

const Pagination = ({
  totalCount,
  showPerPage,
  setShowPerPage,
  handlePageChange,
}: {
  totalCount: any;
  showPerPage: any;
  setShowPerPage: any;
  handlePageChange: any;
}) => {
  const { windowWidth } = React.useContext(ThemeContext) as any;
  const isMobile = windowWidth < 500;

  const pages = Math.ceil(totalCount / showPerPage);
  //Set number of pages
  const numberOfPages = [];
  for (let i = 1; i <= pages; i++) {
    numberOfPages.push(i);
  }
  return (
    <>
      {/* Pagination table */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-5 justify-center sm:justify-between">
          <div className="px-4 flex items-center lg:mb-0">
            <p className="text-xs text-gray-400" data-config-id="pag1">
              Show
            </p>
            <div className="mx-3 py-1 px-2 text-xs text-gray-500 bg-white border border-gray rounded">
              <select
                name="showPerPage"
                id="ShowPerPage"
                defaultValue={showPerPage}
                className="focus:outline-none text-center bg-transparent"
                onChange={(e) => {
                  setShowPerPage(e.target.value);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <p className="text-xs text-gray-400" data-config-id="pag2">
              of {totalCount ? totalCount : 0}
            </p>
          </div>
          {/* Pagination Button */}
          {totalCount > showPerPage && (
            <div>
              {/* @ts-ignore */}
              <ReactPaginate
                pageCount={numberOfPages ? numberOfPages.length : 10}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={(data) => {
                  window.scrollTo(0, 50);
                  handlePageChange(data);
                }}
                previousLabel={
                  <svg
                    width="6"
                    height="8"
                    viewBox="0 0 6 8"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    data-config-id="auto-svg-46-3"
                  >
                    <path
                      d="M2.53335 3.99999L4.86668 1.66666C5.13335 1.39999 5.13335 0.999992 4.86668 0.733325C4.60002 0.466659 4.20002 0.466659 3.93335 0.733325L1.13335 3.53333C0.866683 3.79999 0.866683 4.19999 1.13335 4.46666L3.93335 7.26666C4.06668 7.39999 4.20002 7.46666 4.40002 7.46666C4.60002 7.46666 4.73335 7.39999 4.86668 7.26666C5.13335 6.99999 5.13335 6.59999 4.86668 6.33333L2.53335 3.99999Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                }
                nextLabel={
                  <svg
                    width="6"
                    height="8"
                    viewBox="0 0 6 8"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    data-config-id="auto-svg-49-3"
                  >
                    <path
                      d="M4.88663 3.52667L2.05996 0.700006C1.99799 0.637521 1.92425 0.587925 1.84301 0.554079C1.76177 0.520233 1.67464 0.502808 1.58663 0.502808C1.49862 0.502808 1.41148 0.520233 1.33024 0.554079C1.249 0.587925 1.17527 0.637521 1.1133 0.700006C0.989128 0.824915 0.919434 0.993883 0.919434 1.17001C0.919434 1.34613 0.989128 1.5151 1.1133 1.64001L3.4733 4.00001L1.1133 6.36001C0.989128 6.48491 0.919434 6.65388 0.919434 6.83001C0.919434 7.00613 0.989128 7.1751 1.1133 7.30001C1.17559 7.36179 1.24947 7.41068 1.33069 7.44385C1.41192 7.47703 1.49889 7.49385 1.58663 7.49334C1.67437 7.49385 1.76134 7.47703 1.84257 7.44385C1.92379 7.41068 1.99767 7.36179 2.05996 7.30001L4.88663 4.47334C4.94911 4.41136 4.99871 4.33763 5.03256 4.25639C5.0664 4.17515 5.08383 4.08801 5.08383 4.00001C5.08383 3.912 5.0664 3.82486 5.03256 3.74362C4.99871 3.66238 4.94911 3.58865 4.88663 3.52667Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                }
                previousLinkClassName="inline-flex mr-1 items-center justify-center w-10 h-10 text-xs text-gray-500 border border-gray hover:!bg-themePrimary hover:text-white bg-white rounded-md"
                nextLinkClassName="inline-flex mr-1 items-center justify-center w-10 h-10 text-xs text-gray-500 border border-gray hover:!bg-themePrimary hover:text-white bg-white rounded-md"
                containerClassName="pagination w-full lg:w-auto flex items-center justify-center"
                pageLinkClassName="inline-flex mr-1 items-center justify-center w-10 h-10 text-xs text-gray-500 border border-gray hover:!bg-themePrimary hover:text-white bg-white rounded-md"
                breakLinkClassName="inline-flex mr-1 items-center justify-center w-10 h-10 text-xs text-gray-500 border border-gray hover:!bg-themePrimary hover:text-white bg-white rounded-md"
                activeLinkClassName="!bg-themePrimary text-white !border-themePrimary"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pagination;

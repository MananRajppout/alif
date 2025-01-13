const Pagination = ({
  totalCount,
  showPerPage,
  handlePageChange,
}: {
  totalCount: any;
  showPerPage: any;
  handlePageChange: any;
}) => {
  const pages = Math.ceil(totalCount / showPerPage);
  //Set number of pages
  const numberOfPages = [];
  for (let i = 1; i <= pages; i++) {
    numberOfPages.push(i);
  }

  return (
    <div className="mx-auto px-4 mt-10">
      {/* <ReactPaginate
        pageCount={numberOfPages.length}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={(data) => {
          window.scrollTo(0, 250);
          handlePageChange(data);
        }}
        previousLabel={
          <span className="flex justify-center items-center mr-4">
            <Image
              width={20}
              height={20}
              noPlaceholder
              src="/assets/img/arrow-left-circle1.svg"
              alt="previous icon"
            />
          </span>
        }
        nextLabel={
          <span className="flex justify-center items-center ml-4">
            <Image
              width={20}
              height={20}
              noPlaceholder
              src="/assets/img/arrow-left-circle.svg"
              alt="next icon"
            />
          </span>
        }
        onPageActive={(data) => {
          window.scrollTo(0, 250);
          handlePageChange(data);
        }}
        containerClassName={`flex flex-row flex-nowrap justify-between md:justify-center items-center`}
        pageLinkClassName={`flex w-10 h-10 mx-1 text-xs justify-center items-center rounded-md bg-white text-deep hover:!bg-themePrimary hover:text-white`}
        breakLinkClassName={`flex w-10 h-10 mx-1 text-xs justify-center items-center rounded-md bg-white text-deep hover:!bg-themePrimary hover:text-white`}
        activeLinkClassName={`flex w-10 h-10 mx-1 text-xs justify-center items-center rounded-md !bg-themePrimary text-white`}
      /> */}
    </div>
  );
};

export default Pagination;

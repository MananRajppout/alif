"use client"
import _, { capitalize } from "lodash";
import Link from "next/link";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import { HiChevronDown } from "react-icons/hi";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import { useSWRConfig } from "swr";
import { ThemeContext } from "../../../context/ThemeContext";
import { LoaderGrowing } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";
import Pagination from "../pagination";

const CategoryInfo = () => {
  const { categoryData, categoryError, categoryMutate } = React.useContext(
    ThemeContext
  ) as any;
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = React.useState(false);
  const { addToast } = useToasts();

  // get current pages
  const [currentPage, setCurrentPage] = React.useState(1);
  const [ShowPerPage, setShowPerPage] = React.useState(10);
  const indexOfLastPost = currentPage * ShowPerPage;
  const indexOfFirstPost = indexOfLastPost - ShowPerPage;
  const currentPosts = categoryData
    ? categoryData?.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const handlePageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  if (categoryError) return <div>failed to load</div>;
  if (!categoryData) return <div>loading...</div>;

  // [x] delete category function here
  const deleteCategory = (id: any) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category!",
      icon: "warning",
      buttons: true as any,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          authAxios
            .delete(`/admin/categories/category/${id}`)
            .then((res) => {
              categoryMutate().then(() => {
                addToast(res.data.message, {
                  appearance: "success",
                  autoDismiss: true,
                });
                setLoading(false);
              });
            })
            .catch((err: any) => {
              addToast(capitalize(err.response.data.message), {
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

  return (
    <section className="mb-6">
      {/* button here */}

      <div className="pb-6 text-right">
        <button className="py-3 px-8 bg-themePrimary rounded-lg shadow-themePrimary">
          <Link legacyBehavior href="/job/add-category">
            <a className="text-white font-medium text-xxs">Add New Category</a>
          </Link>
        </button>
      </div>

      {/*end  button here */}
      {!categoryData && !categoryData && (
        <div className="text-center">
          <div className="spinner-border text-themePrimary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {categoryError && (
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
      {categoryData && (
        <>
          {/* table start here */}
          {/* table data for desktop */}
          <div
            className={`shadow-lg bg-white rounded-lg mb-10 overflow-x-auto overflow-y-hidden hidden md:block relative`}
          >
            {/* loader on data mutate */}
            {loading && <LoaderGrowing />}
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left whitespace-nowrap bg-themeDark rounded-tl-lg rounded-bl-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Category
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Sub Category
                  </th>
                  <th className="text-left whitespace-nowrap bg-themeDark rounded-tr-lg rounded-br-lg px-4 py-3.5 leading-9 text-white text-xxs font-medium">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryData.length > 0 ? (
                  <>
                    {_.map(currentPosts, (item, index) => (
                      <TableItem
                        key={index}
                        item={item}
                        deleteCategory={deleteCategory}
                      />
                    ))}
                  </>
                ) : (
                  <tr>
                    <td
                      className="text-center whitespace-nowrap rounded-tr-lg rounded-br-lg px-4 py-6 leading-9 text-lg2 font-medium text-themeLight"
                      colSpan={"3" as any}
                    >
                      No data found ☹️
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* table data for mobile */}
          <div className="block md:hidden">
            {categoryData.length > 0 ? (
              <>
                {_.map(currentPosts, (item, index) => (
                  <div
                    key={index}
                    className="p-4 mb-4 shadow rounded-lg bg-white"
                  >
                    <MobileTable item={item} deleteCategory={deleteCategory} />
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

          <div>
            <Pagination
              setShowPerPage={setShowPerPage}
              totalCount={categoryData?.length}
              showPerPage={ShowPerPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </>
      )}
      {/* end table start here */}
    </section>
  );
};

const TableItem = ({
  item,
  deleteCategory,
}: {
  item: any;
  deleteCategory: any;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <tr className="border-b border-gray w-full align-top last-of-type:border-none">
      <td className="text-themeDark text-base  pl-6 py-3 align-middle">
        <div className="flex gap-3 items-center">
          <ImageOpt
            src={item?.avatar ? item.avatar : "/assets/img/avatar.png"}
            width={60}
            height={60}
            alt="img"
            className="rounded-lg"
          />
          <span>{item.categoryTitle}</span>
        </div>
      </td>
      <td className="text-themeDark text-base  px-3 py-3 align-middle">
        {_.toString(item.subCategory)}
      </td>
      <td className="w-56 text-themeDark text-base pl-3 pr-6 py-3 align-middle   whitespace-nowrap">
        <div>
          <button
            className={`flex ${
              isOpen ? "mb-2" : ""
            } items-center gap-2 cursor-pointer`}
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
            <Link legacyBehavior href={`/job/edit-category?active_id=${item._id}`}>
              <a className="flex items-center group cursor-pointer gap-2 text-themeDark hover:text-themePrimary">
                <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                  <AiOutlineEdit className="w-6 h-6 text-themeDark group-hover:text-themePrimary" />
                </span>
                <span>Edit</span>
              </a>
            </Link>
            {/* Delete */}
            <div
              className="flex items-center group cursor-pointer hover:text-red-500 gap-2"
              onClick={() => deleteCategory(item._id)}
            >
              <span className="w-9 h-9 bg-themePrimary/20 flex items-center justify-center rounded-lg">
                <CgTrash className="w-6 h-6 text-themeDark group-hover:text-red-500" />
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
}: {
  item: any;
  deleteCategory: any;
}) => {
  return (
    <div className="relative">
      <div className="flex gap-4 items-center">
        <div>
          <ImageOpt
            src={item?.avatar ? item.avatar : "/assets/img/avatar.png"}
            width={60}
            height={60}
            alt="img"
            className="rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-lg2 font-medium mb-2">{item.categoryTitle}</h3>
          <div className="text-themeDark text-xss1">
            <span className="font-semibold">Sub Category:</span> “Restaurant
            Dishwasher”
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        {/* Edit */}
        <div className="flex items-center group cursor-pointer gap-2">
          <Link legacyBehavior href={`/job/edit-category?active_id=${item._id}`}>
            <a className="bg-themePrimary/20 shadow-sm flex gap-2 py-2 px-3 items-center justify-center rounded-lg">
              <AiOutlineEdit className="text-xs text-themeDarker" />
              <span className="text-themeDarker text-xss1">Edit</span>
            </a>
          </Link>
        </div>
        {/* Delete */}
        <div className="flex items-center gap-2">
          <div
            className="bg-red-200 shadow-sm flex gap-2 py-2 px-3 items-center cursor-pointer justify-center rounded-lg"
            onClick={() => deleteCategory(item._id)}
          >
            <CgTrash className="text-xs text-themeDarker" />
            <span className="text-themeDarker text-xss1">Delete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryInfo;

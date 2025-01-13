"use client"
import _ from "lodash";
import { useSession } from "next-auth/react";
import React from "react";
import { RiSearchLine } from "react-icons/ri";
import useSWR from "swr";
import { LoaderGrowing } from "../../lib/loader";
import Image from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";
import MessageBox from "./message-box";

// call data fetch using swr and fetcher
const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const MessagesInfo = () => {
  const { data: sessionData } = useSession();
  const userData = sessionData?.user as {
    user: any; _id: string; name?: string | null; email?: string | null; image?: string | null 
};
  const { data, error } = useSWR("/messages/retrives", fetcher, {
    refreshInterval: 3000,
  });

  const [activeItem, setActiveItem] = React.useState(null) as any;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [filterUsers, setFilterUsers] = React.useState([]);

  const returnMessage = (id: any) => {
    if (data) {
      const ChooseMessage = _.filter(data, (item) => {
        return item._id === id;
      });
      setActiveItem(ChooseMessage[0]);
    }
  };

  React.useEffect(() => {
    if (data) {
      setActiveItem(data[activeIndex]);
      setFilterUsers(data);
    }
  }, [data, activeIndex]);

  const searchHandler = (value: any) => {
    const filtered = _.filter(data, (item) => {
      const values =
        item?.members?.candidate?.fullName?.firstName +
        " " +
        item?.members?.candidate?.fullName?.lastName +
        " " +
        item?.members?.employer?.fullName?.firstName +
        " " +
        item?.members?.employer?.fullName?.lastName +
        " " +
        item?.job?.jobTitle;
      return values.toLowerCase().includes(value.toLowerCase());
    }) as any;

    if (value === "") {
      setFilterUsers(data);
    } else {
      // update filter message data
      setFilterUsers(filtered as any);
    }
  };

  return (
    <section className="mb-6">
      <div className="justify-center grid grid-cols-12 gap-10">
        <div className="mb-4 col-span-12 md:col-span-7 lg:col-span-8">
          <div className="bg-white rounded-lg shadow-lg h-full p-6 pb-2 relative">
            {!data && (
              <div className="h- flex justify-center items-center text-center">
                <LoaderGrowing />
              </div>
            )}
            {error && (
              <div className="h-80 flex justify-center items-center text-center text-lg2">
                <div>{error?.message}</div>
              </div>
            )}
            {data && !error && <MessageBox data={activeItem} />}
          </div>
        </div>
        <div className="mb-4 col-span-12 md:col-span-5 lg:col-span-4">
          <div className="bg-white rounded-lg shadow-lg h-full relative">
            {!data && (
              <div className="h-80 flex justify-center items-center text-center">
                <LoaderGrowing />
              </div>
            )}
            {error && (
              <div className="h-80 flex justify-center items-center text-center text-lg2">
                <div>{error?.message}</div>
              </div>
            )}
            {data && !error && (
              <div className="mx-3">
                <div className="pt-6 mb-6 px-4">
                  <div className="pt-2 relative flex items-center text-gray-600 mx-auto">
                    <input
                      className="border border-gray py-3 pl-10 rounded-lg text-sm focus:outline-none w-full"
                      type="search"
                      name="search"
                      onChange={(e) => searchHandler(e.target.value)}
                      placeholder="Search"
                    />
                    <button type="submit" className="absolute left-1 px-2">
                      <RiSearchLine className="text-xl w-5 h-5 text-deep" />
                    </button>
                    {/* <button
                      type="submit"
                      className="absolute right-0 top-0 my-3 mr-4"
                    >
                      <FaCaretDown className="text-2xl w-5 h-5" />
                    </button> */}
                  </div>
                </div>
                <div className="h-[calc(100vh-30vh)] overflow-y-auto overflow-x-hidden">
                  {filterUsers?.length > 0 ? (
                    _.map(filterUsers, (item: any, index: any) => {
                      const isCandidate =
                        item?.members?.candidate?._id === userData?.user?._id;
                      const isEmployer =
                        item?.members?.employer?._id === userData?.user?._id;
                      const getTime = new Date(item.time);
                      const getTimeString = getTime.toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      });
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            returnMessage(item?._id);
                            setActiveIndex(index);
                          }}
                          className={`flex cursor-pointer items-center justify-between ${
                            activeItem?._id === item._id
                              ? "bg-themePrimary/20"
                              : "hover:bg-themeLighterAlt"
                          } py-2.5 px-2.5 sm:px-4 !mb-1 rounded-lg`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative inline-block">
                              <Image
                                className="inline-block object-cover rounded-full"
                                width={48}
                                height={48}
                                src={
                                  (!isCandidate
                                    ? item?.members?.candidate?.avatar
                                    : !isEmployer &&
                                      item?.members?.employer?.avatar) ||
                                  "https://via.placeholder.com/48x48"
                                }
                                alt="Profile image"
                              />
                              <span className="absolute bottom-0 right-0 inline-block w-3 h-3 bg-themePrimary border-2 border-white rounded-full"></span>
                              {/* unActive user profile
                      <span className="absolute bottom-0 right-0 inline-block w-3 h-3 bg-gray-600 border-2 border-white rounded-full"></span> */}
                            </div>

                            <div>
                              <div className="text-xxs font-medium text-arsenic">
                                {!isCandidate
                                  ? `${
                                      item?.members?.candidate?.fullName
                                        ?.firstName || ""
                                    } ${
                                      item?.members?.candidate?.fullName
                                        ?.lastName || ""
                                    }`
                                  : !isEmployer &&
                                    `${
                                      item?.members?.employer?.fullName
                                        ?.firstName || ""
                                    } ${
                                      item?.members?.employer?.fullName
                                        ?.lastName || ""
                                    }`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item?.job?.jobTitle}
                              </div>
                            </div>
                          </div>

                          <div className="text-center lg:mt-0">
                            <p className="themeDark text-xss1">
                              {getTimeString}
                            </p>
                            <p className="text-xsss float-right mt-2 mx-auto bg-themePrimary text-white w-4 h-4 rounded-full">
                              2
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-2.5 px-2.5 sm:px-3 mb-3 text-lg2 text-themeLighter text-center">
                      No Users
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagesInfo;

"use client";
import { Logo } from "@/src/icons";
import _ from "lodash";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { IoNotificationsCircle } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { mutate } from "swr";
import { ThemeContext } from "../../../context/ThemeContext";
import { Menu } from "../../@menuData/menu";
import Image from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";
import DashboardMenu from "./DashboardMenu";

const Header = () => {
  const {
    isSideNavOpen,
    setIsSideNavOpen,
    windowWidth,
    recentNotification,
    recentNotificationError,
  } = React.useContext(ThemeContext) as any;
  const [show, setShow] = React.useState(false);
  const { data } = useSession();
  const userData: any = data?.user;
  const pathname = usePathname();
  const [UserMenu, setUserMenu] = React.useState(false);
  const [notification, setNotification] = React.useState(false);
  const router = useRouter();
  let path = pathname.split(",");
  path = path[path.length - 1] as any;

  const newNotification =
    _.filter(recentNotification, (item) => {
      return _.lowerCase(item.status) === "unread";
    }).length > 0;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const SideNavMenuHandler = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const UserMenuHandler = () => {
    setUserMenu(!UserMenu);
  };

  return (
    <>
      <div className="fixed top-0 w-full py-5 bg-white shadow-md z-50">
        <nav className="relative">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="lg:w-auto pl-10 xl:w-64">
                {/* Desktop logo here ... */}
                <Link legacyBehavior href="/dashboard">
                  <a className="text-xl font-bold" data-config-id="brand">
                    <span className="hidden xl:flex items-center">
                      <div className="flex gap-3 items-center justify-center">
                        <div className="bg-themePrimary text-white px-2.5 py-1 rounded-lg text-3xl font-semibold ">
                          reset
                        </div>
                        <div className="text-4xl font-bold text-themePrimary">
                          Jobs
                        </div>
                      </div>
                    </span>
                    {/* Mobile Logo Text */}
                    <h1 className="m-0 pr-3 text-4xl font-bold text-black xl:hidden lg:block"></h1>
                  </a>
                </Link>
              </div>
              <div className="lg:hidden">
                <button
                  className="flex items-center"
                  onClick={SideNavMenuHandler}
                >
                  <svg
                    className="text-white bg-themePrimary block h-8 w-8 p-2 rounded"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <title>Mobile menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end lg:justify-between gap-4 px-11 w-full">
              <div className="hidden lg:block">
                <ul className="bg-white w-full z-50 menu-open md:space-x-8 space-x-6 font-normal hidden absolute left-0 top-20 lg:static lg:flex">
                  {Menu.map((item, index) => (
                    <li
                      className="relative ml-6 xl:ml-0 xl:mb-0 group"
                      key={index}
                    >
                      <Link legacyBehavior href={item.link}>
                        <a className="text-themeDark text-xs font-medium transition-all hover:text-themePrimary">
                          {item.name}
                        </a>
                      </Link>

                      {item.subMenu && (
                        <ul className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white shadow-lg rounded-md  z-50">
                          {item.subMenu.map((subItem, subIndex) => (
                            <li
                              key={subIndex}
                              className="px-4 py-2 hover:bg-gray-100"
                            >
                              <Link legacyBehavior href={subItem.link}>
                                <a className="text-themeDark text-sm font-medium transition-all hover:text-themePrimary">
                                  {subItem.name}
                                </a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <ul className="flex items-center space-x-6 mr-6">
                  <li className="relative !p-1 grid items-center">
                    <button
                      className={`text-themeDark relative hover:text-themePrimary ${
                        notification ? "!text-themePrimary" : ""
                      }`}
                      onClick={() => setNotification(!notification)}
                    >
                      {newNotification && (
                        <span className="flex h-2 w-2 absolute -top-1 -right-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 11.18V8C13.9986 6.58312 13.4958 5.21247 12.5806 4.13077C11.6655 3.04908 10.3971 2.32615 9 2.09V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V2.09C5.60294 2.32615 4.33452 3.04908 3.41939 4.13077C2.50425 5.21247 2.00144 6.58312 2 8V11.18C1.41645 11.3863 0.910998 11.7681 0.552938 12.2729C0.194879 12.7778 0.00173951 13.3811 0 14V16C0 16.2652 0.105357 16.5196 0.292893 16.7071C0.48043 16.8946 0.734784 17 1 17H4.14C4.37028 17.8474 4.873 18.5954 5.5706 19.1287C6.26819 19.6621 7.1219 19.951 8 19.951C8.8781 19.951 9.73181 19.6621 10.4294 19.1287C11.127 18.5954 11.6297 17.8474 11.86 17H15C15.2652 17 15.5196 16.8946 15.7071 16.7071C15.8946 16.5196 16 16.2652 16 16V14C15.9983 13.3811 15.8051 12.7778 15.4471 12.2729C15.089 11.7681 14.5835 11.3863 14 11.18ZM4 8C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4C9.06087 4 10.0783 4.42143 10.8284 5.17157C11.5786 5.92172 12 6.93913 12 8V11H4V8ZM8 18C7.65097 17.9979 7.30857 17.9045 7.00683 17.7291C6.70509 17.5536 6.45451 17.3023 6.28 17H9.72C9.54549 17.3023 9.29491 17.5536 8.99317 17.7291C8.69143 17.9045 8.34903 17.9979 8 18ZM14 15H2V14C2 13.7348 2.10536 13.4804 2.29289 13.2929C2.48043 13.1054 2.73478 13 3 13H13C13.2652 13 13.5196 13.1054 13.7071 13.2929C13.8946 13.4804 14 13.7348 14 14V15Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                    {windowWidth > 1020 && (
                      <NotificationMenu active={notification} />
                    )}
                  </li>
                </ul>
                <div className="hidden lg:block">
                  <div className="relative">
                    {userData && (
                      <div
                        className="flex items-center text-center cursor-pointer"
                        onClick={UserMenuHandler}
                      >
                        <div className="mr-3 lg:pl-4 lg:border-l lg:border-l-themeLighter flex items-center">
                          {userData?.image && (
                            <Image
                              className="rounded-full object-cover object-right p-1 border border-solid border-gray-500"
                              src={userData?.image}
                              alt="User image"
                              width={40}
                              height={40}
                              placeholder="blur"
                              blurDataURL={userData?.image}
                              quality={75}
                              priority={true}
                            />
                          )}
                          {!userData?.image && (
                            <Image
                              className="rounded-full object-cover object-right p-1 border border-solid border-gray-500"
                              src={`https://ui-avatars.com/api/?name=${userData?.fullName?.firstName}+${userData?.fullName?.lastName}&size=300&background=random`}
                              alt="User image"
                              width={40}
                              height={40}
                              quality={75}
                              priority={true}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm leading-8">
                            {userData?.fullName?.firstName}{" "}
                            {userData?.fullName?.lastName}
                          </p>
                        </div>
                        <span
                          className={`ml-2 transition duration-200 ease-in-out ${
                            UserMenu ? "rotate-180" : ""
                          }`}
                        >
                          <HiChevronDown />
                        </span>
                      </div>
                    )}
                    {!userData && (
                      <div>
                        <div className="flex gap-3 items-center">
                          <div>
                            <Skeleton circle width={40} height={40} />
                          </div>
                          <div>
                            <Skeleton width={120} height={20} />
                          </div>
                        </div>
                      </div>
                    )}
                    <DashboardMenu active={UserMenu} />
                  </div>
                </div>
              </div>
              <div className="lg:hidden flex items-center gap-2">
                <ul className="flex items-center space-x-6 !mr-2">
                  <li className="relative !p-1 grid items-center">
                    <button
                      className={`text-themeDark relative hover:text-themePrimary ${
                        notification ? "!text-themePrimary" : ""
                      }`}
                      onClick={() => setNotification(!notification)}
                    >
                      {newNotification && (
                        <span className="w-2 h-2 absolute -top-1 -right-0.5 rounded-full bg-red-400" />
                      )}
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 11.18V8C13.9986 6.58312 13.4958 5.21247 12.5806 4.13077C11.6655 3.04908 10.3971 2.32615 9 2.09V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V2.09C5.60294 2.32615 4.33452 3.04908 3.41939 4.13077C2.50425 5.21247 2.00144 6.58312 2 8V11.18C1.41645 11.3863 0.910998 11.7681 0.552938 12.2729C0.194879 12.7778 0.00173951 13.3811 0 14V16C0 16.2652 0.105357 16.5196 0.292893 16.7071C0.48043 16.8946 0.734784 17 1 17H4.14C4.37028 17.8474 4.873 18.5954 5.5706 19.1287C6.26819 19.6621 7.1219 19.951 8 19.951C8.8781 19.951 9.73181 19.6621 10.4294 19.1287C11.127 18.5954 11.6297 17.8474 11.86 17H15C15.2652 17 15.5196 16.8946 15.7071 16.7071C15.8946 16.5196 16 16.2652 16 16V14C15.9983 13.3811 15.8051 12.7778 15.4471 12.2729C15.089 11.7681 14.5835 11.3863 14 11.18ZM4 8C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4C9.06087 4 10.0783 4.42143 10.8284 5.17157C11.5786 5.92172 12 6.93913 12 8V11H4V8ZM8 18C7.65097 17.9979 7.30857 17.9045 7.00683 17.7291C6.70509 17.5536 6.45451 17.3023 6.28 17H9.72C9.54549 17.3023 9.29491 17.5536 8.99317 17.7291C8.69143 17.9045 8.34903 17.9979 8 18ZM14 15H2V14C2 13.7348 2.10536 13.4804 2.29289 13.2929C2.48043 13.1054 2.73478 13 3 13H13C13.2652 13 13.5196 13.1054 13.7071 13.2929C13.8946 13.4804 14 13.7348 14 14V15Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                    {windowWidth >= 640 && (
                      <NotificationMenu active={notification} />
                    )}
                  </li>
                </ul>
                <div>
                  <div className="relative">
                    {userData && (
                      <div
                        className="flex items-center text-center cursor-pointer"
                        onClick={UserMenuHandler}
                      >
                        <div className="mr-3 pl-3 border-l border-l-themeLighter flex items-center">
                          {userData?.avatar && (
                            <Image
                              className="rounded-full object-cover object-right p-1 border border-solid border-gray-500"
                              src={userData?.image}
                              alt="User image"
                              width={40}
                              height={40}
                              placeholder="blur"
                              blurDataURL={userData?.avatar}
                              quality={75}
                              priority={true}
                            />
                          )}
                          {!userData?.avatar && (
                            <Image
                              className="rounded-full object-cover object-right p-1 border border-solid border-gray-500"
                              src={`https://ui-avatars.com/api/?name=${userData?.fullName?.firstName}+${userData?.fullName?.lastName}&size=300&background=random`}
                              alt="User image"
                              width={40}
                              height={40}
                              quality={75}
                              priority={true}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm leading-8">
                            {userData?.fullName?.firstName}
                          </p>
                        </div>
                        <span
                          className={`ml-2 transition duration-200 ease-in-out ${
                            UserMenu ? "rotate-180" : ""
                          }`}
                        >
                          <HiChevronDown />
                        </span>
                      </div>
                    )}
                    {!userData && (
                      <div>
                        <div className="flex gap-3 items-center">
                          <div>
                            <Skeleton circle width={48} height={48} />
                          </div>
                          <div>
                            <Skeleton width={120} height={20} />
                          </div>
                        </div>
                      </div>
                    )}
                    <DashboardMenu active={UserMenu} />
                  </div>
                </div>
                <button className="flex items-center" onClick={handleShow}>
                  <svg
                    className="text-white bg-themePrimary block h-8 w-8 p-2 rounded"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <title>Mobile menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* Mobile Menu Wrapper */}
      <div
        className={`fixed w-full h-full top-0  z-[100] transition-all duration-500 ease-in-out ${
          show ? "right-0" : "-right-full"
        }`}
      >
        {/* Mobile Menu */}
        <div
          className={`absolute top-0 overflow-auto  max-w-[400px] w-full h-full p-[15px] bg-white z-[110] transition-all ease-in-out duration-500 ${
            show ? "right-0" : "-right-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="h-[60px]">
            {/* Close Icon */}
            <div className="absolute left-5">
              <MdClose
                className="w-[30px] h-[30px] text-white transition-all ease-in-out duration-500 hover:text-[#ff0000]"
                onClick={handleClose}
              />
            </div>
          </div>
          {/* Mobile Menu Body */}
          <div>
            <div>
              <ul>
                {Menu.map((item, index) => (
                  <li key={index} className="border-b border-gray">
                    <Link legacyBehavior href="/">
                      <a className="block rounded w-full px-4 py-2 text-base text-themeDark hover:text-white hover:bg-themePrimary">
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Overlay Container */}
        <div
          className={`absolute w-full h-full top-0 transition-all duration-500 ease-in-out cursor-pointer bg-[rgba(0,_0,_0,_0.5)] ${
            show ? "right-0" : "-right-full"
          }`}
          onClick={handleClose}
        />
      </div>
      {/* mobile notification component */}
      {/* Mobile Menu Wrapper */}
      <div
        className={`fixed w-full h-full top-0  z-[100] transition-all duration-500 ease-in-out ${
          notification ? "right-0" : "-right-full"
        }  sm:hidden`}
      >
        {/* Menu Wrapper */}
        <div
          className={`absolute top-0 overflow-auto  max-w-[400px] w-full h-full p-[15px] bg-white z-[110] transition-all ease-in-out duration-500 ${
            notification ? "right-0" : "-right-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="h-[60px]">
            {/* Close Icon */}
            <div className="absolute left-5">
              <MdClose
                className="w-[30px] h-[30px] text-white transition-all ease-in-out duration-500 hover:text-[#ff0000]"
                onClick={() => setNotification(!notification)}
              />
            </div>
          </div>
          {/* Mobile Menu Body */}
          <div>
            <div className="!p-4">
              {/* center loader */}
              {!recentNotification && !recentNotificationError && (
                <div className="flex py-7 justify-center items-center h-full">
                  <div
                    className="spinner-border w-7 h-7 text-themePrimary"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              {/* error */}
              {recentNotificationError && (
                <div className="flex py-7 justify-center items-center h-full">
                  <div className="text-center">
                    <p className="text-sm text-themeLighterAlt">
                      Something went wrong. Please try again later.
                    </p>
                  </div>
                </div>
              )}
              {/* data */}
              {recentNotification && (
                <>
                  {_.map(recentNotification, (notify, index) => (
                    <div
                      className="flex justify-between gap-3 !py-2 border-b cursor-pointer border-gray"
                      onMouseEnter={() => notificationSeenHandler(notify._id)}
                    >
                      <div>
                        <p className="text-sm text-themeDarker inline-block relative">
                          {notify.event}
                          {_.lowerCase(notify.status) === "unread" && (
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute top-0 -right-3" />
                          )}
                        </p>
                        <p className="text-sm text-themeLight">
                          {notify.message}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-themeLight">
                          {moment(notify.timestamp).fromNow()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 !pt-3">
                    <div>
                      <p className="text-sm text-text-themeDarker">
                        {recentNotification.length} new notifications
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-themeDarker">
                        <Link legacyBehavior href="/notifications">
                          <a className="text-themePrimary hover:text-themeLighterAlt">
                            View all
                          </a>
                        </Link>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Overlay Container Notification */}
        <div
          className={`absolute w-full h-full top-0 transition-all duration-500 ease-in-out cursor-pointer bg-[rgba(0,_0,_0,_0.5)] ${
            notification ? "right-0" : "-right-full"
          }`}
          onClick={() => setNotification(!notification)}
        />
      </div>
      {/* Dashboard Menu Overlay */}
      <div
        className={`fixed w-full h-full top-0 z-[9] ${
          UserMenu
            ? "opacity-100 transform scale-100"
            : "transform opacity-0 scale-0"
        }`}
        onClick={UserMenuHandler}
      />
      {/* Notification Menu Overlay */}
      <div
        className={`fixed w-full h-full top-0 z-[9] ${
          notification
            ? "opacity-100 transform scale-100"
            : "opacity-0 transform scale-0 "
        }`}
        // className={notification ? 'active' : ''}
        onClick={() => setNotification(!notification)}
      />
    </>
  );
};

// on mouse enter notification seen handler
const notificationSeenHandler = async (id: any) => {
  // update notification
  try {
    await authAxios({
      method: "PUT",
      url: `/notifications/recent/catalog/${id}`,
      data: {
        status: "READ",
      },
    }).then((res) => {
      mutate("/notifications/recent/catalog");
    });
  } catch (error: any) {
    console.error(error);
  }
};

// Dashboard Menu by clicking on user image

// Notification Menu Wrapper
function NotificationMenu({ active }: { active: any }) {
  const { recentNotification, recentNotificationError } = React.useContext(
    ThemeContext
  ) as any;
  return (
    <>
      <div
        className={`transition-all	duration-300 ease-in-out w-[350px] -right-[150%] rounded-[3px] p-0 top-[150%]  text-left
           z-[999] shadow-[0px_0_8px_0px_rgb(0_0_0_/_10%)] before:content-[''] before:absolute before:right-[50px] before:-top-[6px] before:w-0 before:h-0 before:border-l-transparent before:border-r-transparent before:border-b-[rgb(247_248_250)] before:transition-all before:ease-in-out before:duration-300 ${
             active
               ? "transform scale-100 visible opacity-100"
               : "opacity-0 invisible transform scale-[0.95]"
           } bg-themeLighterAlt text-white absolute rounded-lg overflow-hidden`}
      >
        {/* Notification List */}
        <div className="pb-8 bg-white max-h-[400px] overflow-y-auto">
          {/* center loader */}
          {!recentNotification && !recentNotificationError && (
            <div className="flex py-7 justify-center items-center h-full">
              <div
                className="spinner-border w-7 h-7 text-themePrimary"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {/* error */}
          {recentNotificationError && (
            <div className="flex py-7 justify-center items-center h-full">
              <div className="text-center">
                <p className="text-sm text-themeDarker">
                  Something went wrong. Please try again later.
                </p>
              </div>
            </div>
          )}
          {/* data */}
          {recentNotification && (
            <>
              {_.map(recentNotification, (notify, index) => (
                <div
                  className="flex justify-between cursor-pointer items-center px-4 py-3 border-b border-gray last-of-type:border-b-0 hover:bg-themeLighterAlt -mx-2"
                  onMouseEnter={() =>
                    _.lowerCase(notify.status) === "unread" &&
                    notificationSeenHandler(notify._id)
                  }
                >
                  <div className="flex gap-2 items-center">
                    {/* Message Icon */}
                    <IoNotificationsCircle className="w-10 h-10 mx-1 text-themePrimary flex-none" />
                    <div>
                      <p className="text-themeLight text-sm inline mr-2 relative">
                        {moment(notify.timestamp).fromNow()}
                        {_.lowerCase(notify.status) === "unread" && (
                          <span className="flex h-2 w-2 absolute top-0 -right-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-themeLighter">
                        {notify.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="absolute bottom-0 right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-20 w-full">
          <Link legacyBehavior href="/notifications">
            <a className="block bg-themeDarkerAlt w-full p-2 text-white text-center font-bold">
              See all notifications
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;

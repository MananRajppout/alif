"use client";
import { Logo } from "@/src/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { ThemeContext } from "../../../context/ThemeContext";
import { Menu } from "../../@menuData/menu";
import DashboardMenu from "../../dashboard/header/DashboardMenu";
import Image from "../../optimize/image";

const Header = ({ IsLogIn }: { IsLogIn: any }) => {
  const [show, setShow] = useState(false);
  const { LoginPopupHandler, RegisterPopupHandler } = React.useContext(
    ThemeContext
  ) as any;
  const { data, status } = useSession();
  const userData: any = data?.user;
  const [UserMenu, setUserMenu] = React.useState(false);
  const router = useRouter();
  let path = usePathname().split(",") as any;
  path = path[path.length - 1];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const UserMenuHandler = () => {
    setUserMenu(!UserMenu);
  };

  return (
    <>
      <header className="shadow-sm bg-white z-100">
        <nav className="container py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link legacyBehavior href="/">
                <a className="hidden sm:flex">
                  {/* <Logo
                    className="w-[146px] h-[33px] text-themePrimary"
                    dark={true}
                  /> */}
                  <div className="flex gap-3 items-center justify-center">
                    <div className="bg-themePrimary text-white px-2.5 py-1 rounded-lg text-3xl font-semibold ">
                      reset
                    </div>
                    <div className="text-4xl font-bold text-themePrimary">
                      Jobs
                    </div>
                  </div>
                </a>
              </Link>
              {/* Mobile logo here ... */}
              <Link legacyBehavior href="/">
                <a className="sm:hidden flex">
                  <div className="flex gap-3 items-center justify-center">
                    <div className="bg-themePrimary text-white px-2.5 py-1 rounded-lg text-3xl font-semibold ">
                      reset
                    </div>
                    <div className="text-4xl font-bold text-themePrimary">
                      Jobs
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            <div>
              <ul className="bg-white w-full z-50 menu-open md:space-x-8 space-x-6 font-semibold hidden absolute left-0 top-20 lg:static lg:flex z-100 ">
                {Menu.map((item, index) => (
                  <li
                    className="relative group ml-6 xl:ml-0 xl:mb-0"
                    key={index}
                  >
                    <Link legacyBehavior href={item.link}>
                      <a
                        className={`${
                          path === item.link
                            ? "text-themePrimary"
                            : "text-arsenic"
                        } text-xs font-medium transition-all hover:text-themePrimary`}
                      >
                        {item.name}
                      </a>
                    </Link>
                    {/* Render Submenu if exists */}
                    {item.subMenu && (
                      <ul className="hidden z-50 group-hover:block absolute left-0 top-full bg-white shadow-lg rounded-md">
                        {item.subMenu.map((subItem, subIndex) => (
                          <li
                            className="px-4 py-2 whitespace-nowrap hover:bg-gray-100"
                            key={subIndex}
                          >
                            <Link legacyBehavior href={subItem.link}>
                              <a className="text-arsenic hover:text-themePrimary text-sm">
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

            <div>
              {data && status === "authenticated" ? (
                <>
                  {/* After user login design */}
                  {data?.user && (
                    <div className="flex gap-2 items-center">
                      <div className="relative">
                        <button
                          className="flex items-center hover:text-arsenic pr-2 border-r border-r-themeLighter lg:pr-0 lg:border-0 text-center cursor-pointer"
                          onClick={UserMenuHandler}
                        >
                          <div className="mr-3 flex items-center">
                            {userData?.avatar && (
                              <Image
                                className="rounded-full object-cover object-right p-1 border border-solid border-gray-500"
                                src={userData?.avatar}
                                alt="User image"
                                width={48}
                                height={48}
                                noPlaceholder={true}
                              />
                            )}
                            {!userData?.avatar && (
                              <Image
                                className="rounded-full object-cover object-right p-1 border border-solid border-gray-500"
                                src="https://via.placeholder.com/75x75"
                                alt="User image"
                                width={48}
                                height={48}
                                noPlaceholder={true}
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
                            className={`ml-1 transition duration-200 ease-in-out ${
                              UserMenu ? "rotate-180" : ""
                            }`}
                          >
                            <HiChevronDown />
                          </span>
                        </button>
                        <DashboardMenu active={UserMenu} />
                      </div>
                      <button
                        className="mobile-toggle flex lg:hidden p-2 rounded-full transition-all outline-none"
                        onClick={handleShow}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* before user login design */}
                  <ul className="flex py-2">
                    <li className="">
                      {path === "/login" || path === "/sign-up" ? (
                        <Link legacyBehavior href={"/login"}>
                          <a className="block bg-black text-white px-3 py-2 text-xs font-medium rounded-md hover:!bg-themePrimary transition-all outline-none">
                            Sign In
                          </a>
                        </Link>
                      ) : (
                        <button
                          onClick={LoginPopupHandler}
                          className="block bg-black text-white px-3 py-2 text-xs font-medium rounded-md hover:!bg-themePrimary transition-all outline-none"
                        >
                          Sign In
                        </button>
                      )}
                    </li>

                    <li className="ml-4 hidden md:block">
                      {path === "/login" || path === "/sign-up" ? (
                        <Link legacyBehavior href={"/sign-up"}>
                          <a className="block bg-themePrimary text-white px-3 py-2 text-xs font-medium rounded-md hover:bg-black transition-all outline-none">
                            Sign Up
                          </a>
                        </Link>
                      ) : (
                        <button
                          onClick={RegisterPopupHandler}
                          className="block bg-themePrimary text-white px-3 py-2 text-xs font-medium rounded-md hover:bg-black transition-all outline-none"
                        >
                          Sign Up
                        </button>
                      )}
                    </li>
                    <li>
                      <button
                        className="mobile-toggle flex lg:hidden p-2 rounded-full transition-all outline-none"
                        onClick={handleShow}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
      {/* Header End */}
      {/* Mobile Menu Wrapper */}
      <div
        className={`fixed w-full h-full top-0  z-[100] transition-all duration-500 ease-in-out ${
          show ? "left-0" : "-left-full"
        }`}
      >
        {/* Mobile Menu */}
        <div
          className={`absolute top-0  max-w-[400px] w-full h-full z-[110]
               transition-all duration-500 ease-in-out bg-[rgba(0,_0,_0,_0.6)] backdrop-blur-[10px] ${
                 show ? "left-0" : "-left-full"
               }`}
        >
          {/* Mobile Menu Header  */}
          <div className="h-[60px]">
            <div className="cursor-pointer absolute top-4 right-5">
              <MdClose
                onClick={handleClose}
                className="w-[30px] h-[30px] text-[#f2f5f8] transition ease-in-out duration-500 hover:text-[#ff0000]"
              />
            </div>
          </div>
          {/* Menu body  */}
          <div>
            {userData && (
              <div className="px-4">
                <div className="relative">
                  <div className="flex gap-3 items-center text-center cursor-pointer">
                    <div className="flex items-center">
                      {userData?.avatar && (
                        <Image
                          className="rounded-lg object-cover object-right p-1 border border-solid border-gray-500"
                          src={userData?.avatar}
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
                          className="rounded-lg object-cover object-right p-1 border border-solid border-gray-500"
                          src="https://via.placeholder.com/75x75"
                          alt="User image"
                          width={40}
                          height={40}
                          placeholder="blur"
                          blurDataURL={"https://via.placeholder.com/75x75"}
                          quality={75}
                          priority={true}
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm leading-4 text-white">
                        {userData?.fullName?.firstName}{" "}
                        {userData?.fullName?.lastName}
                      </p>
                      <span className="text-xss1 text-deep">
                        {userData?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <ul className="flex flex-col mt-6">
              {Menu.map((item, index) => (
                <li className="flex items-center" key={index}>
                  <Link legacyBehavior href={item.link}>
                    <a
                      className={`${
                        path === item.link
                          ? "text-themePrimary !border-themePrimary"
                          : "text-light"
                      } text-xxs py-3.5 px-4 border-b border-deep w-full transition-all hover:text-themePrimary hover:!border-themePrimary`}
                    >
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Overlay Container */}
        <div
          className={`absolute w-full h-full top-0 transition-all duration-500 ease-in-out cursor-pointer bg-[rgba(0,_0,_0,_0.5)] ${
            show ? "left-0" : "-left-full"
          }`}
          onClick={handleClose}
        />
      </div>
      {/* Dashboard Menu Overlay  */}
      <div
        className={`fixed w-full h-full top-0 z-30   ${
          UserMenu
            ? "opacity-100 transform scale-100"
            : "transform opacity-0 scale-0"
        }`}
        onClick={UserMenuHandler}
      />
    </>
  );
};

export default Header;

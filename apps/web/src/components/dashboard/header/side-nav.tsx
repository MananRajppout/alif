"use client";
import { deleteCookie } from "cookies-next";
import _ from "lodash";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  Logout,
  adminMenu,
  candidatesMenu,
  employerMenu,
} from "../../@menuData/menu";

const SideNav = ({ data }: { data: any }) => {
  const { isSideNavOpen, setIsSideNavOpen, hydrationFix } = React.useContext(
    ThemeContext,
  ) as any;
  const router = useRouter();
  let pathName = usePathname().split(",");
  pathName = pathName[pathName.length - 1] as any;

  const SideNavMenuHandler = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <>
      <div
        className={`${
          isSideNavOpen ? "block" : "hidden"
        } lg:block navbar-menu relative z-50`}
      >
        <div
          className="navbar-backdrop fixed lg:hidden inset-0 bg-gray-800 opacity-20"
          onClick={SideNavMenuHandler}
        ></div>
        <nav className="fixed top-20 left-0 bottom-0 flex flex-col w-24 xl:w-64 pt-10 pb-3 bg-white shadow overflow-y-auto">
          <div>
            <ul className="text-sm">
              {!data && (
                <>
                  {_.map(
                    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                    (item, key) => (
                      <li key={key} className="p-3 mb-2">
                        <Skeleton count={1} height="20px" />
                      </li>
                    ),
                  )}
                </>
              )}
              {hydrationFix &&
                data?.role?.isCandidate &&
                candidatesMenu.map((menu, index) => (
                  <li key={index}>
                    <Link legacyBehavior href={menu.link}>
                      <a
                        className={`${
                          pathName === (menu.link as any)
                            ? "bg-themePrimary text-white"
                            : "hover:bg-themePrimary hover:!text-white"
                        } relative mx-auto flex duration-300 ease-in-out gap-3 group items-center xl:w-full w-14 h-14 xl:h-auto xl:py-4 xl:px-7 mb-2 xl:justify-start justify-center text-gray-500 rounded-full xl:rounded-none`}
                      >
                        {menu.icon}
                        <span
                          data-config-id="link7"
                          className={`hidden xl:block text-xxs font-normal`}
                        >
                          {menu.name}
                        </span>
                        {menu.alert !== "" && (
                          <span
                            className={`${
                              pathName === (menu.link as any)
                                ? "bg-red-400 text-white"
                                : "bg-themePrimary text-white"
                            } flex justify-center items-center group-hover:bg-red-400 text-xsss xl:static absolute top-0 right-1 rounded-full w-4 h-4`}
                          >
                            {menu.alert}
                          </span>
                        )}
                      </a>
                    </Link>
                  </li>
                ))}
              {data?.role?.isEmployer &&
                employerMenu.map((menu, index) => (
                  <li key={index}>
                    <Link legacyBehavior href={menu.link}>
                      <a
                        className={`${
                          pathName === (menu.link as any)
                            ? "bg-themePrimary text-white"
                            : "hover:bg-themePrimary hover:!text-white"
                        } relative mx-auto flex duration-300 ease-in-out gap-3 group items-center xl:w-full w-14 h-14 xl:h-auto xl:py-4 xl:px-7 mb-2 xl:justify-start justify-center text-gray-500 rounded-full xl:rounded-none`}
                      >
                        {menu.icon}
                        <span
                          data-config-id="link7"
                          className={`hidden xl:block text-xxs font-normal`}
                        >
                          {menu.name}
                        </span>
                        {menu.alert !== "" && (
                          <span
                            className={`${
                              pathName === (menu.link as any)
                                ? "bg-red-400 text-white"
                                : "bg-themePrimary text-white"
                            } flex justify-center items-center group-hover:bg-red-400 text-xsss xl:static absolute top-0 right-1 rounded-full w-4 h-4`}
                          >
                            {menu.alert}
                          </span>
                        )}
                      </a>
                    </Link>
                  </li>
                ))}
              {data?.role?.isAdmin &&
                adminMenu.map((menu, index) => {
                  return (
                    <li key={index} className={"mb-2 group"}>
                      {menu?.submenu ? (
                        <>
                          <Dropdown menu={menu} pathName={pathName} />
                        </>
                      ) : (
                        <Link legacyBehavior href={menu.link} className="mb-2">
                          <a
                            className={`${
                              pathName === (menu.link as any)
                                ? "bg-themePrimary text-white"
                                : "hover:bg-themePrimary hover:!text-white"
                            } relative mx-auto flex duration-300 ease-in-out gap-3 group items-center xl:w-full w-14 h-14 xl:h-auto xl:py-4 xl:px-7 xl:justify-start justify-center text-gray-500 rounded-full xl:rounded-none`}
                          >
                            {menu.icon}
                            <span
                              data-config-id="link7"
                              className={`hidden xl:block text-xxs font-normal`}
                            >
                              {menu.name}
                            </span>
                            {menu.alert !== "" && (
                              <span
                                className={`${
                                  pathName === (menu.link as any)
                                    ? "bg-red-400 text-white"
                                    : "bg-themePrimary text-white"
                                } flex justify-center items-center group-hover:bg-red-400 text-xsss xl:static absolute top-0 right-1 rounded-full w-4 h-4`}
                              >
                                {menu.alert}
                              </span>
                            )}
                          </a>
                        </Link>
                      )}
                    </li>
                  );
                })}
              {data && (
                <li>
                  <button
                    onClick={() => {
                      signOut().then(() => {
                        deleteCookie("accessToken");
                      });
                    }}
                    className="flex duration-300 ease-in-out mx-auto justify-center items-center xl:w-full w-14 h-14 xl:h-auto xl:py-4 xl:px-7 xl:justify-start text-gray-500 hover:!text-white hover:bg-red-500 rounded-full xl:rounded-none"
                  >
                    <Logout />
                    <span
                      data-config-id="link12"
                      className="hidden xl:block ml-4 font-normal text-xxs"
                    >
                      Log Out
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

const Dropdown = ({ menu, pathName }: { menu: any; pathName: any }) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    for (let i = 0; i < menu.submenu.length; i++) {
      if (pathName === menu.submenu[i].link) {
        setShow(true);
      }
    }
  }, [pathName, menu]);

  const OnClickHandler = () => {
    setShow(!show);
  };

  return (
    <>
      <div
        className={`${
          show || pathName === menu.link
            ? "bg-themePrimary text-white"
            : "hover:bg-themePrimary hover:!text-white"
        } flex justify-between items-center duration-300 ease-in-out`}
      >
        <Link legacyBehavior href={menu.link}>
          <a
            className={`${
              pathName === menu.link ? "text-white" : "hover:!text-white"
            } relative mx-auto flex gap-3 group items-center xl:w-full w-14 h-14 xl:h-auto xl:py-4 xl:px-7 xl:justify-start justify-center text-gray-500 rounded-full xl:rounded-none`}
          >
            {menu.icon}
            <span
              data-config-id="link7"
              className={`hidden xl:block text-xxs font-normal`}
            >
              {menu.name}
            </span>
            {menu.alert !== "" && (
              <span
                className={`${
                  pathName === menu.link || show
                    ? "bg-red-400 text-white"
                    : "bg-themePrimary text-white"
                } flex justify-center items-center group-hover:bg-red-400 text-xsss xl:static absolute top-0 right-1 rounded-full w-4 h-4`}
              >
                {menu.alert}
              </span>
            )}
          </a>
        </Link>
        <button type="button" onClick={OnClickHandler} className="p-2.5 pr-4">
          <RiArrowDownSLine
            className={`text-xxs duration-300 ease-in-out ${
              (show && menu?.submenu) || pathName === menu.link
                ? "rotate-180"
                : ""
            }`}
          />
        </button>
      </div>
      {((show && menu?.submenu) || pathName === menu.link) && (
        <ul id="dropdown">
          {_.map(menu?.submenu, (submenu, index) => (
            <li
              key={index}
              className="border-b border-gray last-of-type:border-b-0"
            >
              <Link legacyBehavior href={submenu.link}>
                <a
                  className={`${
                    pathName === submenu.link
                      ? "!text-themePrimary"
                      : "hover:!text-themePrimary"
                  } relative mx-auto flex text-themeDark duration-300 ease-in-out bg-themePrimary/20 gap-3 group items-center xl:w-full w-14 h-14 xl:h-auto xl:py-4 xl:px-7 xl:justify-start justify-center text-gray-500 rounded-full xl:rounded-none`}
                >
                  {submenu.icon}
                  <span
                    data-config-id="link7"
                    className={`hidden xl:block text-xs font-normal`}
                  >
                    {submenu.name}
                  </span>
                  {submenu.alert !== "" && (
                    <span
                      className={`${
                        pathName === submenu.link
                          ? "bg-red-400 text-white"
                          : "bg-themePrimary text-white"
                      } flex justify-center items-center group-hover:bg-red-400 text-xsss xl:static absolute top-0 right-1 rounded-full w-4 h-4`}
                    >
                      {submenu.alert}
                    </span>
                  )}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SideNav;

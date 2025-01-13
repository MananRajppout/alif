"use client"
import { AxiosRequestConfig } from "axios";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import useSWR from "swr";
import { Axios, authAxios } from "../components/utils/axiosKits";

type ThemeContextType = {
  apiEndPoint: string;
  body: any;
  windowWidth: any;
  windowHeight: any;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: any;
  isSideNavOpen: boolean;
  setIsSideNavOpen: any;
  LoginPopup: boolean;
  LoginPopupHandler: any;
  setLoginPopup: any;
  RegisterPopup: boolean;
  RegisterPopupHandler: any;
  setRegisterPopup: any;
  lostPasswordShow: boolean;
  lostPasswordHandler: any;
  categoryData: any;
  categoryError: any;
  categoryMutate: any;
  recentNotification: any;
  recentNotificationError: any;
  bookmarkData: any;
  bookmarkError: any;
  bookmarkMutate: any;
  hydrationFix: boolean;
};

const defaultThemeContext: ThemeContextType = {
  apiEndPoint: "",
  body: null,
  windowWidth: undefined,
  windowHeight: undefined,
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: null,
  isSideNavOpen: false,
  setIsSideNavOpen: null,
  LoginPopup: false,
  LoginPopupHandler: null,
  setLoginPopup: null,
  RegisterPopup: false,
  RegisterPopupHandler: null,
  setRegisterPopup: null,
  lostPasswordShow: false,
  lostPasswordHandler: null,
  categoryData: null,
  categoryError: null,
  categoryMutate: null,
  recentNotification: null,
  recentNotificationError: null,
  bookmarkData: null,
  bookmarkError: null,
  bookmarkMutate: null,
  hydrationFix: false,
};

export const ThemeContext = createContext(defaultThemeContext);

const fetcher = (url: AxiosRequestConfig<any>) =>
  Axios(url).then((res: any) => res.data.data);
const authFetcher = (url: AxiosRequestConfig<any>) =>
  authAxios(url).then((res: any) => res.data.data);
const JobCategoryAPI = "/jobs/categories/retrives";

const ThemeContextProvider = ({ children }: { children: any }) => {
  const pathname = usePathname();
  const apiEndPoint = `/api/v1`;
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window === "object" && window.innerWidth,
  );
  const [windowHeight, setWindowHeight] = React.useState(
    typeof window === "object" && window.innerHeight,
  );
  const body = typeof window === "object" && document.querySelector("body");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false); // mobile menu open
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(false); // side nav open
  const [LoginPopup, setLoginPopup] = React.useState(false); // Login Popup
  const [RegisterPopup, setRegisterPopup] = React.useState(false); // register popup
  const [lostPasswordShow, setLostPasswordShow] = React.useState(false); // lost password popup
  const [hydrationFix, setHydrationFix] = useState(false);

  // Hydration Fix
  useEffect(() => {
    setHydrationFix(true);
  }, []);

  const { status } = useSession();

  // Frontend data fetching hooks
  const {
    data: categoryData,
    error: categoryError,
    mutate: categoryMutate,
  } = useSWR(JobCategoryAPI, fetcher, {
    revalidateOnFocus: false,
  });

  // user bookmark data fetching hooks
  const {
    data: bookmarkData,
    error: bookmarkError,
    mutate: bookmarkMutate,
  } = useSWR(
    status === "authenticated" &&
      (pathname === "/bookmarks" || pathname === "/dashboard") &&
      `/bookmarks/retrives`,
    null,
    { fetcher: authFetcher },
  );

  // user notification data fetching hooks
  const { data: recentNotification, error: recentNotificationError } = useSWR(
    status === "authenticated" && `/notifications/recent/retrives`,
    null,
    { fetcher: authFetcher },
  );

  React.useEffect(() => {
    const body = document.querySelector("body") as any;
    if (!body) return;


    let resizeWindow = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      window.innerWidth >= 768 && window.innerWidth < 1300
        ? body.setAttribute("data-sidebar-style", "overlay")
        : window.innerWidth <= 768
        ? body.setAttribute("data-sidebar-style", "overlay")
        : body.setAttribute("data-sidebar-style", "full");
    };
    body.setAttribute("data-typography", "poppins");
    body.setAttribute("data-theme-version", "light");
    body.setAttribute("data-theme-version", "dark");
    body.setAttribute("data-layout", "vertical");
    body.setAttribute("data-nav-headerbg", "color_1");
    body.setAttribute("data-headerbg", "color_1");
    body.setAttribute("data-sidebar-style", "overlay");
    body.setAttribute("data-sibebarbg", "color_1");
    body.setAttribute("data-primary", "color_1");
    body.setAttribute("data-sidebar-position", "fixed");
    body.setAttribute("data-header-position", "fixed");
    body.setAttribute("data-container", "wide");
    body.setAttribute("direction", "ltr");

    
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  const LoginPopupHandler = () => {
    setLoginPopup(!LoginPopup);
  };

  const RegisterPopupHandler = () => {
    setRegisterPopup(!RegisterPopup);
  };

  const lostPasswordHandler = () => {
    setLostPasswordShow(!lostPasswordShow);
    setLoginPopup(false);
  };

  return (
    <ThemeContext.Provider
      value={{
        apiEndPoint,
        body:typeof document !== 'undefined' ? document.querySelector("body") : null,
        windowWidth,
        windowHeight,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSideNavOpen,
        setIsSideNavOpen,
        LoginPopup,
        LoginPopupHandler,
        setLoginPopup,
        RegisterPopup,
        RegisterPopupHandler,
        setRegisterPopup,
        lostPasswordShow,
        lostPasswordHandler,
        categoryData,
        categoryError,
        categoryMutate,
        recentNotification: recentNotification?.notification,
        recentNotificationError,
        bookmarkData,
        bookmarkError,
        bookmarkMutate,
        hydrationFix,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

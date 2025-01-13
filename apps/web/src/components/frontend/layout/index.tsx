"use client";
import React, { useContext } from "react";
import dynamic from "next/dynamic";
import { ThemeContext } from "../../../context/ThemeContext";
const Footer = dynamic(() => import("../footer")) as any;
const Header = dynamic(() => import("../header")) as any;

const Layout = (props: any) => {
  const { isLogIn } = useContext(ThemeContext) as any;
  if (isLogIn) {
    return (
      <>
        <Header IsLogIn={true} />
        {props.children}
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Header IsLogIn={false} />
        {props.children}
        <Footer />
      </>
    );
  }
};

export default Layout;

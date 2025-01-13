"use client"
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
const MainHeader = dynamic(() => import("../header")) as any;

const Layout = (props: { children: any }) => {
  const { status } = useSession();

  if (status === "authenticated") {
    return <MainHeader IsLogIn={true}>{props.children}</MainHeader>;
  } else {
    return <MainHeader IsLogIn={false}>{props.children}</MainHeader>;
  }
};

export default Layout;

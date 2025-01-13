// app/components/UserNavigation.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation"; // Change import to next/navigation
import React from "react";
import { Loader } from "./loader"; // Adjust the path if necessary

export const UserNotLogin = () => {
  const router = useRouter();
  
  React.useEffect(() => {
    router.replace("/login");
  }, [router]);

  return <Loader />;
};

export const UserGoBack = () => {
  const router = useRouter();
  
  React.useEffect(() => {
    router.back();
  }, [router]);

  return <Loader />;
};

export const UserLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  React.useEffect(() => {
    const callbackUrl = searchParams.get('callbackUrl');
    router.push(callbackUrl ? callbackUrl : "/dashboard");
  }, [router, searchParams]);

  return <Loader />;
};

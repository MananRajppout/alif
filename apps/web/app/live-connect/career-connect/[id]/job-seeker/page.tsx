"use client";

import { Loader } from "@/src/components/lib/loader";
import { UserNotLogin } from "@/src/components/lib/user";
import Viewer from "@/videoComponents/Viewer";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { data, status } = useSession();
  const params = useParams();
  const { id } = params;
  const userData = data?.user;
  interface UserRole {
    isCandidate?: boolean;
  }

  interface SessionUser {
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  }

  let isCandidate = (userData as SessionUser)?.role?.isCandidate;

  // useEffect(() => {
  //   isCandidate = (data as SessionUser)?.role?.isCandidate;
  // }, [userData]);

  const [comapanyData, setCompanyData] = useState<any[]>([]);
  const [usersData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      const response = await fetch(`/api/v1/events/${id}/companies`, {
        // Change it please Arnav
        method: "POST",
      });
      console.log("response", response);
      const data = await response.json();
      console.log("Data", data);

      var companyDataList: any[] = [];

      const companydata = [...data.companiesRegistered].map((company: any) => {
        const detailList = company.jobsDetails.map((job: any) => {
          companyDataList.push({
            job: job,
            company: company,
          });
          return {
            job: job,
            company: company,
          };
        });
        // companyDataList.push(detailList);
      });
      console.log("companyDataList", companyDataList);
      setCompanyData(companyDataList);
    };
    const fetchUserData = async () => {
      console.log("ID", id);
      const response = await fetch(`/api/v1/events/${id}/users`, {
        // Change it please Arnav
        method: "POST",
      });
      const data = await response.json();
      console.log("Data User", data.usersRegistered.length);
      setUserData([...data.usersRegistered]); //change to data.usersRegistered
    };
    fetchUserData();
    fetchCompanyData();
  }, []);

  return (
    <>
      {status === "unauthenticated" && <UserNotLogin />}
      {userData &&
        status === "authenticated" &&
        isCandidate &&
        (id ? (
          <Viewer
            comapanyData={comapanyData}
            usersData={usersData}
            className=" w-full h-full "
            roomidProp={id as string}
            userData={userData}
          />
        ) : (
          <div></div>
        ))}
      {status === "loading" && <Loader />}

      {/* {id ? (
        <Viewer className=" w-full h-full " roomidProp={id as string} />
      ) : (
        <div></div>
      )} */}
    </>
  );
}

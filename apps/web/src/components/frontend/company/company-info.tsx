"use client"
import {
  DollarIcon,
  HandWatchIcon,
  JobLocationIcon,
  OfficeBag,
} from "@/src/icons";
import { LoaderGrowing } from "../../lib/loader";

const CompanyInfo = ({ data }: { data: any }) => {
  return (
    <div className="p-8 rounded-md bg-white mb-6 relative">
      {(!data?.company || data?.loading) && <LoaderGrowing />}
      <h4 className="text-lg2 font-bold text-black leading-6 mb-6">
        Company Info
      </h4>
      <ul>
        {data?.company?.category !== "" && (
          <li className="flex gap-3 items-center flex-wrap mb-3">
            <div className="">
              <OfficeBag
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Industry
              </h5>
              <p className="text-grayLight text-sm">
                {data?.company?.category}
              </p>
            </div>
          </li>
        )}
        {data?.company?.companySize !== "" && (
          <li className="flex gap-3 items-center flex-wrap mb-3">
            <div className="">
              <HandWatchIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Company Size
              </h5>
              <p className="text-grayLight text-sm">
                {data?.company?.companySize}
              </p>
            </div>
          </li>
        )}
        {data?.company?.avarageSalary !== "" && (
          <li className="flex gap-3 items-center flex-wrap mb-3">
            <div className="">
              <DollarIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Avg. Salary
              </h5>
              <p className="text-grayLight text-sm">
                {data?.company?.avarageSalary}
              </p>
            </div>
          </li>
        )}
        {data?.company?.location !== "" && (
          <li className="flex gap-3 items-center flex-wrap mb-3">
            <div className="">
              <JobLocationIcon
                className="w-[50px] h-[50px] text-themePrimary"
                aria-hidden="true"
              />
            </div>
            <div className="">
              <h5 className="text-base font-medium text-black leading-5 mb-0">
                Job Location
              </h5>
              <p className="text-grayLight text-sm">
                {data?.company?.location}
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CompanyInfo;

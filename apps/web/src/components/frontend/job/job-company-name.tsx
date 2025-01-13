"use client"
import React from "react";
import { LoaderGrowing } from "../../lib/loader";
import Image from "../../optimize/image";

const JobCompanyName = ({ data }: { data: any }) => {
  return (
    <div className="p-8 rounded-md bg-white relative">
      {(!data?.data || data?.loading) && <LoaderGrowing />}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Image
            width={100}
            height={100}
            noPlaceholder
            src={
              data?.data?.company?.logo
                ? data.data.company.logo
                : "/assets/img/avatar.png"
            }
            alt="img"
          />
        </div>
        <h4 className="text-lg2 font-medium text-black leading-6 mb-1">
          {data?.data?.company?.companyName
            ? data.data.company.companyName
            : "Company Name"}
        </h4>
        <p className="text-xs font-normal text-black leading-5 mb-4">
          {data?.data?.company?.companyTagline
            ? data?.data?.company.companyTagline
            : "Company Tagline"}
        </p>
        <p className="mb-3">
          <a
            className="text-xxs font-normal text-black leading-6 block"
            href={`mailto:${
              data?.data?.company?.companyEmail
                ? data.data.company.companyEmail
                : "info@example.com"
            }`}
          >
            {data?.data?.company?.companyEmail
              ? data.data.company.companyEmail
              : "info@example.com"}
          </a>
          <a
            className="text-xxs font-normal text-black leading-6 block"
            href={`tel:${
              data?.data?.company?.phoneNumber
                ? data.data.company?.phoneNumber
                : "123456789"
            }`}
          >
            {data?.data?.company?.phoneNumber
              ? data.data.company?.phoneNumber
              : "123456789"}
          </a>
        </p>
        <ul className="flex gap-3 flex-wrap justify-center">
          {/* website link */}
          {data?.data?.company?.companyWebsite && (
            <li>
              <a
                href={`${data?.data?.company?.companyWebsite}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Image
                  width={36}
                  height={36}
                  noPlaceholder
                  src="/assets/img/global.svg"
                  alt="icon"
                />
              </a>
            </li>
          )}
          {/* facebook link */}
          {data?.data?.company?.socialLink?.facebook && (
            <li>
              <a
                href={data?.data?.company?.socialLink?.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  width={36}
                  height={36}
                  noPlaceholder
                  src="/assets/img/fb.svg"
                  alt="icon"
                />
              </a>
            </li>
          )}
          {/* linkedin link */}
          {data?.data?.company?.socialLink?.linkedin && (
            <li>
              <a
                href={data?.data?.company?.socialLink?.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  width={36}
                  height={36}
                  noPlaceholder
                  src="/assets/img/linkedin.svg"
                  alt="icon"
                />
              </a>
            </li>
          )}
          {/* twitter link */}
          {data?.data?.company?.socialLink?.twitter && (
            <li>
              <a
                href={data?.data?.company?.socialLink?.twitter}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  width={36}
                  height={36}
                  noPlaceholder
                  src="/assets/img/twitter2.svg"
                  alt="icon"
                />
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default JobCompanyName;

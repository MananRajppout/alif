"use client";
import Head from "next/head";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import Layout from "../src/components/frontend/layout/index";

const PageNotFound = () => {
  return (
    <>
      <Head>
        <meta name="description" content="404: page not found" />
      </Head>

      <Layout>
        <main>
          <div className="container mx-auto px-4 py-16">
            <div className="bg-gray-200 w-full sm:px-16 md:px-0 py-20 sm:py-28 flex items-center justify-center">
              <div className="bg-white border border-gray flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
                <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-themeDark">
                  404
                </p>
                <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-themeDark mt-4">
                  Page Not Found
                </p>
                <p className="text-themeDarkAlt mt-4 pb-4 border-b-2 border-gray text-center">
                  Sorry, the page you are looking for could not be found.
                </p>
                <div className="flex flex-wrap mt-6 gap-5 md:gap-8 justify-center items-center">
                  <Link href="/" legacyBehavior>
                    <a
                      className="flex items-center space-x-2 bg-themePrimary hover:scale-105 text-themeLighterAlt px-4 py-2 rounded transition duration-150"
                      title="Return Home"
                    >
                      <FaHome className="w-5 h-5" />
                      <span>Return Home</span>
                    </a>
                  </Link>
                  <span
                    className="flex items-center space-x-2 m-0 bg-themePrimary hover:scale-105 text-themeLighterAlt px-4 py-2 rounded transition duration-150 cursor-pointer"
                    title="Return Back"
                    onClick={() => window.history.back()}
                  >
                    <TbArrowBackUp className="w-6 h-6" />
                    <span>Return Back</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default PageNotFound;

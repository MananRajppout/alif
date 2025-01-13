"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import React from "react";
import Layout from "@/src/components/frontend/layout/index";
import PageTitle from "@/src/components/frontend/page-title/index";
import capitalize from "@/src/components/lib/capitalize";

const AboutUs = () => {
  let path = usePathname();
  path = path.replace("/", "");
  path = capitalize(path);
  path = path.replace(/-/g, " ");

  return (
    <>
      <Head>
        <meta name="description" content={path} />
      </Head>

      <Layout>
        <main className="bg-light">
          <PageTitle title={path} />
          <div className="container mx-auto px-4 py-16 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-5 ">
              <div className="shadow rounded bg-white p-8 relative ">
                <p className="text-themeLight leading-6 mb-4">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industrys
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Leeriest sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p className="text-themeLight leading-6 mb-4">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using Content
                  here, content here, making it look like readable English. Many
                  desktop publishing packages and web page editors now use Lorem
                  Ipsum as their default model text, and a search for lorem
                  ipsum will uncover many web sites still in their infancy.
                  Various versions have evolved over the years, sometimes by
                  accident, sometimes on purpose (injected humour and the like).
                </p>
              </div>
              <div className="shadow rounded bg-white p-8 relative">
                <p className="text-themeLight leading-6 mb-4">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industrys
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Leeriest sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p className="text-themeLight leading-6 mb-4">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using Content
                  here, content here, making it look like readable English. Many
                  desktop publishing packages and web page editors now use Lorem
                  Ipsum as their default model text, and a search for lorem
                  ipsum will uncover many web sites still in their infancy.
                  Various versions have evolved over the years, sometimes by
                  accident, sometimes on purpose (injected humour and the like).
                </p>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default AboutUs;

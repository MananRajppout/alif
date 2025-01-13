"use client";
import _ from "lodash";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { Axios } from "@/src/components/utils/axiosKits";
import BlogItem from "@/src/components/frontend/blog/blog-item";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import blogsDataPre from "@/src/data/blogData.json";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);
const blogsAPI = "/blogs/retrives";

export default function CareerAdvice() {
  const { data: blogsData, error: blogsError } = useSWR(blogsAPI, fetcher, {
    fallbackData: blogsDataPre,
  });

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Read All career advice from expert. "
        />
      </Head>

      <Layout>
        <main className="bg-grey">
          <PageTitle title="Career Advice" />
          <section className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="container">
              <div className="grid gap-4 xl:gap-6 xl:grid-cols-3 md:grid-cols-2">
                {_.map(blogsData, (item, index) => (
                  <BlogItem data={item} key={index} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
}

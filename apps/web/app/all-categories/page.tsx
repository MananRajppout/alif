"use client";
import Head from "next/head";
import React from "react";
import CategorySection from "@/src/components/frontend/categories/category-section";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import { LoaderGrowing } from "@/src/components/lib/loader";
import { ThemeContext } from "@/src/context/ThemeContext";
import axios from "axios";

export default function AllCategory() {
  const { categoryData, categoryError } = React.useContext(ThemeContext) ??  { };

  if (categoryError) return <div>Error! {categoryError}</div>;
  if (!categoryData) return <LoaderGrowing />;

  // const [categoryData, setCategoryData] = React.useState([]);
  // if(!categoryData) return <LoaderGrowing />

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await axios.get("/api/v1/jobs/categories/retrives");
  //     const data = await res.data;
  //     setCategoryData(data.data);
  //   };
  //   fetchData();
  // },[])

  return (
    <div className="bg-light">
      <Head>
        <meta
          name="description"
          content="Explore the latest tech job opportunities. Find all jobs category. Your next tech career awaits."
        />
      </Head>

      <Layout>
        <main className="bg-light">
          <PageTitle title="All Categories" />
          <section className="pt-20 pb-24 !bg-light mt-12">
            <div className="container">
              
              <CategorySection categoryData={categoryData} />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  );
}

"use client"
import Sidebar from "@/src/components/frontend/blog/sidebar";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import { Axios } from "@/src/components/utils/axiosKits";
import blogsDataPre from "@/src/data/blogData.json";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);
const blogsAPI = "/blogs/blog/single-blog";

export default function PostPage() {
  const { data: blogsData, error: blogsError } = useSWR(blogsAPI, fetcher, {
    fallbackData: blogsDataPre[0],
  });
  const { title, cover_image, excerpt, date, content } = blogsData;
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt || "Blog Details"} />
      </Head>
      <main className="bg-light">
        {/* container */}
        <PageTitle
          title={title}
          image={cover_image || "/assets/img/post/default.webp"}
          excerpt={excerpt}
        />
        <div className="container mx-auto px-4 py-16 ">
          <div className="flex gap-10 justify-center md:flex-col">
            <div className="col-span-12 lg:col-span-8 bg-white shadow-md rounded-lg p-10 " style={{
              maxWidth: '800px',
              width: '1200px'
            }}>
              <div className="pb-3 mb-5 border-b border-gray">
                <div className="w-fit text-themeLighterAlt px-2.5 py-1 bg-themePrimary text-xs md:text-sm rounded-md mb-2">
                  Technology
                </div>
                {/* <h3 className="text-base-content font-semibold text-xl md:text-2xl lg:text-4xl leading-7 md:leading-10 ">
                                    {title}
                                </h3> */}
                <div className="mt-3 md:mt-6 flex items-center gap-5 text-base-content/60">
                  <div className=" flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 rounded-full overflow-hidden">
                        <img src="https://placehold.it/100x100" alt="avatar" />
                      </div>
                    </div>
                    <a
                      href="/"
                      className=" text-xs md:text-base font-medium hover:text-themePrimary transition hover:duration-300"
                    >
                      John Doe
                    </a>
                  </div>
                  <p className=" text-xs md:text-base">August 20, 2022</p>
                </div>
              </div>
              <div className="my-5 ">
                <Image
                  width="800"
                  height="462"
                  alt={`blog_image`}
                  className={`rounded-xl w-full`}
                  src={"/assets/img/post/blog-img-3.webp"}
                  placeholder="blur"
                  blurDataURL="/assets/img/post/blog-img-3.webp"
                  quality={90}
                  priority={true}
                />
              </div>

              {/* article section start  */}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            <Sidebar data={blogsDataPre} />
          </div>
        </div>
      </main>
    </Layout>
  );
}

"use client";
import _ from "lodash";
import Head from "next/head";
import React, { useEffect } from "react";
import useSWR from "swr";
import { Axios } from "@/src/components/utils/axiosKits";
import BlogItem from "@/src/components/frontend/blog/blog-item";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import OpportunityCard from "@/src/components/frontend/event/opportunity-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);
export default function Page({ params }: { params: { id: string } }) {
    const { data, error } = useSWR(`/events/get-opportunities-by-event-id/${params.id}`, fetcher);
    const {status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status == 'unauthenticated'){
            router.push('/login');
        }
    },[status]);

    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Upcoming Events "
                />
            </Head>

            {
                !error && data &&
                <Layout>

                    <main className="bg-grey">
                        <PageTitle title={data[0]?.event_id?.eventName}/>
                        <section className="py-10  bg-white px-10">
                                <h1 className="text-4xl font-medium uppercase">ALL Opportunities</h1>
                                <div className="container mt-20">
                                    <div className="grid gap-4 xl:gap-6 xl:grid-cols-3 md:grid-cols-2">
                                        {
                                            _.map(data,(opportunity) => (
                                                <OpportunityCard opportunity={opportunity}/>
                                            ))
                                        }
                                    </div>
                                </div>
                        </section>
                    </main>
                </Layout >
            }

        </>
    );
}

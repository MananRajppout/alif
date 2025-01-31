"use client";
import _ from "lodash";
import Head from "next/head";
import React, { useCallback, useLayoutEffect, useState } from "react";
import useSWR from "swr";
import { Axios } from "@/src/components/utils/axiosKits";
import BlogItem from "@/src/components/frontend/blog/blog-item";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import OpportunityCard from "@/src/components/frontend/event/opportunity-card";
import { ArrowRight, Route, User } from "lucide-react";
import { IOpportunity } from "@/interface/EventInterface";
import { AxiosError } from "axios";
import { registerOnOpportunityRequest } from "@/http/event";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQue } from "@/src/context/QueContent";
import { FormLoader } from "@/src/components/lib/loader";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);
export default function Page({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { data, error }: {data: IOpportunity, error: any} = useSWR(`/events/get-opportunity-by-id/${params.id}`, fetcher);
    const { data:userData, status } = useSession();
    const user: any = userData?.user;
    const router = useRouter();
    const {handleAddInQue} = useQue();
    

    const handleApply = useCallback(async () => {
        if(status == 'unauthenticated'){
            toast.error("please login first");
            return;
        }
        if(!user.role.isCandidate){
            toast.error("As a Employer you cannot apply for interview.");
            return;
        }
        
        setLoading(true);
        try {
            const formdata = {
                status: 'pending',
                user_id: user._id,
            }
            const res = await registerOnOpportunityRequest(formdata,data?._id);
            handleAddInQue({
                oppotunity_id: data?._id,
                user_id: user?._id,
                round_id: data?.rounds[0]?._id
            });
            router.push(`/wating-room/${data?.rounds[0]?._id}`);
            toast.success(res.data.message);

        } catch (error) {
            console.log((error as Error)?.message)
        }finally{
            setLoading(false);
        }
    },[data?._id,user,status]);


    //check participants is already applied 
    useLayoutEffect(() => {
        if(data && user){
            const isExist:any = data.participants.find(partipant => partipant.user.toString() == user?._id);
            if(isExist && isExist.status == 'pending'){
                router.push(`/wating-room/${data?.rounds[0]?._id}`);
                return
            }

            if(isExist && isExist.status != 'pending'){
                router.push(`/results/${data?._id}?result=${isExist.status}`);
            }

        }
    },[data,user]);

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
                        <PageTitle title={data.name} />
                        <section className="py-10  bg-white px-10">
                            <h1 className="text-4xl font-medium uppercase">Opportunities Info</h1>
                            <div className="container mt-10">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-medium mb-4">{data.name}</h2>
                                </div>

                                <p className='text-gray-600 mb-4 font-normal opacity-70 text-[18px] leading-7'>
                                    {data.description}
                                </p>

                                <p className='text-gray-600 mb-2 font-normal opacity-50 text-[18px] leading-7'>
                                    Tatal Interview Round: {data.rounds?.length}
                                </p>
                                <p className='text-gray-600 mb-2 font-normal opacity-50 text-[18px] leading-7'>
                                    Tatal Apply Candidate: {data.participants?.length}
                                </p>


                                <div className="px-6 py-4">
                                    <button
                                        className="w-full bg-themePrimary hover:bg-themeDarkerAlt disabled:bg-themeDarkerAlt text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center group"
                                        aria-label="Register for event"
                                        onClick={handleApply}
                                        disabled={loading}
                                    >
                                        <span>{!loading ? 'Apply For Live Interview' : 'Loading...'}</span>
                                        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                                        {loading && <FormLoader/>}
                                    </button>
                                </div>

                            </div>
                        </section>
                    </main>
                </Layout >
            }

        </>
    );
}

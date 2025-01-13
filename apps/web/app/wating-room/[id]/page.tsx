'use client'
import { IRound } from '@/mongo/models/round.model'
import Layout from '@/src/components/frontend/layout'
import PageTitle from '@/src/components/frontend/page-title'
import { Axios } from '@/src/components/utils/axiosKits'
import { useQue } from '@/src/context/QueContent'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);
const page = ({params}:{params: {id: string}}) => {
  const [myIndex, setMyIndex] = useState<number>(-1);
  const { data, error }:{data: IRound,error: any} = useSWR(`/events/get-round-by-id/${params.id}`, fetcher);
  const {data:userData} = useSession();
  const user:any = userData?.user;
  const {getMyIndex} = useQue();



  //get my index
  useEffect(() => {
    if(user){
      getMyIndex({
        user_id: user?._id,
        round_id: params.id
      },setMyIndex);
    }
  },[user]);

  return (
    <>
            <Head>
                <meta
                    name="description"
                    content="Wating Room"
                />
            </Head>

            {
              data && !error && 
              <Layout>
                <PageTitle title={data?.name}/>
                  <section className='py-16 px-10'>
                    <div className='mb-5 mt-5'>
                      {
                        myIndex == 0 ?
                        <h1 className='text-2xl'>Next is your turn, be ready!</h1>
                        :
                        <h1 className='text-2xl'>It's your turn after {myIndex} users.</h1>
                      }
                    </div>
                    <h1 className='text-3xl font-normal text-black/90 mt-10'>Important Info</h1>
                    <p className='text-md leading-7 font-normal text-black/50 mt-10'>{data?.description}</p>
                  </section>
              </Layout >
            }
            

        </>
  )
}

export default page
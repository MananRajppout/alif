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
const page = ({ params }: { params: { id: string } }) => {
  const [myIndex, setMyIndex] = useState<number>(-1);
  const { data, error }: { data: IRound, error: any } = useSWR(`/events/get-round-by-id/${params.id}`, fetcher);
  const { data: userData } = useSession();
  const user: any = userData?.user;
  const { getMyIndex } = useQue();



  //get my index
  useEffect(() => {
    if (user) {
      getMyIndex({
        user_id: user?._id,
        round_id: params.id
      }, setMyIndex);
    }
  }, [user]);

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
          <PageTitle title={data?.name} />
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
            <ul className='list-disc space-y-2 mt-3' style={{listStyle: 'desc'}}>
              <li>Stay Online for Your Interview: Once you have applied for the interview, please remain online on the website to be available for your scheduled interview. You will be notified when it is your turn to join the interview.</li>
              <li>Keep Your Session Active: To ensure you don't miss your interview, please make sure your session remains active. Avoid leaving the page, and stay connected to the website.</li>
              <li>Receive Real-Time Notifications: You will receive a notification here on the website when it's time for your interview. Make sure to check for updates regularly, as we will notify you when it's your turn to join.</li>
              <li>Don't Leave the Page: If you leave the page or become inactive for too long, you may miss your opportunity for the interview. Stay on the website to ensure you're available when your interview starts.</li>
              <li>Email Notification: In any case, if you do not receive a notification on the website, we will also send an email to your registered account to notify you of the next steps and when it's time to join the interview. Please check your email actively to stay informed.</li>
            </ul>



            <h1 className='text-3xl font-normal text-black/90 mt-10'>Round Description</h1>
            <p className='text-md leading-7 font-normal text-black/50 mt-3'>{data?.description}</p>
          </section>
        </Layout >
      }


    </>
  )
}

export default page
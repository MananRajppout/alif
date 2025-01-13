'use client'
import React, { useCallback } from 'react'
import useSWR from 'swr';
import { authAxios } from '../../utils/axiosKits';
import moment from 'moment';
import Link from 'next/link';
import { getCandidateResumeRequest } from '@/http/event';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const status = {
    'pending': "In Que",
    'rejected': 'Rejected',
    'accepted': 'Complete'
}

type Status = 'pending' | 'rejected' | 'accepted'

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const EmploterDashboard = () => {
    const { data, error } = useSWR("/events/get-my-register-events", fetcher);
    const router = useRouter();

    const handleCandidateClick = useCallback(async (id:string) => {
        try {
            const res = await getCandidateResumeRequest(id);
            if(res?.data?.data){
                router.push(`/resume/${res?.data?.data?._id}`)
            }else{
                toast.error("candidate does not have a resume.")
            }
        } catch (error) {
            
        }
    },[]);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className='p-5 shadow-md rounded-md'>
                <h1 className='text-lg2 font-semibold'>Register Events</h1>
                <div className='bg-grayLight/40 py-3 px-3 rounded-md flex justify-between items-center mt-5 text-black/90'>
                    <h2 className='text-lg2'>Total: {data?.opportunities?.length}</h2>
                </div>

                <div className='mt-8 space-y-12'>
                    {
                        data?.opportunities && data?.opportunities.map((opportunity:any) => (
                            <div className='flex items-center justify-between'>
                                <div className='space-y-1'>
                                    <h3 className='font-semibold'>Event Name: {opportunity?.event_id?.eventName}</h3>
                                    <h3 className='font-normal '>Date: {moment(opportunity?.event_id?.date).format("LLL")}</h3>
                                    <h3 className='font-normal '>Candidate: {opportunity?.participants?.length}</h3>
                                    <h3 className='font-normal '>Round: {opportunity?.rounds?.length}</h3>
                                </div>
                                <Link href={`/event/register/${opportunity?.event_id?._id}`} className='py-2 px-4 rounded-3xl bg-sky-600 hover:bg-sky-700 transition-all text-white text-center'>
                                    View Details
                                </Link>
                            </div>
                        ))
                    }

                </div>
            </div>



            <div className='p-5 shadow-md rounded-md'>
                <h1 className='text-lg2 font-semibold'>Candidates</h1>
                <div className='bg-grayLight/40 py-3 px-3 rounded-md flex justify-between items-center mt-5 text-black/90'>
                    <h2 className='text-lg2'>Total: {data?.participants?.length}</h2>
                </div>

                <div className='mt-8 space-y-12'>
                    {
                        data?.participants && data?.participants.map((participant:any) => (
                            <div className='flex items-center justify-between'>
                                <div className='space-y-1'>
                                    <h3 className='font-semibold'>Name: {participant?.user?.fullName?.firstName} {participant?.user?.fullName?.lastName}</h3>
                                    <h3 className='font-normal '>Status: {status[participant?.status as Status]}</h3>
                                    <h3 className='font-normal '>email: {participant?.user?.email}</h3>
                                </div>
                                <button className='py-2 px-4 rounded-3xl bg-sky-600 hover:bg-sky-700 transition-all text-white text-center' onClick={() => handleCandidateClick(participant?.user?._id)}>
                                    View Details
                                </button>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default EmploterDashboard
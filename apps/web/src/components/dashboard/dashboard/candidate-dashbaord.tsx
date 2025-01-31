'use client'
import React, { useCallback } from 'react'
import useSWR from 'swr';
import { authAxios } from '../../utils/axiosKits';


const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const CandidateDashboard = () => {
    const { data, error } = useSWR("/events/get-employers-data", fetcher);
    

    return (
        <div className="grid grid-cols-1 gap-5">
            <div className='p-5 shadow-md rounded-md'>
                <h1 className='text-lg2 font-semibold'>Companies Engagement</h1>
                <div className='flex items-center justify-between px-2 mt-8'>
                    <div className='space-x-3'>
                        <h1 className='text-md font-semibold'>Total Companies</h1>
                        <h1 className='text-xl font-semibold'>{data?.employerCount}</h1>
                    </div>

                    <div className='space-x-3'>
                        <h1 className='text-md font-semibold'>Active Companies</h1>
                        <h1 className='text-xl font-semibold'>{data?.activeEmployerCount}</h1>
                    </div>

                    <div className='space-x-3'>
                        <h1 className='text-md font-semibold'>Inactive Companies</h1>
                        <h1 className='text-xl font-semibold'>{data?.inActiveEmployeCount}</h1>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default CandidateDashboard
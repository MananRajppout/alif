'use client'
import React, { useCallback } from 'react'
import useSWR from 'swr';
import { authAxios } from '../../utils/axiosKits';


const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const AdminDashboard = () => {
    const { data, error } = useSWR("/events/get-latest-event", fetcher);
    console.log(data)

    return (
        <div className="grid grid-cols-1 gap-5">
            <div className='p-5 shadow-md rounded-md'>
                <h1 className='text-lg2 font-semibold'>Latest Event: <span className='uppercase'>{data?.eventName}</span></h1>

                <div className="relative overflow-x-auto sm:rounded-lg" style={{ marginTop: "1rem" }}>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Total Round
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Total Partipant
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    created By
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.opportunities && data?.opportunities.map((opportunity:any) => (
                                    <tr className="odd:bg-white even:bg-gray-50 border-b border-grayLight/30">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                            {opportunity?.name}
                                        </th>
                                        <td className="px-6 py-4">
                                        {opportunity?.rounds?.length}
                                        </td>
                                        <td className="px-6 py-4">
                                        {opportunity?.participants?.length}
                                        </td>
                                        <td className="px-6 py-4">
                                        {opportunity?.user?.fullName?.firstName} {opportunity?.user?.fullName?.lastName}
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}

export default AdminDashboard
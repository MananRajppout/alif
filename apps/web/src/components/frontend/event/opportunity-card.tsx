import { IOpportunity } from '@/interface/EventInterface'
import { ArrowRight, Route, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC, useCallback } from 'react'


interface IProps {
  opportunity: IOpportunity
}
const OpportunityCard: FC<IProps> = ({ opportunity }) => {
  const router = useRouter();

  const viewHandler = useCallback(() => {
    router.push(`/opportunities/${opportunity._id}`);
  },[opportunity._id]);
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-100 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      
      <div className="px-6 py-4">
        <h1 className="text-gray-600 mb-4 font-medium text-3xl">{opportunity.name}</h1>
        <div className='flex items-center justify-between my-6'>
          <p className='text-gray-600 font-normal text-lg opacity-70 flex items-center gap-4'>
            <User/>
            <span>{opportunity.role}</span>
          </p>
          <p className='text-gray-600  font-normal text-lg opacity-70 flex items-center gap-4'>
            <Route/>
            <span>{opportunity.rounds?.length}</span>
          </p>
        </div>
        
        <p className='text-gray-600 mb-4 font-normal opacity-70'>
          {opportunity.description.slice(0,150)}...
        </p>
      </div>
      <div className="px-6 py-4">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center group"
          aria-label="Register for event"
          onClick={viewHandler}
        >
          <span>View Oppotunity</span>
          <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  )
}

export default OpportunityCard
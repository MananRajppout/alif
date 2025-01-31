import { Menu } from 'lucide-react'
import React, { FC, useState } from 'react'



interface IProps {
    onNext: () => void;
    onPass: () => void;
    onFail: () => void;
    isPassDisabled: boolean;
    queCount: number;
    setFeedBackOpen: (value:boolean) => void;

}

const RoomSidebar:FC<IProps> = ({isPassDisabled,onNext,onPass,queCount,onFail,setFeedBackOpen}) => {
    const [expend,setExpend] = useState(false);
  return (
    <div className='fixed text-white'>
        <button className='text-white absolute top-0 left-0' style={{margin: '1rem'}} onClick={() => setExpend(prev => !prev)}><Menu size={40}/></button>
        <aside className={`bg-themeDarkerAlt shadow-sm h-screen flex flex-col pb-4 overflow-y-auto transition-all ${expend ? 'px-4': 'px-0'}`} style={{width:expend ? "20rem": "0rem",paddingTop: "5rem"}}>
            <div className='flex-1'>
                <h1 className='text-md uppercase mb-3'>Participant In Waiting: {queCount}</h1>
            
                <h1 className='text-2xl uppercase mb-3'>User Info</h1>
                <h2>User info will be here.</h2>
            </div>

            <div className='flex flex-col gap-2'>
                <button className={`py-2 px-4 rounded-md bg-themePrimary text-center font-medium text-md uppercase disabled:opacity-40`} onClick={onNext} disabled={!isPassDisabled}>Next</button>
                {/* <button className={`py-2 px-4 rounded-md bg-green-500 text-center font-medium text-md uppercase disabled:opacity-40`} disabled={isPassDisabled} onClick={onPass}>Pass</button>
                <button className={`py-2 px-4 rounded-md bg-red-500 text-center font-medium text-md uppercase disabled:opacity-40`} disabled={isPassDisabled} onClick={onFail}>Fail</button> */}
                <button className={`py-2 px-4 rounded-md bg-red-500 text-center font-medium text-md uppercase disabled:opacity-40`} disabled={isPassDisabled} onClick={() => setFeedBackOpen(true)}>View Feedback</button>
            </div>
        </aside>
    </div>
  )
}

export default RoomSidebar
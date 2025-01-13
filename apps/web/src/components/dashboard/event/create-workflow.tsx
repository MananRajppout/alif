'use client'

import { Round } from '@/app/event/register/[id]/page'
import { Plus } from 'lucide-react'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { FormLoader } from '../../lib/loader';


interface IProps {
    setRounds: Dispatch<SetStateAction<Round[]>>;
    rounds: Round[];
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}


const CreateWorkFlow: FC<IProps> = ({ rounds, setRounds, handleSubmit,loading }) => {


    const addRound = () => {
        setRounds(prev => [...prev, { name: `Round ${rounds.length + 1}`, description: '', roundType: '', index: rounds.length, rooms: [{ interviewerName: '', interviewerEmail: '' }] }]);
    }

    const updateRound = (index: number, field: keyof Round, value: string) => {
        const newRounds = [...rounds]
        newRounds[index] = { ...newRounds[index], [field]: value }
        setRounds(newRounds)
    }

    const addRoom = (roundIndex: number) => {
        const newRounds = [...rounds]
        newRounds[roundIndex].rooms.push({ interviewerName: '', interviewerEmail: '' })
        setRounds(newRounds)
    }

    const updateRoom = (roundIndex: number, roomIndex: number, field: keyof Room, value: string) => {
        const newRounds = [...rounds]
        newRounds[roundIndex].rooms[roomIndex] = { ...newRounds[roundIndex].rooms[roomIndex], [field]: value }
        setRounds(newRounds)
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
            <div className='flex justify-between items-center'>
                <h1 className="text-3xl font-bold text-center text-gray-800">Create Workflow</h1>
                <button
                    type="button"
                    onClick={addRound}
                    className="px-6 flex items-center gap-2 py-3 border border-transparent text-base font-medium rounded-md text-black bg-grayLight/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus />
                    Add Round
                </button>
            </div>


            {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
                        <h2 className="text-xl font-semibold text-white">Round {roundIndex + 1}</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor={`round-name-${roundIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Round Name</label>
                            <input
                                id={`round-name-${roundIndex}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={round.name}
                                onChange={(e) => updateRound(roundIndex, 'name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`round-description-${roundIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                id={`round-description-${roundIndex}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={round.description}
                                onChange={(e) => updateRound(roundIndex, 'description', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`round-type-${roundIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Round Type</label>
                            <select
                                id={`round-type-${roundIndex}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={round.roundType}
                                onChange={(e) => updateRound(roundIndex, 'roundType', e.target.value)}
                                required
                            >
                                <option value="">Select round type</option>
                                <option value="coding">Coding</option>
                                <option value="softskill">Soft Skill</option>
                                <option value="technical">Technical</option>
                                <option value="technical">Other</option>
                            </select>
                        </div>

                        <div>
                            <div className='flex items-center justify-between'>

                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rooms</h3>
                                <button
                                    type="button"
                                    onClick={() => addRoom(roundIndex)}
                                    className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Room
                                </button>

                            </div>
                            {round.rooms.map((room, roomIndex) => (
                                <div key={roomIndex} className="bg-gray-50 p-4 rounded-md mb-4 shadow-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor={`interviewer-name-${roundIndex}-${roomIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Interviewer Name</label>
                                            <input
                                                id={`interviewer-name-${roundIndex}-${roomIndex}`}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={room.interviewerName}
                                                onChange={(e) => updateRoom(roundIndex, roomIndex, 'interviewerName', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`interviewer-email-${roundIndex}-${roomIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Interviewer Email</label>
                                            <input
                                                id={`interviewer-email-${roundIndex}-${roomIndex}`}
                                                type="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={room.interviewerEmail}
                                                onChange={(e) => updateRoom(roundIndex, roomIndex, 'interviewerEmail', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-between">
                <button
                    disabled={loading}
                    type="submit"
                    className={`w-full disabled:opacity-40 disabled:bg-themeDarkerAlt py-2 flex items-center gap-4 justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-themePrimary hover:bg-themePrimary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600`}
                >
                    {loading ? 'Loading...' : 'Register Now'}
                    {loading && <FormLoader />}
                </button>
            </div>
        </form>
    )
}

export default CreateWorkFlow;
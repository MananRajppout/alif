import { IEvent } from '@/interface/EventInterface';
import { ArrowRight, CalendarDays, DollarSign, MapPin, Users } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { FC, useCallback } from 'react'

interface IProps {
    event: IEvent;
}

const UpcomingEventCard:FC<IProps> = ({event}) => {
    const router = useRouter();
    const handleRegister = useCallback(() => {
        router.push(`/event/register/${event._id}`);
    },[event._id]);
    return (
        <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-100 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="relative h-56 w-full group">
                <Image
                    src={event.coverImage}
                    alt={event.eventName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl group-hover:opacity-75 transition-opacity duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full font-semibold text-sm shadow-md">
                    Upcoming
                </div>
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full font-bold text-lg shadow-md">
                    {event.eventName}
                </div>
            </div>
            <div className="px-6 py-4">
                <p className="text-gray-600 text-sm mb-4 font-medium">{`${event.city}, ${event.state}, ${event.country}`}</p>
                <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                        <CalendarDays className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium">{moment(event.date).format('LLL')}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Users className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium">{event.numberOfSeats} seats available</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <DollarSign className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium">
                            {event.ticketPrice !== undefined ? `$${event.ticketPrice.toFixed(2)}` : 'Price not available'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4">
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center group"
                    aria-label="Register for event"
                    onClick={handleRegister}
                >
                    <span>Register Now</span>
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>
        </div>
    )
}

export default UpcomingEventCard
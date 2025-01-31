import {
  useState,
  useEffect,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import axios from "axios";

const EventCard = ({nearestEvent}:{
    nearestEvent: any
}) => {
  

    

  return (
    <div className="bg-white p-6 rounded-lg  grid grid-cols-2 gap-12">
      <div className="pl-16 ">
        <h1 className="bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text text-[18px] uppercase ">
            About Event
        </h1>
        <h2 className="text-5xl font-bold text-gray-800 mt-4">
          {nearestEvent.eventName}
        </h2>
        <p className="text-gray-600 mb-4 text-md mt-4 ml-3">{nearestEvent.about}</p>

        <ul className="text-left mb-4 text-lg mt-4">
          {nearestEvent.bulletPoints[0]
            .split(", ")
            .map(
              (
                point:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<AwaitedReactNode>
                  | null
                  | undefined,
                index: Key | null | undefined
              ) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="text-pink-500 mr-2">✓</span>
                  {point}
                </li>
              )
            )}
        </ul>
      </div>
      <div className="flex items-center justify-center relative">

      <img
        src={nearestEvent.coverImage}
        alt={nearestEvent.eventName}
        className="rounded-md w-[100%] mb-4"
        />
        </div>
    </div>
  );
};

export default EventCard;

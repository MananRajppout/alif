import React from "react";
import Broadcaster from "./Broadcaster";
import ReactPlayer from "react-player";
import VideoEnhancer from "./enhanceComp";
import ViewerCard from "./viewerCard";

interface VideoLayoutProps {
  broadcaster: React.ReactNode;
  viewers: {
    id: string;
    name: string;
    position: string;
    companyLogoImage: string;
    companyName: string;
    companyDescription?: string;
    companyWebsite?: string;
    JobTitle?: string;
    JobDescription?: string;
  }[];
  broadcastedStream: MediaStream | null;
  toggleEnhance: boolean;
  setSelectedJobApply: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
      position: string;
      companyLogoImage: string;
      companyName: string;
      companyDescription?: string;
      companyWebsite?: string;
      JobTitle?: string;
      JobDescription?: string;
    }>
  >;
  role?: string;
  handleConsumer?: any;
  currentPage: number;
}

const VIEWERS_PER_PAGE = 12; // Assuming each page shows 12 viewers.

const VideoLayout: React.FC<VideoLayoutProps> = ({
  broadcaster,
  viewers,
  broadcastedStream,
  toggleEnhance,
  setSelectedJobApply,
  handleConsumer,
  role,
  currentPage, // Passed from parent
}) => {
  // Get viewers for the current page
  const displayedViewers = viewers.slice(
    currentPage * VIEWERS_PER_PAGE,
    (currentPage + 1) * VIEWERS_PER_PAGE
  );

  return (
    <div className="w-full h-full primary-background-color grid grid-cols-4 grid-rows-4 gap-5">
      {/* Top row */}
      {displayedViewers.slice(0, 4).map((viewer, index) => (
        <ViewerCard
          setSelectedJobApply={setSelectedJobApply}
          role={role}
          key={index}
          viewerObject={viewer}
        />
      ))}

      {/* Middle section */}
      <div className="row-span-2 grid grid-rows-2 gap-5">
        {displayedViewers[4] && (
          <div className="secondary-background-color text-center rounded-lg overflow-hidden">
            <ViewerCard
              setSelectedJobApply={setSelectedJobApply}
              role={role}
              viewerObject={displayedViewers[4]}
            />
          </div>
        )}
        {displayedViewers[6] && (
          <div className="secondary-background-color text-center rounded-lg overflow-hidden">
            <ViewerCard
              setSelectedJobApply={setSelectedJobApply}
              role={role}
              viewerObject={displayedViewers[6]}
            />
          </div>
        )}
      </div>

      {/* Broadcasted stream */}
      <div className="col-span-2 row-span-2 secondary-background-color text-center rounded-lg overflow-hidden">
        {broadcastedStream &&
          (toggleEnhance ? (
            <VideoEnhancer mediaStream={broadcastedStream} />
          ) : (
            <ReactPlayer
              url={broadcastedStream}
              playing
              border-radius="10px"
              width="100%"
              height="100%"
              autoPlay
              muted
            />
          ))}
        {!broadcastedStream && (
          <button
            onClick={handleConsumer}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
            style={{ zIndex: 100 }}
          >
            Join
          </button>
        )}
      </div>

      {/* Middle right */}
      <div className="row-span-2 grid grid-rows-2 gap-5">
        {displayedViewers[5] && (
          <div className="secondary-background-color text-center rounded-lg overflow-hidden">
            <ViewerCard
              setSelectedJobApply={setSelectedJobApply}
              role={role}
              viewerObject={displayedViewers[5]}
            />
          </div>
        )}
        {displayedViewers[7] && (
          <div className="secondary-background-color text-center rounded-lg overflow-hidden">
            <ViewerCard
              setSelectedJobApply={setSelectedJobApply}
              role={role}
              viewerObject={displayedViewers[7]}
            />
          </div>
        )}
      </div>

      {/* Bottom row */}
      {displayedViewers.slice(8, 12).map((viewer, index) => (
        <div
          key={index + 8}
          className="secondary-background-color text-center rounded-lg overflow-hidden"
        >
          <ViewerCard
            setSelectedJobApply={setSelectedJobApply}
            role={role}
            viewerObject={viewer}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoLayout;

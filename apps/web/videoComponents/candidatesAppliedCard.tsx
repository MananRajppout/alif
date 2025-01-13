import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mail, Paperclip, ChevronLeft, ChevronRight } from "lucide-react";
import { FRONTEND_SERVER } from "@/utils/socketClient";

type Candidate = any;

export default function CandidatesAppliedCard({
  setShow,
  appliedCandidates,
  handleRemoveCandidate,
  handleSelectCandidate,
}: {
  setShow: any;
  appliedCandidates: Candidate[];
  handleRemoveCandidate: (id: string) => void;
  handleSelectCandidate: (id: string) => void;
}) {
  const [candidates, setCandidates] = useState<Candidate[]>(appliedCandidates);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCandidate = () => {
    if (candidates.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 >= candidates.length ? 0 : prevIndex + 1
      );
    }
  };

  const prevCandidate = () => {
    if (candidates.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex - 1 < 0 ? candidates.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    // console.log("Applied candidates:", appliedCandidates);
    // if (appliedCandidates?.length > 0) {
    //   setCandidates(appliedCandidates);
    //   setCurrentIndex(0);
    // } else {
    //   setCandidates([]);
    //   setCurrentIndex(0);
    // }
    console.log("Current candidates state:", candidates);
  }, [appliedCandidates]);

  // if (true) {
  //   return <div className="w-full h-full flex flex-col bg-white"></div>;
  // }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-[50px] w-full flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold text-center text-gray-800">
          Candidates Applied
        </p>
        <Plus
          className="text-black rotate-45 cursor-pointer"
          size={24}
          onClick={() => setShow(false)}
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {candidates.length > 0 ? (
              <div className="flex flex-col p-4 h-full">
                <div className="flex-grow flex flex-col gap-4">
                  <div className="w-full flex justify-center items-center">
                    <img
                      src={
                        candidates[currentIndex]?.userData?.resumeDetails
                          ?.photo || "https://via.placeholder.com/150"
                      }
                      alt={
                        candidates[currentIndex]?.userData?.userDetails
                          ?.fullName?.firstName || "Candidate"
                      }
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {candidates[currentIndex]?.userData?.userDetails?.fullName
                        ?.firstName || "N/A"}{" "}
                      {candidates[currentIndex]?.userData?.userDetails?.fullName
                        ?.lastName || ""}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Mail size={16} className="mr-2" />
                      <a
                        href={`mailto:${candidates[currentIndex]?.userData?.userDetails?.email || ""}`}
                        className="hover:underline"
                      >
                        {candidates[currentIndex]?.userData?.userDetails
                          ?.email || "N/A"}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Paperclip size={16} className="mr-2" />
                      <a
                        href={
                          FRONTEND_SERVER
                            ? `${FRONTEND_SERVER}/resume/${candidates[currentIndex]?.userData?.resumeDetails?._id}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  </div>
                  {candidates.length > 1 && (
                    <div className="flex justify-between items-center my-2">
                      <button
                        onClick={prevCandidate}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                      >
                        <ChevronLeft size={24} className="text-gray-500" />
                      </button>
                      <div className="text-black">
                        {candidates[currentIndex]?.userData?.resumeDetails
                          ?.skills?.[0] || ""}{" "}
                        |{" "}
                        {candidates[currentIndex]?.userData?.resumeDetails
                          ?.skills?.[1] || ""}
                      </div>
                      <button
                        onClick={nextCandidate}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                      >
                        <ChevronRight size={24} className="text-gray-500" />
                      </button>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded-lg ">
                    <p className="text-gray-700">
                      {candidates[currentIndex]?.info?.pitch ||
                        "No pitch available"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() =>
                      handleSelectCandidate(
                        candidates[currentIndex]?.userData.userDetails?._id ||
                          null
                      )
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Select Candidate
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveCandidate(
                        candidates[currentIndex]?.userData.userDetails?._id ||
                          null
                      )
                    }
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Reject Candidate
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 p-4">
                No candidates available
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="h-[30px] flex justify-center items-center">
        {candidates.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            initial={false}
            animate={{
              scale: index === currentIndex ? 1.2 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

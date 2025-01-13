import React, { useEffect, useState } from "react";
import { Plus, Send } from "lucide-react";
import { getChatSocket } from "@/utils/socketClient";
import { Socket } from "socket.io-client";

export default function sJobApplyCard({
  jobApply,
  setSelectedJobApply,
  roomId,
  onSubmit,
}: {
  roomId: string;
  jobApply: {
    id: string;
    name: string;
    position: string;
    companyLogoImage: string;
    companyName: string;
    companyDescription: string;
    companyWebsite: string;
    JobTitle: string;
    JobDescription: string;
  };
  setSelectedJobApply: any;
  onSubmit: (pitch: string) => void;
}) {
  const [pitch, setPitch] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the application submission here
    console.log("Submitting application:", { pitch, resumeFile });

    onSubmit(pitch);
  };

  return (
    <div className="w-full h-full flex flex-col ">
      <div className="h-[50px] w-full flex justify-between items-center p-4">
        <p className="text-lg font-bold text-center text-gray-500">Apply</p>
        <Plus
          className="text-black rotate-45 cursor-pointer"
          size={24}
          onClick={() => setSelectedJobApply(null)}
        />
      </div>
      <div className="flex-grow p-4 overflow-y-auto text-gray-600">
        <div className="mb-4">
          <img
            src={jobApply.companyLogoImage}
            alt={jobApply.companyName}
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-xl font-bold">{jobApply.JobTitle}</h2>
          <p className="text-gray-600">
            {jobApply.companyName} - {jobApply.position}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Company Description</h3>
          <p>{jobApply.companyDescription}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Job Description</h3>
          <p>{jobApply.JobDescription}</p>
        </div>
        <a
          href={jobApply.companyWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Visit Company Website
        </a>
      </div>
      <div className="p-4 bg-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Resume
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label
              htmlFor="pitch"
              className="block text-sm font-medium text-gray-700"
            >
              300 Character Pitch
            </label>
            <textarea
              id="pitch"
              rows={3}
              maxLength={300}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="mt-1 block w-full bg-gray-300 rounded-md outline-none text-black border-gray-300 shadow-sm "
              placeholder="Write a brief pitch (max 300 characters)..."
              style={{
                backgroundColor: "#F1F3F4",
              }}
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              {300 - pitch.length} characters remaining
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Apply Now
          </button>
        </form>
      </div>
    </div>
  );
}

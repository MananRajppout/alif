import React, { useState } from "react";

export default function ViewerCardRecruiter({
  viewerObject,
  setSelectedJobApply,
}: {
  viewerObject: any;
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
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleInvitationClick = () => {
    setSelectedJobApply(viewerObject);
    setIsClicked(true);

    // Reset the state after a short delay if you want to allow multiple clicks
    setTimeout(() => {
      setIsClicked(false);
    }, 2000); // Keep the tick visible for 2 seconds before resetting
  };

  if (
    viewerObject.userDetails &&
    viewerObject.userDetails.role.isCandidate == true
  ) {
    return (
      viewerObject.userDetails.role.isCandidate == true && (
        <div className="relative secondary-background-color text-center rounded-lg overflow-hidden flex flex-col p-2 gap-2 justify-between items-center h-auto group">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="primary-background-color rounded-lg p-2 shadow-lg flex gap-2">
              <button
                onClick={handleInvitationClick}
                className="secondary-background-color text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                {isClicked ? (
                  <span className="text-green-500 animate-pulse">✓</span>
                ) : (
                  "Send Invitation"
                )}
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div
            className="w-full text-end text-sm md:text-base"
            style={{
              height: "20px",
            }}
          >
            {viewerObject.resumeDetails.professionalTitle}
          </div>

          {/* Company Logo */}
          <div
            className="rounded-full bg-transparent bg-cover bg-center"
            style={{
              backgroundImage: `url(${viewerObject.userDetails.avatar})`,
              objectFit: "contain",
              backgroundSize: "contain",
              width: "60px", // Fixed width for the logo
              height: "auto", // Make the height adjust automatically
              aspectRatio: "1 / 1", // Ensure the image stays square
            }}
          ></div>

          {/* Name and Position */}
          <div
            className="w-full text-start text-sm md:text-base"
            style={{
              height: "20px",
            }}
          >
            {viewerObject.userDetails.fullName.firstName} (
            {viewerObject.resumeDetails.skills[0]} |{" "}
            {viewerObject.resumeDetails.skills[1]})
          </div>
        </div>
      )
    );
  } else if (viewerObject.company && viewerObject.job) {
    return (
      <div className="relative secondary-background-color text-center rounded-lg overflow-hidden flex flex-col p-2 gap-2 justify-between items-center h-auto group">
        {/* Buttons Container */}

        {/* Company Name */}
        <div
          className="w-full text-end text-sm md:text-base"
          style={{
            height: "20px",
          }}
        >
          {viewerObject.company.companyDetails.companyName}
        </div>

        {/* Company Logo */}
        <div
          className="rounded-full bg-transparent bg-cover bg-center"
          style={{
            backgroundImage: `url(${viewerObject.company.companyDetails.logo})`,
            objectFit: "contain",
            backgroundSize: "contain",
            width: "60px", // Fixed width for the logo
            height: "auto", // Make the height adjust automatically
            aspectRatio: "1 / 1", // Ensure the image stays square
          }}
        ></div>

        {/* Name and Position */}
        <div
          className="w-full text-start text-sm md:text-base"
          style={{
            height: "20px",
          }}
        >
          {viewerObject.job.jobTypes[0]} ({viewerObject.job.jobTitle})
        </div>
      </div>
    );
  }
}

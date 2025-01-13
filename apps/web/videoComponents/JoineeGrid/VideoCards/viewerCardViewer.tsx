export default function ViewerCardViewer({
  viewerObject,
  setSelectedJobApply,
  role,
}: {
  viewerObject: any;
  setSelectedJobApply: React.Dispatch<
    React.SetStateAction<{
      jobId: string;
      companyId: string;
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
}) {
  const mapJobToSetSelected = (viewerObject: any) => {
    // Assuming you're selecting the first job, adjust logic if selection is dynamic
    const selectedJob = viewerObject.job;
    const companyDetails = viewerObject.company.companyDetails;

    if (!selectedJob || !companyDetails) {
      console.error("Missing job or company details");
      return;
    }

    return {
      jobId: selectedJob._id,
      companyId: companyDetails._id,
      name: companyDetails.companyName || "",
      position: selectedJob.jobTitle || "",
      companyLogoImage: companyDetails.logo || "",
      companyName: companyDetails.companyName || "",
      companyDescription: companyDetails.description || "",
      companyWebsite: companyDetails.companyWebsite || "",
      JobTitle: selectedJob.jobTitle || "",
      JobDescription: selectedJob.jobDescription || "",
    };
  };

  if (
    viewerObject.userDetails &&
    viewerObject.userDetails.role.isCandidate == true
  ) {
    return (
      <div className="relative secondary-background-color text-center rounded-lg overflow-hidden flex flex-col p-2 gap-2 justify-between items-center h-auto group">
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
            backgroundImage: `url(${viewerObject.userDetails?.avatar})`,
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
    );
  } else if (viewerObject.company && viewerObject.job) {
    return (
      <div className="relative secondary-background-color text-center rounded-lg overflow-hidden flex flex-col p-2 gap-2 justify-between items-center h-auto group">
        {/* Buttons Container */}
        {role && role == "viewer" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="primary-background-color rounded-lg p-2 shadow-lg flex gap-2 ">
              <button
                onClick={() => {
                  console.log("Apply Now clicked");
                  const selectedJob = mapJobToSetSelected(viewerObject);
                  if (selectedJob) {
                    setSelectedJobApply(selectedJob);
                  }
                }}
                className="secondary-background-color  text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Apply Now
              </button>
              {/* Add more buttons here if needed */}
            </div>
          </div>
        )}

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

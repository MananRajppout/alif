export default function ViewerCardBroadcaster({
  viewerObject,
  role,
}: {
  viewerObject: any;

  role?: string;
}) {

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

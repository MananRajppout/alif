export default function ViewerCard({
  viewerObject,
  setSelectedJobApply,
  role,
}: {
  viewerObject: {
    id: string;
    name: string;
    position: string;
    companyLogoImage: string;
    companyName: string;
    companyDescription?: string;
    companyWebsite?: string;
    JobTitle?: string;
    JobDescription?: string;
  };
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
}) {
  return (
    <div className="relative secondary-background-color text-center rounded-lg overflow-hidden flex flex-col p-2 gap-2 justify-between items-center h-auto group">
      {/* Buttons Container */}
      {role && role == "viewer" && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="primary-background-color rounded-lg p-2 shadow-lg flex gap-2 ">
            <button
              onClick={() => {
                setSelectedJobApply(viewerObject);
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
        {viewerObject.companyName}
      </div>

      {/* Company Logo */}
      <div
        className="rounded-full bg-transparent bg-cover bg-center"
        style={{
          backgroundImage: `url(${viewerObject.companyLogoImage})`,
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
        {viewerObject.name} ({viewerObject.position})
      </div>
    </div>
  );
}

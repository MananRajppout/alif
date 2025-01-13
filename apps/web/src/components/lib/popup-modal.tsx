"use client";

const PopupModule = ({
  children,
  titleClassName,
  closeIconClassName,
  bodyClassName,
  overlayClassName,
  PopupTitle,
  Popup,
  PopupHandler,
  maxHeight,
}: {
  children?: any;
  titleClassName?: any;
  closeIconClassName?: any;
  bodyClassName?: any;
  overlayClassName?: any;
  PopupTitle?: any;
  Popup?: any;
  PopupHandler?: any;
  maxHeight?: any;
}) => {
  return (
    // Popup Wrapper
    <section
      className={`fixed w-full h-full top-0 left-0 bg-[rgba(0,_0,_0,_0.7)] z-[99] text-white transition-all duration-300 ease-in-out ${
        Popup ? "visible opacity-100" : "opacity-0 invisible"
      }`}
    >
      <div className="flex justify-center items-center w-full h-screen">
        {/* Form */}
        <div
          style={{
            maxHeight: maxHeight ? maxHeight : "90%",
          }}
          className={`relative max-w-[550px] w-full h-fit overflow-auto my-0 mx-auto bg-white
                  rounded-[5px] shadow-[0_0_10px_rgba(0,_0,_0,_0.2)] z-[2] transition duration-300 ease-in-out ${
                    Popup
                      ? "transform scale-[1] opacity-[1] visible"
                      : "transform scale-[0.7] invisible opacity-0"
                  }`}
        >
          {/* Form Title */}
          <div className="flex justify-between items-center py-5 px-10 border-b border-b-[#ebebeb]">
            {/* Form Title Text */}
            <div
              className={`text-[28px] font-medium text-black ${
                titleClassName ? titleClassName : ""
              }`}
            >
              {PopupTitle}
            </div>
            {/* Form Title Close */}
            <div
              onClick={PopupHandler}
              className={`cursor-pointer p-[14px] bg-black rounded-[5px] ${
                closeIconClassName
                  ? closeIconClassName
                  : "hover:bg-themePrimary duration-300 ease-in-out"
              }`}
            >
              <CloseIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          {/* Form Body */}
          <div
            className={`p-10 bg-white text-black ${
              bodyClassName ? bodyClassName : ""
            }`}
          >
            {children}
          </div>
        </div>
        {/* Popup Overlay */}
        <div
          className={`fixed top-0 left-0 w-full h-full z-[1]  ${
            overlayClassName ? overlayClassName : ""
          }`}
          //    overlayClassName={overlayClassName ? overlayClassName : ''}
          onClick={PopupHandler}
        />
      </div>
    </section>
  );
};

const CloseIcon = ({ ...props }) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
        fill="currentColor"
      />
    </svg>
  );
};

export default PopupModule;

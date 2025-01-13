"use client";


export const Loader = () => {
  return (
    <div id="preloader">
      <div className="sk-three-bounce">
        <div className="sk-child bg-themePrimary sk-bounce1"></div>
        <div className="sk-child bg-themePrimary sk-bounce2"></div>
        <div className="sk-child bg-themePrimary sk-bounce3"></div>
      </div>
    </div>
  );
};

export const LoaderGrowing = () => {
  return (
    <div className="absolute inset-0 flex bg-[#ffffffd0] z-40 justify-center items-center">
      <FormLoader className="text-themePrimary h-10 w-10" />
    </div>
  );
};

export const FormLoader = ({ ...props }: any) => {
  return (
    <svg
      className={`animate-spin min-h-[20px] min-w-[20px] ${
        props.className ? props.className : "h-5 w-5 text-themePrimary"
      }`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

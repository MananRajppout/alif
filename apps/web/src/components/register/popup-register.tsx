"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "../toast/toast";
import { ThemeContext } from "../../context/ThemeContext";
import { FormLoader } from "../lib/loader";
import { Axios } from "../utils/axiosKits";

const PopupRegister = () => {
  const { RegisterPopup, RegisterPopupHandler, LoginPopupHandler } =
    React.useContext(ThemeContext) as any;
  const [CurrentPage, setCurrentPage] = React.useState(1);
  const { addToast } = useToasts();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  /* ----------------------------- register submit function ---------------------------- */
  const onSubmitHandler = async (data: any) => {
    if (CurrentPage === 1) {
      setCurrentPage(2);
    }
    if (CurrentPage === 2) {
      if (data.password !== data.confirm_password) {
        addToast("Password and Confirm Password does not match", {
          appearance: "error",
          autoDismiss: true,
        });
      } else if (data.password === data.confirm_password) {
        try {
          await Axios({
            method: "post",
            url: `/users/signup`,
            data: {
              fullName: {
                firstName: data.first_name,
                lastName: data.last_name,
              },
              email: data.email,
              isConfirmed: false,
              password: data.password,
              role: {
                isCandidate:
                  data.freelancer_role === "candidate" ? true : false,
                isEmployer: data.freelancer_role === "employer" ? true : false,
                isAdmin: data.freelancer_role === "admin" ? true : false,
              },
            },
          }).then((res) => {
            if (res.status === 200 || res.status === 201) {
              addToast(res.data.message, {
                appearance: "success",
                autoDismiss: true,
              });
              RegisterPopupHandler();
              LoginPopupHandler();
              setTimeout(() => {
                setCurrentPage(1);
                reset();
              }, 3000);
            }
          });
        } catch (error: any) {
          setError(error.response.data.message)
          addToast(error.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
    }
  };

  /* ------------------------- previous page function ------------------------- */
  const previousHandler = () => {
    if (CurrentPage === 2) {
      setCurrentPage(1);
    }
  };

  const LoginHandler = async () => {
    await RegisterPopupHandler();
    await setTimeout(() => {
      LoginPopupHandler();
    }, 300);
  };



  const validatePassword = (value: string) => {
    const minLengthCheck = value.length >= 8;
    const upperCaseCheck = /[A-Z]/.test(value);
    const numberCheck = /[0-9]/.test(value);
    const specialCharCheck = /[@$!%*?&]/.test(value);

    if (!minLengthCheck) {
      return "Password must be at least 8 characters";
    }
    if (!upperCaseCheck) {
      return "Password must contain at least one uppercase letter";
    }
    if (!numberCheck) {
      return "Password must contain at least one number";
    }
    if (!specialCharCheck) {
      return "Password must contain at least one special character (@$!%*?&)";
    }
    return true;
  };





  return (
    // Popup Register Wrapper
    <section
      className={`fixed w-full h-full top-0 left-0 bg-[rgba(0,_0,_0,_0.7)] z-[9999] text-white transition-all duration-300 ease-in-out  ${RegisterPopup ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
      <div className="flex justify-center items-center w-full h-screen">
        {/* Register Form */}
        <div
          className={`relative z-[2] max-w-[550px] w-full max-h-[650px] overflow-auto my-0 mx-auto bg-white rounded-[5px] shadow-[0_0_10px_rgba(0,_0,_,_0.2)] transition-all duration-300 ease-in-out ${RegisterPopup
              ? "transform scale-100 opacity-100 visible"
              : "transform scale-[0.7] opacity-0 invisible"
            }`}
        >
          {/* Register Form Title */}
          <div className="flex justify-between items-center py-5 px-10 border-b border-b-[#ebebeb]">
            {/* Register Form Title Text */}
            <div className="text-[28px] font-medium text-[#000]">
              {CurrentPage === 1
                ? "Create an Account"
                : "Password Confirmation"}
            </div>
            {/* Register Form Title Close */}
            <div
              onClick={RegisterPopupHandler}
              className="cursor-pointer p-[15px] bg-[#000] rounded-[5px] selection:hover:bg-themePrimary duration-300 ease-in-out"
            >
              <RegisterFormTitleCloseIcon className="text-white w-4 h-4" />
            </div>
          </div>
          {/* Register Form Body */}
          <div className="py-6 px-10">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              {CurrentPage === 1 && (
                <>
                  <div className="flex gap-6 pt-2 pb-8 w-full">
                    {/* Label 1 */}
                    <div className="w-6/12">
                      <input
                        type="radio"
                        id="freelancer-radio"
                        defaultValue="candidate"
                        className="hidden absolute peer"
                        {...register("freelancer_role")}
                        defaultChecked
                      />
                      <label
                        htmlFor="freelancer-radio"
                        className="bg-themePrimary/20 block w-full text-themeDark hover:bg-themePrimary/30 duration-300 ease-in-out hover:text-themePrimary px-3 py-2.5 text-center cursor-pointer rounded peer-checked:bg-themePrimary peer-checked:text-white"
                      >
                        Candidate
                      </label>
                    </div>
                    {/* Label 2 */}
                    <div className="w-6/12">
                      <input
                        type="radio"
                        id="employer-radio"
                        defaultValue="employer"
                        {...register("freelancer_role")}
                        className="hidden absolute peer"
                      />
                      <label
                        htmlFor="employer-radio"
                        className="bg-themePrimary/20 block text-themeDark hover:bg-themePrimary/30 duration-300 ease-in-out hover:text-themePrimary px-3 py-2.5 w-full text-center cursor-pointer rounded peer-checked:bg-themePrimary peer-checked:text-white"
                      >
                        Employer
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block mb-2 text-themeDarker" htmlFor="">
                      First Name
                    </label>
                    <input
                      className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.first_name ? "!border-red-500" : "border-gray"
                        } rounded-lg placeholder-themeLight text-themeLight focus:outline-none `}
                      type="name"
                      {...register("first_name", {
                        required: true,
                      })}
                      placeholder="Enter Your First Name"
                    />
                    {errors?.first_name && (
                      <span className="text-red-600 text-xss italic">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block mb-2 text-themeDarker" htmlFor="">
                      Last Name
                    </label>
                    <input
                      className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.last_name ? "!border-red-500" : "border-gray"
                        } rounded-lg placeholder-themeLight text-themeLight focus:outline-none `}
                      type="name"
                      {...register("last_name", {
                        required: true,
                      })}
                      placeholder="Enter Your Last Name"
                    />
                    {errors?.last_name && (
                      <span className="text-red-600 text-xss italic">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block mb-2 text-themeDarker" htmlFor="">
                      Email
                    </label>
                    <input
                      className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border rounded-lg placeholder-themeLight text-themeLight focus:outline-none focus:ring-2 ${errors?.email ? "!border-red-500" : "border-gray"
                        } focus:ring-themePrimary focus:ring-opacity-50`}
                      type="email"
                      {...register("email", {
                        required: { value: true, message: "This field is required" }
                      })}
                      placeholder="Enter Your Email"
                    />
                    {errors?.email && (
                      <span className="text-red-600 text-xss italic">
                        This field is required
                      </span>
                    )}
                  </div>
                </>
              )}

              {CurrentPage === 2 && (
                <>
                  <div className="mb-3">
                    <label className="block mb-2 text-themeDarker" htmlFor="">
                      Password
                    </label>
                    <input
                      className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.password ? "!border-red-500" : "border-gray"
                        } rounded-lg placeholder-themeLight text-themeLight focus:outline-none `}
                      type="password"
                      {...register("password", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                        validate: validatePassword
                      })}
                      placeholder="Enter Password"
                    />
                    {errors?.password && (
                      <span className="text-red-600 text-xss italic">
                        {/* @ts-ignore */}
                        {errors?.password?.message}
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-themeDarker" htmlFor="">
                      Confirm Password
                    </label>
                    <input
                      className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.confirm_password
                          ? "!border-red-500"
                          : "border-gray"
                        } rounded-lg placeholder-themeLight text-themeLight focus:outline-none `}
                      type="password"
                      {...register("confirm_password", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                      placeholder="Enter Confirm Password"
                    />
                    {errors?.confirm_password && (
                      <span className="text-red-600 text-xss italic">
                        {/* @ts-ignore */}
                        {errors?.confirm_password?.message}
                      </span>
                    )}
                  </div>
                </>
              )}
              {
              error &&
              <span className="text-red-600 text-xss italic">
                {/* @ts-ignore */}
                {error}
              </span>
            }

              <div className="flex gap-4 mt-5">
                {CurrentPage === 2 && (
                  <button
                    onClick={previousHandler}
                    type="button"
                    className="inline-block !py-3 px-7 mb-6 w-full duration-300 ease-in-out text-base text-white font-normal text-center leading-6 bg-themePrimary rounded-md hover:bg-black"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex gap-2 justify-center items-center !py-3 px-7 mb-6 w-full duration-300 ease-in-out text-base text-white font-normal text-center leading-6 ${isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
                    } rounded-md hover:bg-black`}
                >
                  {CurrentPage === 1 ? (
                    "Next"
                  ) : (
                    <>
                      {isSubmitting ? "Please wait..." : "Sign Up"}
                      {isSubmitting && <FormLoader />}
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <p className="text-center">
              <span className="text-xss1 text-deep">
                Already have an account?
              </span>
              <button
                onClick={LoginHandler}
                className="inline-block text-xss1 text-themePrimary hover:underline ml-4"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
        {/* Popup Overlay */}
        <div
          onClick={RegisterPopupHandler}
          className="fixed top-0 left-0 w-full h-full z-[1]"
        />
      </div>
    </section>
  );
};

const RegisterFormTitleCloseIcon = ({ ...props }) => {
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

export default PopupRegister;

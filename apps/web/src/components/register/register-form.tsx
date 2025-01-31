"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import { Axios } from "../utils/axiosKits";

const RegisterForm = () => {
  const [CurrentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const { addToast } = useToasts();

  const Router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  /* ----------------------------- register submit function ---------------------------- */
  const onSubmitHandler = async (data: any) => {
    if (CurrentPage === 1) {
      setCurrentPage(2);
    }
    if (CurrentPage === 2) {
      setLoading(true);
      if (data.password !== data.confirm_password) {
        addToast("Password and Confirm Password does not match", {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
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
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              addToast(res.data.message, {
                appearance: "success",
                autoDismiss: true,
              });
              Router.push("/login");
              setTimeout(() => {
                setCurrentPage(1);
                reset();
              }, 3000);
            }
          });
        } catch (error: any) {
          setLoading(false);
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


  const validatePassword = useCallback((value: string) => {
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
  }, [])


  return (
    <div className="max-w-md mx-auto shadow px-8 py-10 rounded-lg bg-white ">
      <div className="mb-6 text-center">
        <h3 className="mb-4 text-2xl text-themeDarker">
          {CurrentPage === 1 ? "Create an Account" : "Password Confirmation"}
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {CurrentPage === 1 && (
          <>
            <div className="flex gap-6 pt-2 pb-8 w-full">
              <div className="w-6/12 checked:bg-themePrimary text-[#fff]">
                <input
                  type="radio"
                  id="freelancer-radio"
                  defaultValue="candidate"
                  className="hidden absolute"
                  {...register("freelancer_role")}
                  defaultChecked
                />
                <label
                  htmlFor="freelancer-radio"
                  className="bg-themePrimary/20 w-full text-themeDark hover:bg-themePrimary/30 duration-300 ease-in-out hover:text-themePrimary px-3 py-2.5 text-center cursor-pointer rounded"
                >
                  Candidate
                </label>
              </div>
              <div className="w-6/12 checked:bg-themePrimary text-[#fff]">
                <input
                  type="radio"
                  id="employer-radio"
                  defaultValue="employer"
                  {...register("freelancer_role")}
                  className="hidden absolute"
                />
                <label
                  htmlFor="employer-radio"
                  className="bg-themePrimary/20 text-themeDark hover:bg-themePrimary/30 duration-300 ease-in-out hover:text-themePrimary px-3 py-2.5 w-full text-center cursor-pointer rounded"
                >
                  Employer
                </label>
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-themeDarker" htmlFor="">
                First Name
              </label>
              <input
                className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.first_name ? "!border-red-500" : "border-gray"
                  } rounded-lg placeholder-coolGray-400 focus:outline-none `}
                type="name"
                {...register("first_name", { required: true })}
                placeholder="Enter Your First Name"
              />
              {errors?.first_name && (
                <span className="text-red-600 text-xss italic">
                  This field is required
                </span>
              )}
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-themeDarker" htmlFor="">
                Last Name
              </label>
              <input
                className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.last_name ? "!border-red-500" : "border-gray"
                  } rounded-lg placeholder-coolGray-400 focus:outline-none `}
                type="name"
                {...register("last_name", { required: true })}
                placeholder="Enter Your Last Name"
              />
              {errors?.last_name && (
                <span className="text-red-600 text-xss italic">
                  This field is required
                </span>
              )}
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-themeDarker" htmlFor="">
                Email
              </label>
              <input
                className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border rounded-lg placeholder-coolGray-400 focus:outline-none focus:ring-2 ${errors?.email ? "!border-red-500" : "border-gray"
                  } focus:ring-themePrimary focus:ring-opacity-50`}
                type="email"
                {...register("email", { required: true })}
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
            <div className="mb-6">
              <label className="block mb-2 text-themeDarker" htmlFor="">
                Password
              </label>
              <input
                className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.password ? "!border-red-500" : "border-gray"
                  } rounded-lg placeholder-coolGray-400 focus:outline-none `}
                type="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
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
                className={`appearance-none block w-full !p-3 leading-5 text-coolGray-900 border ${errors?.confirm_password ? "!border-red-500" : "border-gray"
                  } rounded-lg placeholder-coolGray-400 focus:outline-none `}
                type="password"
                {...register("confirm_password", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                  validate: (value) => {
                    return (
                      value === watch("password") || "Passwords do not match"
                    );
                  },
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

        <div className="flex gap-4">
          {CurrentPage === 2 && (
            <button
              onClick={previousHandler}
              className="inline-block !py-3 px-7 mb-6 w-full duration-300 ease-in-out text-base text-white font-normal text-center leading-6 bg-themePrimary rounded-md hover:bg-black"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-block !py-3 px-7 mb-6 w-full duration-300 ease-in-out text-base text-white font-normal text-center leading-6 bg-themePrimary rounded-md hover:bg-black"
          >
            {CurrentPage === 1 ? (
              "Next"
            ) : (
              <>{loading ? "Please wait..." : "Sign Up"}</>
            )}
          </button>
        </div>
        <p className="text-center">
          <span className="text-xss1 text-deep">Already have an account?</span>
          <Link href="/login" legacyBehavior>
            <a className="inline-block text-xss1 text-themePrimary hover:text-green-700 hover:underline ml-4">
              Log In
            </a>
          </Link>
        </p>
      </form>
    </div>
  );
};
export default RegisterForm;

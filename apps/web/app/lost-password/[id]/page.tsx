"use client"
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import Layout from "@/src/components/frontend/layout";
import { Axios } from "@/src/components/utils/axiosKits";
import { FormLoader } from "@/src/components/lib/loader";
import { useParams } from "next/navigation";

interface FormInputs {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordData {
  newPassword: string;
  resetLink: string;
}

const NewPassword = () => {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitHandler = async (data: FormInputs) => {
    if (!params.id) {
      addToast("Invalid reset link", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    const resetData: ResetPasswordData = {
      newPassword: data.newPassword,
      resetLink: params.id as string,
    };

    try {
      const response = await Axios({
        method: "PATCH",
        url: `/users/password/forget`,
        data: resetData,
      });

      if (response.status === 200 || response.status === 201) {
        addToast(response.data.message, {
          appearance: "success",
          autoDismiss: true,
        });
        reset();
        router.replace("/login");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message;
      addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div>
      <Head>
        <meta name="description" content="New password setup" />
      </Head>

      <Layout>
        <main className="bg-light">
          <div className="container pb-12 pt-12">
            <div className="flex justify-center px-5 my-20">
              <div className="w-full lg:w-1/2 p-6 m-auto shadow rounded bg-white">
                <h1 className="text-lg text-center font-semibold">
                  New Password
                </h1>
                <p className="text-center text-themeLight">
                  Please enter your new password
                </p>
                <form
                  className="mt-5"
                  onSubmit={handleSubmit(onSubmitHandler)}
                  noValidate
                >
                  <div className="mb-5 pb-4">
                    <input
                      type="password"
                      {...register("newPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                          message: "Password must contain at least one letter and one number",
                        },
                      })}
                      className={`appearance-none block w-full p-3 leading-5 text-themeDarker border ${
                        errors.newPassword ? "border-red-500" : "border-gray"
                      } rounded placeholder-themeDarkAlt focus:outline-none focus:ring-0`}
                      placeholder="New Password"
                      aria-invalid={errors.newPassword ? "true" : "false"}
                    />
                    {errors.newPassword && (
                      <span className="text-red-500 text-xss italic" role="alert">
                        {errors.newPassword.message}
                      </span>
                    )}
                  </div>
                  <div className="mb-5 pb-4">
                    <input
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === watch("newPassword") ||
                          "Passwords do not match",
                      })}
                      className={`appearance-none block w-full p-3 leading-5 text-themeDarker border ${
                        errors.confirmPassword ? "border-red-500" : "border-gray"
                      } rounded placeholder-themeDarkAlt focus:outline-none focus:ring-0`}
                      placeholder="Confirm Password"
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                    />
                    {errors.confirmPassword && (
                      <span className="text-red-500 text-xss italic" role="alert">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                  <button
                    className={`py-3 px-7 w-full flex gap-2 justify-center items-center transition-all duration-300 ease-in-out mb-4 text-base text-white font-normal text-center leading-6 ${
                      isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
                    } rounded-md hover:bg-black`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Please wait..." : "Reset Password"}
                    {isSubmitting && <FormLoader />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  );
};

export default NewPassword;
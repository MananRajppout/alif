"use client";
import React from "react";
import { useToasts } from "../../toast/toast";
import { FormLoader } from "../../lib/loader";
import { authAxios } from "../../utils/axiosKits";

const EmailAlert = () => {
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);
  // reset confirm email function
  const resendEmail = async () => {
    setLoading(true);
    try {
      await authAxios({
        method: "POST",
        url: `/users/resend-email`,
      }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setLoading(false);
        }
      });
    } catch (error: any) {
      if (error.response?.data) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setLoading(false);
    }
  };
  return (
    <div className=" bg-[#F8D7DA] shadow-[0px_8px_15px_-2px] shadow-red-300/60 py-3 px-4 rounded-md mb-10">
      <div className="flex gap-3 justify-between items-center">
        <div>
          <h3 className="text-xxs mb-2 font-medium">
            Email Verification Required
          </h3>
          <p>
            Please verify your email address by clicking the link in the email
            we sent you. Please check your spam folder if you don't see the
            email. If you still don't see the email, please contact us.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={resendEmail}
            className="text-xs flex gap-3 items-center whitespace-nowrap text-red-700 duration-300 ease-in-out border-2 border-red-700 px-4 py-2 rounded-lg hover:text-white hover:bg-themePrimary hover:border-themePrimary"
          >
            {loading ? "Sending..." : "Resend Email"}
            {loading && <FormLoader />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailAlert;

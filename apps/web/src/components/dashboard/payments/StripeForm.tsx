"use client"
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { deleteCookie } from "cookies-next";
import React, { useState } from "react";
import { useToasts } from "@/src/components/toast/toast";
import { useSWRConfig } from "swr";
import { FormLoader } from "../../lib/loader";

export default function StripeForm({ packageId }: any) {
  const { mutate } = useSWRConfig();

  const { addToast } = useToasts();
  const stripe = useStripe();
  const elements = useElements();

  const [btnDisable, setBtnDisable] = useState(true);

  const handleChange = (e: any) => {
    if (e?.complete) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case "succeeded":
            break;
          case "processing":
            break;
          case "requires_payment_method":
            break;
          default:
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await axios.put("/api/v1/users/package", {
        packageId: packageId,
      });
      await mutate("/users/retrives");

      if (data?.status !== 200) {
        setIsLoading(false);
        return;
      }

      deleteCookie("paymentIntent_id");

      const { error, paymentIntent } = (await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/packages/active-package`,
        },
        // redirect: "if_required",
      })) as any;

      if (error) {
        addToast(error?.message || "Sorry, Payment is not successful", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent?.status === "succeeded") {
        addToast("Payment is successful", {
          appearance: "success",
          autoDismiss: true,
        });
        setIsLoading(false);
      } else {
        addToast(error?.message || "Sorry, Payment is not successful", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      addToast(error?.message || "Sorry, Payment is not successful", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <div className="bg-white px-0 sm:px-4 py-3 rounded-xl mt-5">
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement id="payment-element" onChange={handleChange} />

          <div id="button-text" className="flex justify-center">
            <button
              id="submit"
              disabled={isLoading || !stripe || !elements || btnDisable}
              className={`${btnDisable ? " opacity-40" : ""}  ${
                isLoading ? " bg-themeDark" : " bg-themePrimary"
              } ${
                !btnDisable && !isLoading ? "hover:bg-themeDark" : ""
              }  text-white  my-5 px-5 py-4 flex items-center justify-center text-base font-semibold uppercase duration-500 ease-in-out rounded-md`}
            >
              {isLoading && (
                <span className="mr-2">
                  <FormLoader id="spinner" color={"text-themeDark"} />
                </span>
              )}
              {isLoading ? "Payment Processing" : "CONFIRM PAYMENT"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

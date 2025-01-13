"use client"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import axios from "axios";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToasts } from "@/src/components/toast/toast";
import useSWR from "swr";
import { authAxios } from "../../utils/axiosKits";
import StripeForm from "../payments/StripeForm";
import fallBackData from "./fallbackData.json";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const fetcher = (url: string) =>
  authAxios.get(url).then((res: any) => res.data);

const PreviewPackages = () => {
  const { addToast } = useToasts();

  const { data: userData } = useSession();
  const {
    email,
    fullName,
    phoneNumber,
    package: userPackage,
  } = userData?.user as any;

  const userDetails = {
    name: fullName,
    email: email,
    phone: phoneNumber,
  };

  const { data, error } = useSWR(`/packages/retrives`, fetcher, {
    fallbackData: fallBackData,
  });

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [modalOn, setModalOn] = useState(false);

  // =========================Start create payment intent and get client secret=====================
  const handlePaymentIntent = async (pricing: number, packageID: any) => {
    try {
      setPackageId(packageID);

      const { data } = await axios.post(
        "/api/v1/stripe/create-payment-intent",
        {
          price: pricing,
          userDetails,
        },
      );
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentID);
      setModalOn(true);
    } catch (error: any) {
      addToast(error.message || "Server Error", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  } as any;

  return (
    <div className="mx-auto">
      {/* error box */}
      {error && (
        <div className="w-full lg:w-1/3 mb-8 shadow rounded bg-red-400 mx-auto p-6">
          <h3 className="text-lg font-bold text-center text-white">
            Something went wrong. Please try again later. ☹️
          </h3>
        </div>
      )}
      {data && data?.data?.length > 0 && (
        <>
          <div className="w-full lg:w-1/2 mb-8">
            <h3 className="text-xl font-bold text-themeDarkerAlt !mb-3">
              We Have Exclusive Plan In Our Pricing
            </h3>
            <p className="text-xs text-themeLight">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Congue
              feugiat adipiscing urna mauris sit leo consectetur tortor, dui.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 2xl:!gap-14">
            {_.map(data?.data, (item, index) => (
              <div
                className={`${
                  item?._id === userPackage ? "border border-themePrimary" : ""
                } shadow rounded-lg overflow-auto relative bg-white`}
                key={index}
              >
                {/* Heading */}
                {item.subTitleStatus && (
                  <div className="w-full !py-1.5 text-sm text-center text-white bg-themePrimary">
                    {item.subtitle}
                  </div>
                )}
                {/* Body */}
                <div className="!px-6 pt-6 pb-20">
                  <h1 className="text-xxl2 font-semibold mb-6">
                    ${item.pricing === 0 ? "00" : item.pricing}
                    <span className="text-xs text-themeLight">/Monthly</span>
                  </h1>
                  <h3 className="text-lg text-themeDarkerAlt font-semibold !mb-5">
                    {item.packageName}
                  </h3>
                  <p className="text-sm text-themeLight !mb-5">
                    {item.shortDesc}
                  </p>
                  <hr className="!border-gray !mb-8" />
                  <ul>
                    <li className="!mb-4 flex justify-between gap-3">
                      <span className="text-xs text-themeLight">
                        Job Posting
                      </span>
                      <span className="text-xs text-themeLight">
                        {item.totalJobs}
                      </span>
                    </li>
                    <li className="!mb-4 flex justify-between gap-3">
                      <span className="text-xs text-themeLight">
                        Featured Job
                      </span>
                      <span className="text-xs text-themeLight">
                        {item.featuredJobs}
                      </span>
                    </li>
                    <li className="!mb-4 flex justify-between gap-3">
                      <span className="text-xs text-themeLight">
                        Job Displayed
                      </span>
                      <span className="text-xs text-themeLight">
                        {item.validity}/days
                      </span>
                    </li>
                    {_.map(
                      item.services,
                      (field, index) =>
                        (field.name || field.details) && (
                          <li
                            className="!mb-4 flex justify-between gap-3"
                            key={field.id}
                          >
                            <span className="text-xs text-themeLight">
                              {field.name}
                            </span>
                            <span className="text-xs text-themeLight">
                              {field.details}
                            </span>
                          </li>
                        ),
                    )}
                  </ul>
                </div>
                {/* button */}
                <div className="!p-6 absolute bottom-0 left-0 w-full">
                  <button
                    disabled={item?._id === userPackage}
                    onClick={() => {
                      handlePaymentIntent(item?.pricing, item?._id);
                    }}
                    type="button"
                    className={`${
                      item?._id === userPackage
                        ? "bg-themePrimary/20 text-themeSecondary"
                        : "bg-themePrimary hover:!bg-themeDarkerAlt hover:!border-themeDarkerAlt text-white"
                    } block w-full transition-all duration-300 ease-in-out  !border-themePrimary  border px-10 !py-3 rounded-lg`}
                  >
                    {item.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/*  stripe-button popup  */}
      <>
        <div
          className={`fixed w-full h-full left-0 top-0 z-20 bg-themeSecondary opacity-70  backdrop-blur-md ${
            modalOn ? "block" : "hidden"
          }`}
          onClick={() => setModalOn(false)}
        />
        {modalOn ? (
          <div className="fixed w-full h-full left-0 top-0 z-50 transition-all ease-in-out duration-500 scale-100 visible flex items-center justify-center">
            <div>
              <div className=" px-6 py-4 md:pt-10 md:pb-6 rounded font-Roboto text-themeSecondary w-11/12 md:w-full max-w-2xl  m-auto z-50 bg-white  relative">
                <h3 className=" pt-2 text-xxs font-bold text-themeDark text-center">
                  Please Complete Payment
                </h3>
                {/* stripe-button */}
                <Elements options={options} stripe={stripePromise}>
                  <StripeForm packageId={packageId} />
                </Elements>
              </div>
            </div>
            <div
              className={`fixed w-full h-full left-0 top-0 z-20 ${
                modalOn ? "block" : "hidden"
              }`}
              onClick={() => setModalOn(false)}
            />
          </div>
        ) : (
          <div className="invisible scale-75 opacity-0"></div>
        )}
      </>
    </div>
  );
};

export default PreviewPackages;

"use client";
import { FormLoader } from "@/src/components/lib/loader";
import Head from "next/head";
import React from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import { Axios } from "@/src/components/utils/axiosKits";

export default function ContactUs() {
  const { addToast } = useToasts();
  const [successMessage, setSuccessMessage] = React.useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const onSubmitHandler = async (data: any) => {
    try {
      await Axios({
        method: "POST",
        url: "/admin/contact",
        data,
      }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setSuccessMessage(res.data.message);
          reset();
        }
      });
    } catch (error: any) {
      if (error?.response?.data) {
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
    }
  };

  React.useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    }
  }, [successMessage]);

  return (
    <>
      <Head>
        <meta name="description" content="Contact us for any query." />
      </Head>

      <Layout>
        <main className="bg-light">
          <PageTitle title="Contact Us" />
          <section>
            <div className="container mx-auto px-3 sm:px-0 py-10 md:py-20">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="w-full">
                    <h1 className="text-4xl font-semibold text-[#373737]">
                      Reach Us Quickly
                    </h1>
                    <p className="text-base text-grayLight !pt-5">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vitae donec risus eu elit. Non arcu laoreet lacus, enim
                      lacinia eu mauris. Lorem nunc nec dictumst urna nulla sit.
                      Non diam duis non, rhoncus morbi tortor sollicitudin sit
                      duis. Arcu duis velit.
                    </p>
                    <form onSubmit={handleSubmit(onSubmitHandler)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 !pt-5">
                        <div>
                          <input
                            className={`p-3 bg-white rounded  ${
                              errors?.name
                                ? "!border-red-400"
                                : "border-themeLighterAlt"
                            } focus:outline-none shadow-md w-full transition duration-500 ease-in-out`}
                            type="text"
                            {...register("name", {
                              required: "Name is required",
                              minLength: {
                                value: 3,
                                message: "Name must be at least 3 characters",
                              },
                            })}
                            placeholder="Name"
                          />
                          {errors?.name && (
                            <p className="text-red-400 text-sm italic py-2">
                              {/* @ts-ignore */}
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            className={`p-3 bg-white rounded  ${
                              errors?.email
                                ? "!border-red-400"
                                : "border-themeLighterAlt"
                            } focus:outline-none shadow-md w-full transition duration-500 ease-in-out`}
                            type="email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email address",
                              },
                            })}
                            placeholder="Email"
                          />
                          {errors?.email && (
                            <p className="text-red-400 text-sm italic py-2">
                              {/* @ts-ignore */}
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                        <div>
                          <input
                            className={`p-3 bg-white rounded  ${
                              errors?.mobile
                                ? "!border-red-400"
                                : "border-themeLighterAlt"
                            } focus:outline-none shadow-md w-full transition duration-500 ease-in-out`}
                            type="text"
                            {...register("mobile", {
                              required: "Mobile is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Mobile must be numeric",
                              },
                            })}
                            placeholder="Mobile No"
                          />
                          {errors?.mobile && (
                            <p className="text-red-400 text-sm italic py-2">
                              {/* @ts-ignore */}
                              {errors.mobile.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            className={`p-3 bg-white rounded  ${
                              errors?.subject
                                ? "!border-red-400"
                                : "border-themeLighterAlt"
                            } focus:outline-none shadow-md w-full transition duration-500 ease-in-out`}
                            type="text"
                            {...register("subject", {
                              required: "This field is required",
                            })}
                            placeholder="Subject"
                          />
                          {errors?.subject && (
                            <p className="text-red-400 text-sm italic py-2">
                              {/* @ts-ignore */}
                              {errors.subject.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <textarea
                        className={` ${
                          errors?.message
                            ? "!border-red-400"
                            : "border-themeLighterAlt"
                        } focus:outline-none shadow-md p-3 h-40 w-full transition duration-500 ease-in-out rounded`}
                        {...register("message", {
                          required: "This field is required",
                        })}
                        placeholder="Type your message"
                      />
                      {errors?.message && (
                        <p className="text-red-400 text-sm italic py-2">
                          {/* @ts-ignore */}
                          {errors.message.message}
                        </p>
                      )}
                      <button
                        className={`${
                          isSubmitting
                            ? "bg-themeDarkerAlt hover:!bg-themeDarkerAlt hover:!text-white"
                            : "bg-themePrimary hover:bg-white"
                        } flex gap-2 items-center py-3 px-8 rounded-lg mt-4  border hover:!border-themePrimary hover:!text-themePrimary text-white text-base  ease-in-out duration-500`}
                      >
                        {isSubmitting ? "Please wait..." : "Send Message"}
                        {isSubmitting && <FormLoader />}
                      </button>
                    </form>
                    {successMessage && (
                      <div className="bg-themePrimary/10 border-l-4 border-green-500 text-green-700 py-3 px-4 mt-4">
                        <p className="font-bold">Success!</p>
                        <p>{successMessage}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-16">
                    <div className="border-l-4 border-red-500 px-5 mt-3 mb-8">
                      <p className="text-lg font-medium text-[#373737]">
                        Address
                      </p>
                      <p className="text-grayLight text-base font-normal pt-2">
                        158 Ralegih Sit, Houston, <br /> Yk 5896,UK
                      </p>
                    </div>

                    <hr className="my-7" />
                    <div className="border-l-4 border-blue-300 px-5 mt-8 mb-8" style={{
                      borderLeftColor: "#2196F3"
                    }}>
                      <p className="text-lg font-medium text-[#373737]">
                        Phones
                      </p>
                      <p className="text-grayLight text-base font-normal pt-2">
                        (406) 555-0120{" "}
                        <span className="text-themePrimary">(Toll Free)</span>
                      </p>
                      <p className="text-grayLight text-base font-normal pt-2">
                        (406) 555-0120
                      </p>
                    </div>
                    <hr className="my-7" />
                    <div className="border-l-4 border-orange-600 px-5 mt-8 mb-8" style={{
                      borderLeftColor: "#FFA500"
                    }}>
                      <p className="text-lg font-medium text-[#373737]">
                        E-Mail
                      </p>
                      <p className="text-grayLight text-base font-normal pt-2">
                        Support87@Gmial.Com
                      </p>
                      <p className="text-grayLight text-base font-normal pt-2">
                        Info@Youremial.Com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 w-full  ">
                  <iframe
                    className="h-full"

                    style={{
                      height: "400px",
                    }}

                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12075.377291106915!2d-74.084481!3d40.831383!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x3e3160910d4d5045!2sHoliday%20Inn%20Express%20%26%20Suites%20Meadowlands%20Area%2C%20an%20IHG%20Hotel!5e0!3m2!1sen!2sbd!4v1648105833329!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
}

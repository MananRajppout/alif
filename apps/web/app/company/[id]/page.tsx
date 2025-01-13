"use client"
import companyData from "@/src/data/companyData.json";
import _ from "lodash";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import useSWR, { useSWRConfig } from "swr";
import CompanyInfo from "@/src/components/frontend/company/company-info";
import CompanyJobItem from "@/src/components/frontend/company/company-job-item";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import { FormLoader, LoaderGrowing } from "@/src/components/lib/loader";
import PopupModule from "@/src/components/lib/popup-modal";
import Image from "@/src/components/optimize/image";
import { Axios, authAxios } from "@/src/components/utils/axiosKits";
import { ThemeContext } from "@/src/context/ThemeContext";

const fetcher = (url: string) => Axios(url).then((res) => res.data);
const authFetcher = (url: string) =>
  authAxios(url).then((res) => res.data.data);

export default function CompanyProfile() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { LoginPopupHandler } = React.useContext(ThemeContext) as any;
  // check isBookmark true or false
  const { data: bookmarkData } = useSWR(
    id ? `/bookmarks/bookmark/${id}` : null,
    authFetcher,
    {
      refreshInterval: 0,
    },
  );
  const [bookmark, setBookmark] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    company?: {
      _id?: string;
    };
  }

  const { data: userData, status } = useSession() as { data: { user: User } | null; status: string };
  const { addToast } = useToasts();
  const { mutate } = useSWRConfig();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const { data, error } = useSWR(
    id ? `/companies/company/${id}` : null,
    fetcher,
    {
      refreshInterval: 0,
      fallbackData: companyData,
    },
  );

  // company bookmark submit form
  const companyBookmarkSubmit = async (data: any) => {
    setLoading(true);
    try {
      await authAxios({
        method: "post",
        url: "/bookmarks/retrives",
        data: {
          company: id,
          note: data.note,
        },
      }).then((res) => {
        mutate(`/bookmarks/bookmark/${id}`).then(() => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setLoading(false);
          setBookmark(!bookmark);
          reset();
        });
      });
    } catch (error: any) {
      addToast(error.responsive.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  // remove bookmark function
  const removeBookmark = async () => {
    setLoading(true);

    if (!params.id) return;

    try {
      await authAxios({
        method: "DELETE",
        url: `/bookmarks/bookmark/${params.id}`,
      }).then((res) => {
        mutate(`/bookmarks/bookmark/${params.id}`).then(() => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setLoading(false);
        });
      });
    } catch (error: any) {
      if (error?.response?.data) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      } else {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Head>
        <meta
          name="description"
          content="Company details page. Find all company details."
        />
      </Head>

      <Layout>
        <main>
          <PageTitle
            title="Company Details"
            image={data?.data?.company?.thumb}
          />
          <section className="pt-16 pb-24 bg-light">
            <div className="container">
              <div className="lg:grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  {/* left Top */}
                  <div className="p-8 rounded-md bg-white flex flex-wrap gap-10 xl:gap-36 items-center mb-6 relative">
                    {(!data?.data || data?.loading || loading) && (
                      <LoaderGrowing />
                    )}
                    <div className="flex gap-4 items-center flex-wrap">
                      <div>
                        <Image
                          width={100}
                          height={100}
                          className="rounded-md"
                          src={
                            data?.data?.company?.logo
                              ? data?.data?.company?.logo
                              : "/assets/img/avatar.png"
                          }
                          alt="img"
                        />
                      </div>
                      <div className="mb-6 xl:mb-0">
                        <h2 className="text-lg text-black font-bold leading-6 mb-2">
                          {data?.data?.company?.companyName}
                        </h2>
                        <p className="text-grayLight text-xss1 font-normal mb-3">
                          {data?.data?.company?.companyTagline}
                        </p>
                        <ul className="flex gap-3 flex-wrap">
                          {/* website link */}
                          {data?.data?.company?.companyWebsite !== "" && (
                            <li>
                              <a
                                href={data?.data?.company?.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Image
                                  width={36}
                                  height={36}
                                  noPlaceholder
                                  src="/assets/img/global.svg"
                                  alt="icon"
                                />
                              </a>
                            </li>
                          )}
                          {/* facebook link */}
                          {data?.data?.company?.socialLink?.facebook !== "" && (
                            <li>
                              <a
                                href={data?.data?.company?.socialLink?.facebook}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Image
                                  width={36}
                                  height={36}
                                  noPlaceholder
                                  src="/assets/img/fb.svg"
                                  alt="icon"
                                />
                              </a>
                            </li>
                          )}
                          {/* linkedin link */}
                          {data?.data?.company?.socialLink?.linkedin !== "" && (
                            <li>
                              <a
                                href={data?.data?.company?.socialLink?.linkedin}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Image
                                  width={36}
                                  height={36}
                                  noPlaceholder
                                  src="/assets/img/linkedin.svg"
                                  alt="icon"
                                />
                              </a>
                            </li>
                          )}
                          {/* twitter link */}
                          {data?.data?.company?.socialLink?.twitter !== "" && (
                            <li>
                              <a
                                href={data?.data?.company?.socialLink?.twitter}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Image
                                  width={36}
                                  height={36}
                                  noPlaceholder
                                  src="/assets/img/twitter2.svg"
                                  alt="icon"
                                />
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <p className="mb-0">
                      <a
                        className="text-xxs font-normal text-black leading-6 block mb-3"
                        href={`mailto:${data?.data?.companyEmail}`}
                      >
                        {data?.data?.companyEmail}
                      </a>
                      <a
                        className="text-xxs font-normal text-black leading-6 block"
                        href={`mailto:${data?.data?.phoneNumber}`}
                      >
                        {data?.data?.phoneNumber}
                      </a>
                    </p>

                    {/* Bookmark */}
                    {userData?.user?.company?._id !==
                      data?.data?.company?.user && (
                      <button
                        onClick={() => {
                          if (bookmarkData?.isBookmark) {
                            // remove bookmark
                            sweetAlert({
                              title: "Are you sure?",
                              text: "You want to remove this company from your bookmark?",
                              icon: "warning",
                              buttons: true as any,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                removeBookmark();
                              }
                            });
                          } else {
                            setBookmark(!bookmark);
                          }
                        }}
                        className={`p-2 group flex absolute top-0 right-0 justify-center items-center gap-2 mb-2 leading-4 rounded-md transition-all`}
                      >
                        {" "}
                        {bookmarkData?.isBookmark ? (
                          <AiFillHeart
                            className={`text-themePrimary group-hover:text-themeLight text-lg`}
                          />
                        ) : (
                          <AiOutlineHeart
                            className={`text-themeLight group-hover:text-themePrimary text-lg`}
                          />
                        )}
                      </button>
                    )}
                  </div>
                  {/* left Bottom */}
                  <div className="p-8 rounded-md bg-white relative">
                    {(!data?.data || data?.loading) && <LoaderGrowing />}
                    <h4 className="text-lg2 font-bold text-black leading-6 mb-6">
                      About Company
                    </h4>
                    <div className="mb-0 text-xs text-deep font-normal leading-6">
                      {data?.data?.company?.description}
                    </div>
                  </div>

                  <div className="pt-12 mb-6">
                    <h4 className="text-lg2 font-bold text-black leading-6 mb-6">
                      Open Job
                    </h4>

                    {data?.data?.jobs?.length > 0 ? (
                      <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
                        {_.map(data?.data?.jobs, (item, index) => {
                          return (
                            <CompanyJobItem
                              key={index}
                              item={item}
                              loading={null}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-lg2 font-bold text-themeLighter py-6">
                          This company has no open job
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-4">
                  <CompanyInfo data={data?.data} />
                  {/* <Map data={data?.data} /> */}
                </div>
              </div>
            </div>
          </section>
        </main>
      </Layout>
      {/* company Bookmark popup */}
      <PopupModule
        PopupTitle="Bookmark Details"
        Popup={bookmark}
        PopupHandler={() => {
          setBookmark(!bookmark);
        }}
      >
        {status === "authenticated" ? (
          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={handleSubmit(companyBookmarkSubmit)}
          >
            <div className="mb-6">
              <label
                className="block mb-2 text-themeDarker font-normal"
                htmlFor="note"
              >
                Bookmark Note:
              </label>
              <textarea
                className={`appearance-none block w-full p-3 leading-5 text-themeDarker border ${
                  errors?.note ? "border-red-500" : "border-gray"
                } placeholder:font-normal h-40 placeholder:text-xss1 rounded placeholder-themeDarkAlt focus:outline-none focus:ring-2 focus:ring-themePrimary focus:ring-opacity-50`}
                id="note"
                {...register("note")}
                placeholder="Note"
              />
              {errors?.note && (
                <span className="text-red-500 text-xss italic">
                  This field is required
                </span>
              )}
            </div>
            <button
              className={`py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out mb-6 w-full text-base text-white font-normal text-center leading-6 ${
                isSubmitting || loading
                  ? "bg-themeDarkerAlt"
                  : "bg-themePrimary"
              } rounded-md hover:bg-black`}
              type="submit"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? "Please wait..." : "Add Bookmark"}
              {(isSubmitting || loading) && <FormLoader />}
            </button>
          </form>
        ) : (
          <div className="text-center grid justify-center items-center h-40">
            <div>
              <p className="text-xxs text-themeLighter mb-4">
                You must be logged in to bookmark this company.
              </p>
              <button
                className="bg-themePrimary text-white px-10 py-3 hover:bg-themeDarkerAlt transition-all duration-300 ease-in-out rounded text-base font-normal"
                onClick={() => {
                  LoginPopupHandler();
                  setBookmark(!bookmark);
                }}
              >
                Login Now
              </button>
            </div>
          </div>
        )}
      </PopupModule>
    </div>
  );
}

"use client"
import sendEmail from "@/src/utils/sendEmail";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { useToasts } from "@/src/components/toast/toast";
import SweetAlert from "sweetalert";
import useSWR, { useSWRConfig } from "swr";
import { ThemeContext } from "../../../context/ThemeContext";
import { FormLoader, LoaderGrowing } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";
import { MultiSelect } from "../form/multi-select-dropdown";

const fetcher = (url: string) =>
  authAxios.get(url).then((res: any) => res.data.data);

const ResumeForm = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR("/admin/filters/retrives", fetcher);
  const { categoryData } = React.useContext(ThemeContext) as any;
  const [photoImage, setPhotoImage] = React.useState(null);
  // const [resumeImage, setResumeImage] = React.useState(null);
  const [resumeFileName, setResumeFileName] = React.useState("");

  const [isMailSent, setIsMailSent] = React.useState(false);
  const [emailType, setEmailType] = React.useState("");

  const {
    register,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      url: [],
    },
  }) as any;

  // urls field array
  const {
    fields: urls,
    append: urlsAppend,
    remove: urlsRemove,
  } = useFieldArray({
    control,
    name: "url",
  });

  // educations field array
  const {
    fields: educations,
    append: educationAppend,
    remove: educationRemove,
  } = useFieldArray({
    control,
    name: "educations",
  });

  // experiences field array
  const {
    fields: experiences,
    append: experienceAppend,
    remove: experienceRemove,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const { addToast } = useToasts();

  // [x] Add Resume form submit handler
  const onSubmitHandler = async (data: {
    fullName: string | Blob;
    email: string | Blob;
    region: string | Blob;
    professionalTitle: string | Blob;
    location: string | Blob;
    photoFile: (string | Blob)[];
    video: string | Blob;
    category: string | Blob;
    workingRate: string | Blob;
    educations: any;
    resumeContent: string | Blob;
    skills: any;
    url: any;
    experiences: any;
    resumeFile: (string | Blob)[];
  }) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("region", data.region);
    formData.append("professionalTitle", data.professionalTitle);
    formData.append("location", data.location);
    if (data.photoFile[0]) {
      formData.append("image", data.photoFile[0]);
    }
    formData.append("video", data.video);
    formData.append("category", data.category);
    formData.append("workingRate", data.workingRate);
    formData.append("education", JSON.stringify(data.educations));
    formData.append("resumeContent", data.resumeContent);
    formData.append("skills", JSON.stringify(data.skills));
    formData.append("url", JSON.stringify(data.url));
    formData.append("experience", JSON.stringify(data.experiences));
    if (data.resumeFile[0]) {
      formData.append("resumeFile", data.resumeFile[0]);
    }

    try {
      await authAxios({
        method: "POST",
        url: `/resumes/retrives`,
        data: formData,
      }).then((res: any) => {
        mutate("/resumes/retrives").then(() => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setEmailType("RESUME_PUBLISHED");
          setIsMailSent(true);
          router.push("/resume/manages-resumes");
          setPhotoImage(null as any);
          setResumeFileName(null as any);
        });
      });
    } catch (error: any) {
      addToast(error.response?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  //  Send Email to the user
  useEffect(() => {
    if (isMailSent) {
      sendEmail(emailType);
      setIsMailSent(false);
    }
  }, [isMailSent]);

  // photo image upload preview handler
  function photoPreview(e: any) {
    const file = e.target.files[0];
    const filePreview = URL.createObjectURL(file);
    setPhotoImage(filePreview as any);
  }

  // resume image upload preview handler
  function resumePreview(event: any) {
    setResumeFileName(event.target.files[0].name);
  }

  // url remove form handler
  const onRemoveUrlHandler = (index: any, removeValue: any) => {
    SweetAlert({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      buttons: true,
    } as any).then((willDelete) => {
      if (willDelete) {
        removeValue(index);
      }
    });
  };

  const photoFile = register("photoFile");
  const resumeFile = register("resumeFile");

  return (
    <section className="mb-6">
      <div className="rounded-lg shadow-lg bg-white">
        <div className="h-16 bg-themeDark mb-8 flex items-center px-10 rounded-lg">
          <p className="text-xs text-white">Submit Resume</p>
        </div>

        {/* Loader */}
        {!data && (
          <div className="relative min-h-40">
            <LoaderGrowing />
          </div>
        )}

        {data && (
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="!mx-5 xl:mx-10 justify-center items-center">
              {/* form  */}
              <div>
                <div className="flex flex-wrap">
                  {/* Your Name required */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Your Name
                    </label>
                    <input
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.fullName ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      type="text"
                      placeholder="Full Name"
                      {...register("fullName", {
                        required: true,
                      })}
                    />
                    {errors?.fullName && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Your Email required */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-last-name"
                    >
                      Your Email
                    </label>
                    <input
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.email ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      type="email"
                      placeholder="info@youremail.com"
                      {...register("email", {
                        required: true,
                      })}
                    />
                    {errors?.email && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Region required */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Region
                    </label>
                    <select
                      aria-label="Default select example"
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.region ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white w-full svg_icon appearance-none`}
                      defaultValue={""}
                      {...register("region", {
                        required: true,
                      })}
                    >
                      <option value="">Choose a region</option>
                      {_.map(data?.region, (item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>

                    {errors?.region && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Professional Title required */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Professional Title
                    </label>
                    <input
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.professionalTitle ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      type="text"
                      placeholder="Web Developer"
                      {...register("professionalTitle", {
                        required: true,
                      })}
                    />
                    {errors?.professionalTitle && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Location required */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Location
                    </label>
                    <input
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.location ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      type="location"
                      placeholder="London, UK"
                      {...register("location", {
                        required: true,
                      })}
                    />
                    {errors?.location && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Photo */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <span className="block tracking-wide text-themeDark text-xs mb-2">
                      Photo{" "}
                      <span className="text-xss text-gray-400">(optional)</span>
                    </span>
                    <div className="mt-2 border border-gray rounded py-1 !px-3">
                      {photoImage && (
                        <span className="!mb-3 items-center flex gap-3">
                          <ImageOpt
                            noPlaceholder
                            src={photoImage}
                            width={40}
                            height={40}
                            alt="img"
                          />
                          <button
                            type="button"
                            className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded hover:bg-red-500"
                            onClick={() => {
                              setPhotoImage(null);
                              setValue("photoFile", "");
                            }}
                          >
                            Remove
                          </button>
                        </span>
                      )}
                      <div className="flex gap-4 items-center">
                        <label
                          className="block text-xss1 duration-300 ease-in-out py-1 px-3 border border-gray shadow-sm cursor-pointer hover:bg-themePrimary/20 hover:border-themePrimary/20 text-themeLight rounded"
                          htmlFor="photoImage"
                        >
                          Select File
                          <input
                            className="hidden"
                            id="photoImage"
                            {...photoFile}
                            accept="image/*"
                            ref={photoFile.ref}
                            onBlur={photoFile.onBlur}
                            onChange={(e) => {
                              photoFile.onChange(e);
                              photoPreview(e);
                            }}
                            type="file"
                          />
                        </label>
                        <span className="text-xsss1 text-themeLighter">
                          Maximum file size: 100 MB.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Video */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Video{" "}
                      <span className="text-xss text-gray-400">(optional)</span>
                    </label>
                    <input
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.companyName ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      placeholder="https://example.com"
                      type="url"
                      {...register("video")}
                    />
                  </div>

                  {/* Resume Category required */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Resume Category
                    </label>
                    <select
                      aria-label="Default select example"
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.category ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white w-full svg_icon appearance-none`}
                      defaultValue={""}
                      {...register("category", {
                        required: true,
                      })}
                    >
                      <option value="">Choose a category</option>
                      {_.map(categoryData, (item, index) => (
                        <option value={item.categoryTitle} key={index}>
                          {item.categoryTitle}
                        </option>
                      ))}
                    </select>
                    {errors?.category && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Minimum rate/h ($) */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Minimum rate/h ($){" "}
                      <span className="text-xss text-gray-400">(optional)</span>
                    </label>
                    <input
                      className={`appearance-none block w-full text-themeDark ${
                        errors?.companyName ? "!border-red-400" : ""
                      } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      type="number"
                      placeholder="40"
                      {...register("workingRate")}
                    />
                  </div>

                  {/* Skills */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-last-name"
                    >
                      Skills{" "}
                      {/* <span className="text-xss text-gray-400">(optional)</span> */}
                    </label>
                    <MultiSelect
                      options={data?.skills}
                      isObject={false}
                      name="skills"
                      displayValue="name"
                      register={register}
                      placeholder="Add Skills..."
                      setValue={setValue}
                      validationSyntax={{
                        required: true,
                      }}
                      forwardRef={undefined}
                      selectedValues={undefined}
                      disabled={undefined}
                      singleSelect={undefined}
                      className={undefined}
                      error={undefined}
                      emptyRecordMsg={undefined}
                    />
                    {errors?.skills && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Resume Content required */}
                  <div className="w-full px-3 md:py-2">
                    <label className="themeDark text-xs">Resume Content</label>
                    <textarea
                      className={`w-full h-36 ${
                        errors?.resumeContent ? "!border-red-400" : ""
                      } border border-gray focus:outline-none focus:bg-white mt-2 p-3 rounded`}
                      {...register("resumeContent", {
                        required: true,
                      })}
                      placeholder="We are a team of expert designers and developers committed to rendering the best WordPress website designing services in a cost-effective practice. We are on a mission to help small business owners build their presence online. Our customer-centric approach ensures that the final product is unbeatable."
                    />
                    {errors?.resumeContent && (
                      <p className="text-red-500 text-sm py-1 italic">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* URL(s) */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-last-name"
                    >
                      URL(s){" "}
                      <span className="text-xss text-gray-400">(optional)</span>
                    </label>
                    <div className="border border-gray rounded p-2">
                      {urls.map((url, index) => (
                        <div
                          className="p-8 !mx-5 mt-3 mb-7 transition-all duration-300 ease-in-out bg-themePrimary/10 border border-gray rounded-lg shadow relative"
                          key={url.id}
                        >
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-url-name"
                            >
                              Name
                            </label>
                            <input
                              className={`appearance-none block w-full text-themeDark ${
                                errors?.url?.[index]?.name
                                  ? "!border-red-400"
                                  : ""
                              } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                              id="grid-url-name"
                              type="text"
                              placeholder="Name here"
                              {...register(`url.${index}.name`, {
                                required: true,
                              })}
                            />
                            {errors?.url?.[index]?.name && (
                              <p className="text-red-500 text-sm py-1 italic">
                                This field is required
                              </p>
                            )}
                          </div>
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-url"
                            >
                              URL
                            </label>
                            <input
                              className={`appearance-none block w-full text-themeDark ${
                                errors?.url?.[index]?.url
                                  ? "!border-red-400"
                                  : ""
                              } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                              id="grid-url"
                              type="url"
                              placeholder="https://www.example.com"
                              {...register(`url.${index}.url`, {
                                required: true,
                              })}
                            />
                            {errors?.url?.[index]?.url && (
                              <p className="text-red-500 text-sm py-1 italic">
                                This field is required
                              </p>
                            )}
                          </div>
                          {/* Cancel button */}
                          <div className="absolute top-0 right-0">
                            <button
                              className="bg-red-300 hover:bg-red-500 text-white font-bold !py-2 !px-3 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={() =>
                                onRemoveUrlHandler(index, urlsRemove)
                              }
                            >
                              <IoMdClose />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          urlsAppend({
                            id: urls.length + 1,
                            url: "",
                            name: "",
                          })
                        }
                        className="!px-3 py-1.5 flex items-center justify-between gap-2 bg-themePrimary/10  shadow-sm hover:bg-themePrimary/30 transition-all duration-300 ease-in-out text-themeLight rounded text-xss1"
                      >
                        Add URL <GoPlus />
                      </button>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Education{" "}
                      <span className="text-xss text-gray-400">(optional)</span>
                    </label>
                    <div className="border border-gray rounded p-2">
                      {educations.map((education, index) => (
                        <div
                          className="p-8 !mx-5 mt-3 mb-7 transition-all duration-300 ease-in-out bg-themePrimary/10 border border-gray rounded-lg shadow relative"
                          key={education.id}
                        >
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-schoolName"
                            >
                              School Name
                            </label>
                            <input
                              className={`appearance-none block w-full text-themeDark ${
                                errors?.educations?.[index]?.schoolName
                                  ? "!border-red-400"
                                  : ""
                              } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                              id="grid-schoolName"
                              type="text"
                              {...register(`educations.${index}.schoolName`, {
                                required: true,
                              })}
                            />
                            {errors?.educations?.[index]?.schoolName && (
                              <p className="text-red-500 text-sm py-1 italic">
                                This field is required
                              </p>
                            )}
                          </div>
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-qualifications"
                            >
                              Qualification(s)
                            </label>
                            <input
                              className={`appearance-none block w-full text-themeDark ${
                                errors?.educations?.[index]?.qualifications
                                  ? "!border-red-400"
                                  : ""
                              } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                              id="grid-qualifications"
                              type="text"
                              {...register(
                                `educations.${index}.qualifications`,
                                {
                                  required: true,
                                }
                              )}
                            />
                            {errors?.educations?.[index]?.qualifications && (
                              <p className="text-red-500 text-sm py-1 italic">
                                This field is required
                              </p>
                            )}
                          </div>
                          <div className="flex gap-3 !mb-3">
                            <div className="w-full lg:w-1/2">
                              <label
                                className="block tracking-wide text-themeDark text-xss1 mb-2"
                                htmlFor="grid-startDate"
                              >
                                Start Date
                              </label>
                              <input
                                className={`appearance-none block w-full text-themeDark ${
                                  errors?.educations?.[index]?.startDate
                                    ? "!border-red-400"
                                    : ""
                                } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-startDate"
                                type="date"
                                {...register(`educations.${index}.startDate`, {
                                  required: true,
                                })}
                              />
                              {errors?.educations?.[index]?.startDate && (
                                <p className="text-red-500 text-sm py-1 italic">
                                  This field is required
                                </p>
                              )}
                            </div>
                            <div className="w-full lg:w-1/2">
                              <label
                                className="block tracking-wide text-themeDark text-xss1 mb-2"
                                htmlFor="grid-endDate"
                              >
                                End Date
                              </label>
                              <input
                                className={`appearance-none block w-full text-themeDark ${
                                  errors?.educations?.[index]?.endDate
                                    ? "!border-red-400"
                                    : ""
                                } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-endDate"
                                type="date"
                                {...register(`educations.${index}.endDate`, {
                                  required: true,
                                })}
                              />
                              {errors?.educations?.[index]?.endDate && (
                                <p className="text-red-500 text-sm py-1 italic">
                                  This field is required
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-notes"
                            >
                              Notes(optional)
                            </label>
                            <textarea
                              className="h-28 appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white"
                              id="grid-notes"
                              {...register(`educations.${index}.notes`)}
                            />
                          </div>
                          {/* Cancel button */}
                          <div className="absolute top-0 right-0">
                            <button
                              className="bg-red-300 hover:bg-red-500 text-white font-bold !py-2 !px-3 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={() =>
                                onRemoveUrlHandler(index, educationRemove)
                              }
                            >
                              <IoMdClose />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          educationAppend({
                            id: educations.length + 1,
                            schoolName: "",
                            qualifications: "",
                            startDate: "",
                            endDate: "",
                            notes: "",
                          })
                        }
                        className="!px-3 py-1.5 flex items-center justify-between gap-2 bg-themePrimary/10  shadow-sm hover:bg-themePrimary/30 transition-all duration-300 ease-in-out text-themeLight rounded text-xss1"
                      >
                        Add Education <GoPlus />
                      </button>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <label
                      className="block tracking-wide text-themeDark text-xs mb-2"
                      htmlFor="grid-first-name"
                    >
                      Experience{" "}
                      <span className="text-xss text-gray-400">(optional)</span>
                    </label>
                    <div className="border border-gray rounded p-2">
                      {experiences.map((education, index) => (
                        <div
                          className="p-8 !mx-5 mt-3 mb-7 transition-all duration-300 ease-in-out bg-themePrimary/10 border border-gray rounded-lg shadow relative"
                          key={education.id}
                        >
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-employerName"
                            >
                              Employer Name
                            </label>
                            <input
                              className={`appearance-none block w-full text-themeDark ${
                                errors?.experiences?.[index]?.employerName
                                  ? "!border-red-400"
                                  : ""
                              } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                              id="grid-employerName"
                              type="text"
                              {...register(
                                `experiences.${index}.employerName`,
                                {
                                  required: true,
                                }
                              )}
                            />
                            {errors?.experiences?.[index]?.employerName && (
                              <p className="text-red-500 text-sm py-1 italic">
                                This field is required
                              </p>
                            )}
                          </div>
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-jobTitle"
                            >
                              Job Title
                            </label>
                            <input
                              className={`appearance-none block w-full text-themeDark ${
                                errors?.experiences?.[index]?.jobTitle
                                  ? "!border-red-400"
                                  : ""
                              } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                              id="grid-jobTitle"
                              type="text"
                              {...register(`experiences.${index}.jobTitle`, {
                                required: true,
                              })}
                            />
                            {errors?.experiences?.[index]?.jobTitle && (
                              <p className="text-red-500 text-sm py-1 italic">
                                This field is required
                              </p>
                            )}
                          </div>
                          <div className="flex gap-3 !mb-3">
                            <div className="w-full lg:w-1/2">
                              <label
                                className="block tracking-wide text-themeDark text-xss1 mb-2"
                                htmlFor="grid-startDate"
                              >
                                Start Date
                              </label>
                              <input
                                className={`appearance-none block w-full text-themeDark ${
                                  errors?.experiences?.[index]?.startDate
                                    ? "!border-red-400"
                                    : ""
                                } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-startDate"
                                type="date"
                                {...register(`experiences.${index}.startDate`, {
                                  required: true,
                                })}
                              />
                              {errors?.experiences?.[index]?.startDate && (
                                <p className="text-red-500 text-sm py-1 italic">
                                  This field is required
                                </p>
                              )}
                            </div>
                            <div className="w-full lg:w-1/2">
                              <label
                                className="block tracking-wide text-themeDark text-xss1 mb-2"
                                htmlFor="grid-endDate"
                              >
                                End Date
                              </label>
                              <input
                                className={`appearance-none block w-full text-themeDark ${
                                  errors?.experiences?.[index]?.endDate
                                    ? "!border-red-400"
                                    : ""
                                } border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-endDate"
                                type="date"
                                {...register(`experiences.${index}.endDate`, {
                                  required: true,
                                })}
                              />
                              {errors?.experiences?.[index]?.endDate && (
                                <p className="text-red-500 text-sm py-1 italic">
                                  This field is required
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="!mb-3">
                            <label
                              className="block tracking-wide text-themeDark text-xss1 mb-2"
                              htmlFor="grid-notes"
                            >
                              Notes(optional)
                            </label>
                            <textarea
                              className="h-28 appearance-none block w-full text-themeDark border border-gray rounded py-2.5 px-3 leading-tight focus:outline-none focus:bg-white"
                              id="grid-notes"
                              {...register(`experiences.${index}.notes`)}
                            />
                          </div>
                          {/* Cancel button */}
                          <div className="absolute top-0 right-0">
                            <button
                              className="bg-red-300 hover:bg-red-500 text-white font-bold !py-2 !px-3 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={() =>
                                onRemoveUrlHandler(index, experienceRemove)
                              }
                            >
                              <IoMdClose />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          experienceAppend({
                            id: experiences.length + 1,
                            employerName: "",
                            jobTitle: "",
                            startDate: "",
                            endDate: "",
                            notes: "",
                          })
                        }
                        className="!px-3 py-1.5 flex items-center justify-between gap-2 bg-themePrimary/10  shadow-sm hover:bg-themePrimary/30 transition-all duration-300 ease-in-out text-themeLight rounded text-xss1"
                      >
                        Add Experience <GoPlus />
                      </button>
                    </div>
                  </div>

                  {/* Resume File */}
                  <div className="w-full md:w-3/6 px-3 md:py-2">
                    <span className="block tracking-wide text-themeDark text-xs mb-2">
                      Resume File{" "}
                      <span className="text-xss text-gray-400">(optional)</span>
                    </span>
                    <div className="mt-2 border border-gray rounded p-2 relative">
                      {resumeFileName && (
                        <span className="!mb-3 items-center flex gap-3">
                          <span
                            className="chip"
                            style={{
                              backgroundColor: "#E8F7EE",
                              color: "#66737F",
                              borderRadius: "4px",
                              fontSize: "16px",
                              height: "33px",
                            }}
                          >
                            {resumeFileName}
                          </span>
                          <button
                            type="button"
                            className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded-md hover:bg-red-500"
                            onClick={() => {
                              setResumeFileName("");
                              // setResumeImage(null);
                              setValue("resumeFile", "");
                            }}
                          >
                            Remove
                          </button>
                        </span>
                      )}
                      <div className="flex gap-4 items-center">
                        <label
                          className="block text-xss1 duration-300 ease-in-out py-1 px-3 border border-gray shadow-sm cursor-pointer hover:bg-themePrimary/20 hover:border-themePrimary/20 text-themeLight rounded"
                          htmlFor="resumeImage"
                        >
                          Select File
                          <input
                            className="hidden"
                            id="resumeImage"
                            accept=".doc,.docx,.pdf"
                            {...resumeFile}
                            ref={resumeFile.ref}
                            onBlur={resumeFile.onBlur}
                            onChange={(e) => {
                              resumeFile.onChange(e);
                              resumePreview(e);
                            }}
                            type="file"
                          />
                        </label>
                        <span className="text-xsss1 text-themeLighter">
                          Maximum file size: 100 MB.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Submit button */}
              <div className="mt-6 px-3 !pb-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2.5 flex gap-2 items-center !mb-4 px-10 ${
                    isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
                  } rounded-lg shadow-themePrimary text-white font-medium text-xs`}
                >
                  {isSubmitting ? "Please wait..." : "Submit"}
                  {isSubmitting && <FormLoader />}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ResumeForm;

"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic"; 
import "react-quill/dist/quill.snow.css"; 
import { useToasts } from "@/src/components/toast/toast";
import { useSWRConfig } from "swr";
import { FormLoader } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); 

const SubmitBlogForm = () => {
  const [EventDisplayImage, setEventDisplayImage] = useState<string | null>(null);
  const [blogContent, setBlogContent] = useState<string>(""); // State for rich text editor content

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();
  const router = useRouter();

  const submitHandler = async (data: any) => {
    const formData = new FormData();

    // Append form fields
    formData.append("blogTitle", data.blogTitle);
    formData.append("blogContent", blogContent); 

    // Append displayImage as File
    if (data.displayImage && data.displayImage.length > 0) {
      formData.append("displayImage", data.displayImage[0]);
    }

    try {
      await authAxios.post("/blogs/private", formData);
      addToast("Blog added successfully!", {
        appearance: "success",
        autoDismiss: true,
      });
      router.push("/blogs/manages-blogs");
    } catch (error: any) {
      addToast(error.response.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  function PreviewImage(e: any, setImage: any) {
    const file = e.target.files[0];
    if (file) {
      const filePreview = URL.createObjectURL(file);
      setImage(filePreview);

      return () => URL.revokeObjectURL(filePreview);
    }
  }

  return (
    <section className="rounded-lg shadow-lg bg-white">
      <div className="bg-themeDark rounded-lg !py-3">
        <p className="text-lg2 text-white px-6 sm:px-10">Blog Details</p>
      </div>
      <div className="sm:px-5 py-10 mx-3 sm:mx-0">
        <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
          <label className="w-full" htmlFor="blogTitle">
            <p className="text-base font-normal text-themeDark pb-3">Blog Title</p>
            <input
              className={`w-full border ${errors?.blogTitle ? "!border-red-400" : "border-gray"} focus:outline-none h-12 !px-3 rounded`}
              type="text"
              id="blogTitle"
              {...register("blogTitle", { required: true })}
              placeholder="Blog Title"
            />
            {errors?.blogTitle && (
              <p className="text-red-400 text-sm italic">Blog Title is required</p>
            )}
          </label>

          <label className="w-full" htmlFor="blogContent">
            <p className="text-base font-normal text-themeDark pb-2 pt-3">Blog Content</p>
            <div className="mb-16">

            <ReactQuill
              theme="snow"
              value={blogContent}
              onChange={setBlogContent} 
              className="h-60 bg-white rounded"
              placeholder="Write your blog here..."
              />
              </div>
          </label>

          {EventDisplayImage && (
            <span className="!mb-6 w-2/3 items-center flex gap-3 mt-12">
              <ImageOpt
                className="rounded-lg shadow-lg"
                src={EventDisplayImage}
                width={800}
                height={400}
                alt="Event Display Image"
              />
              <button
                className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded hover:bg-red-500"
                onClick={() => {
                  setEventDisplayImage(null);
                  setValue("displayImage", "");
                }}
              >
                Remove
              </button>
            </span>
          )}
          <label className="w-full" htmlFor="displayImage">
            <p className="text-base font-normal text-themeDark pt-2 mt-12">Display Image</p>
            <input
              className="w-full border border-gray focus:outline-none h-12 !px-3 py-2 rounded"
              type="file"
              id="displayImage"
              accept="image/*"
              {...register("displayImage")}
              onChange={(e) => {
                PreviewImage(e, setEventDisplayImage);
              }}
            />
          </label>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
              } text-white rounded-lg px-4 flex gap-1 items-center !py-3 shadow-themePrimary`}
            >
              {isSubmitting ? "Please wait..." : "Add Blog"}
              {isSubmitting && <FormLoader className="w-5 h-5 text-themePrimary ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SubmitBlogForm;

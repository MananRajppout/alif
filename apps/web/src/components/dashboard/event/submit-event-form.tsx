"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "@/src/components/toast/toast";
import { useSWRConfig } from "swr";
import { FormLoader } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";

const SubmitEventForm = () => {
  const [EventDisplayImage, setEventDisplayImage] = React.useState(null);
  const [EventCoverImage, setEventCoverImage] = React.useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();
  const router = useRouter();

  // [x] submit form handler
  const submitHandler = async (data: any) => {
    const formData = new FormData();

    formData.append("eventName", data.eventName);
    formData.append("date", data.date);
    formData.append("speakers", data.speakers);
    formData.append("location", data.location);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("about", data.about);
    formData.append("bulletPoints", data.bulletPoints);
    formData.append("numberOfSeats", data.numberOfSeats);
    formData.append("ticketPrice", data.ticketPrice)

    if (data.coverImage) {
      formData.append("coverImage", data.coverImage[0]); // Ensure coverImage is a File
    }
    
    // Append displayImage as File (from array)
    if (data.displayImage && data.displayImage.length > 0) {
      formData.append("displayImage", data.displayImage[0]); // Access first element in array
    }

    try {
      await authAxios({
        method: "post",
        url: "/events/private",
        data: formData,
      })
        .then((res) => {
          addToast(res.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
          router.push("/event/manages-events");
        })
        .catch((err) => {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        });
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

      // Cleanup the preview URL when the component is unmounted or the image is removed
      return () => URL.revokeObjectURL(filePreview);
    }
  }

  return (
    <section className="rounded-lg shadow-lg bg-white">
      <div className="bg-themeDark rounded-lg !py-3">
        <p className="text-lg2 text-white px-6 sm:px-10">Event Details</p>
      </div>
      <div className="sm:px-5 py-10 mx-3 sm:mx-0">
        <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="w-full " htmlFor="eventName">
              <p className="text-base font-normal text-themeDark pb-3">
                Event Name
              </p>
              <input
                className={`w-full border ${errors?.name ? "!border-red-400" : "border-gray"} focus:outline-none h-12 !px-3 rounded`}
                type="text"
                id="eventName"
                {...register("eventName", { required: true })}
                placeholder="Event Name"
              />
              {errors?.name && (
                <p className="text-red-400 text-sm italic">
                  Event Name is required
                </p>
              )}
            </label>
            <label className="w-full " htmlFor="date">
              <p className="text-base font-normal text-themeDark pb-3">
                Event Date
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="date"
                id="date"
                {...register("date", { required: true })}
              />
            </label>

            {/* Speakers */}
            <label className="w-full " htmlFor="speakers">
              <p className="text-base font-normal text-themeDark pb-3">
                Number of Speakers
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="number"
                id="speakers"
                {...register("speakers", { required: true, min: 1 })}
                placeholder="Number of Speakers"
              />
            </label>

            {/* Location */}
            <label className="w-full" htmlFor="location">
              <p className="text-base font-normal text-themeDark pb-3">
                Location
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="location"
                {...register("location", { required: true })}
                placeholder="Event Location"
              />
            </label>

            {/* City */}
            <label className="w-full" htmlFor="city">
              <p className="text-base font-normal text-themeDark pb-3">City</p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="city"
                {...register("city", { required: true })}
                placeholder="City"
              />
            </label>

            <label className="w-full" htmlFor="state">
              <p className="text-base font-normal text-themeDark pb-3">State</p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="state"
                {...register("state", { required: true })}
                placeholder="State"
              />
            </label>

            <label className="w-full" htmlFor="country">
              <p className="text-base font-normal text-themeDark pb-3">
                Country
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="country"
                {...register("country", { required: true })}
                placeholder="Country"
              />
            </label>

            <label className="w-full" htmlFor="about">
              <p className="text-base font-normal text-themeDark pb-3">
                About the Event
              </p>
              <textarea
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded py-3"
                id="about"
                {...register("about", { required: true })}
                placeholder="Describe the event"
              />
            </label>

            <label className="w-full" htmlFor="bulletPoints">
              <p className="text-base font-normal text-themeDark pb-3">
                Key Points
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="text"
                id="bulletPoints"
                {...register("bulletPoints")}
                placeholder="Highlights (separate by commas)"
              />
            </label>

            <label className="w-full" htmlFor="numberOfSeats">
              <p className="text-base font-normal text-themeDark pb-3">
                Number of Seats
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="number"
                id="numberOfSeats"
                {...register("numberOfSeats", { required: true })}
                placeholder="Total Seats"
              />
            </label>
          </div>

          <label className="w-full" htmlFor="ticketPrice">
              <p className="text-base font-normal text-themeDark pb-3">
                Ticket Price
              </p>
              <input
                className="w-full border border-gray focus:outline-none h-12 !px-3 rounded"
                type="number"
                id="ticketPrice"
                {...register("ticketPrice", { required: true })}
                placeholder="Ticket Price in INR"
              />
            </label>
          {EventCoverImage && (
            <span className="!mb-6 w-2/3 items-center flex gap-3">
              <ImageOpt
                className="rounded-lg shadow-lg"
                src={EventCoverImage} // Display the selected image preview
                width={800}
                height={400}
                alt="Event Cover Image"
              />
              <button
                className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded hover:bg-red-500"
                onClick={() => {
                  setEventCoverImage(null); // Clear display image preview
                  setValue("coverImage", "");
                }}
              >
                Remove
              </button>
            </span>
          )}

          <label className="w-full" htmlFor="coverImage">
            <p className="text-base font-normal text-themeDark pb-1 pt-2">
              Cover Image
            </p>
            <input
              className="w-full border border-gray focus:outline-none h-12 !px-3 py-2 rounded"
              type="file"
              id="coverImage"
              accept="image/*"
              {...register("coverImage")}
              onChange={(e) => {
                PreviewImage(e, setEventCoverImage); // Update the cover image preview on selection
              }}
            />
          </label>
          {EventDisplayImage && (
            <span className="!mb-6 w-2/3 items-center flex gap-3">
              <ImageOpt
                className="rounded-lg shadow-lg"
                src={EventDisplayImage} // Display the selected image preview
                width={800}
                height={400}
                alt="Event Display Image"
              />
              <button
                className="bg-red-300 mt-2 text-white py-1 p-2.5 text-xss rounded hover:bg-red-500"
                onClick={() => {
                  setEventCoverImage(null); // Updated to clear display image preview
                  setValue("coverImage", "");
                }}
              >
                Remove
              </button>
            </span>
          )}
          <label className="w-full" htmlFor="displayImage">
            <p className="text-base font-normal text-themeDark pt-2 ">
              Display Image
            </p>
            <input
              className="w-full border border-gray focus:outline-none h-12 !px-3 py-2 rounded"
              type="file"
              id="displayImage"
              accept="image/*"
              {...register("displayImage")}
              onChange={(e) => {
                PreviewImage(e, setEventDisplayImage); // Updated to setEventDisplayImage
              }}
            />
          </label>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-themeDarkerAlt" : "bg-themePrimary"
              } text-white rounded-lg px-4 flex gap-1 items-center !py-3 shadow-themePrimary`}
            >
              {isSubmitting ? "Please wait..." : "Add Event"}
              {isSubmitting && (
                <FormLoader className="w-5 h-5 text-themePrimary ml-2" />
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SubmitEventForm;

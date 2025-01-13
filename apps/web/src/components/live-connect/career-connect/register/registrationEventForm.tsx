"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authAxios } from "@/src/components/utils/axiosKits";
import Razorpay from "razorpay";
import Script from "next/script";

export default function RegistrationEventForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const router = useRouter();
  const [event, setEvent] = useState<any>("");
  const params = useParams();
  const [isPaying, setIsPaying] = useState(false);
  const { id } = params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await authAxios.get("/events/retrives/" + id);
        setEvent(res.data.data[0]);
        console.log(res.data.data[0]);
      } catch (error) {
        toast.error("Error fetching event");
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await authAxios.get("/resumes/retrives");
        setResumes(res.data.data);
        setSelectedResume(res.data.data.length ? res.data.data[0]._id : "");
      } catch (error) {
        toast.error("Error fetching resumes");
      }
    };

    fetchResumes();
  }, []);

  const submitHandler = async (data: any) => {
    try {
      const res = await axios.post("/api/events/register", {
        ...data,
        resumeId: selectedResume,
      });
      toast.success("Event registration successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Event registration failed");
    }
  };

  const handleRegistration = async () => {
    try {
      const res = await authAxios.post("/events/register", {
        eventId: event._id,
        resumeId: selectedResume,
      });
      if (res.data.success) {
        toast.success("Event registration successful");
      }
      router.push("/live-connect/career-connect/");
    } catch (error) {
      toast.error("Event registration failed");
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      // Create Razorpay order

      const res = await authAxios.post("/payments", event);
      const order = res.data.order;

      const options = {
        key_id: process.env.RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        name: "Reset Jobs",
        description: "Event Ticket Payment",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            setLoading(true);
            await authAxios.post(`/payments/verify`, {
              eventId: event._id,
              response,
              order,
              selectedResume,
            });
            setLoading(false);
            toast.success("Payment successful, registration complete!");
            router.push("/live-connect/career-connect/");
          } catch (error) {
            toast.error(
              "Registration failed after payment. Any Deductions will be refunded after 3-5 business days or You can contact support for more information."
            );
          }
        },
        prefill: {
          name: res.data.user.fullName,
          email: res.data.user.email,
          contact: res.data.user._id,
        },
        theme: {
          color: "#3399cc",
        },
      };
      //@ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        setIsPaying(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("Error initiating payment.");
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {event && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{event.eventName}</h2>
          <p className="text-sm text-gray-600">{event.about}</p>
          <p className="text-sm font-medium text-gray-800">
            Ticket Price: ₹{event.ticketPrice}
          </p>
        </div>
      )}
      <h1 className="text-2xl font-bold text-themeDark mb-6">
        Event Registration Form
      </h1>
      <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-base font-medium text-themeDark pb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className={`w-full border ${
              errors?.name ? "!border-red-400" : "border-gray-300"
            } focus:outline-none h-12 px-3 rounded`}
            {...register("name", { required: true })}
          />
          {errors?.name && (
            <p className="text-red-400 text-sm italic">Name is required</p>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-col">
          <label
            htmlFor="mobile"
            className="text-base font-medium text-themeDark pb-2"
          >
            Mobile Number
          </label>
          <input
            id="mobile"
            type="text"
            placeholder="Enter your mobile number"
            className={`w-full border ${
              errors?.mobile ? "!border-red-400" : "border-gray-300"
            } focus:outline-none h-12 px-3 rounded`}
            {...register("mobile", {
              required: true,
              pattern: /^[0-9]{10}$/,
            })}
          />
          {errors?.mobile && (
            <p className="text-red-400 text-sm italic">
              {errors.mobile.type === "pattern"
                ? "Enter a valid 10-digit mobile number"
                : "Mobile number is required"}
            </p>
          )}
        </div>

        {/* Email for Sending Tickets */}
        <div className="flex flex-col">
          <label
            htmlFor="emailForSendingTickets"
            className="text-base font-medium text-themeDark pb-2"
          >
            Email for Sending Tickets
          </label>
          <input
            id="emailForSendingTickets"
            type="email"
            placeholder="Enter your email"
            className={`w-full border ${
              errors?.emailForSendingTickets
                ? "!border-red-400"
                : "border-gray-300"
            } focus:outline-none h-12 px-3 rounded`}
            {...register("emailForSendingTickets", { required: true })}
          />
          {errors?.emailForSendingTickets && (
            <p className="text-red-400 text-sm italic">Email is required</p>
          )}
        </div>

        {/* Resume Dropdown */}
        <div className="flex flex-col">
          <label
            htmlFor="resume"
            className="text-base font-medium text-themeDark pb-2"
          >
            Select Resume
          </label>
          <select
            id="resume"
            className="w-full border border-gray-300 focus:outline-none h-12 px-3.5 rounded"
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
          >
            {resumes &&
              resumes.length > 0 &&
              resumes.map((resume: any) => (
                <option key={resume._id} value={resume._id}>
                  {resume.name} - {resume.professionalTitle} - ({resume.region})
                </option>
              ))}
          </select>
        </div>
        <div>
          <button
            className="bg-themePrimary text-white font-bold px-4 py-2 rounded-md hover:bg-themeDark"
            onClick={(e) => {
              e.preventDefault();
              router.push("/resume/add-resume");
            }}
          >
            Add New Resume
          </button>
        </div>

        {event?.ticketPrice > 0 ? (
          <button
            type="button"
            className={`w-full py-3 rounded-lg shadow ${
              isPaying
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-themeDark text-white hover:bg-themeDark/90"
            } transition`}
            onClick={handlePayment}
            disabled={isPaying}
          >
            {isPaying
              ? "Paying..."
              : `Pay ₹${event.ticketPrice} for Registration`}
          </button>
        ) : (
          <button
            type="button"
            className="w-full bg-themeDark text-white py-3 rounded-lg shadow hover:bg-themeDark/90 transition"
            onClick={handleRegistration}
          >
            Register for Event
          </button>
        )}
      </form>
    </div>
  );
}

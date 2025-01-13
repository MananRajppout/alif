"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { authAxios } from "@/src/components/utils/axiosKits";

export default function RegistrationCompanyForm({ id }: { id: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await authAxios.get("/companies/retrives");
        setCompanies(res.data.data);
        setSelectedCompany(res.data.data.length ? res.data.data[0]._id : "");
      } catch (error) {
        toast.error("Error fetching companies.");
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const fetchJobs = async () => {
        try {
          const res = await authAxios.get(`/jobs/${selectedCompany}`); // Update API endpoint
          setJobs(res.data.data);
        } catch (error) {
          toast.error("Error fetching jobs.");
        }
      };

      fetchJobs();
    }
  }, [selectedCompany]);

  interface Company {
    _id: string;
    companyName: string;
  }

  interface Job {
    _id: string;
    jobTitle: string;
  }

  const addJob = (job: string) => {
    if (!selectedJobs.includes(job)) {
      setSelectedJobs((prev) => [...prev, job]);
    }
  };

  const removeJob = (job: string) => {
    setSelectedJobs((prev) => prev.filter((j) => j !== job));
  };

  interface FormData {
    name: string;
    email: string;
  }

  const submitHandler = async (data: FormData) => {
    try {
      await authAxios.post("/events/"+id+"/company-registeration", {
        ...data,
        companyId: selectedCompany,
        jobIds: selectedJobs,
      });
      toast.success("Registration successful.");
    } catch (error) {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Company Event Registration</h1>
      <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="font-medium pb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className={`border ${
              errors.name ? "border-red-400" : "border-gray-300"
            } focus:outline-none h-12 px-3 rounded`}
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-400 text-sm italic">Name is required.</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="font-medium pb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={`border ${
              errors.email ? "border-red-400" : "border-gray-300"
            } focus:outline-none h-12 px-3 rounded`}
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm italic">Email is required.</p>
          )}
        </div>

        {/* Company Selection */}
        <div className="flex flex-col">
          <label htmlFor="company" className="font-medium pb-2">
            Select Company
          </label>
          <select
            id="company"
            className="border border-gray-300 focus:outline-none h-12 px-3 rounded"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {companies && companies.length > 0 &&
              companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))}
          </select>
        </div>

        {/* Job Selection */}
        <div className="flex flex-col">
          <label className="font-medium pb-2">Select Jobs</label>
          <div className="flex flex-wrap gap-2">
            {jobs.map((job) => (
              <button
                key={job._id}
                type="button"
                className={`px-3 py-1 rounded-full border ${
                  selectedJobs.includes(job._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() =>
                  selectedJobs.includes(job._id)
                    ? removeJob(job._id)
                    : addJob(job._id)
                }
              >
                {job.jobTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Jobs */}
        <div className="flex flex-col">
          <label className="font-medium pb-2">Selected Jobs</label>
          <div className="flex flex-wrap gap-2">
            {selectedJobs.map((jobId) => {
              const job = jobs.find((j) => j._id === jobId);
              return (
                <div
                  key={jobId}
                  className="px-3 py-1 rounded-full bg-blue-500 text-white flex items-center gap-2"
                >
                  {job?.jobTitle}
                  <button
                    type="button"
                    onClick={() => removeJob(jobId)}
                    className="text-sm bg-red-500 rounded-full px-2"
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

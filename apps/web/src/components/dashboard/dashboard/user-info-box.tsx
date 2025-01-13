"use client"
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";
import { authAxios } from "../../utils/axiosKits";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const dashboardStatic = "/users/statistics";

const UserInfoBox = (): any => {
  // Use SWR
  const { data, error } = useSWR(dashboardStatic, fetcher);

  if (error) return "An error has occurred.";
  if (!data)
    return (
      <section className="mb-10">
        <div className="mx-auto">
          <div className="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="shadow-[0px_15px_20px_-4px] shadow-[rgba(251,139,47,0.4)] py-4 px-3 bg-[#FB8B2F] text-white rounded-lg text-center">
              <p className="font-normal text-lg mb-3">Total Jobs</p>
              <Skeleton height={48} width={150} />
            </div>

            <div className="shadow-[0px_15px_20px_-4px] shadow-[rgb(28,175,87,0.4)] py-4 px-3 bg-themePrimary text-white rounded-lg text-center">
              <p className="font-normal text-lg mb-3">Total Resumes</p>
              <Skeleton height={48} width={150} />
            </div>
            <div className="shadow-[0px_15px_20px_-4px] shadow-[rgb(60,198,252,0.4)] py-4 px-3 bg-[#3CC6FC] text-white rounded-lg text-center">
              <p className="font-normal text-lg mb-3">Total Employe</p>
              <Skeleton height={48} width={150} />
            </div>
            <div className="shadow-[0px_15px_20px_-4px] shadow-[rgb(79,107,241,0.4)] py-4 px-3 bg-[#4F6BF1] text-white rounded-lg text-center">
              <p className="font-normal text-lg mb-3">Total Companies</p>
              <Skeleton height={48} width={150} />
            </div>
          </div>
        </div>
      </section>
    );
  return (
    <section className="mb-10">
      <div className="mx-auto">
        <div className="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-10">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className={`shadow-[0px_15px_20px_-4px] py-6 px-5 ${
                item.title === "Applied Jobs" || item.title === "Total Jobs"
                  ? "bg-[#FB8B2F] shadow-[rgba(251,139,47,0.4)]"
                  : item.title === "Favorite Jobs" ||
                    item.title === "Total Resumes" ||
                    item.title === "Featured Jobs"
                  ? "bg-[#1CAF57] shadow-[rgb(28,175,87,0.4)]"
                  : item.title === "Job Alerts" ||
                    item.title === "Total Employee" ||
                    item.title === "Published Jobs"
                  ? "bg-[#3CC6FC] shadow-[rgb(60,198,252,0.4)]"
                  : item.title === "Resumes Views" ||
                    item.title === "Total Companies"
                  ? "bg-[#4F6BF1] shadow-[rgb(79,107,241,0.4)]"
                  : "bg-[#4F6BF1] shadow-[rgb(79,107,241,0.4)]"
              } text-white rounded-lg text-center`}
            >
              <p className="font-normal text-[18px] leading-[21px] uppercase mb-4">
                {item.title}
              </p>
              <h2 className="text-[40px] font-bold leading-[48px]">
                {item.count}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserInfoBox;

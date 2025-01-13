"use client"
import CandidateInfo from "@/src/components/frontend/candidate/candidate-info";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import { Axios } from "@/src/components/utils/axiosKits";
import resumePreData from "@/src/data/resumeData.json";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => Axios(url).then((res) => res.data);

export default function CandidateProfile() {
  const params = useParams()
  const { id } = params;
  const API = `/resumes/resume/${id}`;
  const { data, error } = useSWR(id ? API : null, fetcher, {
    fallbackData: resumePreData,
    refreshInterval: 0,
  });
  return (
    <>
      <Head>
        <meta name="description" content="Your Resume Details page" />
      </Head>

      <Layout>
        <main>
          <PageTitle title="Candidate Profile" />
          {error && (
            <div className="h-40 text-center shadow rounded-lg bg-white w-full">
              failed to load
            </div>
          )}
          <CandidateInfo data={data} />
        </main>
      </Layout>
    </>
  );
}

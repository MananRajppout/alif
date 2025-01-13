"use client"
import { registerOnEventRequest } from "@/http/event";
import { User } from "@/interface/AuthInterface";
import CreateWorkFlow from "@/src/components/dashboard/event/create-workflow";
import RegisterForm from "@/src/components/dashboard/event/register-form";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import { authAxios } from "@/src/components/utils/axiosKits";
import { AxiosError } from "axios";
import { set } from "lodash";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";


interface Room {
  interviewerName: string
  interviewerEmail: string
  _id?: string,
  accessToken?: string
}

export interface Round {
  name: string
  description: string
  roundType: string
  index: number;
  rooms: Room[]
}

interface IProps {
  params: { id: string }
}

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const Page: FC<IProps> = ({ params }) => {
  const [step, setStep] = useState<'register' | 'workflow'>('register');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const { data, status } = useSession();
  const [alreadyRegisterDeatils, setAlreadyRegisterDeatils] = useState<any>(null);
  const [rounds, setRounds] = useState<Round[]>([
    { name: `Round 1`, description: '', roundType: '', index: 0, rooms: [{ interviewerName: '', interviewerEmail: '' }] }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const userData = data?.user as User;
  const isCandidate = userData?.role?.isCandidate;
  const { data: opportunity, error } = useSWR(`/events/opportunity/${params.id}`, fetcher);



  useEffect(() => {
    if (opportunity?.length > 0) {
      setAlreadyRegisterDeatils(opportunity[0]);
    }
  }, [opportunity]);



  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = {
        rounds,
        name,
        description,
        role,
        event_id: params.id
      }
      const res = await registerOnEventRequest(formdata);
      setStep('register');
      setName('');
      setDescription('');
      setRole('');
      setRounds([{ name: `Round 1`, description: '', roundType: '', index: 0, rooms: [{ interviewerName: '', interviewerEmail: '' }] }]);
      toast.success(res.data.message);
      setAlreadyRegisterDeatils(res.data.data);
    } catch (error) {
      toast.error((error as AxiosError<{ message: string }>).response?.data?.message || (error as Error).message);
    } finally {
      setLoading(false);
    }

  }, [rounds, name, description, role, params.id]);



  const copyToClipboard = useCallback((_id: string, accessToken: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/interview-room/${_id}?accessToken=${accessToken}`)
        .then(() => {
          toast.success("Text copied to clipboard")
        })
        .catch(err => {
          toast.error("Failed to copy text to clipboard:", err);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Dashboard- Bookmark jobs, upcoming events and register"
        />
      </Head>

      <Layout>
        <main className="">
          {status === "unauthenticated" && <UserNotLogin />}
          {isCandidate && <UserGoBack />}
          {userData && status === "authenticated" && !isCandidate && !alreadyRegisterDeatils && (
            <>
              {
                step === 'register' ? <RegisterForm setStep={setStep} name={name} description={description} role={role} setName={setName} setDescription={setDescription} setRole={setRole} />
                  : <CreateWorkFlow rounds={rounds} setRounds={setRounds} handleSubmit={handleSubmit} loading={loading} />
              }
            </>
          )}

          {userData && status === "authenticated" && !isCandidate && alreadyRegisterDeatils && (
            <div>
              <h1 className="text-2xl font-bold text-center">You have already registered for this event</h1>
              <h1 className="text-2xl font-bold text-center">Your registration details</h1>
              <div className=" mt-10">
                <div className="space-y-8">
                  <div className="flex justify-between gap-16">
                    <p className="text-lg">Name</p>
                    <p>{alreadyRegisterDeatils.name}</p>
                  </div>
                  <div className="flex justify-between gap-16">
                    <p className="text-lg">Description</p>
                    <p>{alreadyRegisterDeatils.description?.slice(0, 40)}...</p>
                  </div>
                  <div className="flex justify-between gap-16">
                    <p className="text-lg">Role</p>
                    <p>{alreadyRegisterDeatils.role}</p>
                  </div>
                  <div className="flex justify-between gap-16">
                    <p className="text-lg">Event</p>
                    <p>{alreadyRegisterDeatils.event_id}</p>
                  </div>
                  <div className="flex justify-between gap-16">
                    <p className="text-lg">Total Round</p>
                    <p>{alreadyRegisterDeatils.rounds?.length}</p>
                  </div>

                  {
                    alreadyRegisterDeatils.rounds?.map((round: Round) => (
                      <>
                        {
                          round.rooms.map((room: Room, index) => (
                            <div className="flex justify-between gap-16">
                              <p className="text-lg">{round.name} - Room {index + 1}</p>
                              <button className="bg-themePrimary hover:bg-themeDarkerAlt text-white px-4 py-2 rounded-md" onClick={() => copyToClipboard(room._id as string, room.accessToken as string)}>Copy Link</button>
                            </div>
                          ))
                        }
                      </>
                    ))
                  }





                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ marginTop: "5rem" }}>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            First Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Last Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            email
                          </th>
                          <th scope="col" className="px-6 py-3">
                            status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          alreadyRegisterDeatils.participants?.map((user: any) => (
                            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {user?.user?.fullName?.firstName}
                              </th>
                              <td className="px-6 py-4">
                              {user?.user?.fullName?.lastName}
                              </td>
                              <td className="px-6 py-4">
                              {user?.user?.email}
                              </td>
                              <td className="px-6 py-4">
                               {user.status}
                              </td>
                            </tr>
                          ))
                        }

                      </tbody>
                    </table>
                  </div>






                </div>
              </div>
            </div>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Page;

"use client"
import _ from "lodash";
import moment from "moment";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { AiOutlineSend } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { useToasts } from "@/src/components/toast/toast";
import { useSWRConfig } from "swr";
import { FormLoader } from "../../lib/loader";
import ImageOpt from "../../optimize/image";
import { authAxios } from "../../utils/axiosKits";

const MessageBox = ({ data }: { data: any }) => {
  const { data: sessionData } = useSession();
  const userData = sessionData?.user as {
    user: any; _id: string; role: { isEmployer: boolean; isAdmin: boolean }; avatar?: string 
};
  const isEmployer = userData?.role.isEmployer;
  const isAdmin = userData?.role.isAdmin;
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();
  const [filter, setFilterData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const isCandidate = data?.members?.candidate?._id === userData?.user?._id;
  const Employer = data?.members?.employer?._id === userData?.user?._id;
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  React.useEffect(() => {
    if (data) setFilterData(data.messages);
  }, [data]);

  const onSendMessage = async (item: any) => {
    setLoading(true);

    // if item.message is empty
    if (!item.message) {
      setError("message", {
        type: "manual",
        message: "Message is required",
      });
      setLoading(false);

      return;
    }

    const date = new Date();
    const newData = {
      sender: userData?.user?._id,
      reciver:
        userData?.user?._id === data?.members?.candidate?._id
          ? data?.members?.employer?._id
          : data?.members?.candidate?._id,
      message: item?.message,
      timestamp: date,
    };
    try {
      await authAxios({
        method: "PUT",
        url: `/messages/message/${data?._id}`,
        data: newData,
      }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          mutate(`/messages/message`).then(() => {
            addToast("Message sent", {
              appearance: "success",
              autoDismiss: true,
            });
            setLoading(false);
            reset();
          });
        }
      });
    } catch (error: any) {
      addToast("Error sending message", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  // sort messages by timestamp
  const sortedMessages = _.sortBy(filter, (item: any) => {
    const date = new Date(item?.timestamp);
    return date.getTime() * -1;
  }) as any;

  const searchHandler = (value: any) => {
    const filtered = _.filter(data?.messages, (item) => {
      return item.message.toLowerCase().includes(value.toLowerCase());
    });

    if (value === "") {
      setFilterData(data?.messages);
    } else {
      // update filter message data
      setFilterData(filtered as any);
    }
  };

  return (
    <div className="grid content-between h-full">
      {!data && (
        <div className="text-lg2 text-themeLighter h-52 grid justify-center items-center">
          No Messages
        </div>
      )}
      {data && (
        <>
          {/* header bar */}
          <div className="flex justify-between flex-wrap border-b border-gray !pb-3">
            <div className="flex flex-wrap items-center gap-x-4">
              <div>
                <ImageOpt
                  width={48}
                  height={48}
                  alt="image"
                  className="inline-block object-cover rounded-full"
                  src={
                    (!isCandidate
                      ? data?.members?.candidate?.avatar
                      : !Employer && data?.members?.employer?.avatar) ||
                    "https://via.placeholder.com/48x48"
                  }
                />
              </div>
              <div className="grid gap-1 sm:gap-0">
                <div className="flex gap-2 items-center">
                  <p className="text-lg2 font-bold text-themeDark leading-8">
                    {!isCandidate
                      ? `${
                          data?.members?.candidate?.fullName?.firstName || ""
                        } ${data?.members?.candidate?.fullName?.lastName || ""}`
                      : !Employer &&
                        `${data?.members?.employer?.fullName?.firstName} ${data?.members?.employer?.fullName?.lastName}`}
                  </p>
                  {/* <span className="text-xs !font-normal text-deep border-l border-deep pl-2">
                                        Last seen: 9 hours ago
                                    </span> */}
                </div>
                {data?.job && (
                  <p className="text-themePrimary font-normal text-xxs">
                    {data?.job?.jobTitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center relative my-2 w-auto">
              <input
                type="text"
                name="search"
                placeholder="Search"
                onChange={(e) => searchHandler(e.target.value)}
                className="bg-themeLighterAlt rounded-lg border-0 h-12 min-w-[245px] w-full px-4 pl-10 focus:outline-none "
              />
              <div className="absolute left-0 px-3">
                <FiSearch className="text-lg w-5 text-themeDarker" />
              </div>
            </div>
          </div>
          {/*end header bar */}

          <div className="flex flex-col bg-white">
            {/* message box area    */}
            <div
              id="chat"
              className="flex mt-2 flex-col-reverse space-y-3 pb-3 pr-4 h-[calc(100vh-38vh)] min-h-[calc(100vh-38vh)] overflow-y-auto overflow-x-hidden"
            >
              {sortedMessages?.length > 0 ? (
                _.map(sortedMessages, (item, index) => {
                  const isSender = item?.sender === userData?.user?._id;
                  return isEmployer || isAdmin ? (
                    isSender ? (
                      <From
                        item={item}
                        image={
                          userData?.user?.avatar ||
                          "https://via.placeholder.com/48x48"
                        }
                        key={index}
                      />
                    ) : (
                      <To
                        item={item}
                        image={
                          data?.members?.candidate?.avatar ||
                          "https://via.placeholder.com/48x48"
                        }
                        key={index}
                      />
                    )
                  ) : isSender ? (
                    <From
                      item={item}
                      image={
                        userData?.user?.avatar ||
                        "https://via.placeholder.com/48x48"
                      }
                      key={index}
                    />
                  ) : (
                    <To
                      item={item}
                      image={
                        data?.members?.employer?.avatar ||
                        "https://via.placeholder.com/48x48"
                      }
                      key={index}
                    />
                  );
                })
              ) : (
                <div className="text-lg2 text-themeLighter h-52 grid justify-center items-center">
                  No Messages
                </div>
              )}
              {/* date line */}
              {/* <ChatDate item={{}} /> */}
            </div>
            {/* end message box area    */}

            {/* send box area */}

            <form onSubmit={handleSubmit(onSendMessage)} className="relative">
              {loading && (
                <div className="flex items-center absolute left-2 -top-4 justify-start">
                  <FormLoader />
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 items-center bottom-0 my-2 w-full">
                {/* Image upload icon hidden */}
                {/* <div>
                <button
                  className="flex  items-center justify-center h-12 w-12 rounded-full
                   text-white focus:outline-none border border-themeDark"
                >
                  <FiImage className="text-xl text-themeDark" />
                </button>
              </div> */}
                <div className={`w-full`}>
                  <textarea
                    id="message"
                    disabled={loading}
                    placeholder="Type your message here. Press ctrl + enter to send message"
                    {...register("message", {
                      required: {
                        value: true,
                        message: "Message is required",
                      },
                    })}
                    // on control + enter send message
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === "Enter") {
                        handleSubmit(onSendMessage)();
                      }
                    }}
                    className={`border-gray h-12 border !px-4 !py-3 rounded-lg w-full focus:outline-none text-sm items-center`}
                  />
                  {/* emoji icon hidden */}
                  {/* <div className="flex flex-row">
                  <button
                    id="capture"
                    className="focus:outline-none flex items-center justify-center h-10 w-8 ml-1 mr-2"
                  >
                    <HiOutlineEmojiHappy className="text-lg" />
                  </button>
                </div> */}
                </div>
                {/* send button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading || !watch("message")}
                    className={`flex items-center justify-center h-11 w-14 -mt-2.5 rounded text-white focus:outline-none ${
                      loading ? "bg-black" : "bg-themePrimary"
                    }`}
                  >
                    {loading ? (
                      <FormLoader />
                    ) : (
                      <AiOutlineSend className="text-lg text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* error message */}
              {errors.message && (
                <div className="text-red-400 text-sm mb-3">
                  {/* @ts-ignore */}
                  {errors.message?.message}
                </div>
              )}
            </form>
            {/* end send box area */}
          </div>
        </>
      )}
    </div>
  );
};

const To = ({ item, image }: { item: any; image: any }) => {
  return (
    <>
      <div className="flex justify-start items-start gap-x-4 gap-y-2 mr-auto pb-4">
        <div className="block flex-none w-12">
          <ImageOpt
            width={48}
            height={48}
            alt="image"
            className="inline-block object-cover rounded-full"
            src={image ? image : "https://via.placeholder.com/48x48"}
          />
        </div>
        <div className="w-fit">
          <p className="!py-2 !px-3 bg-slate-200 text-themeDarker rounded-lg">
            {item?.message ?? ""}
          </p>
          {item?.timestamp && (
            <span className="text-xsss font-normal text-deep">
              {moment(item?.timestamp).fromNow()}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

const From = ({ item, image }: { item: any; image: any }) => {
  return (
    <div className="flex justify-end items-start gap-x-4 gap-y-2 ml-auto pb-4">
      <div className="w-fit">
        <p className="!py-2 !px-3 bg-themePrimary text-white rounded-lg">
          {item?.message ?? ""}
        </p>
        {item?.timestamp && (
          <span className="text-xsss w-fit font-normal text-deep">
            {moment(item?.timestamp).fromNow()}
          </span>
        )}
      </div>
      <div className="block flex-none w-12">
        <ImageOpt
          width={48}
          height={48}
          alt="image"
          className="block object-cover rounded-full"
          src={`${image ? image : "https://via.placeholder.com/48x48"}`}
        />
      </div>
    </div>
  );
};

export default MessageBox;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { Transport, Consumer } from "mediasoup-client/lib/types";
import { getChatSocket } from "../utils/socketClient";
import ReactPlayer from "react-player";
import VideoEnhancer from "./enhanceComp";
import { motion } from "framer-motion";
import ChatBox from "./chatBox";
import VideoLayout from "./videoLayout";
import {
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Mic,
  MicOff,
  MonitorUp,
  MonitorX,
  Phone,
  PhoneOff,
  Plus,
  Presentation,
  Sparkle,
  Sparkles,
  Tv,
  Users,
} from "lucide-react";
import { Timer } from "./Timer";

import { viewerForRecruiter } from "../utils/contants";
import JobApplyCard from "./jobApplyCard";
import CandidatesAppliedCard from "./candidatesAppliedCard";
import VideoLayoutRecruiter from "./JoineeGrid/VideoLayouts/videoLayoutRecruiter";
const SERVER_URL = "http://localhost:5000";

const Recruiter = ({
  className,
  roomidProp,
  comapanyData,
  usersData,
  userData,
}: {
  className: string;
  roomidProp: string;
  comapanyData: any[];
  usersData: any[];
  userData: any;
}) => {
  const viewers = [...usersData, ...comapanyData];

  const broadcaster = <div className="text-white">Broadcaster Video</div>;

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [device, setDevice] = useState<mediasoupClient.Device | null>(null);
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [transport, setTransport] = useState<Transport | null>(null);
  const [dev, setDev] = useState<mediasoupClient.Device | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const [showChat, setShowChat] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [teleprompterText, setTeleprompterText] = useState(
    "This is a floating teleprompter that you can drag around the screen. It helps presenters read text while maintaining eye contact with the audience. This is a floating teleprompter that you can drag around the screen. It helps presenters read text while maintaining eye contact with the audience."
  ); // State to store teleprompter text
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [screenShared, setScreenShared] = useState(false);
  const [toggleEnhance, setToggleEnhance] = useState(false);
  const [screenShareStream, setScreenShareStream] =
    useState<MediaStream | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  const [selectedJobApply, setSelectedJobApply] = useState<any>(null);
  const [showJobApply, setShowJobApply] = useState(false);

  const [showApplied, setShowApplied] = useState(false);
  const [appliedCandidates, setAppliedCandidates] = useState<any[]>([]);
  const totalPages = Math.ceil(viewers.length / 12);
  const [currentPage, setCurrentPage] = useState(0);

  const moveLeft = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const moveRight = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleConsumer = async ({
    transport,
    roomId,
    dev,
    socket,
  }: {
    transport: Transport;
    roomId: string;
    dev: mediasoupClient.Device;
    socket: Socket;
  }) => {
    transport.on("icegatheringstatechange", (candidate) => {
      console.log("Client ICE candidate gathered:", candidate);
      if (candidate) {
        console.log("Client ICE candidate gathered:", candidate);
        socket.emit("addIceCandidate", { roomId, candidate });
      }
    });
    transport.on("connect", ({ dtlsParameters }, callback, errback) => {
      console.log("Viewer transport connected started");
      socket.emit(
        "connectViewerTransport",
        { roomId, dtlsParameters, transportId: transport.id },
        (response: any) => {
          if (response && response.error) {
            console.error("Error connecting viewer transport:", response.error);
            return errback(response.error);
          }
          setConnected(true);
          console.log("Viewer transport connected");
          callback();
        }
      );
    });

    transport.on("connectionstatechange", (state) => {
      console.log("Viewer transport state changed", state);
      if (state === "connected") {
        console.log("Viewer transport connected");
      } else if (state === "failed" || state === "closed") {
        console.error("Viewer transport failed or closed");
      }
    });
    console.log("Viewer transport params created");
    socket.emit(
      "consume",
      {
        roomId,
        rtpCapabilities: dev.rtpCapabilities,
        transportId: transport.id,
      },
      async (response: any) => {
        console.log("Consuming...", response, typeof response, response.length);
        if (response.error) {
          console.error("Error consuming:", response.error);
          return;
        }

        if (!response || response.length === 0) {
          console.log("No producers to consume");
          return;
        }
        const consumersList: mediasoupClient.types.Consumer<mediasoupClient.types.AppData>[] =
          [];
        const combinedStream = new MediaStream();
        response.forEach(async (consumerParams: any) => {
          const { id, kind, rtpParameters, producerId } = consumerParams;

          console.log("Consuming", kind, id);

          console.log(
            "Transport connection state: ",
            transport.connectionState
          );
          const newConsumer = await transport.consume({
            id,
            kind,
            rtpParameters,
            producerId,
          });

          const { track } = newConsumer;
          combinedStream.addTrack(track);

          if (newConsumer.kind === "video") {
            setConsumer(newConsumer);
          }
          consumersList.push(newConsumer);
          console.log("Consumer ready", newConsumer.kind);
        });

        setRemoteStream(combinedStream);
        setRemoteStreams((prevStreams) => [...prevStreams, combinedStream]);
        console.log("Consumers list herer");
        setTimeout(() => {
          console.log("Consuming paused", consumersList);

          if (consumersList && consumersList.length > 0) {
            console.log("Consuming resumed", consumersList);
            socket.emit("consume-resume", roomId, () => {
              console.log("Consumer resumed");
            });
          }
        }, 3000);
      }
    );
  };

  const handleRemoveCandidate = (id: string) => {
    console.log(`Removing candidate with id: ${id}`);
    setAppliedCandidates((prevCandidates) =>
      prevCandidates.filter(
        (candidate) => candidate.userData.userDetails._id !== id
      )
    );
    console.log("Remaining candidates:", appliedCandidates.length - 1);
  };

  const handleSelectCandidate = (id: any) => {
    const random = Math.floor(10000 + Math.random() * 90000);
    if (chatSocket) {
      console.log("Chat Socket found");
      chatSocket.emit("candidateSelect", {
        roomId: roomidProp,
        interviewId: random,
        userId: id,
      });
      console.log("Candidate Selected", id);
    }else{
      console.log("Chat Socket not found");
    }

    window.open(`/peerViewers/create/${random}`, "_blank");
  };

  useEffect(() => {
    const initSocketAndMediasoup = async (roomId: string) => {
      console.log("Initializing socket and mediasoup...");
      // const socket = getSocket();
      setSocket(socket);
      const chatSocket = getChatSocket();
      chatSocket.on("connect", () => {
        console.log("Connected to chat server 101");
        chatSocket.emit("join", { roomId });
      });
      chatSocket.on("appliedJobApply", (data: any) => {
        console.log("Applied Job Apply", data);
        if (!appliedCandidates.includes(data)) {
          console.log("Applied added", data);
          setAppliedCandidates((prevCandidates) => [...prevCandidates, data]);
        }
      });
      setChatSocket(chatSocket);
      // setSocket(socket);
      // socket.on("connect", async () => {
      //   console.log(`Connected to server, joining room: ${roomId}`);

      //   // Join the specific room
      //   socket.emit(
      //     "joinRoom",

      //     { roomId, role: "viewer" },
      //     async (response: any) => {
      //       const routerRtpCapabilities = response.routerRtpCapabilities;

      //       console.log("Joined room as viewer", routerRtpCapabilities);
      //       socket.emit(
      //         "createViewerTransport",
      //         roomId,
      //         async (response: any) => {
      //           if (response.error) {
      //             console.error(
      //               "Error creating viewer transport:",
      //               response.error
      //             );
      //             return;
      //           }

      //           const transportParams = response.params;
      //           const dev = new mediasoupClient.Device();
      //           await dev.load({
      //             routerRtpCapabilities,
      //           });

      //           const transport = dev.createRecvTransport({
      //             id: transportParams.id, // Provided by server
      //             iceParameters: transportParams.iceParameters, // Provided by server
      //             iceCandidates: transportParams.iceCandidates, // Provided by server
      //             dtlsParameters: transportParams.dtlsParameters, // Provided by server
      //             // Optional: Custom transport settings
      //             iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      //           });
      //           console.log(
      //             "Viewer transport listeners created",
      //             transportParams
      //           );

      //           setDev(dev);
      //           setTransport(transport);
      //           setRoomId(roomId);
      //           setSocket(socket);

      //           await handleConsumer({ transport, roomId, dev, socket });
      //         }
      //       );
      //     }
      //   );
      // });

      // socket.on("connect_error", (error) => {
      //   console.error("Socket connection error:", error);
      // });

      // socket.on("disconnect", () => {
      //   console.log("Socket disconnected");
      // });

      // setSocket(socket);
    };

    if (!connected) {
      initSocketAndMediasoup(roomidProp);
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (consumer) {
        consumer.close();
      }
    };
  }, [connected, roomidProp]); // Only trigger when 'connected' or 'roomidProp' changes

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="w-screen h-screen poppins-medium primary-background-color">
      <div className="h-full">
        <div
          className="w-full flex justify-center items-center p-4 gap-4"
          style={{
            height: "90%",
          }}
        >
          <div
            className="h-full"
            style={{
              width: showChat ? "75%" : "100%",
              transition: "width 0.5s ease-in-out", // Smooth transition for layout
            }}
          >
            <VideoLayoutRecruiter
              broadcaster={broadcaster}
              viewers={viewers}
              // @ts-ignore
              broadcastedStream={
                screenShared ? screenShareStream : remoteStreams[0]
              }
              toggleEnhance={toggleEnhance}
              currentPage={currentPage}
              setSelectedJobApply={setSelectedJobApply}
              handleConsumer={handleConsumer}
            />
          </div>
          {/* Chatbox with Framer Motion for slide-in/out animation */}
          <motion.div
            className="h-full primary-background-color "
            initial={{ width: 0 }}
            animate={{ width: showChat ? "25%" : "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              overflow: "hidden",
            }}
          >
            <motion.div
              className="bg-white w-full h-full rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: showChat ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {chatSocket && (
                <ChatBox
                  roomId={roomidProp}
                  setShowChat={() => {
                    setShowChat(!showChat);
                  }}
                  showChat={showChat}
                  senderNameProp={
                    userData?.fullName.firstName +
                    " " +
                    userData?.fullName.lastName
                  }
                  chatSocket={chatSocket}
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="h-full primary-background-color  rounded-lg "
            initial={{ width: 0 }}
            animate={{ width: showApplied ? "25%" : "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              overflow: "hidden",
            }}
          >
            <motion.div
              className="bg-white w-full h-full rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: showApplied ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {showApplied &&
                appliedCandidates &&
                appliedCandidates.length > 0 && (
                  <CandidatesAppliedCard
                    setShow={setShowApplied}
                    appliedCandidates={appliedCandidates}
                    handleRemoveCandidate={handleRemoveCandidate}
                    handleSelectCandidate={handleSelectCandidate}
                  />
                )}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Controls */}
        <div
          className="h-1/12 w-full primary-background-color flex flex-row justify-between items-center pl-4 pr-4"
          style={{
            height: "10%",
          }}
        >
          {/* Timer */}
          <div className="w-1/4 h-full flex justify-between items-center">
            <p className="text-white text-lg p-4">
              <Timer />
            </p>

            {/* controls pagination */}

            <div className="flex justify-between items-center">
              <button
                className=" font-bold py-2 px-4 rounded"
                onClick={moveLeft}
              >
                <ChevronLeft className="text-white" />
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className=" font-bold py-2 px-4 rounded"
                onClick={moveRight}
              >
                <ChevronRight className="text-white" />
              </button>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="w-2/4 flex justify-center items-center gap-3">
            <motion.div
              className={`h-fit w-fit p-3 ${
                !toggleEnhance
                  ? "secondary-background-color rounded-full"
                  : "secondary-background-color rounded-full"
              }`}
              onClick={() => setToggleEnhance(!toggleEnhance)}
              whileTap={{ scale: 0.9 }} // Button animation on click
            >
              {toggleEnhance ? (
                <Sparkles className="text-white" size={24} />
              ) : (
                <Sparkle className="text-white" size={24} />
              )}
            </motion.div>
            <motion.div
              className={`h-fit w-fit p-3  pl-6 pr-6 bg-red-500 rounded-full`}
              whileTap={{ scale: 0.9 }} // Button animation on click
            >
              <Phone
                onClick={() => {}}
                className="text-white"
                style={{
                  transform: "rotate(135deg)",
                }}
                size={24}
              />
            </motion.div>
          </div>

          {/* Chat Toggle Button */}
          <motion.div
            className="w-1/4 flex justify-end items-center"
            whileTap={{ scale: 0.9 }}
          >
            <div
              className="h-fit w-fit p-3 hover:bg-gray-600 rounded-full"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquareText className="text-white" size={24} />
            </div>
            <div
              className="h-fit w-fit p-3 hover:bg-gray-600 rounded-full"
              onClick={() => setShowApplied(!showApplied)}
            >
              <Users className="text-white" size={24} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Recruiter;

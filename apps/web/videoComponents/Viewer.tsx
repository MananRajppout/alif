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
} from "lucide-react";
import { Timer } from "./Timer";

import { recuiterForViewer } from "../utils/contants";
import JobApplyCard from "./jobApplyCard";
import VideoLayoutViewer from "./JoineeGrid/VideoLayouts/videoLayoutViewer";
const SERVER_URL = "http://localhost:5000";

const Viewer = ({
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
  const viewers = [...comapanyData, ...usersData];
  const broadcaster = <div className="text-white">Broadcaster Video</div>;

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [device, setDevice] = useState<mediasoupClient.Device | null>(null);
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
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

  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  const [selectedJobApply, setSelectedJobApply] = useState<any>(null);
  const [showJobApply, setShowJobApply] = useState(false);

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
          const { id, kind, rtpParameters, producerId, appData } =
            consumerParams;

          console.log("Consuming", consumerParams);

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
          console.log("Consumer ready", newConsumer);

          if (appData && appData.source == "webcam" && track.kind === "video") {
            setWebcamStream(new MediaStream([track]));
          } else if (
            appData &&
            appData.source == "audio" &&
            track.kind === "audio"
          ) {
            const dualStream = webcamStream?.addTrack(track);

            if (dualStream) {
              setWebcamStream(dualStream);
            } else {
              console.log("Dual stream not added");
            }
          } else if (
            appData &&
            appData.source == "screen" &&
            track.kind === "video"
          ) {
            setScreenShareStream(new MediaStream([track]));
            setScreenShared(true);
            console.log("Screen shared");
          } else if (
            appData &&
            appData.source == "screen" &&
            track.kind === "audio"
          ) {
            const dualStream = screenShareStream?.addTrack(track);

            if (dualStream) {
              setScreenShareStream(dualStream);
            } else {
              console.log("Dual stream not added");
            }
          }
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

  const handleSendApplication = (pitch: string) => {
    console.log(
      "Sending application:",
      selectedJobApply,
      chatSocket,
      roomidProp
    );

    console.log("User data", userData);

    const userDatas = usersData.find(
      (user) => user.userDetails._id === userData._id
    );

    if (selectedJobApply && chatSocket && roomidProp) {
      console.log("Emitting candidate job apply", selectedJobApply);
      chatSocket.emit("candidateJobApply", {
        info: {
          ...selectedJobApply,
          pitch,
        },
        userData: userDatas,
        roomId: roomidProp,
      });
    }
  };

  useEffect(() => {
    const initSocketAndMediasoup = async (roomId: string) => {
      console.log("Initializing socket and mediasoup...");
      // const socket = getSocket();
      const chatSocket = getChatSocket();

      chatSocket.on("connect", () => {
        console.log("Connected to chat server");
        chatSocket.emit("join", { roomId });
      });

      chatSocket.on("disconnect", () => {
        console.log("Disconnected from chat server");
      });

      chatSocket.on("appliedSelect", (data) => {
        console.log("appliedSelect", data);
        if (data.userId === userData._id) {
          console.log("ssss");
          window.open(`/peerViewers/join/${data.interviewId}`, "_blank");
        }
      });

      setSocket(socket);
      setChatSocket(chatSocket);

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

      //           socket.on("reConsume", async (data: any) => {
      //             console.log("New event received", data);

      //             if (data && data.roomId == roomId) {
      //               if (transport && dev) {
      //                 console.log("Reconsuming...");
      //                 await handleConsumer({ transport, roomId, dev, socket });
      //               } else {
      //                 console.log("Transport or device not ready", transport);
      //               }
      //             } else {
      //               console.log("Room id not matched", data.roomId, roomId);
      //             }
      //           });
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
      if (chatSocket) {
        chatSocket.disconnect();
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
            <VideoLayoutViewer
              broadcaster={broadcaster}
              viewers={viewers}
              currentPage={currentPage}
              broadcastedStream={
                screenShared ? screenShareStream : webcamStream
              }
              toggleEnhance={toggleEnhance}
              setSelectedJobApply={setSelectedJobApply}
              role="viewer"
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
                  chatSocket={chatSocket}
                  showChat={showChat}
                  senderNameProp={
                    userData?.fullName.firstName +
                    " " +
                    userData?.fullName.lastName
                  }
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="h-full primary-background-color rounded-lg"
            initial={{ width: 0 }}
            animate={{ width: selectedJobApply ? "25%" : "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              overflow: "hidden",
            }}
          >
            <motion.div
              className="bg-white w-full h-full rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedJobApply ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {selectedJobApply && chatSocket && (
                <JobApplyCard
                  roomId={roomidProp}
                  jobApply={selectedJobApply}
                  setSelectedJobApply={setSelectedJobApply}
                  onSubmit={handleSendApplication}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;

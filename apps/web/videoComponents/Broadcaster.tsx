"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { Transport, Producer } from "mediasoup-client/lib/types";
import { getChatSocket } from "../utils/socketClient";
import ReactPlayer from "react-player";
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

import VideoEnhancer from "./enhanceComp";
import { viewerForBroadcaster } from "../utils/contants";
import JobApplyCard from "./jobApplyCard";
import VideoLayoutBroadcaster from "./JoineeGrid/VideoLayouts/videoLayoutBroadcaster";
// import enhanceVideoTrack from "./enhanceVideo";

const Broadcaster = ({
  roomidProp,
  comapanyData,
  usersData,
  userData,
}: {
  roomidProp: string;
  comapanyData: any[];
  usersData: any[];
  userData: any;
}) => {
  const viewers = [...comapanyData, ...usersData];
  const broadcaster = <div className="text-white">Broadcaster Video</div>;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [device, setDevice] = useState<mediasoupClient.Device | null>(null);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [transportState, setTransportState] = useState<Transport | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

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

  const screenShare = async () => {
    if (!transportState) {
      console.error("No transport available.");
      return;
    }
    if (!socket) {
      console.error("No socket available.");
      return;
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
    if (!stream) return;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      console.error("No video track available.");
      return;
    }

    const audioTrack = stream.getAudioTracks()[0];

    console.log("Produce Pre:", videoTrack, audioTrack);

    const produceVideo = await transportState.produce({
      track: videoTrack,
      appData: { source: "screen" },
    });

    if (audioTrack) {
      const produceAudio = await transportState.produce({
        track: audioTrack,
        appData: { source: "screen" },
      });
      if (stream) {
        audioTrack.onended = () => {
          socket.emit("closeProducer", {
            roomId: roomidProp,
            producerId: produceAudio.id,
          });
          setScreenShareStream(null);
        };
      }
    }

    console.log("Produce:", produceVideo.id);

    if (stream && stream.getVideoTracks()[0])
      videoTrack.onended = () => {
        socket.emit("closeProducer", {
          roomId: roomidProp,
          producerId: produceVideo.id,
        });
        setScreenShareStream(null);
      };

    setScreenShareStream(stream);

    socket.emit("newProducer", {
      producerId: "producer.id",
      kind: "producer.kind",
      producerLabel: "producerLabel", //must look into this
    });

    setScreenShared(true);
  };

  const stopScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach((track) => track.stop());
      setScreenShareStream(null);
      setScreenShared(false);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  var singleRun = false;
  useEffect(() => {
    let isMounted = true;
    const initSocketAndMediasoup = async (roomId: string) => {
      if (!isMounted) return;
      console.log("Initializing socket and mediasoup...");
      const chatSocket = getChatSocket();
      chatSocket.on("connect", () => {
        console.log("Connected to chat server 101");
        chatSocket.emit("join", { roomId });
      });

      setChatSocket(chatSocket);
      // const socket = getSocket();
      // setSocket(socket);
      // socket.on("reConsume", async (data: any) => {
      //   console.log("New event received", data);
      // });
      // socket.on("connect", async () => {
      //   console.log(`Connected to server, joining room: ${roomId}`);

      //   // Join the specific room
      //   socket.emit(
      //     "joinRoom",
      //     { roomId, role: "broadcaster" },
      //     (response: any) => {
      //       console.log("Joined room:", response);
      //       if (response.error) {
      //         console.error("Error joining room:", response.error);
      //       }
      //       if (singleRun) return;

      //       const routerRtpCapabilities = response.routerRtpCapabilities;

      //       socket.emit(
      //         "createBroadcasterTransport",
      //         roomId,
      //         async (response: any) => {
      //           if (response.error) {
      //             console.error(
      //               "Error creating broadcaster transport:",
      //               response.error
      //             );
      //             return;
      //           }
      //           console.log("Broadcaster transport created:", response);
      //           singleRun = true;
      //           var transportParams = response.params;
      //           const dev = new mediasoupClient.Device();
      //           setDevice(dev);
      //           console.log(
      //             "Device:",
      //             dev,
      //             transportParams.routerRtpCapabilities
      //           );
      //           await dev.load({
      //             routerRtpCapabilities: routerRtpCapabilities,
      //           });

      //           transportParams.routerRtpCapabilities = routerRtpCapabilities;

      //           const transport =
      //             await dev.createSendTransport(transportParams);
      //           console.log("Transport:", transport);

      //           transport.on(
      //             "connect",
      //             ({ dtlsParameters }, callback, errback) => {
      //               console.log("Transport connect:", dtlsParameters);
      //               socket.emit(
      //                 "connectBroadcasterTransport",
      //                 { roomId, dtlsParameters, transportId: transport.id },
      //                 (response: any) => {
      //                   if (response && response.error) {
      //                     console.error(
      //                       "Error connecting broadcaster transport:",
      //                       response.error
      //                     );
      //                     return errback(response.error);
      //                   }
      //                   callback();
      //                 }
      //               );
      //             }
      //           );

      //           transport.on(
      //             "produce",
      //             async (
      //               { kind, rtpParameters, appData },
      //               callback,
      //               errback
      //             ) => {
      //               console.log("Produceda:", kind, rtpParameters);
      //               socket.emit(
      //                 "produce",
      //                 {
      //                   roomId,
      //                   kind,
      //                   rtpParameters,
      //                   transportId: transport.id,
      //                   appData: appData,
      //                 },
      //                 ({ id, error }: { id: any; error: any }) => {
      //                   if (error) {
      //                     console.error("Error producing:", error);
      //                     return errback(error);
      //                   }
      //                   callback({ id });
      //                 }
      //               );
      //             }
      //           );

      //           transport.on("connectionstatechange", (state) => {
      //             if (state === "connected") {
      //               console.log("Broadcaster transport connected");
      //             } else if (state === "failed" || state === "closed") {
      //               console.error("Broadcaster transport failed or closed");
      //             }
      //           });

      //           let producers = [];

      //           const stream = await navigator.mediaDevices.getUserMedia({
      //             video: {
      //               width: { ideal: 1280 },
      //               height: { ideal: 720 },
      //               frameRate: { ideal: 30 },
      //             },
      //             audio: {
      //               echoCancellation: true,
      //               noiseSuppression: true,
      //               sampleRate: 44100,
      //             },
      //           });

      //           setStream(stream);

      //           const videoTrack = stream.getVideoTracks()[0];

      //           if (!videoTrack) {
      //             console.error("No video track available.");
      //             return;
      //           }

      //           const setVideoOff = (value: boolean) => {
      //             videoTrack.enabled = !value;
      //             setVideoOff(value);
      //           };

      //           stream.getVideoTracks().forEach((track) => {
      //             track.enabled = camera;
      //           });

      //           stream.getAudioTracks().forEach((track) => {
      //             track.enabled = mic;
      //           });

      //           try {
      //             console.log("Produce Pre:", videoTrack);
      //             if (!transport || transport.closed) {
      //               console.error("Transport not ready or closed");
      //               return;
      //             }

      //             const producer = await transport.produce({
      //               track: videoTrack,
      //               appData: { source: "webcam" },
      //             });

      //             const audio = await transport.produce({
      //               track: stream.getAudioTracks()[0],
      //               appData: { source: "webcam" },
      //             });

      //             console.log("Produce:", producer.id, audio.id);
      //             setProducer(producer);
      //           } catch (error) {
      //             console.error("Error producing:", error);
      //           }

      //           setTransportState(transport);

      //           if (localVideoRef.current) {
      //             localVideoRef.current.srcObject = stream;
      //           }
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
    };

    initSocketAndMediasoup(roomidProp);

    return () => {
      isMounted = false;
      if (socket) {
        socket.disconnect();
      }
      if (producer) {
        producer.close();
      }
    };
  }, [producer]);

  return (
    <div className="w-screen h-screen poppins-medium primary-background-color">
      {showTeleprompter && (
        <motion.div
          className="teleprompter fixed bg-white p-4 rounded-lg shadow-lg"
          style={{
            width: "300px",
            height: "200px",
            top: "20%",
            left: "20%",
            zIndex: 100,
          }}
          drag
          dragConstraints={{
            top: 0,
            left: 0,
            right: window.innerWidth - 300,
            bottom: window.innerHeight - 200,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Close Button */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-gray-500">Teleprompter</h3>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setShowTeleprompter(false)} // Close teleprompter
            >
              <Plus size={24} className="rotate-45" />
            </button>
          </div>

          {/* Scrollable Text Area */}
          <div className="overflow-y-auto" style={{ height: "150px" }}>
            <p className="text-gray-700">
              {teleprompterText
                ? teleprompterText
                : "No teleprompter text available."}
            </p>
          </div>
        </motion.div>
      )}

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
            <VideoLayoutBroadcaster
              broadcaster={broadcaster}
              viewers={viewers}
              broadcastedStream={screenShared ? screenShareStream : stream}
              toggleEnhance={toggleEnhance}
              currentPage={currentPage}
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
              {chatSocket && <ChatBox
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
              />}
            </motion.div>
          </motion.div>

          <motion.div
            className="h-full primary-background-color "
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
              {/* {selectedJobApply && (
                <JobApplyCard
                  jobApply={selectedJobApply}
                  setSelectedJobApply={setSelectedJobApply}
                />
              )} */}
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
            {/* Mic Button */}
            <motion.div
              className={`h-fit w-fit p-3 ${
                !mic
                  ? "bg-red-500 rounded-xl"
                  : "secondary-background-color rounded-full"
              }`}
              whileTap={{ scale: 0.9 }} // Button animation on click
              onClick={() => {
                if (!stream) return;
                stream.getAudioTracks().forEach((track) => {
                  track.enabled = !mic;
                });
                setMic(!mic);
              }}
            >
              {mic ? (
                <Mic className="text-white" size={24} />
              ) : (
                <MicOff className="text-white" size={24} />
              )}
            </motion.div>

            {/* Camera Button */}
            <motion.div
              className={`h-fit w-fit p-3 ${
                !camera
                  ? "bg-red-500 rounded-xl"
                  : "secondary-background-color rounded-full"
              }`}
              onClick={() => {
                if (!stream) return;
                stream.getVideoTracks().forEach((track) => {
                  track.enabled = !camera;
                });
                setCamera(!camera);
              }}
              whileTap={{ scale: 0.9 }}
            >
              {camera ? (
                <Camera className="text-white" size={24} />
              ) : (
                <CameraOff className="text-white" size={24} />
              )}
            </motion.div>

            {/* Screen Share Button */}
            <motion.div
              className={`h-fit w-fit p-3 ${
                screenShared
                  ? "bg-red-500 rounded-xl"
                  : "secondary-background-color rounded-full"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {!screenShared ? (
                <MonitorUp
                  onClick={() => screenShare()}
                  className="text-white"
                  size={24}
                />
              ) : (
                <MonitorX
                  onClick={() => {
                    if (screenShared) {
                      stopScreenShare();
                    }
                  }}
                  className="text-white"
                  size={24}
                />
              )}
            </motion.div>
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
              onClick={() => setShowTeleprompter(!showTeleprompter)}
            >
              <Tv className="text-white" size={24} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Broadcaster;

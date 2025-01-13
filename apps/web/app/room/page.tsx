"use client";

import React, { useEffect, useRef, useState } from "react";
import Particles from "../../videoComponents/particles";

import {
  addClient,
  getClients,
  mediaConstraintsG,
  roomNoVar,
  setStreamLocal,
  streamLocal,
  updateMediaStream,
} from "../peertopeerVideoChat/webRTC/globals";
import { setSocket, socket } from "../peertopeerVideoChat/webRTC/socket";
import { startingStep, userAction } from "../peertopeerVideoChat/webRTC/action";
import "./style.css";
import ReactPlayer from "react-player";
import {
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  Eraser,
  MessageSquareText,
  Mic,
  MicOff,
  MonitorUp,
  MonitorX,
  Phone,
  PhoneOff,
  Plus,
  Presentation,
  ScreenShare,
  Sparkle,
  Sparkles,
  Trash,
  Trash2,
  Tv,
  Video,
  VideoOff,
} from "lucide-react";
import {
  addTrackAddon,
  handleNegotiationNeededAnswer,
  handleRecieveAnswer,
  handleRecieveIceCandidate,
  handleRecieveOffer,
  peerConnectionList,
  peerConnectionListAdd,
  peerConnectionListRemove,
  peerConnectionListReset,
  peerConnectionListUpdate,
  sendOffer,
} from "../peertopeerVideoChat/webRTC/peerConnection";
import WhiteBoard from "../peertopeerVideoChat/whiteBoard";
import "./style.css";
import ChatBox from "../../videoComponents/chatBox";
import { motion } from "framer-motion";
import JobApplyCard from "../../videoComponents/jobApplyCard";
import { Timer } from "../../videoComponents/Timer";
import VideoEnhancer from "../../videoComponents/enhanceComp";
import { getChatSocket } from "@/utils/socketClient";
const Room: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localScreenShare, setLocalScreenShare] = useState<MediaStream>();

  const [rightCont, setRightCont] = useState<string>("chats");

  const [username, setUsername] = useState<string>("");
  const [nameSetBool, setNameSetBool] = useState<boolean>(true);
  const [remoteVideoTracks, setRemoteVideoTracks] = useState<
    MediaStreamTrack[]
  >([]);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<
    MediaStreamTrack[]
  >([]);

  const [localaStreamState, setLocalStreamState] = useState<MediaStream>();

  const [chatBoxMobile, setChatBoxMobile] = useState<boolean>(false);

  const [videoPremission, setVideoPremission] = useState<boolean>(
    mediaConstraintsG.video
  );
  const [audioPremission, setAudioPremission] = useState<boolean>(
    mediaConstraintsG.audio
  );
  const [screenShared, setScreenShared] = useState<boolean>(false);

  const clientStreamMap = new Map<string, MediaStream>();

  const [usersInfo, setUsersInfo] = useState<
    { name: string; mediaStream: MediaStream; clientID: string }[]
  >([]);

  const [width, setWidth] = useState<number>(0);

  const [color, setColor] = useState<string>("black");
  const [showWhiteBoard, setShowWhiteBoard] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    message: string;
    userName: string;
    userId: string;
    date: Date;
  }>();

  const [messageList, setMessageList] =
    useState<
      { message: string; userName: string; userId: string; date: string }[]
    >();

  const [showChat, setShowChat] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [teleprompterText, setTeleprompterText] = useState(
    "This is a floating teleprompter that you can drag around the screen. It helps presenters read text while maintaining eye contact with the audience. This is a floating teleprompter that you can drag around the screen. It helps presenters read text while maintaining eye contact with the audience."
  ); // State to store teleprompter text
  const [toggleEnhance, setToggleEnhance] = useState(false);

  const [chatSocket, setChatSocket] = useState<any>();

  const updateName = (clientIdToUpdate: String, newName: string) => {
    setUsersInfo((prevUsersInfo) => {
      const indexToUpdate = prevUsersInfo.findIndex(
        (user) => user.clientID === clientIdToUpdate
      );

      if (indexToUpdate === -1) {
        return prevUsersInfo;
      }

      const updatedUsersInfo = [...prevUsersInfo];
      const updatedUserInfo = { ...updatedUsersInfo[indexToUpdate] };
      updatedUserInfo.name = newName;
      updatedUsersInfo[indexToUpdate] = updatedUserInfo as any;
      return updatedUsersInfo;
    });
  };

  const deleteUser = (clientID: string) => {
    setUsersInfo((prevUsersInfo) => {
      return prevUsersInfo.filter((user) => user.clientID !== clientID);
    });
  };

  const updateMediaStream = (
    clientIdToUpdate: string,
    newMediaStream: MediaStream,
    user: any
  ) => {
    setUsersInfo((prevUsersInfo) => {
      const indexToUpdate = prevUsersInfo.findIndex(
        (user) => user.clientID === clientIdToUpdate
      );

      if (indexToUpdate === -1) {
        return [
          ...prevUsersInfo,
          {
            name: user?.name || "name",
            mediaStream: newMediaStream,
            clientID: clientIdToUpdate,
          },
        ];
      }

      const updatedUsersInfo = [...prevUsersInfo];
      const updatedUserInfo = { ...updatedUsersInfo[indexToUpdate] };
      updatedUserInfo.mediaStream = newMediaStream;
      updatedUsersInfo[indexToUpdate] = updatedUserInfo as any;
      return updatedUsersInfo;
    });
  };

  const handleChat = (data: any) => {
    const dataN = {
      message: data.message,
      userName: data.senderName,
      userId: data.senderID,
      date: data.date,
    };

    setMessageList((prevList) => [...(prevList || []), dataN]);
  };
  const handleSendChat = (message: string) => {
    if (message === "") return;

    const dateLocale = new Date().toLocaleTimeString();

    socket.send(
      JSON.stringify({
        type: "chat",
        message: message,
        senderName: username,
        date: dateLocale,
      })
    );

    const data = {
      message: message,
      userName: username,
      userId: username,
      date: dateLocale,
    };

    setMessageList((prevList) => [...(prevList || []), data]);
    setMessage({
      message: "",
      userName: username,
      userId: username,
      date: new Date(),
    });
  };

  const connectionInitiator = async () => {
    socket.onmessage = async (event) => {
      const data = await JSON.parse(event.data);

      if (data.type === "offer") {
        if (data.negotiation) {
          await handleNegotiationNeededAnswer(data);
        } else {
          if (!peerConnectionList[data.senderID]) {
            peerConnectionListAdd(data.senderID);
            trackEventSetup(data.senderID, data);

            await handleRecieveOffer(data);
          }
        }
      } else if (data.type === "answer") {
        trackEventSetup(data.senderID, data);
        updateName(data.senderID, data.senderName);

        await handleRecieveAnswer(data, data.senderID);
      } else if (data.type === "candidate") {
        await handleRecieveIceCandidate(data);
      } else if (data.type === "clientList") {
        var listClients = getClients();
        data.list.forEach((client: string) => {
          if (listClients.includes(client) === false) {
            addClient(client);
          }
        });
      } else if (data.type === "chat") {
        handleChat(data);
      } else if (data.type === "disconnectUser") {
        window.location.replace("/");
      } else if (data.type === "userLeft") {
        disconnectUserFull(data.clienId);
      } else {
      }
    };
    socket.send(
      JSON.stringify({
        type: "clientList",

        target: "all",
      })
    );
  };

  const disconnectUserFull = (clientID: string) => {
    peerConnectionListRemove(clientID);
    clientStreamMap.delete(clientID);
    var users = usersInfo;
    deleteUser(clientID);
  };

  const trackEventSetup = (clientID: string, data: any) => {
    const pc = peerConnectionList[clientID];
    if (!pc) {
      return;
    }
    try {
      if (streamLocal) {
        streamLocal
          .getTracks()
          .forEach((track: any) => pc.addTrack(track, streamLocal));
      }
    } catch (err) {}

    pc.ontrack = (event: any) => {
      handleTrackEvent(event, clientID, data);
    };

    peerConnectionListUpdate(clientID, pc);
  };

  const handleTrackEvent = (event: any, clientID: string, data: any) => {
    const track = event.track;

    var user = usersInfo.find((user) => user.clientID == clientID);

    if (!user) {
      var mediaStreamT = clientStreamMap.get(clientID);

      if (mediaStreamT) {
        user = {
          name: data.senderName,
          mediaStream: mediaStreamT,
          clientID: clientID,
        };
      } else {
        user = {
          name: data.senderName,
          mediaStream: new MediaStream(),
          clientID: clientID,
        };

        clientStreamMap.set(clientID, user.mediaStream);
      }
    } else {
    }

    var mediaStream = user.mediaStream;

    if (!mediaStream) {
      return;
    }

    if (track.kind === "video") {
      mediaStream.getVideoTracks().forEach((track) => {
        mediaStream.removeTrack(track);
      });

      mediaStream.addTrack(track);
      setRemoteVideoTracks((prevTracks) => [...prevTracks, track]);
      loadTrack(clientID);

      const existingUserIndex = usersInfo.findIndex(
        (user) => user.clientID == clientID
      );

      updateMediaStream(clientID, mediaStream, user);
    }
    if (track.kind === "audio") {
      mediaStream.addTrack(track);
      setRemoteAudioTracks((prevTracks) => [...prevTracks, track]);
    }

    loadTrack(clientID);
  };

  const loadTrack = (clientID: string) => {
    const number = Math.ceil(
      Math.sqrt(
        Array.from(clientStreamMap.values()).length > 0
          ? Array.from(clientStreamMap.values()).length
          : 1
      )
    );

    setWidth(100 / number);
  };

  const startLocalStream = async () => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoPremission ? true : false,
        audio: audioPremission,
      });
      setLocalStreamState(stream);
      setStreamLocal(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = streamLocal;
      }
    } catch (error) {
      console.error("Error accessing local media:", error);
    }
  };
  const removeAllTracksFromStream = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      stream.removeTrack(track);
    });
  };

  const stopScreenShare = async () => {
    const stream = localScreenShare;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setLocalScreenShare(undefined);
      await startLocalStream();
      removeAllTracksFromStream(stream);
      addTrackAddon(streamLocal);
      setScreenShared(false);
      usersInfo.forEach((user) => {
        if (user.clientID === "0SCREEN") {
          deleteUser("0SCREEN");
        }
      });
    }
  };

  const startScreenStream = async () => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: videoPremission,
        audio: audioPremission,
      });

      if (!stream) {
        return;
      }
      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) {
        return;
      }
      videoTrack.onended = async () => {
        deleteUser("0SCREEN");
        setLocalScreenShare(undefined);
        await startLocalStream();
        removeAllTracksFromStream(stream);
        addTrackAddon(streamLocal);
        setScreenShared(false);
      };
      setLocalStreamState(stream);
      setLocalScreenShare(stream);

      setUsersInfo((prevUsersInfo) => [
        ...prevUsersInfo,
        {
          name: "Screen Share",
          mediaStream: stream,
          clientID: "0SCREEN",
        },
      ]);

      await addTrackAddon(stream);
      setScreenShared(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = streamLocal;
      }
    } catch (error) {
      console.error("Error accessing local media:", error);
    }
  };

  const manageStreamControls = (changeNeeded: string) => {
    const localStream = streamLocal;
    const audioTrack = localStream.getAudioTracks()[0];
    const videoTrack = localStream.getVideoTracks()[0];

    if (audioTrack && !audioPremission && changeNeeded === "audio") {
      audioTrack.enabled = true;
      setAudioPremission(true);
    }
    if (videoTrack && !videoPremission && changeNeeded === "video") {
      videoTrack.enabled = true;
      setVideoPremission(true);
    }
    if (audioTrack && audioPremission && changeNeeded === "audio") {
      audioTrack.enabled = false;
      setAudioPremission(false);
    }

    if (videoTrack && videoPremission && changeNeeded === "video") {
      videoTrack.enabled = false;
      setVideoPremission(false);
    }
  };

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    handleSendChat(message?.message || "");
  };

  const waitSocketConnection = () => {
    return new Promise<void>((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 300;

      setSocket();

      const chatSocket = getChatSocket();

      chatSocket.on("connect", () => {
        console.log("Connected to chat server");
        chatSocket.emit("join", { roomNoVar });
      });

      chatSocket.on("disconnect", () => {
        console.log("Disconnected from chat server");
      });

      setChatSocket(chatSocket);

      let currentAttempt = 0;
      const interval = setInterval(async () => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject();

          window.location.replace("/");
        } else if (socket?.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          startingStep(userAction, socket, username);

          var clientList = getClients();
          const clientListSet = new Set(clientList);
          clientList = Array.from(clientListSet);

          await startLocalStream();
          connectionInitiator();
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };
  const fetchData = async () => {
    await waitSocketConnection();
  };

  const handleStartVideoButton = () => {
    const clientList = getClients();
    const clientListSet = new Set(clientList);
    const clientListArray = Array.from(clientListSet);
    clientListArray.forEach(async (client) => {
      if (!peerConnectionList[client]) {
        peerConnectionListAdd(client);
        await sendOffer(client);
      }
    });
  };
  useEffect(() => {
    return () => {
      const tracks = streamLocal?.getTracks();
      tracks && tracks.forEach((track: MediaStreamTrack) => track.stop());

      var clientList = getClients();
      const clientListSet = new Set(clientList);
      clientList = Array.from(clientListSet);
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close();
      }

      peerConnectionListReset();
    };
  }, []);
  const copyToClipboard = () => {
    const textToCopy = `${roomNoVar}`;
    navigator.clipboard.writeText(textToCopy);
    alert("Copied to clipboard");
  };
  const handleContinueButtonClick = () => {
    setNameSetBool(false);
    fetchData();
  };

  const calculateGridSize = (count: any) => {
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    return Math.ceil(Math.sqrt(count));
  };

  const gridSize = calculateGridSize(usersInfo.length + 1);

  return (
    <div className="w-screen h-screen poppins-medium primary-background-color">
      {nameSetBool && (
        <div className="overlay" id="overlay">
          <div className="box">
            <div className="head-name">Enter a Name</div>
            <input
              type="text"
              className="name-field"
              placeholder="Type here.."
              id="name-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="continue-name"
              onClick={handleContinueButtonClick}
            >
              Continue
            </button>
          </div>
        </div>
      )}
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
            className="h-full flex flex-wrap  justify-center items-center"
            style={{
              width: showChat ? "75%" : "100%",
              transition: "width 0.5s ease-in-out",
            }}
          >
            {usersInfo.length === 0 && userAction === "joinRoom" && (
              <button
                className="w-62 h-16 text-center p-4 bg-black text-white rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  zIndex: 100,
                }}
                onClick={handleStartVideoButton}
              >
                Click To Join
              </button>
            )}
            {showWhiteBoard && (
              <div
                className="whiteboard-cont w-full h-full rounded-3xl"
                style={{
                  backgroundColor: "#333333",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "75vh",
                  width: "75vw",
                  position: "absolute",
                  zIndex: 100,
                  top: "10%",
                  left: "10%",
                }}
              >
                <WhiteBoard setShowWhiteBoard={setShowWhiteBoard} />
              </div>
            )}
            {usersInfo.length >= 0 && (
              <>
                {/* Render local stream */}
                {localaStreamState && (
                  <div
                    key="localStream"
                    className="relative secondary-background-color text-center rounded-lg overflow-hidden"
                    style={{
                      width: `calc(${100 / gridSize}% - 7rem)`,
                      height: `calc(${100 / gridSize}vh - 7rem)`,
                      margin: "0.5rem",
                    }}
                  >
                    <ReactPlayer
                      className="absolute top-0 left-0 w-full h-full"
                      playing
                      url={localaStreamState}
                      muted // Always mute the local stream to avoid feedback loops
                      width="100%"
                      height="100%"
                    />
                    <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 mt-2 rounded">
                      {`${username} (You)`}
                    </div>
                  </div>
                )}

                {/* Render remote users' streams */}
                {Array.from(new Set(usersInfo)).map((user) => {
                  return (
                    <div
                      key={user.clientID ?? "0"}
                      className="relative secondary-background-color text-center rounded-lg overflow-hidden"
                      style={{
                        width: `calc(${100 / gridSize}% - 7rem)`,
                        height: `calc(${100 / gridSize}vh - 7rem)`,
                        margin: "0.5rem",
                      }}
                    >
                      {!toggleEnhance ? (
                        <ReactPlayer
                          className="absolute top-0 left-0 w-full h-full"
                          playing
                          url={user.mediaStream}
                          muted={(user.clientID ?? "0") === "0SCREEN"}
                          width="100%"
                          height="100%"
                        />
                      ) : (
                        <VideoEnhancer mediaStream={user.mediaStream} />
                      )}
                      <div className="absolute bottom-2 left-2 mt-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                        {(user.clientID ?? "0") === "0SCREEN"
                          ? `${username} (Your Screen)`
                          : usersInfo.find((u) => u.clientID === user.clientID)
                              ?.name}
                      </div>
                      {!user.mediaStream.getAudioTracks()[0]?.enabled && (
                        <div className="absolute top-2 right-2 text-red-500">
                          <MicOff size={20} />
                        </div>
                      )}
                      {!user.mediaStream.getVideoTracks()[0]?.enabled && (
                        <div className="absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                          <VideoOff size={20} className="inline mr-1" />
                          Video Off
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
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
                  roomId={roomNoVar}
                  chatSocket={chatSocket}
                  setShowChat={() => {
                    setShowChat(!showChat);
                  }}
                  showChat={showChat}
                  senderNameProp={username}
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
            <div className="flex gap-2">
              <p>{roomNoVar} -</p>
              <button className="" onClick={() => copyToClipboard()}>
                Copy Code
              </button>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="w-2/4 flex justify-center items-center gap-3">
            {/* Mic Button */}
            <motion.div
              className={`h-fit w-fit p-3 ${
                !audioPremission
                  ? "bg-red-500 rounded-xl"
                  : "secondary-background-color rounded-full"
              }`}
              whileTap={{ scale: 0.9 }} // Button animation on click
              onClick={() => {
                manageStreamControls("audio");
              }}
            >
              {audioPremission ? (
                <Mic className="text-white" size={24} />
              ) : (
                <MicOff className="text-white" size={24} />
              )}
            </motion.div>

            {/* Camera Button */}
            <motion.div
              className={`h-fit w-fit p-3 ${
                !videoPremission
                  ? "bg-red-500 rounded-xl"
                  : "secondary-background-color rounded-full"
              }`}
              onClick={() => {
                manageStreamControls("video");
              }}
              whileTap={{ scale: 0.9 }}
            >
              {videoPremission ? (
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
                  onClick={() => startScreenStream()}
                  className="text-white"
                  size={24}
                />
              ) : (
                <MonitorX
                  onClick={async () => {
                    if (screenShared) {
                      await stopScreenShare();
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
              className={`h-fit w-fit p-3 ${
                !showWhiteBoard
                  ? "secondary-background-color rounded-full"
                  : "secondary-background-color rounded-full"
              }`}
              whileTap={{ scale: 0.9 }} // Button animation on click
            >
              <Presentation
                onClick={() => {
                  setShowWhiteBoard(!showWhiteBoard);
                  connectionInitiator();
                }}
                className="text-white"
                size={24}
              />
            </motion.div>
            <motion.div
              className={`h-fit w-fit p-3  pl-6 pr-6 bg-red-500 rounded-full`}
              whileTap={{ scale: 0.9 }} // Button animation on click
            >
              <Phone
                onClick={() => {
                  window.location.replace("/");
                }}
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

export default Room;

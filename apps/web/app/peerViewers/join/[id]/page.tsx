"use client";
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";
import "../../style.css";
import {
  setMediaConstraintsG,
  setRoomNoVar,
} from "../../../peertopeerVideoChat/webRTC/globals";
import {
  handleOnCreate,
  handleOnJoin,
  userAction,
} from "../../../peertopeerVideoChat/webRTC/action";
import { useParams, useRouter } from "next/navigation";

const Page: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const [micAllowed, setMicAllowed] = useState<number>(1);
  const [camAllowed, setCamAllowed] = useState<number>(1);
  const [mediaConstraints, setMediaConstraints] =
    useState<MediaStreamConstraints>({ video: true, audio: true });
  const router = useRouter();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((localstream) => {
        const videoCont = document.querySelector(
          ".video-self"
        ) as HTMLVideoElement;
        if (videoCont) {
          videoCont.srcObject = localstream;
        }
      });
  }, [mediaConstraints]);

  const uuidv4 = () => {
    return "xxyxyxxyx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const joinButtonClicked = () => {
    console.log("join  button clicked");
    setRoomNoVar(id);
    handleOnJoin();
    setMediaConstraintsG({
      video: camAllowed ? true : false,
      audio: micAllowed ? true : false,
    });

    router.push(`/room`);
  };

  const camClicked = () => {
    setMediaConstraints({
      video: !camAllowed,
      audio: micAllowed ? true : false,
    });
    setCamAllowed(!camAllowed ? 1 : 0);
  };

  const micClicked = () => {
    setMediaConstraints({
      video: camAllowed ? true : false,
      audio: !micAllowed,
    });
    setMicAllowed(!micAllowed ? 1 : 0);
  };

  return (
    <div className="w-full h-full">
      {/* <div>
        <div className="logo text-white">Reset-Jobs</div>
      </div> */}
      <div className="main">
        <div className="create-join w-1/2">
          <div className="text">
            <div className="head">Reset Jobs</div>
          </div>

          <button
            className="createroom-butt unselectable"
            onClick={joinButtonClicked}
          >
            Join Your Interview
          </button>
        </div>
        <div className="video-cont w-1/2">
          <video className="video-self" autoPlay muted playsInline></video>
          <div className="settings">
            <div
              className="device flex flex-row justify-center items-center"
              id="mic"
              onClick={micClicked}
            >
              {micAllowed ? <Mic /> : <MicOff />}
            </div>
            <div
              className="device flex flex-row justify-center items-center"
              id="webcam"
              onClick={camClicked}
            >
              {camAllowed ? <Camera /> : <CameraOff />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

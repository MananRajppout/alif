"use client";
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";
import "./style.css";
import { setMediaConstraintsG, setRoomNoVar } from "../peertopeerVideoChat/webRTC/globals";
import { handleOnCreate, handleOnJoin, userAction } from "../peertopeerVideoChat/webRTC/action";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
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

  const createButtonClicked = () => {
    const roomCode = uuidv4();

    setRoomNoVar(roomCode);
    handleOnCreate();
    setMediaConstraintsG({
      video: camAllowed ? true : false,
      audio: micAllowed ? true : false,
    });

    router.push(`/room`);
  };

  const joinButtonClicked = () => {
    const codeCont = document.querySelector("#roomcode") as HTMLInputElement;
    if (codeCont.value.trim() === "") {
      codeCont.classList.add("roomcode-error");
      return;
    }
    const code = codeCont.value;
    setRoomNoVar(code);
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
      <div>
        <div className="logo text-black">Video Connect</div>
      </div>
      <div className="main">
        <div className="create-join w-1/2">
          <div className="text">
            <div className="head">Peer-to-Peer Part</div>
          </div>
          <button
            className="createroom-butt unselectable"
            onClick={createButtonClicked}
          >
            Create Room
          </button>
          <br />
          <input
            type="text"
            name="room"
            spellCheck={false}
            placeholder="Enter Room Code"
            id="roomcode"
            className="roomcode"
          />
          <br />
          <div
            className="joinroom unselectable"
            style={{
              textAlign: "center",
              border: "1px solid black",
              padding: "5px",
              borderRadius: "10px",
            }}
            onClick={joinButtonClicked}
          >
            Join Room
          </div>
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

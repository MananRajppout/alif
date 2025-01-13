"use client";

import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { socket } from "./webRTC/socket";
import { roomNoVar } from "./webRTC/globals";
import { Circle, Eraser, Plus, X } from "lucide-react";
import { userAction } from "./webRTC/action";

const WhiteBoard = ({ setShowWhiteBoard }: { setShowWhiteBoard: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevCoords, setPrevCoords] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("black");
  const [drawSize, setDrawSize] = useState(3);

  const draw = (
    newX: number,
    newY: number,
    prevX: number,
    prevY: number,
    color: string | CanvasGradient | CanvasPattern,
    size: number
  ) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(newX, newY);
    ctx.stroke();
    ctx.closePath();
  };

  const handleDraw = (data: {
    newX: any;
    newY: any;
    prevX: any;
    prevY: any;
    color: any;
    size: any;
  }) => {
    const { newX, newY, prevX, prevY, color, size } = data;
    draw(newX, newY, prevX, prevY, color, size);
  };

  const handleMouseDown = (e: {
    nativeEvent: { offsetX: any; offsetY: any };
  }) => {
    setIsDrawing(true);
    setPrevCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseMove = (e: {
    nativeEvent: { offsetX: any; offsetY: any };
  }) => {
    if (!isDrawing) return;
    const newX = e.nativeEvent.offsetX;
    const newY = e.nativeEvent.offsetY;

    if (userAction === "createRoom" || true) {
      draw(newX, newY, prevCoords.x, prevCoords.y, color, drawSize);
      sendDrawAction(newX, newY, prevCoords.x, prevCoords.y, color, drawSize);
    }

    setPrevCoords({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    socket.send(
      JSON.stringify({
        type: "storeCanvas",
        roomId: roomNoVar,
        canvasData: canvasRef.current?.toDataURL(),
      })
    );
  };

  const sendDrawAction = (
    newX: any,
    newY: any,
    prevX: number,
    prevY: number,
    color: string,
    size: number
  ) => {
    // if (userAction !== "createRoom"  ) return;
    socket.send(
      JSON.stringify({
        type: "draw",
        newX,
        newY,
        prevX,
        prevY,
        color,
        size,
      })
    );
  };
  const clearBoard = () => {
    if (userAction === "createRoom" || true) {
      if (
        window.confirm(
          "Are you sure you want to clear the board? This cannot be undone."
        )
      ) {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "clearBoard" }));
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const handleClearBoard = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    socket.send(JSON.stringify({ type: "getCanvas", roomId: roomNoVar }));
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "draw") {
        handleDraw(data);
      } else if (data.type === "clearBoard") {
        handleClearBoard();
      } else if (data.type === "getCanvas") {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        let img = new Image();
        img.onload = start;
        img.src = data.canvas;

        function start() {
          ctx.drawImage(img, 0, 0);
        }
      }
    };
  }, []);
  const colorOptions = [
    { name: "black", hex: "#000000" },
    { name: "red", hex: "#e74c3c" },
    { name: "yellow", hex: "#f1c40f" },
    { name: "green", hex: "#2ecc71" },
    { name: "blue", hex: "#3498db" },
    { name: "orange", hex: "#e67e22" },
    { name: "purple", hex: "#9b59b6" },
    { name: "pink", hex: "#fd79a8" },
    { name: "brown", hex: "#834c32" },
    { name: "grey", hex: "#95a5a6" },
  ];
  return (
    <div className="whiteboard-container bg-[#202124] w-full h-full flex flex-col md:flex-row gap-4 justify-center items-center rounded-lg shadow-lg p-4 " style={{
      boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.5)",
    }}>
      <div className="tools-panel flex flex-row md:flex-col justify-center items-center gap-2 bg-[#3C4043] rounded-lg p-4 shadow-md ">
        <div className="brush-sizes flex flex-col gap-2">
          {[3, 6, 10].map((size) => (
            <button
              key={size}
              className={`w-8 h-8 rounded-full ${
                drawSize === size
                  ? "bg-[#8AB4F8] text-[#202124]"
                  : "bg-[#5F6368] text-[#E8EAED]"
              } flex items-center justify-center text-xs font-semibold transition-all duration-200 hover:bg-[#8AB4F8] hover:text-[#202124]`}
              onClick={() => setDrawSize(size)}
            >
              {size === 3 ? "S" : size === 6 ? "M" : "L"}
            </button>
          ))}
        </div>
        <button
          className="w-full mt-4 bg-[#F28B82] text-[#202124] rounded-md py-2 px-4 text-sm font-semibold transition-all duration-200 hover:bg-[#EE675C]"
          onClick={clearBoard}
        >
          Clear
        </button>
      </div>

      <canvas
        id="whiteboard"
        className="bg-[#3C4043] rounded-lg shadow-md "
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "900px",
          maxHeight: "600px",
        }}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      ></canvas>

      <div className="colors-panel flex flex-col md:flex-col justify-center items-center gap-2 bg-[#3C4043] rounded-lg p-4 shadow-md">
        {colorOptions.map((colorOption) => (
          <button
            key={colorOption.name}
            className={`w-8 h-8 rounded-full transition-all duration-200 ${
              color === colorOption.hex
                ? "ring-2 ring-[#8AB4F8] ring-offset-2 ring-offset-[#3C4043]"
                : ""
            }`}
            style={{ backgroundColor: colorOption.hex }}
            onClick={() => setColor(colorOption.hex)}
          />
        ))}
        <button
          className={`w-8 h-8 rounded-full bg-[#5F6368] flex items-center justify-center ${
            color === "#202124"
              ? "ring-2 ring-[#8AB4F8] ring-offset-2 ring-offset-[#3C4043]"
              : ""
          }`}
          onClick={() => setColor("#202124")}
        >
          <Eraser size={16} className="text-[#E8EAED]" />
        </button>
      </div>

      <button
        className="absolute top-4 right-4 text-[#E8EAED] hover:text-[#8AB4F8] transition-colors duration-200"
        onClick={() => setShowWhiteBoard(false)}
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default WhiteBoard;

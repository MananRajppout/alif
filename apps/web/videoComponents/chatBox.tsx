"use client";
import { useEffect, useRef, useState } from "react";
import { getChatSocket } from "../utils/socketClient";
import { Socket } from "socket.io-client";
import { Plus, Send } from "lucide-react";

export default function ChatBox({
  roomId,
  setShowChat,
  showChat,
  senderNameProp,
  chatSocket,
  
}: {
  roomId: string;
  setShowChat: any;
  showChat: boolean;
  senderNameProp?: string;
  chatSocket: Socket;
}) {
  const [socket, setSocket] = useState<Socket >(chatSocket);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messagesObject, setMessagesObject] = useState<
    {
      message: string;
      senderId: string;
      senderName: string;
      createAt: string;
    }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const sendMessage = (message: string) => {
    socket?.emit("sendChatMessage", {
      roomId,
      message,
      senderId: "123",
      senderName: senderNameProp || "John",
      createAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    const InitializingSocket = () => {
      console.log("Initializing socket...");

      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("join", { roomId });
        socket.on("chatMessage", (message: any) => {
          setMessagesObject((prev: any) => {
            // Check if the previous messages array is not empty
            if (prev.length > 0) {
              // Compare the current message with the last one, and only add if they're different
              if (prev[prev.length - 1].message !== message.message) {
                return [...prev, message];
              } else {
                // If the new message is the same as the last one, return the previous state
                return prev;
              }
            }
            // If no messages exist yet, just add the message
            return [...prev, message];
          });

          // Scroll to the bottom of the chat
          scrollRef.current?.scrollTo({
            top: scrollRef.current?.scrollHeight + 100,
          });

          console.log("Received chat message:", message);
        });
      });
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      setSocket(socket);
    };

    InitializingSocket();
  }, []);

  if (showChat) {
    return (
      <div className="w-full h-full">
        <div
          style={{
            height: "50px",
          }}
          className="w-full flex justify-between items-center p-4"
        >
          <p
            className="text-lg font-bold text-center text-gray-500"
            // style={{
            //   color: "#ACAFB0",
            // }}
          >
            Chat
          </p>
          <Plus
            className="text-black rotate-45"
            size={24}
            onClick={() => {
              setShowChat();
            }}
          />
        </div>
        <div
          className="w-full p-4"
          style={{
            minHeight: "calc(100% - 120px)",
            overflowY: "scroll",
          }}
          ref={scrollRef}
        >
          {messagesObject.map((object, index) => (
            <div key={index} className="w-full h-fit flex flex-col ">
              {messagesObject[index - 1]?.senderName !== object.senderName && (
                <p className="text-sm font-bold text-gray-500 mt-2">
                  {object.senderName}{" "}
                  <span className="text-sm text-gray-500 poppins-light">
                    {new Date(object.createAt).toLocaleTimeString()}
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-500 poppins-light ">
                {object.message}
              </p>
            </div>
          ))}
        </div>
        <div
          className="w-full pr-2 pl-2 "
          style={{
            height: "50px",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message);
              setMessage("");
            }}
            className="w-full h-full pl-2 pr-2 rounded-3xl flex justify-between items-center"
            style={{
              backgroundColor: "#F1F3F4",
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              className="w-10/12 h-full border-0 border-gray-300 rounded-3xl bg-white p-4 text-black outline-none"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              style={{
                backgroundColor: "#F1F3F4",
              }}
            />
            <Send
              className="text-black w-2/12 "
              color={message == "" ? "#ACAFB0" : "#1A73E8"}
              size={24}
            />
          </form>
        </div>
      </div>
    );
  }
}

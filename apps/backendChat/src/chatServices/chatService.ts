import { Server } from "socket.io";
import Redis from "ioredis";

export default function ChatService(
  io: Server,
  redisPublisher: Redis,
  redisSubscriber: Redis
) {
  const chatWS = io.of("/chat");
  // Subscribe to Redis
  redisSubscriber.subscribe("chat_messages");
  redisSubscriber.on("message", (channel, messageJson) => {
    console.log("Received message from Redis");
    const { roomId, message, senderId, senderName, createAt } =
      JSON.parse(messageJson);
    chatWS.to(roomId).emit("chatMessage", {
      message,
      senderId,
      senderName,
      createAt,
    });
  });
  chatWS.on("connection", (socket) => {
    console.log("Connected to chat namespace");

    socket.on("join", ({ roomId }) => {
      console.log("Joining room", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendChatMessage",
      ({
        roomId,
        message,
        senderId,
        senderName,
        createAt,
      }: {
        roomId: string;
        message: string;
        senderId: string;
        senderName: string;
        createAt: string;
      }) => {
        // chatWS.to(roomId).emit("chatMessage", {
        //   message,
        //   senderId,
        //   senderName,
        //   createAt,
        // });
        console.log("Publishing message to Redis");
        // Publish message to Redis
        redisPublisher.publish(
          "chat_messages",
          JSON.stringify({
            roomId,
            message,
            senderId,
            senderName,
            createAt,
          })
        );
      }
    );

    socket.on("candidateJobApply", (data) => {
      console.log("candidateJobApply", data);
      const userData = data.userData;
      const info = data.info;
      chatWS.to(data.roomId).emit("appliedJobApply", { userData, info });
    });

    socket.on("candidateSelect", (data) => {
      console.log("candidateSelect", data);
      const userId = data.userId;

      chatWS
        .to(data.roomId)
        .emit("appliedSelect", {
          userId: userId,
          interviewId: data.interviewId,
        });
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from chat namespace");
    });
  });
}

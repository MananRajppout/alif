import express from "express";
import http from "http";
import { Server as HttpServer } from "http";
import os from "os";
import { Server as SocketIOServer } from "socket.io";
import { serverConfig } from "./config/serverConfig";
import cors from "cors";
import Redis from "ioredis";
import ChatService from "./chatServices/chatService";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
const redisPublisher = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);
const redisSubscriber = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

export const serverId = uuidv4();

const wsServer = new HttpServer();

app.use(
  cors({
    origin: "*",
  })
);
(async () => {
  ChatService(io, redisPublisher, redisSubscriber);

  server.listen(serverConfig.port, () => {
    console.log(`Server is running on port ${serverConfig.port}`);
  });
})();

export const broadcastEvent = (event: any) => {
  console.log("broadcastEvent", serverId);
  redisPublisher.publish("sfu-events", JSON.stringify({ ...event, serverId }));
};

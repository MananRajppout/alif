// utils/socketClient.ts
import { io, Socket } from "socket.io-client";

// export const SERVER_URL = `http://localhost:${process.env.BACKEND_PORTAS || 5000}`;
export const CHAT_SERVER_URL = `https://api.resetjobs.com`;
export const SINGALING_SERVER_URL = `wss://webrtc.resetjobs.com`;
let socket: Socket | null = null;

// export const getSocket = (): Socket => {
//   if (!socket) {
//     socket = io(SERVER_URL, {
//       transports: ["websocket", "polling"],
//     });
//   }

//   return socket;
// };

export const getChatSocket = () => {
  return io(`${CHAT_SERVER_URL}/chat`, {
    transports: ["websocket", "polling"],
  });
};

export const FRONTEND_SERVER = `https://resetjobs.com`;

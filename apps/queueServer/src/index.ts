import http from "http";
import dotenv from "dotenv";
import {initQueueServer} from "./config/queConfig.js";
import { Server } from "socket.io";
dotenv.config();

const server = http.createServer();
const PORT = 4003;


//init queue server
const queueIo = new Server({cors: {origin: "*"}});
queueIo.attach(server);
initQueueServer(queueIo);


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
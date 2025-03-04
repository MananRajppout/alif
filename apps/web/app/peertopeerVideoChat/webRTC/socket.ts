import { SINGALING_SERVER_URL } from "@/utils/socketClient";
import { addClient, getClients } from "./globals";

export var socket: WebSocket;



export var socketReadyState: boolean = false;
export const removeSocket = () => {
  socket?.close();
};


export const setSocket = () => {
  
  socket = new WebSocket(SINGALING_SERVER_URL) ; //URL OF WEBSOCKET SERVER
  socket.onopen = () => {
    socketReadyState = true;
    console.log("WebSocket is open now.");
  };

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);
    if (data.type === "clientList") {
      var listClients = getClients();
      data.list.forEach((client: string) => {
        if (listClients.includes(client) === false) {
          addClient(client);
        }
      });
    }
  };
  return socket;
};
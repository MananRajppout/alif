import { userMap } from '../constant/userSockerIdConstant.js';
import { SocketEvent } from '../constant/socketEventConstant.js';
import { handleAddInQue, handleDisconnet, handleGetMyNumber, handleGetNextParticipant, handleGetRoomCurrentUser, initSubscribeNextUser, redis } from '../service/redisService.js';
import { Server } from 'socket.io';
import { IAddInQue, IGetMyNumber, IGetNextParticipant, IGetRoomCurrentUser } from '@/interfaces/EventInterface.js';
// import { redis } from '../service/redisService.js';


export const initQueueServer = async (io: Server) => {
    initSubscribeNextUser(io);
    io.on("connection", async (socket) => {
        const user_id:string|undefined = socket.handshake.query?.user_id as string;
        
        //add user in active user list
        if(user_id){
            userMap.set(user_id,socket.id);
            await redis.set(user_id,'online');
        }

        socket.on(SocketEvent.ADD_IN_QUE,(data:IAddInQue) => handleAddInQue(data));
        socket.on(SocketEvent.GET_MY_NUMBER,(data:IGetMyNumber,callback: (index: number) => void) => handleGetMyNumber(data,callback));
        socket.on(SocketEvent.GET_NEXT_PARTCIPANT,(data:IGetNextParticipant,callback: (data:any) => void) => handleGetNextParticipant(data,callback));
        socket.on(SocketEvent.GET_CURRENT_USER,(data:IGetRoomCurrentUser,callback: (user_id:string,queLength:number,data:any) => void) => handleGetRoomCurrentUser(data,callback));
        socket.on(SocketEvent.DISCONNTED,() => handleDisconnet(user_id));
    });
}


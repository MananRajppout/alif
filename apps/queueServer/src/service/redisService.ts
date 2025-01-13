import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import { IAddInQue, IGetMyNumber, IGetNextParticipant, IGetRoomCurrentUser } from '../interfaces/EventInterface.js';
import { userMap } from '../constant/userSockerIdConstant.js';
import { getItemIndex } from '../processor/getItemIndexProcessor.js';
import { SocketEvent } from '../constant/socketEventConstant.js';
import { Server } from 'socket.io';
import { redisPublisherEvent } from '../constant/redisPublisherEvent.js';
dotenv.config();

export const redis = new Redis(process.env.REDIS_URL as string);

const redisPub = new Redis(process.env.REDIS_URL as string);
const redisSub = new Redis(process.env.REDIS_URL as string);

//subsribe redis next user channel
export const initSubscribeNextUser = (io:Server) => {
    redisSub.subscribe(SocketEvent.REDIS_CHANNEL, (err, count) => {
        if (err) {
            console.error('Error subscribing to channel:', err);
        } else {
            console.log(`Subscribed to ${count} channel(s)`);
        }
    });

    redisSub.on('message', (channel, message) => {
        if(channel == SocketEvent.REDIS_CHANNEL){
            const data = JSON.parse(message);
            const user_id = data.user_id;
            const socket_id = userMap.get(user_id as string);
            

            if(data.event_type == redisPublisherEvent.MY_TURN){
                
                if(socket_id){
                    io.to(socket_id).emit(SocketEvent.IS_MY_TURN,data);
                }
            }

            if(data.event_type == redisPublisherEvent.GO_WATING_ROOM){
                
                if(socket_id){
                    io.to(socket_id).emit(SocketEvent.GO_ON_WAITING_ROOM,data);
                }
            }


            if(data.event_type == redisPublisherEvent.GO_ON_RESULT_PAGE){
                
                if(socket_id){
                    io.to(socket_id).emit(SocketEvent.GO_ON_RESULT_PAGE,data);
                }
            }
             
        }
    });
}

export const handleAddInQue = async (data: IAddInQue) => {
    if(data.cuurent_room_id){
        await redis.del(data.cuurent_room_id);
    }


    if(data.only_remove == true){
        const publishData = {
            oppotunity_id: data.oppotunity_id,
            result: data.pass_true ? 'passed': 'failed',
            event_type: redisPublisherEvent.GO_ON_RESULT_PAGE,
            user_id: data.user_id
        }
    
        await redisPub.publish(SocketEvent.REDIS_CHANNEL,JSON.stringify(publishData));
        return;
    }

    redis.lpush(data.round_id, data.user_id);

    const publishData = {
        user_id: data.user_id,
        round_id: data.round_id,
        event_type: redisPublisherEvent.GO_WATING_ROOM
    }

    await redisPub.publish(SocketEvent.REDIS_CHANNEL,JSON.stringify(publishData));

    
    
    
}

export const handleGetMyNumber = async (data: IGetMyNumber, callback: (index: number) => void) => {

    const my_index = await getItemIndex(data.round_id, data.user_id, redis);
    callback(my_index);

}

export const handleGetNextParticipant = async (data: IGetNextParticipant, callback: (data: any) => void) => {
    const next_user_id: string | null = await redis.rpop(data.round_id);
    const queLength = await redis.llen(data.round_id);
    if (!next_user_id) {
        callback({
            isEmpty: true,
            queLength
        });
        return
    }

    const user_status = await redis.get(next_user_id) || "offline";
    const publishData = {
        user_id: next_user_id,
        room_id: data.room_id,
        event_type: redisPublisherEvent.MY_TURN,
    }

    await redisPub.publish(SocketEvent.REDIS_CHANNEL, JSON.stringify(publishData));

    const savedCurrentData = {
        next_user_id,
        user_status,
        isEmpty: false,
        queLength
    }

    await redis.set(data.room_id,JSON.stringify(savedCurrentData));
   
    callback({
        next_user_id,
        user_status,
        isEmpty: false,
        queLength
    });
}

export const handleGetRoomCurrentUser = async (data:IGetRoomCurrentUser,callback: (user_id: string,queLength:number,data:any) => void) => {
   
    try {
        const stringData = await redis.get(data.room_id);
        
        const parseData = JSON.parse(stringData || "{}");
        const user_id = parseData?.next_user_id;
        const queLength = data.round_id ? (await redis.llen(data.round_id)) : 0;
        
        callback(user_id as string,queLength,parseData);
    } catch (error) {
        callback("" as string,0,null);
    }

}

export const handleDisconnet = async (user_id: string) => {
    userMap.delete(user_id);
    await redis.del(user_id);
}
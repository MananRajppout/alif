
export interface IAddInQue {
    oppotunity_id: string;
    user_id: string;
    round_id: string;
    cuurent_room_id?: string;
    only_remove?: boolean;
    pass_true?: boolean;
}

export interface IGetMyNumber {
    user_id: string;
    round_id: string;
}

export interface IGetNextParticipant {
    room_id: string;
    round_id: string;
}

export interface IGetRoomCurrentUser {
    room_id: string;
    round_id: string;
}

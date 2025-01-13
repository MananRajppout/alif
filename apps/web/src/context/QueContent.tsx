import { useSession } from "next-auth/react";
import { createContext, Dispatch, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { QueEvent } from "../constant/QueEventConstant";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface IQueContent {
    socketRef: MutableRefObject<Socket | null>;
    handleAddInQue: (data: any) => void;
    getMyIndex: (data: any, setMyIndex: React.Dispatch<React.SetStateAction<number>>) => void;
    handleNextParticipant: (data: any, setCurrentUser: any, setQueCount: any) => void;
    handleGetCurrentRoomUser: (data: any, setCurrentId: any, setQueCount: any, setCurrentUser: any) => void;
}



const QueContext = createContext<IQueContent | undefined>(undefined);


export const QueProvider = ({ children }: { children: ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const { data, status } = useSession();
    const router = useRouter();
    const user: any = data?.user;


    useEffect(() => {
        if (status !== "loading") {
            socketRef.current = io(process.env.NEXT_PUBLIC_QUE_SERVER_URL as string, {
                query: {
                    user_id: user?._id
                }
            });
        }
    }, [status]);


    const handleAddInQue = useCallback((data: any) => {
        socketRef.current?.emit(QueEvent.ADD_IN_QUE, data)
    }, [socketRef.current]);

    const getMyIndex = useCallback((data: any, setMyIndex: React.Dispatch<React.SetStateAction<number>>) => {
        socketRef.current?.emit(QueEvent.GET_MY_NUMBER, data, (index: number) => setMyIndex(index));
    }, [socketRef.current]);

    const handleIsMyTurn = useCallback((data: { room_id: string }) => {
        // const confirm = window.confirm("Are You ready for interview ?");
        // if (confirm) {
        //     router.push(`/interview-room/${data.room_id}`);
        //     toast.success("Now You are going to meet");
        // }
            router.push(`/interview-room/${data.room_id}`);
            toast.success("Now You are going to meet");

    }, []);



    const handleGetCurrentRoomUser = useCallback((data: any, setCurrentId: any, setQueCount: any, setCurrentUser: any) => {
        socketRef.current?.emit(QueEvent.GET_CURRENT_USER, data, (user_id: string, length: number, data: any) => { setCurrentId(user_id), setQueCount(length), setCurrentUser(data) });
    }, [socketRef.current]);


    const handleNextParticipant = (data: any, setCurrentUser: any, setQueCount: any) => {
        socketRef.current?.emit(QueEvent.GET_NEXT_PARTCIPANT, data, (data: any) => {
            setCurrentUser(data);
            setQueCount(data.queLength);
        });
    }

    const handleGoOnWaitingRoom = useCallback((data: any) => {
        router.push(`/wating-room/${data?.round_id}`);
    }, []);


    const handleGoOnResultPage = useCallback((data: any) => {
        router.push(`/results/${data?.oppotunity_id}?result=${data.result}`);
    }, []);

    useEffect(() => {
        socketRef.current?.on(QueEvent.IS_MY_TURN, handleIsMyTurn);
        socketRef.current?.on(QueEvent.GO_ON_WAITING_ROOM, handleGoOnWaitingRoom);
        socketRef.current?.on(QueEvent.GO_ON_RESULT_PAGE, handleGoOnResultPage);

        return () => {
            socketRef.current?.off(QueEvent.IS_MY_TURN, handleIsMyTurn);
            socketRef.current?.off(QueEvent.GO_ON_WAITING_ROOM, handleGoOnWaitingRoom);
            socketRef.current?.on(QueEvent.GO_ON_RESULT_PAGE, handleGoOnResultPage);
        }
    }, [socketRef.current]);




    const values = {
        socketRef,
        handleAddInQue,
        getMyIndex,
        handleNextParticipant,
        handleGetCurrentRoomUser
    }
    return <QueContext.Provider value={values}>
        {children}
    </QueContext.Provider>
}



export const useQue = () => {
    const context = useContext(QueContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a QueProvider');
    }
    return context;
}
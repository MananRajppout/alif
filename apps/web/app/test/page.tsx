import MessageBox from "@/src/components/dashboard/messages/message-box";

export default function Home() {

    return(
        <>
            <MessageBox data={
                {
                    "id": 1,
                    "name": "John Doe",
                    "message": "Hello, I am John Doe",
                    "time": "1 min ago"
                }
            }/>
        </>
    )
}
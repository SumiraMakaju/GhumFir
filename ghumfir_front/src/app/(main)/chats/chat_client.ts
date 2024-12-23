import { useEffect, useState } from "react";
import { useSession } from "../SessionProvider";
import { StreamChat } from "stream-chat";
import kyInstance from "@/lib/ky";
//import { error } from "console";

export default function ChatClient() {
    const {user} = useSession();
    const [chatClient, setChatCLient] = useState<StreamChat | null>(null);

    useEffect(()=>{
        const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!, process.env.STREAM_SECRET);

        client.connectUser({
            id: user.id,
            username: user.username,
            name: user.displayName,
            image: user.avatarUrl
        }, 
        async () => kyInstance.get("/api/get_token")
        .json<{token: string}>()
        .then((data)=> data.token)
    )
    .catch(error=> console.error("faileddddd" , error))
    .then(() => setChatCLient(client))

return () => {
    setChatCLient(null);
    client.disconnectUser()
    .catch(error => console.error("failed to disconnect", error))
}

    },[user.id, user.username, user.displayName, user.avatarUrl])


    return chatClient;
}
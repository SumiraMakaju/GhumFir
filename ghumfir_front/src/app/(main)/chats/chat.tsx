"use client";

import { Loader2 } from "lucide-react";
import ChatClient from "./chat_client";
import {Chat as ChatUI} from "stream-chat-react";
import Side from "./side";
import ChatChannel from "./Channel";

export default function Chat() {
    const chatClient = ChatClient();

    

    if (!chatClient) {
        return <Loader2 className="w-8 h-8 animate-spin" />;
    }

    return <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="absolute bottom-0 top-0 flex-full">
            <ChatUI
            client={chatClient }>
                <Side />
                {<ChatChannel open={true} openSidebar={() => {}} />}
            </ChatUI>
        </div>
    </main>
}
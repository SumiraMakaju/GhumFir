"use client";

import { Loader2 } from "lucide-react";
import ChatClient from "./chat_client";
import {Chat as ChatUI} from "stream-chat-react";
import { useTheme } from "next-themes";
import Side from "./side";
import ChatChannel from "./Channel";
import { useEffect, useState } from "react";
import UserListPopup  from "./UserSelect";
import { MutualFollowersResponse, UserData } from "@/lib/types";
import {useSession} from "../SessionProvider";

export default function Chat() {
    const chatClient = ChatClient();
    const {resolvedTheme} = useTheme();
    const [showModal, setShowModal] = useState(false);
    const {session} = useSession();
    const [mutualFollowers, setMutualFollowers] = useState<UserData[] | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        async function fetchMutualFollowers(userId: string) {
          try {
            const response = await fetch(`/api/users/${userId}/mutual`);
            if (!response.ok) {
              throw new Error("Failed to fetch mutual followers");
            }
            const data = (await response.json()) as MutualFollowersResponse;
            setMutualFollowers(data.users);
          } catch (error) {
            console.error("Error fetching mutual followers:", error);
          }
        }

        if (session?.userId) {
            fetchMutualFollowers(session?.userId);
          }
        }, [chatClient, session?.userId]);

    if (!chatClient) {
        return <Loader2 className="w-8 h-8 animate-spin" />;
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
            <div className="absolute bottom-0 top-0 flex w-full">
            
                <ChatUI client={chatClient}
                    theme={
                        resolvedTheme === "dark"
                          ? "str-chat__theme-dark"
                          : "str-chat__theme-light"
                    }
                >
                <button 
                        className="fixed bottom-4 left bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600" 
                        onClick={() => setShowModal(true)}
                    >
                        Create Chat
                    </button>
                    <div className={`flex h-full ${sidebarOpen ? 'md:w-72' : 'w-0'} transition-all duration-300`}>
                        <Side />
                    </div>
                    <div className="flex-1">
                        <ChatChannel 
                            open={true} 
                            openSidebar={toggleSidebar}
                        />
                    </div>
                    <UserListPopup 
                        isOpen={showModal} 
                        onClose={() => setShowModal(false)} 
                        client={chatClient}
                        title="Select User" 
                        currentUserId={session.userId}
                        users={mutualFollowers || []}
                    />
                </ChatUI>
            </div>
        </main>
    );
}

export async function createChat(){

}
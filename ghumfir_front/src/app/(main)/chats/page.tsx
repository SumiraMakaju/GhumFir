import { Metadata } from "next";
import Chat from "./chat";

export const metadata: Metadata = {
    title: "Chat",
    description: "ghumfir initial chat setup",
};

export default function ChatPage() {
    return <Chat />;
}
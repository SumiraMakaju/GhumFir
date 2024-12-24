import { Metadata } from "next";
import Chat from "./chat"; // Import the Chat component

// Define metadata for the page
export const metadata: Metadata = {
    title: "Chat",
    description: "ghumfir initial chat setup",
};

// Define the ChatPage component and pass mutualFollowers as props
export default async function ChatPage() {
    return <Chat />;
}
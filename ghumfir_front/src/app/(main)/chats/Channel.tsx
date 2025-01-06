import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { EmojiPicker } from 'stream-chat-react/emojis';

import { init, SearchIndex } from "emoji-mart";
import data from "@emoji-mart/data";

interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

init({ data });

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  const messageListRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom(); // Ensure scroll to bottom on mount
  }, []);

  return (
    <div className={cn("w-full md:block h-full", !open && "hidden") }>
      <Channel EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          {/* Scrollable Message List */}
        
          <MessageList />
        
          <MessageInput/>
        </Window>
      </Channel>
    </div>
  );
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
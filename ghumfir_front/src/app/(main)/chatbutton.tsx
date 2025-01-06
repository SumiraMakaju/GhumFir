"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageCircleHeart } from "lucide-react";
import Link from "next/link";

interface ChatButtonProps {
  initialState: MessageCountInfo;
}

export default function ChatButton({ initialState }: ChatButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/chats").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/chats">
        <div className="relative">
          <MessageCircleHeart />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-secondary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Chats</span>
      </Link>
    </Button>
  );
}
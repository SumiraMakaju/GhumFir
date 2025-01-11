"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {

  const currentPath = usePathname();

  // Utility for active/inactive styles
  const isActive = (path: string) =>
    currentPath === path
      ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white"
      : "bg-transparent text-gray-700";
      
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className={`flex items-center justify-start gap-3 ${isActive("/notifications")}`}
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-secondary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
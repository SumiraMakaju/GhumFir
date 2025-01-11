import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookAIcon,
  CalendarClock,
  Globe2Icon,
  Home,
  Hotel,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import NotificationsButton from "../notbut";
import ChatButton from "../chatbutton";
import MenuBarClient from "./MenuBarClient";
import streamServerClient from "@/lib/stream";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();
  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <MenuBarClient
      className={className}
      unreadNotificationsCount={unreadNotificationsCount}
      unreadMessagesCount={unreadMessagesCount}
    />
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {  BookAIcon, CalendarClock, Home, Hotel, MessageCircleHeartIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import NotificationsButton from "../notbut";
import ChatButton from "../chatbutton";
import streamServerClient from "@/lib/stream"; 


interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {

const {user} = await validateRequest();

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
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/home">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationsButton initialState={{ unreadCount: unreadNotificationsCount }} />
      

        <ChatButton initialState={{ unreadCount: unreadMessagesCount}} />

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Hotels"
        asChild
      >
        <Link href="/hotels">
          <Hotel />
          <span className="hidden lg:inline">Hotels</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Diaries"
        asChild
      >
        <Link href="/Diaries">
          <BookAIcon/>
          <span className="hidden lg:inline">Diaries</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Events"
        asChild
      >
        <Link href="/events">
          <CalendarClock/>
          <span className="hidden lg:inline">Events</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="TripAdvisor"
        asChild
      >
        <Link href="/advice">
          <CalendarClock/>
          <span className="hidden lg:inline">TripAdvisor</span>
        </Link>
      </Button>
    </div>
  );
}

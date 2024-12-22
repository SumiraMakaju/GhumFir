import { Button } from "@/components/ui/button";
import Link from "next/link";
import {  BookAIcon, Home, Hotel, MessageCircleHeartIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import NotificationsButton from "../notbut";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {

const {user} = await validateRequest();

if (!user) return null;

const not_count = await prisma.notification.count({
  where: {
    recipientId: user.id,
    read: false,
  },
});

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

      <NotificationsButton initialState={{ unreadCount: not_count }} />
      

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href="/Messages">
          <MessageCircleHeartIcon />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>

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
          <span className="hidden lg:inline">Hotels</span>
        </Link>
      </Button>
    </div>
  );
}

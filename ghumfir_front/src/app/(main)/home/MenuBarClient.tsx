"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookAIcon,
  CalendarClock,
  Globe2Icon,
  Home,
  Hotel,
} from "lucide-react";
import NotificationsButton from "../notbut"; // Notifications button
import ChatButton from "../chatbutton"; // Chat button

interface MenuBarClientProps {
  className?: string;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

export default function MenuBarClient({
  className,
  unreadNotificationsCount,
  unreadMessagesCount,
}: MenuBarClientProps) {
  const currentPath = usePathname();

  const isActive = (path: string) =>
    currentPath === path
      ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white"
      : "bg-transparent text-gray-700";

  return (
    <div className={`${className} flex gap-4 items-center`}>
      {/* Home Button */}
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${isActive("/home")}`}
        title="Home"
        asChild
      >
        <Link href="/home">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {/* Notifications Button */}
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />

      {/* Chat Button */}
      <ChatButton
        initialState={{ unreadCount: unreadMessagesCount }}
      />

      {/* Hotels Button */}
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${isActive("/hotels")}`}
        title="Hotels"
        asChild
      >
        <Link href="/hotels">
          <Hotel />
          <span className="hidden lg:inline">Hotels</span>
        </Link>
      </Button>

      {/* Diaries Button */}
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${isActive("/Diaries")}`}
        title="Diaries"
        asChild
      >
        <Link href="/Diaries">
          <BookAIcon />
          <span className="hidden lg:inline">Diaries</span>
        </Link>
      </Button>

      {/* Events Button */}
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${isActive("/events")}`}
        title="Events"
        asChild
      >
        <Link href="/events">
          <CalendarClock />
          <span className="hidden lg:inline">Events</span>
        </Link>
      </Button>

      {/* Advice Button */}
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${isActive("/advice")}`}
        title="Advice"
        asChild
      >
        <Link href="/advice">
          <Globe2Icon />
          <span className="hidden lg:inline">Advice</span>
        </Link>
      </Button>
    </div>
  );
}

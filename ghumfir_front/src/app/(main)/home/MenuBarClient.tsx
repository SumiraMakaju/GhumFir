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
import NotificationsButton from "../notbut";
import ChatButton from "../chatbutton";

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

  // Utility for active/inactive styles
  const isActive = (path: string) =>
    currentPath === path
      ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white"
      : "bg-transparent text-secondaru-700";

  const iconActive = (path: string) =>
    currentPath === path ? "text-orange-500" : "text-secondary-500";

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
          <Home className={iconActive("/home")} />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

       
          <NotificationsButton
            initialState={{ unreadCount: unreadNotificationsCount }}
          />
          <ChatButton
            initialState={{ unreadCount: unreadMessagesCount }}
          />

      {/* Hotels Button */}
      <Button
        variant="ghost"
        className={`text-secondary flex items-center justify-start gap-3 ${isActive("/hotels")}`}
        title="Hotels"
        asChild
      >
        <Link href="/hotels">
          <Hotel className={iconActive("/hotels")} />
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
          <BookAIcon className={iconActive("/Diaries")} />
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
          <CalendarClock className={iconActive("/events")} />
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
          <Globe2Icon className={iconActive("/advice")} />
          <span className="hidden lg:inline">Trip Advisor</span>
        </Link>
      </Button>
    </div>
  );
}

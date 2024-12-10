"use client";
 
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
 import { DropdownMenuContent,DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenu, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "./ui/dropdown-menu";
 import UserAvatar from "./UserAvatar";
 import Link from "next/link";
import { logout } from "@/app/(auth)/action";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

 interface UserButtonProps {
    className?:string
 }

 export default function UserButton({ className }:UserButtonProps){
   // const {user} = useSession();

   const{theme, setTheme} = useTheme();

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className={cn("flex-none rounded-full", className)}>
                <UserAvatar avatarUrl="/avatar.webp" size={40}/> {//yaha database
                }
                </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Logged in as username {//database
                     }
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                        <Link href={'/users/${user.username'}>
                        <DropdownMenuItem>
                            <UserIcon className="mr-2 size-4"/>
                            profile
                        </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={()=>setTheme("system")}>
                                            <Monitor className="mr-2 size-4"/>
                                            system default
                                            {theme === "system" && <Check className="ms-2 size-4"/>}
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={()=>setTheme("light")}>
                                            <Sun className="mr-2 size-4"/>
                                            light
                                            {theme === "light" && <Check className="ms-2 size-4"/>}
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={()=>setTheme("dark")}>
                                            <Moon className="mr-2 size-4"/>
                                            dark
                                            {theme === "dark" && <Check className="ms-2 size-4"/>}
                                        </DropdownMenuItem>

                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                                <Monitor className="mr-2 size-4" />
                                Theme
                            </DropdownMenuSubTrigger>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                        onClick={()=>{
                            logout();                            
                            }}>
                                <LogOutIcon className="mr-2 size-4"/>
                                Log Out
                        </DropdownMenuItem>
                </DropdownMenuContent>
            
    </DropdownMenu>
 }
"use client";

import { DiariesData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "../UserAvatar";

interface DiaryProps {
  diary: DiariesData;
}

export default function Diary({ diary }: DiaryProps) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
    
        <div className="flex justify-between gap-3">
      
      <div className="flex flex-wrap gap-3">
        <UserAvatar avatarUrl={diary.user?.avatarUrl ?? ""} className="hidden sm:inline" />
     </div>
     <div>
      <Link href={`/home/users/${diary.user.username}`} className="text-bold text-secondary">
        {diary.user.displayName}
      </Link>

<p >{formatRelativeDate(diary.createdAt)}</p>
</div>
</div>

      <div className="whitespace-pre-line break-words">
        {diary.content || "No content available."}
      </div>

    </article>
  );
}

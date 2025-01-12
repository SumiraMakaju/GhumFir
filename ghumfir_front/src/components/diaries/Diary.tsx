"use client";

import { DiariesData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Image from "next/image";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import DiaryMoreButton from "./DiaryMore";

interface DiaryProps {
  diary: DiariesData;
}

export default function Diary({ diary }: DiaryProps) {
  const { user } = useSession();
  if (!user) return null;

  return (
    <article className="group/diary space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserAvatar avatarUrl={diary.user?.avatarUrl || "/default-avatar.png"} />
        </div>
        <div>
          <p className="text-secondary font-bold">{formatRelativeDate(diary.createdAt)}</p>
        </div>
        {diary.user?.id === user?.id && (
          <DiaryMoreButton
            diary={diary}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      {diary.content && (
        <Linkify>
          <div className="whitespace-pre-line break-words">{diary.content}</div>
        </Linkify>
      )}
      {diary.attachments?.length > 0 && <MediaPreviews attachments={diary.attachments} />}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    createdAt: Date;
  }[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    createdAt: Date;
  };
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment related to the diary content"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        loading="lazy"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
          preload="metadata"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

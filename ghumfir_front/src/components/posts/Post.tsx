import { PostData as Data } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMore from "./postmore";
import Linkify from "../Linkify";
import UserTooltip from "../UserToolTip";

interface PostProps {
  post: Data;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-3xl bg-card p-5 shadow-md">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
         <UserTooltip user={post.user}>
          <Link href={`/home/users/${user.username}`} className="flex items-center gap-3 hover:underline">
            <UserAvatar avatarUrl={post.user.avatarUrl} />
            <div className="flex flex-col">
              <span className="font-bold">{post.user.username}</span>
              <span className="text-muted-foreground text-sm underline hover:underline-offset-2">
                {formatRelativeDate(new Date(post.createdAt))}
              </span>
            </div>
          </Link>
          </UserTooltip>
        </div>
        {post.user.id === user.id && (
          <PostMore post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100" />
        )}
      </div>
      <Linkify>
      
      <div className="whitespace-pre-line break-words">{post.content}</div>

      </Linkify>
    </article>
  );
}
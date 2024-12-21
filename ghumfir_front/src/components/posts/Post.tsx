import { PostData as Data, PostData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMore from "./postmore";
import Linkify from "../Linkify";
import UserTooltip from "../UserToolTip";
import LikeButton from "./LikeButton";
import { useState } from "react";
import { MessageCircleCode } from "lucide-react";
import Comments from "../comments/comments";
//import { Button } from "../ui/button";

interface PostProps {
  post: Data;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

    const [showComments, setShowComments] = useState(false);
  return (
    <article className="group/post space-y-3 rounded-3xl bg-card p-5 shadow-md">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
         <UserTooltip user={post.user}>
          <Link href={`/home/users/${post.user.username}`} className="flex items-center gap-3 hover:underline">
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
<hr className="text-muted-foreground"/>
<div className="flex items-center gap-6">
<LikeButton 
postId={post.id} 
initialState={{
  likes: post._count.likes, 
isLikedByUser: post.likes.some((like) => like.userId === user.id)
}} />

<CommentButton post={post} onclick={()=> setShowComments(!showComments)} />
</div>

{showComments && <Comments post={post} />}
    </article>
  );
}

interface CommentButtonProps{
  post: PostData;
  onclick:()=> void;
}

function CommentButton({post, onclick}:CommentButtonProps){
  return (
    <button onClick={onclick} className="flex items-center gap-2">
 <MessageCircleCode className="size-5"/>
 <span className="text-sm font-medium tabular-nums">
  {post._count.comments}{" "}
  <span className="hidden sm:inline">comments</span>
  </span>
  </button>
  );
}
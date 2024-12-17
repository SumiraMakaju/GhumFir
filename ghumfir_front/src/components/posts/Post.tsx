import { PostData as Data } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import Link from 'next/link';
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: Data;
}

export default function Post({post}: PostProps) {
    return <article className="space-y-2 rounded-3xl bg-card p-5 shadow-md">
        <div className="flex flex-wrap gap-3">
            <Link href={`/user/${post.user.username}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
            <div className="flex flex-col">
                <Link href={`/user/${post.user.username}`} className="font-bold">
                    {post.user.username}
                </Link>
                <Link
                href={`/post/${post.id}`}
                className="text-muted-foreground text-sm hover:underline-offset-2">
                    {formatRelativeDate(new Date(post.createdAt))}
                </Link>
            </div>
        </div>
        <div className=" whitespace-pre-line break-words">{post.content}</div>
    </article>
}
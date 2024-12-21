import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
//import { useEffect } from "react";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
 // const queryClient = useQueryClient();
 

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id], // Unique queryKey for each post
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
          )
          .json<CommentsPage>(),
      // Ensure this aligns with API response
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(), //no idea documentation batw ho
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  // Reset query state when post.id changes

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}

{/*post._count.comments === 0 && (
  <div className="space-y-3">
    <p className="text-center text-muted-foreground">No comments yet.</p>
  </div>
)*/}
      
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && post._count.comments ===0 && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          post.id == comment.postId?(<Comment key={comment.id} comment={comment} />):null
        ))}
      </div>
    </div>
  );
}

import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import { useEffect } from "react";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
 const queryClient = useQueryClient();
 

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id], // Unique queryKey for each post
      queryFn: async ({ pageParam }) =>{
        const response = await kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam?{ searchParams: { cursor: pageParam} }:{}
          )
          .json<CommentsPage>();
          response.comments = response.comments.filter((comment) => post.id === comment.postId);
        return response;
        },
      // Ensure this aligns with API response
      getNextPageParam: (lastPage) => lastPage.previousCursor,
      initialPageParam: null as string | null,
      enabled: !!post.id, // Only fetch when post.id is valid
    });
    
  // Reset query state when post.id chang
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
  }, [post.id, queryClient]);

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => {fetchNextPage()}}
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
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

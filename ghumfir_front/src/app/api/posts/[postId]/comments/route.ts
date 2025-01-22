import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

type Props = {
   params:  Promise<{ 
    postId: string 
  }> };

export async function GET(
  req: NextRequest,
  context: Props
) {
  try {
    const url = new URL(req.url);
    const cursor = url.searchParams.get("cursor") || undefined;
    const pageSize = 5;
    const postId = (await context.params).postId as string; // Correctly access the postId from params
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

     // Validate that the post exists first
     const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Count comments for this specific post only
    const totalComments = await prisma.comment.count({
      where: { 
        postId: postId // Only count comments for this post
      }
    });

    if (totalComments === 0) {
      return NextResponse.json({
        comments: [],
        previousCursor: null
      });
    }

    if (!cursor && totalComments <= pageSize) {
      const comments = await prisma.comment.findMany({
        where: { postId: postId },
        include: getCommentDataInclude(user.id),
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        comments,
        previousCursor: null
      });
    }
    
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor item when paginating
    });

    const hasMore = comments.length > pageSize;
    const previousCursor = hasMore ? comments[comments.length - 1].id : null;

    const data: CommentsPage = {
      comments: hasMore ? comments.slice(0, -1) : comments,
      previousCursor,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

// export async function GET(
//   req: NextRequest,
//   { params: { postId } }: { params: { postId: string } },
// ) {
//   try {
//     const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

//     const pageSize = 5;

//     const { user } = await validateRequest();

//     if (!user) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // First, get total count of comments
//     const totalComments = await prisma.comment.count({
//       where: { postId: postId }
//     });

//     // Only fetch with pagination if there are more than pageSize comments
//     if (totalComments <= pageSize) {
//       // If we have fewer comments than pageSize, just fetch all of them
//       const comments = await prisma.comment.findMany({
//         where: { postId: postId },
//         include: getCommentDataInclude(user.id),
//         orderBy: { createdAt: "asc" },
//       });

//       return Response.json({
//         comments,
//         previousCursor: null // No need for cursor when we have all comments
//       });
//     }

//     const comments = await prisma.comment.findMany({
//       where: { postId: postId },
//       include: getCommentDataInclude(user.id),
//       orderBy: { createdAt: "asc" },
//       take: -pageSize - 1,
//       cursor: cursor ? { id: cursor } : undefined,
//     });

//     const previousCursor = comments.length > pageSize ? comments[0].id : null;

//     const data: CommentsPage = {
//       comments: comments.length > pageSize ? comments.slice(1) : comments,
//       previousCursor,
//     };

//     return Response.json(data);
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 5;
    const postId = await params.postId; // Correctly access the postId from params
    if (!postId) {
      return Response.json({ error: "Post ID is required" }, { status: 400 });
    }

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
     // Validate that the post exists first
     const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Count comments for this specific post only
    const totalComments = await prisma.comment.count({
      where: { 
        postId: postId // Only count comments for this post
      }
    });

    if (totalComments === 0) {
      return Response.json({
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

      return Response.json({
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

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { postid: string } }  // Changed to lowercase
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.postid },  // Changed to params.postid
      select: {
        likes: {
          where: {
            userId: loggedInUser.id
          },
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length
    };

    return Response.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params : {postId}}: { params: { postId: string } }  // Changed to lowercase
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    //const postid = await(params.postId);  // Get the postid from params
    
    //if (!postid) {
    //  return Response.json({ error: "Post ID is required" }, { status: 400 });
    //}

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true
      }
    })

    if (!post){
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

  await prisma.$transaction(async (prisma) => {
    await prisma.like.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {}  // No updates needed for like toggle
    });

    if (loggedInUser.id !== post.userId) {
      await prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          type: "LIKE",
          postId,
          read: false
        }
      });
    }
  });



    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: {postId} }: { params: { postId: string } }  // Changed to lowercase
) {
  try {
    //const postid = await(params.postId);  // Get the postid from params
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {id: postId},
      select: {
        userId: true
      }
    })

    if (!post){
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          type: "LIKE",
          postId,
        },
      }),
    ]);


    await prisma.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,  // Changed to params.postid
      }
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
} 
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params:  Promise<{ 
   postId: string 
 }> };

export async function GET(
  req: NextRequest,
  params : Props
) {
  const postid = (await (params.params)).postId;  // Get the postid from params
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postid },  // Changed to params.postid
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
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  params: Props
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postid = (await(params.params)).postId;  // Get the postid from params
    
    if (!postid) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postid },
      select: {
        userId: true
      }
    })

    if (!post){
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

  await prisma.$transaction(async (prisma) => {
    await prisma.like.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId: postid
        }
      },
      create: {
        userId: loggedInUser.id,
        postId: postid
      },
      update: {}  // No updates needed for like toggle
    });

    if (loggedInUser.id !== post.userId) {
      await prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          type: "LIKE",
          postId: postid,
          read: false
        }
      });
    }
  });



    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  params: Props
) {
  try {
    const postid = (await(params.params)).postId;  // Get the postid from params
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {id: postid},
      select: {
        userId: true
      }
    })

    if (!post){
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId: postid
        }
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          type: "LIKE",
          postId: postid
        },
      }),
    ]);


    await prisma.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId: postid  // Changed to params.postid
      }
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import { NextResponse } from "next/server";

// GET request to fetch follower info
export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // Validate the logged-in user
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user and their followers
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST request to follow a user
export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // Validate the logged-in user
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use Prisma transaction to follow the user and create a notification
    await prisma.$transaction([
      prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: loggedInUser.id,
            followingId: userId,
          },
        },
        create: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
        update: {},
      }),
      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE request to unfollow a user
export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // Validate the logged-in user
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use Prisma transaction to unfollow the user and delete the notification
    await prisma.$transaction([
      prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const { params } = context;
    const { userId } = await(params);

    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch users that the target user is following
    const userFollowing = await prisma.follow.findMany({
      where: { followerId: userId },
      select: {
        followingId: true,
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        },
      },
    });

    // Fetch users who are following the target user
    const userFollowers = await prisma.follow.findMany({
      where: { followingId: userId },
      select: {
        followerId: true,
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        },
      },
    });

    // Create a set of IDs of users that the target user follows
    const followingIds = new Set(userFollowing.map((f) => f.followingId));

    // Filter to include only mutual followers
    const mutualFollowers = userFollowers
      .filter((f) => followingIds.has(f.followerId))
      .map((f) => ({
        id: f.follower.id,
        username: f.follower.username,
        displayName: f.follower.displayName,
        avatarUrl: f.follower.avatarUrl,
        bio: f.follower.bio,
        followers: f.follower._count.followers,
        following: f.follower._count.following,
        isFollowedByLoggedInUser: userFollowing.some(
          (uf) => uf.followingId === f.follower.id
        ),
      }));

    const data = {
      users: mutualFollowers,
      metadata: {
        total: mutualFollowers.length,
        isMutualWithLoggedInUser: mutualFollowers.some(
          (mf) => mf.id === loggedInUser.id
        ),
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

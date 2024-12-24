import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import { NextResponse } from "next/server";

// GET request to fetch mutual followers
export async function GET(
    req: Request,
    { params: { userId } }: { params: { userId: string } },
  ) {
    try {
      const { user: loggedInUser } = await validateRequest();
  
      if (!loggedInUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // First, find all users that the target user is following
      const userFollowing = await prisma.follow.findMany({
        where: { 
          followerId: userId 
        },
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
              // Check if these users are following back
              followers: {
                where: {
                  followerId: userId,
                },
                select: {
                  followerId: true,
                },
              },
            },
          },
        },
      });
  
      // Then, find all users who are following the target user
      const userFollowers = await prisma.follow.findMany({
        where: { 
          followingId: userId 
        },
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
              // Check if the target user is following these users back
              followers: {
                where: {
                  followerId: userId,
                },
                select: {
                  followerId: true,
                },
              },
            },
          },
        },
      });
  
      // Create a Set of IDs of users that the target user follows
      const followingIds = new Set(userFollowing.map(f => f.followingId));
      
      // Filter followers to only include mutual follows (users who follow each other)
      const mutualFollowers = userFollowers.filter(f => 
        followingIds.has(f.followerId)
      ).map(f => ({
        id: f.follower.id,
        username: f.follower.username,
        displayName: f.follower.displayName,
        avatarUrl: f.follower.avatarUrl,
        bio: f.follower.bio,
        followers: f.follower._count.followers,
        following: f.follower._count.following,
        // Check if the logged-in user is following this mutual follower
        isFollowedByLoggedInUser: f.follower.followers.length > 0,
      }));
  
      const data = {
        users: mutualFollowers,
        metadata: {
          total: mutualFollowers.length,
          isMutualWithLoggedInUser: userFollowing.some(f => 
            f.followingId === loggedInUser.id && 
            userFollowers.some(follower => 
              follower.followerId === loggedInUser.id
            )
          ),
        },
      };
      return NextResponse.json(data);
    } catch (error) {
      console.error("GET Error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
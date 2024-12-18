import { Prisma } from '@prisma/client';

export function getUserDataSelect(loggedInUserId: string): Prisma.UserSelect {
  return{
    id:true,
    username:true,
    avatarUrl:true,
    bio:true,
    displayName:true,
    followers: {
        where: {
          followerId: loggedInUserId,
        },
        select: {
          followerId: true,
        },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
        },
      },
}satisfies Prisma.UserSelect;

}

export type UserData = Prisma.UserGetPayload<{
select: ReturnType<typeof getUserDataSelect>;
}>

           

export function getPostDatainclude(loggedInUserId: string){
    return {
        user: {
            select: getUserDataSelect(loggedInUserId),
        },
    } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
    include: ReturnType<typeof getPostDatainclude>;
}>;

export interface PostsPage{
    posts: PostData[];
    nextCursor: string | null;  
}
export interface FollowerInfo {
    followers: number;
    isFollowedByUser: boolean;
  }

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}
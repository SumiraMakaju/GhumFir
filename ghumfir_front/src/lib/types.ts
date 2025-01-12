import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
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
  } satisfies Prisma.UserSelect;
}



export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

// export function getPostDatainclude(loggedInUserId: string) {
//   return {
//     user: {
//       select: getUserDataSelect(loggedInUserId),
//     },
//     likes: {
//       where: {
//         userId: loggedInUserId,
//       },
//       select: {
//         userId: true,
//       },
//     },
//     _count: {
//       select: {
//         likes: true,
//         comments: true,
//       },
//     },
//     attachments:true,
//   } satisfies Prisma.PostInclude;
// }

export function getPostDatainclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
    attachments: {
      select: {
        id: true,
        type: true,
        url: true,
        createdAt: true
      }
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDatainclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },    
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
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

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}


export interface MutualFollowersResponse {
  users: UserData[];
  metadata: {
    total: number;
    isMutualWithLoggedInUser: boolean;
  };
}
export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
export interface Event {
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  url: string;
}

//diaries
export type DiariesData = Prisma.DiaryGetPayload<{
  include: ReturnType<typeof getDiariesDatainclude>;
}>;

export interface DiariesPage {
  diaries: DiariesData[];
  nextCursor: string | null;
}
export function getDiariesDatainclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: {
      select: {
        id: true,
        type: true,
        url: true,
        createdAt: true
      }
    },
  } satisfies Prisma.DiaryInclude;
}
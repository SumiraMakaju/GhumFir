"use server"

import { validateRequest } from "@/auth"
import { createPostSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { getPostDatainclude } from "@/lib/types";


export async function submitPost(input: string){
    const {user} = await validateRequest();
    const data = JSON.parse(input);
    const { content } = createPostSchema.parse({ content: data.content});
    const mediaIds = data.mediaIds;
    if(!user) throw Error("unauthorized")


        const newPost = await prisma.post.create({
            data:{
                content,
                userId:user.id,
            },
            include: getPostDatainclude(user.id),
        });

        // Map and update media with the new post ID
  if (Array.isArray(mediaIds) && mediaIds.length > 0) {
    await prisma.media.updateMany({
      where: {
        id: { in: mediaIds },
      },
      data: {
        postId: newPost.id,
      },
    });
  }

        return newPost;
    }

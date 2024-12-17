"use server"

import { validateRequest } from "@/auth"
import { createPostSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { postDatainclude } from "@/lib/types";

export async function submitPost(input: string){
    const {user} = await validateRequest();

    if(!user) throw Error("unauthorized")

        const{content} = createPostSchema.parse({content:input})

        const newPost = await prisma.post.create({
            data:{
                content,
                userId:user.id,
            },
            include: postDatainclude,
        });

        return newPost;
    }
"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma";
import { getPostDatainclude } from "@/lib/types";

export async function deletePost(id:string){
    const {user} = await validateRequest();
 
    if(!user) throw Error("unauthorized")

    const post = await prisma.post.findUnique({
        where:{id},
    });

    if(!post) throw new Error("Post not found");

    if(post.userId !== user.id) throw new Error("Unauthorized");

    const deletedpost = await prisma.post.delete({
        where:{id},
        include: getPostDatainclude(user.id),
    });

    return deletedpost;
}
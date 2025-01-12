"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma";
import { getDiariesDatainclude, getPostDatainclude } from "@/lib/types";

export async function deleteDiary(id:string){
    const {user} = await validateRequest();
 
    if(!user) throw Error("unauthorized")

    const diary = await prisma.diary.findUnique({
        where:{id},
    });

    if(!diary) throw new Error("Not found");

    if(diary.userId !== user.id) throw new Error("Unauthorized");

    const deleteddiary = await prisma.diary.delete({
        where:{id},
        include: getDiariesDatainclude(user.id),
    });

    return deleteddiary;
}
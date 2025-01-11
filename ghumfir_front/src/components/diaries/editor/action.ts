"use server"

import { validateRequest } from "@/auth"
import { createDiarySchema } from "@/lib/validation";
import prisma from "@/lib/prisma";

export async function submitDiary(input: string){
    const {user} = await validateRequest();

    if(!user){
        throw new Error("Unauthorized");
    }

    const { content } = createDiarySchema.parse({content: input});

    await prisma.diary.create({
        data: {
            content,
            userId: user.id
        },
    });
}
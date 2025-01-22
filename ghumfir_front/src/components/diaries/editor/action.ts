"use server"

import { validateRequest } from "@/auth"
import { createDiarySchema } from "@/lib/validation";
import { getDiariesDatainclude } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function submitDiary(input: string) {
    const {user} = await validateRequest();

    if(!user){
        throw new Error("Unauthorized");
    }

    const { content } = createDiarySchema.parse({content: input});

    // Return the created diary with includes
    return await prisma.diary.create({
        data: {
            content,
            userId: user.id
        },
        include: getDiariesDatainclude(user.id) // Include the related data
    });
}
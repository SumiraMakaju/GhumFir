"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues, avatarUrl?: string) {
  const validatedValues = updateUserProfileSchema.parse(values);
  console.log("validatedValues: ",validatedValues);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        bio: validatedValues.bio,
        displayName: validatedValues.displayName,
        avatarUrl: avatarUrl,
      },
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.displayName,
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
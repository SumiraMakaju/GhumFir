import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import dotenv from "dotenv";
dotenv.config();

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Transform the URL first
        const newAvatarUrl = file.url.replace(
          "/f/",
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        );

        console.log("New Avatar URL:", newAvatarUrl);

        // Delete old avatar if it exists
        if (metadata.user.avatarUrl) {
          try {
            const key = metadata.user.avatarUrl.split(
              `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            )[1];
            
            if (key) {
              const api = new UTApi({ token: process.env.UPLOADTHING_SECRET });
              await api.deleteFiles(key);
              console.log("Old avatar deleted successfully");
            }
          } catch (deleteError) {
            // Log but don't fail if delete fails
            console.error("Error deleting old avatar:", deleteError);
          }
        }

        // Update user in database
        const updatedUser = await prisma.user.update({
          where: { id: metadata.user.id },
          data: { avatarUrl:  metadata.user.avatarUrl },
        });

        console.log("Avatar URL updated in database:", updatedUser.avatarUrl);

        return { avatarUrl: newAvatarUrl };

      } catch (error) {
        console.error("Error processing avatar upload:", error);
        return { avatarUrl: file.url }; // Return the original URL even if the update fails
      }
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      try {
        const media = await prisma.media.create({
          data: {
            url: file.url.replace(
              "/f/",
              `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            ),
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        });

        if (!media) {
          throw new Error("Failed to create media record");
        }

        console.log("Media created successfully:", media);

        return { mediaId: media.id };
      } catch (error) {
        console.error("Error in attachment upload handler:", error);
        throw new UploadThingError("Failed to process attachment upload");
      }
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient, QueryKey,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./action";
import prisma from "@/lib/prisma";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      // Start uploading the avatar if it's provided
      let uploadResult;
      if (avatar) {
        uploadResult = await startAvatarUpload([avatar]);
        console.log("Upload result:", uploadResult);
      }else{
        console.log("No avatar provided");
      }
      // Update user profile with values only - avatar is handled by uploadthing
      const updatedUser = await updateUserProfile(values);

      if (uploadResult && uploadResult[0]?.url) {
        const newAvatarUrl = uploadResult[0].url;
        
        // Update the user's avatar URL in Prisma
        await prisma.user.update({
          where: { id: updatedUser.id }, // Assuming user has an 'id' field
          data: {
            avatarUrl: newAvatarUrl,
          },
        });
      }

      return { updatedUser, uploadResult };
    },
    onSuccess: async ({uploadResult, updatedUser}) => {
      // Use the avatarUrl from the uploadthing response if available
      const newAvatarUrl = uploadResult?.[0]?.url;
      
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>, Error, InfiniteData<PostsPage, string | null>, QueryKey> = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      // Use the new URL from uploadthing, or keep existing one
                      avatarUrl: newAvatarUrl || post.user.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      router.refresh();

      toast({
        description: "Profile updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
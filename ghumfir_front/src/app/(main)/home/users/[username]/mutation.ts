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
      let uploadResult = undefined;
      let updatedUser = undefined;
        uploadResult = await startAvatarUpload([avatar])
        .then((res) => {
          if (!res) {
            throw new Error(res);
          }
          
          updatedUser = updateUserProfile(values, res[0].url);
        })
        .catch((error) => {
          console.error("Error uploading avatar", error);
          throw new Error("Failed to upload avatar");
        });

      return { updatedUser, uploadResult };
    },
    onSuccess: async ({updatedUser, uploadResult}) => {
      if (!updatedUser) {
        throw new Error("Failed to update profile");
      }

      // Use the avatarUrl from the uploadthing response if available
      const newAvatarUrl = updatedUser?.avatarUrl;    
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>, Error, InfiniteData<PostsPage, string | null>, QueryKey> = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) {
            console.error("Failed to update profile: missing old data");
            return ;
          }

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
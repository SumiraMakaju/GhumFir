
import { useToast } from "@/hooks/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { deleteDiary } from "./action";
import { DiariesPage } from "@/lib/types";

export function useDeleteDiaryMutation(){
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const router = useRouter();
    const pathname = usePathname();

    const mutation = useMutation({
        mutationFn: deleteDiary,
        onSuccess: async(deletedDiary) => {
            const queryFilter: QueryFilters<InfiniteData<DiariesPage, string | null>> = { queryKey: [" "] }

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<DiariesPage,string|null>>(
                queryFilter,
                (oldData)=>{
                    if(!oldData) return;

                    return{
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            diaries: page.diaries.filter(p => p.id !== deletedDiary.id)
                        })),
                        
                    };
                },
            );

            toast({
                description: "Diary page Torn",
            })

            if(pathname === `/diaries/${deletedDiary.id}`){
                router.push(`/users/${deletedDiary.user.username}`);
            }

        },
        onError(error){
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to delete. Please try again!",
            });
        },
    });

    return mutation;
}
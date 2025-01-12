import { useToast } from "@/hooks/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitDiary } from "./action";
import { DiariesPage } from "@/lib/types";
// import { useSession } from "@/app/(main)/SessionProvider";
export function useSubmitDiaryMutation(){
    const {toast} = useToast();

    const queryClient = useQueryClient();

    //const {user} = useSession();

    const mutation = useMutation({
        mutationFn: submitDiary,
        onSuccess: async (newDiary) =>{
            const queryFilter: QueryFilters<InfiniteData<DiariesPage, string | null>> = { queryKey: [" "]

             };

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<DiariesPage,string |null>>(queryFilter, (oldData)=>{
                const firstPage = oldData?.pages[0];

                if(firstPage){
                    return{
                        pageParams: oldData.pageParams,
                        pages:[
                            {
                                diaries: [newDiary, ...firstPage.diaries],
                                nextCursor: firstPage.nextCursor
                            },
                            ...oldData.pages.slice(1),
                        ],
                    };
                }
            },
        );

        queryClient.invalidateQueries({
            queryKey: queryFilter.queryKey,
            predicate(query){
                return !query.state.data;
            },
        });

        toast({
            description: "submitted successfully!",
        })
        },
        onError: (error) => {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to submit"
            });
        },
    });

    return mutation;
}
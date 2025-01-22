// import { useToast } from "@/hooks/use-toast";
// import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
// import { submitDiary } from "./action";
// import { DiariesPage } from "@/lib/types";
// // import { useSession } from "@/app/(main)/SessionProvider";
// export function useSubmitDiaryMutation(){
//     const {toast} = useToast();

//     const queryClient = useQueryClient();

//     //const {user} = useSession();

//     const mutation = useMutation({
//         mutationFn: submitDiary,
//         onSuccess: async (newDiary) =>{
//             const queryFilter: QueryFilters<InfiniteData<DiariesPage, string | null>> = { queryKey: [" "]

//              };

//             await queryClient.cancelQueries(queryFilter);

//             queryClient.setQueriesData<InfiniteData<DiariesPage,string |null>>(queryFilter, (oldData)=>{
//                 // If no existing data, create initial structure
//                 if (!oldData) {
//                     return {
//                         pageParams: [null],
//                         pages: [{
//                             diaries: [newDiary],
//                             nextCursor: null
//                         }]
//                     };
//                 }
            
//                 const firstPage = oldData.pages[0];
//                 // Always return a valid data structure
//                 return {
//                     pageParams: oldData.pageParams,
//                     pages:[
//                         {
//                             diaries: [newDiary, ...(firstPage?.diaries || [])],
//                             nextCursor: firstPage?.nextCursor ?? null
//                         },
//                         ...oldData.pages.slice(1),
//                     ],
//                 };
//             });

//         queryClient.invalidateQueries({
//             queryKey: queryFilter.queryKey,
//             predicate(query){
//                 return !query.state.data;
//             },
//         });

//         toast({
//             description: "submitted successfully!",
//         })
//         },
//         onError: (error) => {
//             console.error(error);
//             toast({
//                 variant: "destructive",
//                 description: "Failed to submit"
//             });
//         },
//     });

//     return mutation;
// }

import { useToast } from "@/hooks/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitDiary } from "./action";
import { DiariesPage, DiariesData } from "@/lib/types";

export function useSubmitDiaryMutation() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: submitDiary,
        onSuccess: async (newDiary: DiariesData) => {
            const queryFilter: QueryFilters<InfiniteData<DiariesPage, string | null>> = {
                queryKey: ["diaries"]
            };

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<DiariesPage, string | null>>(
                queryFilter,
                (oldData): InfiniteData<DiariesPage, string | null> => {
                    if (!oldData) {
                        return {
                            pageParams: [null],
                            pages: [{
                                diaries: [newDiary],
                                nextCursor: null
                            }]
                        };
                    }

                    const updatedPages = oldData.pages.map((page, index) => {
                        if (index === 0) {
                            return {
                                ...page,
                                diaries: [newDiary, ...page.diaries]
                            };
                        }
                        return page;
                    });

                    return {
                        pageParams: oldData.pageParams,
                        pages: updatedPages
                    };
                }
            );

            await queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate(query) {
                    return !query.state.data;
                },
            });

            toast({
                description: "Diary submitted successfully!",
            });
        },
        onError: (error) => {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to submit diary"
            });
        },
    });

    return mutation;
}
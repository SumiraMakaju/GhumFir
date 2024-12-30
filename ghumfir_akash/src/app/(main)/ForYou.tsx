"use client";

import {  PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
//import { Button } from "@/components/ui/button";
import InfiniteLoad from "@/components/ui/infiniteload";
import PostsLoading from "@/components/posts/Loading";
//import Delete from "@/components/posts/delete";

export default function ForYou() {


    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["post-feed", "for-you"],
        queryFn: ({pageParam})=> kyInstance.get(
            "/api/posts/for-you",
            pageParam ? {searchParams: {cursor: pageParam}} : {}
        ).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage)=> lastPage.nextCursor
    });

    const posts = data?. pages.flatMap(page => page.posts) || [];

    if (status === "pending") {
        return <PostsLoading />;
    }

    if(status === "success" && !posts.length && !hasNextPage){
        return(
            <p className="text-center text-gray-400">
                No posts to show. Follow some users to see their posts.
            </p>
        )
    }

    if (status === "error") { 
        return <p className="text-center text-destructive">Something went wrong</p>;
    }

    return (
        <InfiniteLoad className="space-y-4" onBottomReached={()=> hasNextPage && !isFetching && fetchNextPage()}>
        {posts.map((post)=>(
            <Post key={post.id} post={post} />
        ))}
       {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
        
        
        
        </InfiniteLoad>
    );
}
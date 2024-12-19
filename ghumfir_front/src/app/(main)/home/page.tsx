
import PostEditor from "@/components/posts/editor/PostEditor";

import Popular from "@/components/popular";
import ForYou from "../ForYou";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Following from "../followingfeed";
export default async function homepage
(){
    return (
    <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
    <PostEditor/>
    <Tabs defaultValue="for-you">
        <TabsList>
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
            <ForYou />
            </TabsContent>
        <TabsContent value="following">
            <Following/>
        </TabsContent>
    </Tabs>
    <ForYou />
        </div>
        <Popular/>
        </main>
    );
}
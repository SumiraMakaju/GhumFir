
import PostEditor from "@/components/posts/editor/PostEditor";

import Popular from "@/components/popular";
import ForYou from "../ForYou";
export default async function homepage
(){
    return (
    <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
    <PostEditor/>
    <ForYou />
        </div>
        <Popular/>
        </main>
    );
}
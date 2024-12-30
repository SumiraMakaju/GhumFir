"use client"

import { EditorContent, useEditor } from "@tiptap/react";
import StarterterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "./action";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css"
import { useSubmitPostMutation } from "./mutation";
import LoadingButton from "@/components/ui/LoadingButton";

export default function PostEditor() {

 const{user} = useSession();
 const mutation = useSubmitPostMutation();

    const editor = useEditor({
        extensions:[
            StarterterKit.configure({
              bold:false,
              italic:false,
            }),
            Placeholder.configure({
                placeholder:"How was your trip?",
            })
        ]
    })

    const input = editor?.getText({
        blockSeparator: "\n",
    })||"";



    async function onSubmit(){
        mutation.mutate(input,{
            onSuccess:()=>{
                editor?.commands.clearContent();
            }
        });
    
        
    }

    return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-5">
            <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline"/>
            <EditorContent
            editor ={editor}
            className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-3xl px-5 py-3"/>
        </div>
       <div className="flex justify-end">
        <LoadingButton
        onClick={onSubmit}
        loading={mutation.isPending}
        disabled={!input.trim()}
        className="min-w-20">
            Post
        </LoadingButton>
       </div>
    </div>
    );
}
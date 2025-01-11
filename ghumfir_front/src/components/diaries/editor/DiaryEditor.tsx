"use client"

import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { submitDiary } from "./action"
import { useSession } from "@/app/(main)/SessionProvider"
import UserAvatar from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import "./styles.css"

export default function DiaryEditor() {
const {user} = useSession();

const editor = useEditor({
    extensions:[
        StarterKit.configure({
            bold:false,
            italic:false
        }),
        Placeholder.configure({
            placeholder:"Dear Diary..."
        })
    ]
})

    const input = editor?.getText({
        blockSeparator: "\n",
    }) || "";

    async function onSubmit(){
        await submitDiary(input);
        editor?.commands.clearContent();
    }

    return(
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex gap-5">
                <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" /> 
                <EditorContent
                editor={editor}
                className="w-full max-h-[20rem] overflow-y-auto bg-background rounded-3xl px-4 py-4"/>

            </div>
            <div className="flex justify-end">
                <Button onClick={onSubmit}
                disabled={!input.trim()}
                    className="min-w-20"
                >Write</Button>
            </div>
        </div>
    );

}
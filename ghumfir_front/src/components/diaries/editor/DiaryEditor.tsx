"use client"

import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import LoadingButton from "@/components/ui/LoadingButton";
import StarterKit from "@tiptap/starter-kit"
import { submitDiary } from "./action"
import { useSession } from "@/app/(main)/SessionProvider"
import { useDropzone as useUploadthingDropzone } from "@uploadthing/react";
import Image from "next/image";
import UserAvatar from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import { ClipboardEvent, useRef } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import "./styles.css"
import useMediaUpload, { Attachment } from "./UseMediaUpload";
import { useSubmitDiaryMutation } from "./mutation";
import { cn } from "@/lib/utils";

export default function DiaryEditor() {
const {user} = useSession();

const mutation = useSubmitDiaryMutation();

const {
  startUpload,
  attachments,
  isUploading,
  uploadProgress,
  removeAttachment,
  reset: resetMediaUploads,
} = useMediaUpload();

const { getRootProps, getInputProps, isDragActive } = useUploadthingDropzone({
  onDrop: startUpload,
});


const { onClick, ...rootProps } = getRootProps();


const editor = useEditor({
    extensions:[
        StarterKit.configure({
            bold:false,
            italic:false
        }),
        Placeholder.configure({
            placeholder:"Dear Diary...",
        }),
    ],
});

    const input = editor?.getText({
        blockSeparator: "\n",
    }) || "";

    function onSubmit() {
        mutation.mutate(
          JSON.stringify({
            content: input,
            mediaIds: attachments.map((a) => a.mediaId),
          }),
          {
            onSuccess: () => {
              editor?.commands.clearContent();
              resetMediaUploads();
            },
          },
        );
      }

     function onPaste(e: ClipboardEvent<HTMLInputElement>) {
         const files = Array.from(e.clipboardData.items)
           .filter((item) => item.kind === "file")
           .map((item) => item.getAsFile()) as File[];
         startUpload(files);
       }
      
    return(
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex gap-5">
            <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" /> 
                 <div {...rootProps} className="w-full">
                <EditorContent
                editor={editor}
                className={cn(
                              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
                              isDragActive && "outline-dashed",
                            )}
                            onPaste={onPaste}
                />
                <input {...getInputProps()} />
            </div>
            </div>
            {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
            <div className="flex justify-end gap-3">
             {isUploading && (
                       <>
                         <span className="text-sm">{uploadProgress ?? 0}%</span>
                         <Loader2 className="size-5 animate-spin text-primary" />
                       </>
                     )}
                     <AddAttachmentsButton
                       onFilesSelected={startUpload}
                       disabled={isUploading || attachments.length >= 5}
                     />
                     <LoadingButton
                       onClick={onSubmit}
                       loading={mutation.isPending}
                       disabled={!input.trim() || isUploading}
                       className="min-w-20"
                     >
                       Wriite
                     </LoadingButton>
            </div>
        </div>
    );

}

function useDropzone(arg0: { onDrop: (files: File[]) => void; }): { getRootProps: any; getInputProps: any; isDragActive: any; } {
    throw new Error("Function not implemented.");
}

interface AddAttachmentsButtonProps {
    onFilesSelected: (files: File[]) => void;
    disabled: boolean;
  }
  
  function AddAttachmentsButton({
    onFilesSelected,
    disabled,
  }: AddAttachmentsButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={20} />
        </Button>
        <input
          type="file"
          accept="image/*, video/*"
          multiple
          ref={fileInputRef}
          className="sr-only hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) {
              onFilesSelected(files);
              e.target.value = "";
            }
          }}
        />
      </>
    );
  }
  
  interface AttachmentPreviewsProps {
    attachments: Attachment[];
    removeAttachment: (fileName: string) => void;
  }
  
  function AttachmentPreviews({
    attachments,
    removeAttachment,
  }: AttachmentPreviewsProps) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3",
          attachments.length > 1 && "sm:grid sm:grid-cols-2",
        )}
      >
        {attachments.map((attachment) => (
          <AttachmentPreview
            key={attachment.file.name}
            attachment={attachment}
            onRemoveClick={() => removeAttachment(attachment.file.name)}
          />
        ))}
      </div>
    );
  }
  
  interface AttachmentPreviewProps {
    attachment: Attachment;
    onRemoveClick: () => void;
  }
  
  function AttachmentPreview({
    attachment: { file, mediaId, isUploading },
    onRemoveClick,
  }: AttachmentPreviewProps) {
    const src = URL.createObjectURL(file);
  
    return (
      <div
        className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
      >
        {file.type.startsWith("image") ? (
          <Image
            src={src}
            alt="Attachment preview"
            width={500}
            height={500}
            className="size-fit max-h-[30rem] rounded-2xl"
          />
        ) : (
          <video controls className="size-fit max-h-[30rem] rounded-2xl">
            <source src={src} type={file.type} />
          </video>
        )}
        {!isUploading && (
          <button
            onClick={onRemoveClick}
            className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
          >
            <X size={20} />
          </button>
        )}
      </div>
    );
  }
import {PostData} from "@/lib/types";
import { useDeletePostMutation } from "./mutation";
import { Dialog, DialogDescription, DialogFooter, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";
import LoadingButton from "../ui/LoadingButton";
import { Button } from "../ui/button";

interface DeleteProps{
    post: PostData;
    open: boolean;
    onClose: ()=>void;
}

export default function Delete({post, open, onClose}: DeleteProps){
const mutation = useDeletePostMutation();

function handleOpenChange(open: boolean){
    if(!open || !mutation.isPending){
        onClose();
    }
}


    return <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete post?</DialogTitle>
                <DialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.    
                </DialogDescription>   
            </DialogHeader>
            <DialogFooter>
                <LoadingButton variant="destructive" onClick={()=> mutation.mutate(post.id, {onSuccess: onClose})}
                    loading={mutation.isPending}>
                    Delete
                </LoadingButton>
                <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>No</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
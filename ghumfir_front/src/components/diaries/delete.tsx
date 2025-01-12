import {DiariesData, PostData} from "@/lib/types";
import { useDeleteDiaryMutation } from "./mutation";
import { Dialog, DialogDescription, DialogFooter, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";
import LoadingButton from "../ui/LoadingButton";
import { Button } from "../ui/button";

interface DeleteProps{
    diary: DiariesData;
    open: boolean;
    onClose: ()=>void;
}

export default function Delete({diary, open, onClose}: DeleteProps){
const mutation = useDeleteDiaryMutation();

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
                Are you sure you want to delete? This action cannot be undone.    
                </DialogDescription>   
            </DialogHeader>
            <DialogFooter>
                <LoadingButton variant="destructive" onClick={()=> mutation.mutate(diary.id, {onSuccess: onClose})}
                    loading={mutation.isPending}>
                    Delete
                </LoadingButton>
                <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>No</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
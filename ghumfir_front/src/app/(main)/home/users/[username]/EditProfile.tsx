"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditDialog";

interface EditProfileProps {
    user: UserData;
}

export default function EditProfile({user}: EditProfileProps) {
    const [showDialog, setShowDialog] = useState(false);

    return(
        <>
        <Button variant="outline" onClick={() => setShowDialog(true)}>
            Edit Profile
            </Button>
            <EditProfileDialog user={user} open={showDialog} onOpenChange={setShowDialog} />
        </>
    );
}
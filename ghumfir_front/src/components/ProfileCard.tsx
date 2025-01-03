import React from "react";

interface ProfileCardProps {
  avatarUrl?: string;
  username: string;
  bio?: string;
}

export default function ProfileCard({ avatarUrl, username, bio }: ProfileCardProps) {
  return (
    <div className="flex items-center space-x-4 rounded-md border p-4 shadow-md">
      <img
        src={avatarUrl || "/favicon.png"}
        alt={`${username}'s avatar`}
        className="h-16 w-16 rounded-full"
      />
      <div>
        <h2 className="text-lg font-bold">@{username}</h2>
        <p className="text-sm text-muted-foreground">{bio || "No bio available."}</p>
      </div>
    </div>
  );
}

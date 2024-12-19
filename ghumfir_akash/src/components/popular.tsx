import { validateRequest } from "@/auth";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

import { unstable_cache } from "next/cache";

import prisma
 from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
export default function Popular() {
  return (
    <div className="sticky top -[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
       <Suspense fallback={<Loader2 className="m-auto" animate-spin/>}>
        <WhoToFollow/>
        <Trends/>
        </Suspense>
    </div>
  );
}

async function WhoToFollow(){
    const {user} = await validateRequest();

    if (!user) {
        throw new Error("User is null");
    }

    const userstofollow = await prisma?.user.findMany({
        where:{
            NOT:{
                id: user.id
            },
            followers:{
                none:{
                    followerId: user.id,
                },
        },
      },
        select: getUserDataSelect(user.id),
        take: 5
    })
    return (
        <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
          <div className="text-xl font-bold">{"Let's travel together!"}</div>
          {userstofollow && userstofollow.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
                <Link
                  href={`/home/users/${user.username}`}
                  className="flex items-center gap-3"
                >
                  <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                  <div>
                    <p className="line-clamp-1 break-all font-semibold hover:underline">
                      {user.displayName}
                    </p>
                    <p className="line-clamp-1 break-all text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </Link>
                <FollowButton
                userId={user.id}
                initialState={{
                  followers: user._count?.followers || 0,
                  isFollowedByUser: !!user.followers.some(
                    ({followerId}) => followerId === user.id,
                ),
                }}/>

                
              
            </div>
          ))}
        </div>
      );
    }

    const gettrends = unstable_cache(
        async () => {
            const result = await prisma.$queryRaw<Array<{hashtag: string; count:bigint}>>`
            SELECT LOWER(unnest(regexp_matches(Content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts 
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC 
            LIMIT 5
            `;

            return result.map(row=>({
                hashtag: row.hashtag,
                count: Number(row.count)
            }))
        },
        ["popular_these_days"],
        {
            revalidate: 3*60*60,
        },
    );
    async function Trends(){
        const trends = await gettrends();
        return <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="text-xl font-bold">Travel Hashtags</div>
            {trends.map(({hashtag, count}: {hashtag: string, count: number}) => {
                const title = hashtag.split("#")[1];



                return <Link key={title} href={`/hashtags/${title}`} className="block">
                    <p className="line-clamp-1 break-all font-semibold hover:underline" title={hashtag}>
                        {hashtag}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatNumber(count)} {count === 1 ? "post" : "posts"}
                    </p>
                </Link>
            })}
        </div>
    }
import DiaryEditor from "@/components/diaries/editor/DiaryEditor";
import prisma from "@/lib/prisma";
import Diary from "@/components/diaries/Diary";

export default async function Diaries(){

    const diaries = await prisma.diary.findMany({
        include:{
          user:{
            select:{
                id: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                    },
                },
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                followers: {
                    select: {
                        followerId: true,
                    },
                },
            },
          },
          attachments:true,
        },

        orderBy:{createdAt:"desc"}
    })

    return (
    <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5"> 
        <DiaryEditor/>
        {diaries.map((diary)=>(
            <Diary key={diary.id} diary={diary}/>
        ))}
        </div>
    </main>
    );
}

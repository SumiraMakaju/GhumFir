import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MediaType } from "@/lib/types";

// Handle POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.uploads)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const mediaEntries = body.uploads.map((upload: any) => {
      const mediaType = upload.type.split("/")[0];
      return {
        type: mediaType.toUpperCase() as MediaType,
        url: upload.url,
        id: upload.key,
      };
    });
    const result = await prisma.media.createMany({
      data: mediaEntries,
    });

    return NextResponse.json({ message: "Media uploaded successfully", result }, { status: 200 });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

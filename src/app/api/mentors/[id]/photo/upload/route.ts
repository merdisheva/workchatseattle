import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";
import { getEditableMentor } from "@/lib/mentor-photo-server";
import {
  MENTOR_PHOTO_CONTENT_TYPES,
  MENTOR_PHOTO_MAX_BYTES,
  mentorPhotoPathPrefix,
} from "@/lib/mentor-photo";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth();
  const { id: mentorId } = await params;

  const mentor = await getEditableMentor(session, mentorId);
  if (!mentor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(mentorPhotoPathPrefix(mentorId))) {
          throw new Error("Invalid upload path");
        }
        return {
          allowedContentTypes: MENTOR_PHOTO_CONTENT_TYPES,
          maximumSizeInBytes: MENTOR_PHOTO_MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ mentorId }),
        };
      },
      // As with event materials, the client saves the photo URL with a
      // follow-up PUT to /api/mentors/[id]/photo, because this webhook can't
      // reach a local dev server.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

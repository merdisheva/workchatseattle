export const MENTOR_PHOTO_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const MENTOR_PHOTO_MAX_BYTES = 4 * 1024 * 1024;

export function mentorPhotoPathPrefix(mentorId: string) {
  return `mentors/${mentorId}/photo/`;
}

// Photos are stored on the mentor's User.image, which may also hold an avatar
// URL from Google sign-in. Only URLs in our Blob store should ever be deleted.
export function isBlobUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

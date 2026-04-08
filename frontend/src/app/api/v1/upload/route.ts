import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthUser, ok, err, unauthorized, forbidden } from '@/lib/db/auth';
import { uploadFile, deleteFile } from '@/lib/db/storage';

const ALLOWED_TYPES: Record<string, string[]> = {
  avatars: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  thumbnails: ['image/jpeg', 'image/png', 'image/webp'],
  videos: ['video/mp4', 'video/webm'],
  documents: ['application/pdf'],
  certificates: ['image/png', 'image/jpeg', 'application/pdf'],
};

const MAX_SIZE: Record<string, number> = {
  avatars: 2 * 1024 * 1024,       // 2 MB
  thumbnails: 5 * 1024 * 1024,    // 5 MB
  videos: 500 * 1024 * 1024,      // 500 MB
  documents: 20 * 1024 * 1024,    // 20 MB
  certificates: 5 * 1024 * 1024,  // 5 MB
};

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const folder = (form.get('folder') as string | null) ?? 'misc';

  if (!file) return err('No file provided', 400);

  // Validate folder
  const allowedTypes = ALLOWED_TYPES[folder] ?? ALLOWED_TYPES.documents;
  if (!allowedTypes.includes(file.type)) {
    return err(`Invalid file type for ${folder}. Allowed: ${allowedTypes.join(', ')}`, 400);
  }

  // Validate size
  const maxSize = MAX_SIZE[folder] ?? 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return err(`File too large. Max ${maxSize / 1024 / 1024} MB for ${folder}`, 400);
  }

  // Only ADMIN/INSTRUCTOR can upload videos and documents
  if (['videos', 'documents'].includes(folder) && auth.role === 'STUDENT') {
    return forbidden();
  }

  const ext = file.name.split('.').pop() ?? 'bin';
  const path = `${folder}/${auth.sub}/${uuidv4()}.${ext}`;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const url = await uploadFile(path, buffer, file.type);
    return ok({ url, path });
  } catch (e) {
    console.error('[upload POST]', e);
    return err('Upload failed', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();

  const { path } = await req.json() as { path: string };
  if (!path) return err('path is required', 400);

  // Users can only delete their own files
  if (!path.includes(`/${auth.sub}/`) && auth.role !== 'ADMIN') {
    return forbidden();
  }

  try {
    await deleteFile(path);
    return ok(null, 'File deleted');
  } catch (e) {
    console.error('[upload DELETE]', e);
    return err('Delete failed', 500);
  }
}

import { handleUpload } from '@vercel/blob/server';

export const POST = handleUpload({
  access: 'public',
});

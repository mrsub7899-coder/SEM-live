import { handleUpload } from '@vercel/blob';

export const POST = handleUpload({
  access: 'public',
});


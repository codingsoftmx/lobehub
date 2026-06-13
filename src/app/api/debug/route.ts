export const dynamic = 'force-dynamic';

export async function GET() {
  const authVal = process.env.AUTH_SECRET?.substring(0, 20) || 'NO AUTH_SECRET';
  const betterVal = process.env.BETTER_AUTH_SECRET?.substring(0, 20) || 'NO BETTER_AUTH_SECRET';
  
  return Response.json({
    AUTH_SECRET_length: process.env.AUTH_SECRET?.length || 0,
    AUTH_SECRET_preview: authVal + '...',
    BETTER_AUTH_SECRET_length: process.env.BETTER_AUTH_SECRET?.length || 0,
    BETTER_AUTH_SECRET_preview: betterVal + '...',
    NODE_ENV: process.env.NODE_ENV,
    has_AUTH_SECRET: !!process.env.AUTH_SECRET,
    has_BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
    env_files: ['.env.local', '.env.development'],
  });
}

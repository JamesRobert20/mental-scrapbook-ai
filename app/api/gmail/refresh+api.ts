import { handleGmailRefresh } from '@/server/services/gmail.service';

export async function POST(request: Request): Promise<Response> {
  return handleGmailRefresh(request);
}

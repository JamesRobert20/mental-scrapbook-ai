import { handleChatRequest } from '@/server/services/chat.service';

export async function POST(request: Request): Promise<Response> {
  return handleChatRequest(request);
}

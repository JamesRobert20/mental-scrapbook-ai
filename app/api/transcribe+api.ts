import { handleTranscribeRequest } from '@/server/services/transcription.service';

export async function POST(request: Request): Promise<Response> {
  return handleTranscribeRequest(request);
}

import { handleSpeakRequest } from '@/server/services/speech.service'

export async function POST(request: Request): Promise<Response> {
    return handleSpeakRequest(request)
}

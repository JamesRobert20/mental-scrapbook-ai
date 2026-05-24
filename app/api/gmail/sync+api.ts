import { handleGmailSyncRequest } from '@/server/services/gmail.service'

export async function POST(request: Request): Promise<Response> {
    return handleGmailSyncRequest(request)
}

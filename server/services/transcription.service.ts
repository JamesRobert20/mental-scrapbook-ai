import { transcribeAudio } from '@/server/integrations/groq/whisper'

export async function handleTranscribeRequest(request: Request): Promise<Response> {
    // React Native's FormData type lacks .get; in the +api runtime we get the web FormData.
    const form = (await request.formData()) as unknown as {
        get(name: string): Blob | string | null
    }
    const file = form.get('file')
    if (!(file instanceof Blob)) {
        return Response.json(
            { error: { code: 'BAD_REQUEST', message: 'Missing audio file' } },
            { status: 400 }
        )
    }

    const result = await transcribeAudio(file)
    return Response.json(result)
}

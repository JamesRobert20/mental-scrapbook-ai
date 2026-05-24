// Pulls completed sentences off a growing text buffer.
// Used to feed TTS chunk-by-chunk during a streaming LLM response.

const SENTENCE_REGEX = /[^.!?…\n]+(?:[.!?…]+|\n)/g;

export function extractSentences(text: string): {
  sentences: string[];
  remainder: string;
} {
  const sentences: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SENTENCE_REGEX.exec(text)) !== null) {
    const trimmed = match[0].trim();
    if (trimmed.length > 0) sentences.push(trimmed);
    lastIndex = SENTENCE_REGEX.lastIndex;
  }
  SENTENCE_REGEX.lastIndex = 0;
  return { sentences, remainder: text.slice(lastIndex) };
}

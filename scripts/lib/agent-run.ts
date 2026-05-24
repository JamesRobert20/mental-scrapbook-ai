import { ToolLoopAgent, tool } from 'ai'

import { buildSystemPrompt } from '../../lib/ai/prompts'
import { agentTools as definitions } from '../../lib/ai/tools'
import { DEFAULT_LANGUAGE, type LanguageId } from '../../lib/i18n/languages'

export type ToolCallTrace = {
    tool: string
    input: unknown
    output: unknown
}

const CHAT_MODEL = 'google/gemini-3-flash'

function wrapTool<Name extends keyof typeof definitions>(
    traces: ToolCallTrace[],
    name: Name,
    stub: (input: any) => unknown
) {
    const base = definitions[name] as {
        description: string
        inputSchema: any
    }
    return tool({
        description: base.description,
        inputSchema: base.inputSchema,
        execute: async (input: unknown) => {
            const output = stub(input)
            traces.push({ tool: name, input, output })
            return output
        }
    })
}

function stubId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function buildStubTools(traces: ToolCallTrace[]) {
    return {
        createTodo: wrapTool(traces, 'createTodo', input => ({
            id: stubId('todo'),
            title: input.title,
            notes: input.notes ?? null,
            dueAt: input.dueAt ?? null,
            priority: input.priority ?? 'medium',
            source: 'voice',
            createdAt: new Date().toISOString(),
            completedAt: null,
            calendarEventId: null
        })),
        completeTodo: wrapTool(traces, 'completeTodo', () => ({ success: true })),
        listTodos: wrapTool(traces, 'listTodos', () => []),
        pullGmailTodos: wrapTool(traces, 'pullGmailTodos', () => [])
    }
}

export type AgentProbeResult = {
    text: string
    traces: ToolCallTrace[]
    steps: number
}

export function requireAgentEnv(): void {
    if (!process.env.AI_GATEWAY_API_KEY) {
        throw new Error(
            'Missing AI_GATEWAY_API_KEY. Add it to .env.local (scripts load it via --env-file).'
        )
    }
}

export type RunAgentProbeOptions = {
    language?: LanguageId
}

export async function runAgentProbe(
    prompt: string,
    options: RunAgentProbeOptions = {}
): Promise<AgentProbeResult> {
    requireAgentEnv()
    const traces: ToolCallTrace[] = []
    const agent = new ToolLoopAgent({
        model: CHAT_MODEL,
        instructions: buildSystemPrompt(options.language ?? DEFAULT_LANGUAGE),
        tools: buildStubTools(traces)
    })
    const result = await agent.generate({ prompt })
    return {
        text: result.text ?? '',
        traces,
        steps: result.steps.length
    }
}

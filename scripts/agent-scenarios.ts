// Fixed agent smoke tests — asserts the model picks the right tools for common prompts.
// Requires AI_GATEWAY_API_KEY in .env.local (live Gateway call, ~10–15s total).
//
// Usage:
//   pnpm agent:scenarios
import { type AgentProbeResult, type ToolCallTrace, runAgentProbe } from './lib/agent-run'

type Scenario = {
    name: string
    prompt: string
    assert: (result: AgentProbeResult) => string | null
}

function toolNames(traces: ToolCallTrace[]): string[] {
    return traces.map(t => t.tool)
}

const scenarios: Scenario[] = [
    {
        name: 'schedules a timed todo',
        prompt: 'remind me to call mom tomorrow at 5pm',
        assert: ({ traces, text }) => {
            if (!text.trim()) return 'assistant reply was empty'
            const create = traces.find(t => t.tool === 'createTodo')
            if (!create) return 'expected createTodo'
            const input = create.input as { title?: string; dueAt?: string }
            if (!input.title?.trim()) return 'createTodo missing title'
            if (!input.dueAt || !/T\d{2}:\d{2}/.test(input.dueAt)) {
                return 'createTodo dueAt should include a time (ISO datetime)'
            }
            return null
        }
    },
    {
        name: 'lists open todos',
        prompt: 'what todos do I have open right now?',
        assert: ({ traces, text }) => {
            if (!text.trim()) return 'assistant reply was empty'
            if (!toolNames(traces).includes('listTodos')) {
                return `expected listTodos, got: ${toolNames(traces).join(', ') || '(none)'}`
            }
            return null
        }
    },
    {
        name: 'answers without tools',
        prompt: 'what is the capital of France?',
        assert: ({ traces, text }) => {
            if (!text.trim()) return 'assistant reply was empty'
            if (traces.length > 0) {
                return `expected no tool calls, got: ${toolNames(traces).join(', ')}`
            }
            if (!/paris/i.test(text)) return 'expected a reply mentioning Paris'
            return null
        }
    }
]

async function main(): Promise<void> {
    const started = Date.now()
    let passed = 0
    const failures: { name: string; reason: string }[] = []

    console.log(`Running ${scenarios.length} agent scenarios…\n`)

    for (const scenario of scenarios) {
        process.stdout.write(`  ${scenario.name} … `)
        try {
            const result = await runAgentProbe(scenario.prompt)
            const reason = scenario.assert(result)
            if (reason) {
                console.log('✗')
                failures.push({ name: scenario.name, reason })
            } else {
                console.log('✓')
                passed += 1
            }
        } catch (err) {
            console.log('✗')
            failures.push({
                name: scenario.name,
                reason: err instanceof Error ? err.message : String(err)
            })
        }
    }

    const elapsed = ((Date.now() - started) / 1000).toFixed(1)
    console.log(`\n${passed}/${scenarios.length} passed in ${elapsed}s`)

    if (failures.length > 0) {
        console.log('\nFailures:')
        for (const f of failures) {
            console.log(`  • ${f.name}: ${f.reason}`)
        }
        process.exit(1)
    }
}

main().catch(err => {
    console.error('\nagent-scenarios failed:', err instanceof Error ? err.message : err)
    process.exit(1)
})

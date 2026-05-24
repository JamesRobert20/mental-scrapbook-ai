// CLI: run a single chat turn through the real ToolLoopAgent with stubbed
// client tools. Prints the assistant text and every tool call the model made.
//
// Usage:
//   pnpm agent "remind me to call mom at 5pm tomorrow"
import { runAgentProbe } from './lib/agent-run'

async function main(): Promise<void> {
    const prompt = process.argv.slice(2).join(' ').trim()
    if (!prompt) {
        console.error('Usage: pnpm agent "<your prompt>"')
        process.exit(1)
    }

    console.log(`\n> ${prompt}\n`)

    const { text, traces, steps } = await runAgentProbe(prompt)

    console.log('=== Assistant ===')
    console.log(text || '(no text)')

    console.log('\n=== Tool calls ===')
    if (traces.length === 0) {
        console.log('(none)')
    } else {
        console.log(JSON.stringify(traces, null, 2))
    }

    console.log(`\nsteps: ${steps}`)
}

main().catch(err => {
    console.error('\nagent-probe failed:', err instanceof Error ? err.message : err)
    process.exit(1)
})

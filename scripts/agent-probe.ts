// CLI: run a single chat turn through the real ToolLoopAgent with stubbed
// client tools. Prints the assistant text and every tool call the model made.
//
// Usage:
//   pnpm agent "remind me to call mom at 5pm tomorrow"
//   pnpm agent --lang es "recuérdame llamar a mamá mañana a las 5pm"
import { isLanguageId, type LanguageId } from '../lib/i18n/languages'
import { runAgentProbe } from './lib/agent-run'

function parseArgs(argv: string[]): { prompt: string; language?: LanguageId } {
    const args = [...argv]
    let language: LanguageId | undefined
    const langIdx = args.indexOf('--lang')
    if (langIdx !== -1) {
        const value = args[langIdx + 1]
        if (!value || !isLanguageId(value)) {
            console.error(`Unknown language: ${value ?? '(missing)'}`)
            process.exit(1)
        }
        language = value
        args.splice(langIdx, 2)
    }
    return { prompt: args.join(' ').trim(), language }
}

async function main(): Promise<void> {
    const { prompt, language } = parseArgs(process.argv.slice(2))
    if (!prompt) {
        console.error('Usage: pnpm agent [--lang <id>] "<your prompt>"')
        process.exit(1)
    }

    console.log(`\n> ${prompt}${language ? `  [lang=${language}]` : ''}\n`)

    const { text, traces, steps } = await runAgentProbe(prompt, { language })

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

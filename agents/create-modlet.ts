#!/usr/bin/env tsx
/**
 * Agent system for creating new modlet components in the Sheet Music App.
 *
 * Usage:
 *   pnpm agent:create <ComponentName> [ParentModule] [description...]
 *
 * Examples:
 *   pnpm agent:create MetronomeDisplay SheetMusicComposer "Visual metronome beat indicator"
 *   pnpm agent:create TriviaScore Songs "Displays the user's current score"
 *   pnpm agent:create KeySignatureSelector SheetMusicComposer
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const [, , componentName, parentModule, ...descWords] = process.argv;
const description = descWords.join(' ');

if (!componentName) {
  console.error(
    'Usage: pnpm agent:create <ComponentName> [ParentModule] [description...]\n',
  );
  console.error(
    'Example: pnpm agent:create MetronomeDisplay SheetMusicComposer "Visual beat indicator"',
  );
  process.exit(1);
}

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

const ORCHESTRATOR_PROMPT = `\
You are the orchestrator for the Sheet Music App component creation pipeline.
Your job: coordinate three specialized subagents to create a production-ready modlet.

## Modlet structure (4 mandatory files)
\`\`\`
ComponentName/
├── ComponentName.tsx        ← React component (React 19, CSS Modules, named export)
├── ComponentName.module.css ← Scoped styles (kebab-case class names)
├── ComponentName.test.tsx   ← Vitest + React Testing Library tests
└── index.ts                 ← export { ComponentName } from './ComponentName'
\`\`\`

## Your exact workflow
1. Call the **architect** subagent with the component name, parent module, and description.
   It will read existing components and return a complete implementation plan.

2. Call the **builder** subagent with the full plan from step 1.
   It will create all 4 modlet files on disk.

3. Call the **validator** subagent with the path to the new modlet.
   It will run tests and lint, and fix any failures (up to 3 rounds).

4. Summarize what was created: file paths, component API, and test count.

Pass the complete context to each subagent — they don't share memory.
Do not skip any step.`;

const ARCHITECT_PROMPT = `\
You are an architect for the Sheet Music App.
When called, you produce a detailed implementation plan for a new modlet component.

## Your steps
1. Read the CLAUDE.md at the project root to confirm conventions.
2. Identify 2 similar existing components and read them (tsx + css + test) to extract patterns.
   Good reference components:
   - src/SheetMusicComposer/Palette/Palette.tsx (complex, many buttons, conditional classes)
   - src/SheetMusicComposer/PlaybackControls/PlaybackControls.tsx (controls with state)
   - src/SheetMusicComposer/SongList/SongList.tsx (list with CRUD actions)
   - src/Songs/MusicTrivia/TriviaView.tsx (props-based presentational component)
3. Determine the correct directory (e.g. src/SheetMusicComposer/MetronomeDisplay/).
4. Output a structured plan containing:
   - **File path**: full path for the modlet directory
   - **Props interface**: TypeScript type for props (or "no props" if none)
   - **State**: useState hooks needed (name, type, initial value)
   - **Hooks to use**: existing hooks to call (useSheetMusicComposer, usePlaybackContext, etc.)
   - **CSS classes**: list of class names (kebab-case) and what they style
   - **JSX structure**: outline of the rendered markup (not full code — just the tree)
   - **Test cases**: 5+ concrete test case descriptions (what to render, what to assert)

Be specific and concrete. The builder will implement exactly what you specify.`;

const BUILDER_PROMPT = `\
You are a builder for the Sheet Music App.
When called with an implementation plan, you create all 4 modlet files on disk.

## Files to create (all 4 are required)

### 1. ComponentName.tsx
- Named export: \`export const ComponentName: React.FC<Props> = ...\`
- Props via explicit \`type Props = { ... }\` above the component
- No-props components: \`export const ComponentName: React.FC = () => ...\`
- CSS: \`import styles from './ComponentName.module.css'\`
- Class access: \`styles['kebab-case']\` or \`styles.camelCase\`
- Conditional classes: \`[styles.base, isActive ? styles.active : ''].filter(Boolean).join(' ')\`
- Use \`import type\` for type-only imports
- Access context via project custom hooks, never import context directly
- React 19: no legacy patterns (no class components, no defaultProps, no propTypes)

### 2. ComponentName.module.css
- All class names in **kebab-case**: \`.component-name\`, \`.palette-btn\`, \`.active\`
- Follow the dark theme palette already used in the project:
  - Background containers: \`#16213e\`
  - Card surfaces: \`#2d2d44\`
  - Accent / interactive: \`#4ecdc4\`
  - Text primary: \`#e8e8e8\`
  - Border: \`#3d3d54\`
- Include hover states and transitions for interactive elements
- Use flexbox for layouts

### 3. ComponentName.test.tsx
- First test: \`it('works', () => { render(<ComponentName />) })\`
- Describe block name: \`'ParentModule/ComponentName'\`
- Mock all hooks with \`vi.mock('../hookName')\`
- \`beforeEach\`: \`vi.clearAllMocks()\` + restore mock return values
- Use \`screen.getByRole\`, \`screen.getByText\`, \`screen.getByLabelText\` for queries
- Use \`userEvent\` for interactions (click, type)
- Test at minimum: renders, content visibility, interaction callbacks, conditional rendering

### 4. index.ts
\`\`\`ts
export { ComponentName } from './ComponentName';
\`\`\`

Read the implementation plan carefully. Read 1-2 reference files if you need to verify
a specific pattern before writing. Then create all 4 files.`;

const VALIDATOR_PROMPT = `\
You are a validator for the Sheet Music App.
When called with a modlet directory path, you verify the component is correct and fix failures.

## Steps (repeat up to 3 times until all pass)

### Round 1 — run checks
1. Run: \`pnpm test -- <path/to/ComponentName.test.tsx>\`
   (vitest run with the specific test file path)
2. Run: \`pnpm lint\`

### Round 2+ — fix failures
If tests fail:
- Read the failing test and the component it tests
- Fix the root cause in the component file or the test file
- Re-run the specific test

If lint fails:
- Read the lint output carefully
- Fix each ESLint/Prettier/TypeScript error
- Re-run lint

### Success criteria
- \`pnpm test -- <testFile>\` exits 0 with all tests passing
- \`pnpm lint\` exits 0 with no errors

### Report format
Return a summary:
- Tests: X passed, Y failed
- Lint: pass / fail (with error count)
- Files modified during validation (if any)`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n🎵 Sheet Music App — Modlet Generator');
  console.log('─'.repeat(40));
  console.log(`  Component : ${componentName}`);
  if (parentModule) console.log(`  Parent    : ${parentModule}`);
  if (description) console.log(`  Desc      : ${description}`);
  console.log('─'.repeat(40));
  console.log();

  const orchestratorUserPrompt = [
    `Create a new modlet for: **${componentName}**`,
    parentModule
      ? `Place it at: src/${parentModule}/${componentName}/`
      : 'Determine the best location based on the component purpose.',
    description ? `Description: ${description}` : '',
    '',
    'Follow the workflow: architect → builder → validator.',
  ]
    .filter(Boolean)
    .join('\n');

  for await (const message of query({
    prompt: orchestratorUserPrompt,
    options: {
      cwd: PROJECT_ROOT,
      allowedTools: ['Read', 'Glob', 'Grep', 'Bash', 'Agent'],
      permissionMode: 'bypassPermissions',
      allowDangerouslySkipPermissions: true,
      maxTurns: 80,
      systemPrompt: ORCHESTRATOR_PROMPT,
      settingSources: ['project'], // load CLAUDE.md

      agents: {
        architect: {
          description:
            'Reads existing components and creates a detailed implementation plan (props, CSS, tests)',
          prompt: ARCHITECT_PROMPT,
          tools: ['Read', 'Glob', 'Grep'],
        },

        builder: {
          description:
            'Creates all 4 modlet files on disk following the project conventions',
          prompt: BUILDER_PROMPT,
          tools: ['Read', 'Write', 'Edit', 'Glob'],
        },

        validator: {
          description:
            'Runs tests and lint, fixes any failures, confirms everything passes',
          prompt: VALIDATOR_PROMPT,
          tools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
        },
      },
    },
  })) {
    // Show subagent progress
    if (
      'type' in message &&
      message.type === 'system' &&
      'subtype' in message
    ) {
      if (message.subtype === 'init') {
        console.log(
          `[session] ${(message as { session_id: string }).session_id}`,
        );
      }
    }

    // Show task notifications (subagent completions)
    if (
      'type' in message &&
      message.type === 'system' &&
      'subtype' in message &&
      (message as { subtype: string }).subtype === 'task_notification'
    ) {
      const m = message as { result?: string };
      if (m.result) {
        const preview = m.result.slice(0, 120).replace(/\n/g, ' ');
        console.log(`  ✓ subagent: ${preview}…`);
      }
    }

    // Final result
    if ('result' in message) {
      console.log('\n✅ Done!\n');
      console.log(message.result);
      console.log();
    }
  }
}

main().catch((err: Error) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});

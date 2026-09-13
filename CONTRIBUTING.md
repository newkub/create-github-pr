# Contributing

## Development

1. Install dependencies:
   ```bash
   bun install
   ```
2. Run the Probot dev server:
   ```bash
   bun run dev
   ```
3. Run typecheck:
   ```bash
   bunx tsc --noEmit
   ```
4. Run tests:
   ```bash
   bun test
   ```

## Conventions

- TypeScript strict mode
- Keep handlers thin, put business logic in `src/domain/`
- Add tests for new handlers
- Follow Probot patterns from the official docs


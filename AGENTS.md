# Svelte project instructions

This project follows the official Svelte AI workflow.

1. Run `npx -y @sveltejs/mcp list-sections` before Svelte/SvelteKit work.
2. Fetch every relevant current section with `npx -y @sveltejs/mcp get-documentation '<paths>'`.
3. Use Svelte 5 runes mode (`$props`, `$state`, `$derived`) and current SvelteKit route conventions.
4. Use `+page.server.ts` load functions for database reads and form actions for mutations.
5. Use `$app/paths` `resolve()` for internal links.
6. Run `npx -y @sveltejs/mcp svelte-autofixer <file> --svelte-version 5` for every changed Svelte file until it reports no issues or suggestions.
7. Finish with `npm run check`, tests, lint, build, and a dependency audit.

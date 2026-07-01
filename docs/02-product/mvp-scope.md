# MVP scope

> **Status:** Draft — lock before goal-driven implementation.

## MVP goal

Ship `@pcampus/ui` v0 with shared design tokens and the first promoted primitives from Cockpit — enough for one consuming service to bootstrap and look like a Pcampus product.

## In scope (v1)

- [ ] Design tokens package (`@pcampus/ui/tokens`) — colors, spacing, typography from Cockpit
- [ ] Package scaffold in `code/` — tsup build, Storybook, Vitest, ESLint
- [ ] First Tier 2 primitives promoted from Cockpit (per active goal — e.g. `Button`, `Input`)
- [ ] Storybook stories and unit tests for shipped components
- [ ] Semantic versioning + publish workflow

## Out of scope (v1)

- Domain-specific components (Story, Evidence, Business vocabulary stays in service repos)
- Pcampus Console shell application
- New component design not yet proven in Cockpit
- Speculative abstractions before the two-service rule is met
- Service-specific branding beyond token remapping

## Quality bar

- [ ] Tests and linter pass per [../06-workflows/definition-of-done.md](../06-workflows/definition-of-done.md)
- [ ] Goal-driven delivery per [../06-workflows/dev-loop.md](../06-workflows/dev-loop.md)
- [ ] Components meet publish gates in [.agents/review.md](../../.agents/review.md)

## Related

- [project-brief.md](project-brief.md)
- [../01-vision.md](../01-vision.md)
- [../07-backlog/goals.md](../07-backlog/goals.md)

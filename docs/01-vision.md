# Vision — @pcampus/ui

## What We Are Building

One visual language for every product in the Pcampus ecosystem.

A user who logs into PIP to manage their identity, then opens PBCP Cockpit to run their business, then switches to Factory to manage their shop — they should feel like they never left. Same spacing, same type, same colors, same interaction patterns. The product changes; the visual foundation does not.

`@pcampus/ui` is that foundation.

---

## The Problem We Solve

Without a shared library, every service builds its own buttons, its own modals, its own shells. They drift apart over time. PIP buttons look different from Cockpit buttons. Factory spacing is tighter than Upload spacing. Users feel the seams.

Shared CSS is not enough. Shared design tokens are not enough. What teams need is shared, tested, documented components — ones they can import and trust.

---

## North Star

**"Feels like one product"** — no matter which Pcampus service you are using.

The standard is AWS Console and Google Cloud Console: dozens of services, one shell, one vocabulary. You know you are in the same product family because the parts are the same.

That is what `@pcampus/ui` enables for Pcampus.

---

## How We Get There

### Cockpit as source of truth

PBCP Cockpit is the most visually mature service in the ecosystem. Its design language — Evidence Blue, the 4pt grid, the SnapshotPanel pattern, the AppShell — is the starting point for all shared components.

Nothing new is designed in this repo. We extract, generalize, package, and version what Cockpit has already proven in production.

### Conservative promotion (the two-service rule)

A component enters `@pcampus/ui` only when:
1. It has shipped and been stable in Cockpit
2. A second service confirms it needs the same component
3. It can be stripped of all PBCP-specific semantics and still be useful

This prevents speculative abstractions and keeps the library grounded in real production needs.

### Tokens as the unifying layer

Before any component is shared, the tokens are shared. A service that imports only `@pcampus/ui/tokens` already gets consistent colors, spacing, and typography. Everything built on those tokens inherits the visual foundation automatically.

Services may remap semantic tokens to their own brand values — but the token structure is the same across all of them.

### The eventual console

When each service has implemented `AppShell` from `@pcampus/ui`, switching between services becomes a navigation choice rather than a context switch. At that point, building a unified Pcampus Console becomes feasible: a single shell that hosts PIP, Cockpit, Factory, and BuatJai as sections of one product.

`@pcampus/ui` is the prerequisite for that console.

---

## Product Principles

1. **Extract, don't invent** — every component here has lived in production before it enters the library
2. **Two-service rule** — nothing is promoted until at least two services need it
3. **Tokens before components** — visual consistency starts at the token layer
4. **Generic names** — no PBCP vocabulary leaks into public API

---

## Success Metrics

- A new Pcampus service can bootstrap with `@pcampus/ui` and immediately look like a Pcampus product — no custom styling required for standard patterns
- Cockpit, PIP, Upload, BuatJai, and Factory share the same `Button`, `Input`, `AppShell`, `SnapshotPanel` — each differentiated only at the token level
- Breaking changes to shared components are deliberate, versioned decisions — not accidents
- Antigravity signs off on the visual language once in Cockpit — and it propagates automatically to every service through the shared library

---

## What This Is Not

- Not a replacement for service-specific design — every service keeps its own domain components
- Not a design tool — designs originate in Cockpit, not here
- Not the Pcampus Console itself — this is the library the console will be built with
- Not a place for experimentation — components live here after they have proven themselves, not before

---

## Related

- [02-product/project-brief.md](02-product/project-brief.md)
- [.agents/product.md](../.agents/product.md) — component tier system + promotion process
- [.agents/design.md](../.agents/design.md) — visual foundation and token specs

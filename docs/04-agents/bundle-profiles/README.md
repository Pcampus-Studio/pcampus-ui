# Bundle profiles — reusable compile presets

> Compiler applies a **profile** to select imports, recipes, and exclusions.  
> Recipes: [execution-recipes/](../execution-recipes/README.md)

---

## Profiles

| Profile | Role | Imports | Exclude |
|---------|------|---------|---------|
| **backend-api** | developer / backend | REST recipe, API checklist, security checklist | UI, UX, design files |
| **qa** | qa | Acceptance, regression recipe | implementation unless testing |
| **product** | product | Pains, PDR, metrics | code/, migrations |
| **designer** | designer | Brief journey, UI constraints | backend code |

Declare in goal Context manifest: `profile: backend-api`

---

## Example: backend-api

See [backend-api.yaml](backend-api.yaml)

Compiler merges profile `imports` with step `recipe` and goal manifest.

---

## Example: qa

See [qa.yaml](qa.yaml)

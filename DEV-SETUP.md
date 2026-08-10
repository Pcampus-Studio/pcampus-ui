# Developer setup — @pcampus-studio/ui

## One-time machine setup

1. Create a GitHub Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens (classic)
   - Scope: `read:packages`

2. Add to your `~/.npmrc`:
   ```
   @pcampus-studio:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
   ```

## Install in a service

```bash
npm install @pcampus-studio/ui
```

## Import

```tsx
import { Button, AppShell, SnapshotPanel } from '@pcampus-studio/ui';
import '@pcampus-studio/ui/dist/esm/tokens/index.css';
```

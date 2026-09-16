# Design System Impact demo

This standalone demo repository models an enterprise React design system evolving from `@acme/ui` 1.4 to 2.0, a legacy checkout consumer, a multi-level barrel consumer, and the migrated result.

The workflow is intentionally split between two tools:

- `design-system-impact` snapshots both contracts, explains semantic changes, locates the legacy consumer, resolves CODEOWNERS, and produces an agent-ready migration manifest.
- `design-system-guard` rejects the legacy policy violations and accepts the migrated consumer.

## Run

```sh
npm install
npm test
```

Node 22.18 or newer is required by the published `design-system-guard` parser dependency. The repository pins `design-system-impact` to the exact dogfooded Git commit because its npm package has not been published yet.

Inspect generated artifacts in `artifacts/` after the test. Run individual stages with `npm run impact`, `npm run guard:legacy`, and `npm run guard:migrated`.

The legacy Guard command is expected to exit with status 1. The dogfood test treats that expected rejection as success and verifies the reported rules.

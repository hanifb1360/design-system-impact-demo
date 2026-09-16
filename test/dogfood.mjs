import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
await rm(path.join(root, 'artifacts'), { recursive: true, force: true });
await mkdir(path.join(root, 'artifacts'));
const impactCli = path.join(root, 'node_modules/design-system-impact/dist/cli.js');
const guardCli = path.join(root, 'node_modules/design-system-guard/dist/cli.mjs');
const tscCli = path.join(root, 'node_modules/typescript/bin/tsc');
const run = (script, args, options = {}) => execFileSync(process.execPath, [script, ...args], { cwd: root, stdio: 'inherit', ...options });

run(tscCli, ['-p', 'packages/ui/tsconfig.json']);
run(impactCli, ['snapshot', '--root', 'releases/ui-v1', '--output', '../../artifacts/ui-v1.snapshot.json']);
run(impactCli, ['snapshot', '--root', 'packages/ui', '--output', '../../artifacts/ui-v2.snapshot.json']);
run(impactCli, ['diff', 'artifacts/ui-v1.snapshot.json', 'artifacts/ui-v2.snapshot.json', '--format', 'json', '--output', 'artifacts/ui.diff.json']);
run(impactCli, ['impact', 'artifacts/ui.diff.json', '--format', 'json', '--output', 'artifacts/consumer-impact.json']);
run(impactCli, ['plan', 'artifacts/ui.diff.json', 'artifacts/consumer-impact.json', '--format', 'json', '--output', 'artifacts/migration-plan.json']);
const currentSnapshot = JSON.parse(await readFile(path.join(root, 'artifacts/ui-v2.snapshot.json'), 'utf8'));
if (!currentSnapshot.exports.some((item) => item.name === 'Button' && item.importPath === '@acme/ui/button')) throw new Error('Expected @acme/ui/button package export discovery.');
const impacts = JSON.parse(await readFile(path.join(root, 'artifacts/consumer-impact.json'), 'utf8'));
if (!impacts.diagnostics.some((diagnostic) => diagnostic.code === 'DSI2101' && diagnostic.location?.file === 'apps/barrel-consumer/src/SpreadButton.tsx')) throw new Error('Expected a JSX spread uncertainty diagnostic.');
if (impacts.impacts.some((impact) => impact.changeId.endsWith('.requiredness') && impact.location.file === 'apps/barrel-consumer/src/SpreadButton.tsx')) throw new Error('A JSX spread must not produce a definite missing-required-prop impact.');
const plan = JSON.parse(await readFile(path.join(root, 'artifacts/migration-plan.json'), 'utf8'));
const propTask = plan.tasks.find((task) => task.replacement?.to === 'Button.variant="danger"' && task.locations.some((location) => location.owner?.includes('@checkout-team')));
if (!propTask?.automatic) throw new Error('Expected an owned automatic Button tone-to-variant task for checkout.');
const barrelTask = plan.tasks.find((task) => task.locations.some((location) => location.file === 'apps/barrel-consumer/src/DeleteButton.tsx'));
if (!barrelTask?.automatic || !barrelTask.locations.some((location) => location.owner?.includes('@platform-team'))) throw new Error('Expected an owned automatic migration through the multi-level barrel.');

const legacy = spawnSync(process.execPath, [guardCli, 'check', 'apps/checkout-legacy/src', '--config', 'design-system-guard.config.mjs', '--json'], { cwd: root, encoding: 'utf8' });
if (legacy.status !== 1) throw new Error(`Legacy Guard check should exit 1, received ${legacy.status}.\n${legacy.stdout}\n${legacy.stderr}`);
const guardResult = JSON.parse(legacy.stdout.slice(legacy.stdout.indexOf('{')));
const ruleIds = new Set(guardResult.diagnostics.map((diagnostic) => diagnostic.ruleId));
for (const expected of ['component-prop-policy', 'no-hardcoded-colors', 'prefer-design-system-components', 'no-unknown-tokens']) if (!ruleIds.has(expected)) throw new Error(`Expected Guard diagnostic ${expected}.`);

run(guardCli, ['check', 'apps/checkout-migrated/src', '--config', 'design-system-guard.config.mjs']);
run(tscCli, ['--noEmit']);
process.stdout.write('Dogfood workflow passed: Impact planned the migration and Guard accepted the migrated consumer.\n');

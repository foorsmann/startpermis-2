#!/usr/bin/env node

/**
 * Aggregate validation runner.
 * Executes the combined lint pipeline so the command
 * can also be used in CI without duplicating logic.
 */

const { spawnSync } = require('node:child_process');

const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(command, ['run', 'lint'], { stdio: 'inherit' });

if (result.error) {
  console.error('Failed to start lint command:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);

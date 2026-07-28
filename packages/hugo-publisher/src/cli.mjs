#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import {
  approvedLetterFromIssue,
  outputFilename,
  renderHugoMarkdown,
} from './index.mjs';

function argumentsFrom(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      throw new Error('expected --event, --comments, --output and --maintainers');
    }
    args.set(key.slice(2), value);
  }
  return args;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function main() {
  const args = argumentsFrom(process.argv.slice(2));
  const eventPath = args.get('event');
  const commentsPath = args.get('comments');
  const outputDir = args.get('output');
  const maintainers = args.get('maintainers');

  if (!eventPath || !commentsPath || !outputDir || !maintainers) {
    throw new Error('expected --event, --comments, --output and --maintainers');
  }

  const event = await readJson(eventPath);
  const comments = await readJson(commentsPath);
  if (!Array.isArray(comments)) {
    throw new Error('comments must be an array');
  }

  const letter = approvedLetterFromIssue(event, comments, maintainers);
  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, outputFilename(letter));
  await writeFile(outputPath, renderHugoMarkdown(letter), 'utf8');
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`guestbook publish failed: ${error.message}\n`);
  process.exitCode = 1;
});

#!/usr/bin/env bun
import { buildPrBody, type PrBodyInput } from "./pr-body.js";

const args = Bun.argv.slice(2);

function getArg(name: string): string | undefined {
  const index = args.findIndex((a) => a === `--${name}`);
  if (index === -1) return undefined;
  return args[index + 1];
}

const inputArg = getArg("input");
const outputArg = getArg("output") || "/dev/stdout";

if (!inputArg) {
  console.error("Usage: create-github-pr --input pr-body.json [--output pr-body.md]");
  process.exit(1);
}

const input = inputArg;
const output = outputArg;

async function main() {
  const file = Bun.file(input);
  const text = await file.text();
  const data: PrBodyInput = JSON.parse(text);
  const body = buildPrBody(data);

  if (output === "/dev/stdout") {
    console.log(body);
  } else {
    await Bun.write(output, body);
    console.log(`PR body written to ${output}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

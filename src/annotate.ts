import { generateHtml, screenshotHtml, loadConfig } from "./core/index.js";

const args = Bun.argv.slice(2);
let configPath = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--config" || args[i] === "-c") {
    configPath = args[i + 1];
    i++;
  }
}

if (!configPath) {
  console.error("Usage: bunx tsx src/annotate.ts --config <config.json>");
  process.exit(1);
}

async function main() {
  const config = await loadConfig(configPath);
  const html = await generateHtml(config);
  await screenshotHtml(html, config.output);
  console.log(`Annotated image saved to: ${config.output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

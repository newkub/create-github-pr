// Pure module — file I/O is optional via CLI below

export interface TestCaseInput {
  summary: string;
  description: string;
  previewUrl: string;
  imageName: string;
  imageAlt: string;
}

export interface FeatureInput {
  name: string;
  description: string;
  status: string;
  testCases: TestCaseInput[];
}

export interface PrBodyInput {
  title?: string;
  summary?: string;
  features: FeatureInput[];
  typeOfChange?: string[];
  testingNotes?: string[];
  checklist?: string[];
  releaseStatus?: string;
  issueReferences?: string;
  imageBaseUrl?: Record<string, string>;
}

export function buildPrBody(input: PrBodyInput): string {
  const sections: string[] = [];

  if (input.summary) {
    sections.push(`# ${input.title || "PR"}\n\n${input.summary}`);
  }

  sections.push(generateSummaryTable(input.features));
  sections.push("");
  sections.push("---");
  sections.push("");

  for (const feature of input.features) {
    sections.push(generateFeature(feature, input.imageBaseUrl || {}));
    sections.push("");
  }

  if (input.typeOfChange && input.typeOfChange.length > 0) {
    sections.push(generateSection("Type of Change", input.typeOfChange.map((x) => `- [x] ${x}`)));
  }

  if (input.testingNotes && input.testingNotes.length > 0) {
    sections.push(generateSection("Testing", input.testingNotes));
  }

  if (input.checklist && input.checklist.length > 0) {
    sections.push(generateSection("Checklist", input.checklist));
  }

  if (input.releaseStatus) {
    sections.push(`## Release Status\n\n${input.releaseStatus}`);
  }

  if (input.issueReferences) {
    sections.push(`## Issue References\n\n${input.issueReferences}`);
  }

  return sections.filter(Boolean).join("\n\n");
}

function generateSummaryTable(features: FeatureInput[]) {
  const rows = features
    .map(
      (f, i) =>
        `| ${i + 1} | ${f.name} | ${f.status} | [Test cases](#feature-${slug(f.name)}) |`,
    )
    .join("\n");

  return `## Feature Summary

| No. | Feature | Status | Evidence |
|---|---|---|---|
${rows}`;
}

function generateFeature(feature: FeatureInput, imageBaseUrl: Record<string, string>) {
  const testCases = feature.testCases
    .map((tc, i) => {
      const imageUrl = imageBaseUrl[tc.imageName] || tc.imageName;
      return `<details>
<summary>Test case ${i + 1}: ${tc.summary}</summary>

- Preview: [Open staging preview](${tc.previewUrl}) (replace with real staging URL if needed)
- Description: ${tc.description}
- Evidence:

![${tc.imageAlt}](${imageUrl})

</details>`;
    })
    .join("\n\n");

  return `## Feature: ${feature.name}

### Description
${feature.description}

### Test Cases

${testCases}`;
}

function generateSection(title: string, items: string[]) {
  return `## ${title}

${items.join("\n")}`;
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// CLI entry point
const inputPath = Bun.argv.find((a) => a.startsWith("--input="))?.slice("--input=".length);
const outputPath = Bun.argv.find((a) => a.startsWith("--output="))?.slice("--output=".length);

async function runCli() {
  if (!inputPath || !outputPath) return;
  const file = Bun.file(inputPath);
  const text = await file.text();
  const input: PrBodyInput = JSON.parse(text);
  const body = buildPrBody(input);
  await Bun.write(outputPath, body);
  console.log(`PR body saved to: ${outputPath}`);
}

runCli().catch((err) => {
  console.error(err);
  process.exit(1);
});

> ![Status](https://img.shields.io/badge/status-in_development-red)

# create-github-pr

GitHub bot + CLI for creating fully-featured PRs with annotated screenshots, test-case accordions, and staging preview links.

![TypeScript](https://img.shields.io/badge/TypeScript-5.1-3178c6)
![Bun](https://img.shields.io/badge/Bun-1.3.13-f9f1e1)
![Probot](https://img.shields.io/badge/Probot-14.3.2-3b82f6)
![Playwright](https://img.shields.io/badge/Playwright-1.63.0-2ead5a)

```text
┌──────────────────────────────────────────────────────────┐
│  create-github-pr                                        │
│                                                          │
│ GitHub App + CLI + Annotate                              │
│                                                          │
│ .github/create-github pr.json                            │
│ features: [                                              │
│   { name: "Docs", testCases: [...] }                     │
│ ]                                                        │
│                                                          │
│ pull_request.opened -> build PR body -> update PR        │
│ issue_comment /create-github pr -> create PR             │
└──────────────────────────────────────────────────────────┘
```

## Get Started

1. Install dependencies — `bun install`
   ```bash
   bun install
   ```
2. Run the Probot dev server — `bun run dev`
   ```bash
   bun run dev
   ```
3. Build a PR body from JSON — `bunx tsx src/cli.ts --input pr-body.json --output pr-body.md`
   ```bash
   bunx tsx src/cli.ts --input pr-body.json --output pr-body.md
   ```
4. Annotate a screenshot — `bunx tsx src/annotate.ts --config annotate.json`
   ```bash
   bunx tsx src/annotate.ts --config annotate.json
   ```
5. Run tests — `bun test`
   ```bash
   bun test
   ```

## Features

| Icon | Feature | Description | Benefit | Usage |
|:----:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:file-document-edit.svg?color=%231976d2&width=16) | PR Body Builder | Generate markdown PR bodies from JSON input | Removes manual formatting in PRs | `buildPrBody(data)` or `bunx tsx src/cli.ts` |
| ![icon](https://api.iconify.design/mdi:brush.svg?color=%237b1fa2&width=16) | Annotated Screenshots | Draw arrows, boxes, and text labels on screenshots | Visual evidence is clearer | `bunx tsx src/annotate.ts --config annotate.json` |
| ![icon](https://api.iconify.design/mdi:menu.svg?color=%23c2185b&width=16) | Test Case Accordions | One `<details>` block per test case with preview and image | Organizes evidence by feature | `.github/create-github pr.json` |
| ![icon](https://api.iconify.design/mdi:robot.svg?color=%230097a7&width=16) | Probot GitHub App | Auto-update PR bodies on `pull_request.opened` | Hands-free PR formatting | `bun run dev` |
| ![icon](https://api.iconify.design/mdi:comment.svg?color=%23303f9f&width=16) | Slash Commands | Create PRs from issue comments with `/create-github pr` | Faster issue-to-PR flow | `/create-github pr --head <branch>` |
| ![icon](https://api.iconify.design/mdi:cloud-upload.svg?color=%23388e3c&width=16) | Release Asset Upload | Upload screenshots to a GitHub release for PR body | Images persist in the PR body | `uploadReleaseAssets(...)` |
| ![icon](https://api.iconify.design/mdi:cog.svg?color=%2300796b&width=16) | JSON Config | Declarative features and test cases in repository | Single source of truth for PR content | `config.features` |
| ![icon](https://api.iconify.design/mdi:camera.svg?color=%23f57c00&width=16) | Playwright Screenshots | Render annotated HTML to PNG | Automated evidence capture | `bunx playwright screenshot ...` |
| ![icon](https://api.iconify.design/mdi:shield-check.svg?color=%23ffa000&width=16) | TypeScript Strict | `strict: true` with NodeNext resolution | Type-safe PR generation | `bunx tsc --noEmit` |
| ![icon](https://api.iconify.design/mdi:key.svg?color=%23d32f2f&width=16) | Environment Variables | Probot auth via `APP_ID`, `PRIVATE_KEY_PATH`, etc. | Secure GitHub App credentials | `.env.example` |


## Usage

### Usage via CLI

```bash
bunx tsx src/cli.ts --help
```

```text
┌──────────────────────────────────────────────────────────┐
│ $ bunx tsx src/cli.ts --help                             │
│                                                          │
│ Usage: bunx tsx src/cli.ts --input pr-body.json          │
│        [--output pr-body.md]                             │
│                                                          │
│ Options:                                                 │
│   --input   Path to pr-body.json                         │
│   --output  Output path (default: /dev/stdout)           │
└──────────────────────────────────────────────────────────┘
```

### Usage via Web

<details>
<summary>GitHub App webhook flow & PR body layout</summary>

Install the GitHub App, subscribe to `Pull request` and `Issue comment` events, and add `.github/create-github pr.json` to the repository. When a PR is opened, the bot uploads images, builds the body, and updates the PR. Comment `/create-github pr --head <branch>` on an issue to create a PR.

```text
┌──────────────────────────────────────────────────────────┐
│            Pull Request #42 — Docs migration             │
│                                                          │
│  ## Feature Summary                                      │
│  | No. | Feature | Status | Evidence |                   │
│  |---|---|---|---|                                       │
│  | 1 | Docs | Ready | Test cases |                       │
│                                                          │
│  <details>                                               │
│  <summary>Test 1: Homepage loads</summary>               │
│  - Preview: [Open staging preview](...)                  │
│  - Description: See the docs homepage                    │
│  - Evidence:                                             │
│  ![docs homepage](...)                                   │
│  </details>                                              │
└──────────────────────────────────────────────────────────┘
```

</details>

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, conventions, and validation workflows.

## License

MIT License — see [LICENSE.md](LICENSE.md)


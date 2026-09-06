---
name: create-github-pr
description: Create a GitHub pull request from the current branch
argument-hint: "[scope]"
related:
  - git-commit
  - git-push
  - run-check
  - run-test
  - capture-terminal
  - record-video-terminal
  - open-github-pr
  - open-web
  - merge-github-pr
  - update-github-pr
  - implement-github-issue
  - open-github-repo
  - open-github-repo-personal
  - open-github-repo-org
---

## Goal

Create a pull request from the current branch with title, body, labels, reviewers, and optional annotated screenshots following project conventions.

## Scope

- For skills: `implement-github-issue`, `open-github-pr`, `open-github-repo`, `open-github-repo-personal`, `open-github-repo-org`, `update-github-pr`
- Use after implementation when a PR is needed to merge into the base branch
- Use annotated screenshots and accordion test cases when the PR changes UX/UI

## Execute

### 1. Prepare

> Goal: Check state before creating the PR

1. Confirm you are on the correct branch, not `main`
2. Run `git status --short` to see changed files
3. If there are uncommitted changes, use `/git-commit` first
4. Run `git log --oneline main..HEAD` to review commits

### 2. Push Branch

> Goal: Push the branch to remote

1. Run `/git-push` or `git push -u origin <branch>`
2. Confirm the branch was pushed successfully

### 3. Run Checks

> Goal: Verify quality before creating the PR

1. Run `/run-check` (lint, typecheck, scan)
2. Run `/run-test` for tests
3. If checks fail, run `/resolve-errors` first

### 4. Build PR Body

> Goal: Create a feature-based PR title and body with evidence

1. Create the title from commit messages or the task, using conventional commit format: `<type>(<scope>): <subject>`
2. If the repo has `.github/pull_request_template.md`, read and use it as the base
3. If not, read `create-github-pr/templates/index.md` and pick a template by type:
   - `feature` → `templates/feature.md`
   - `bugfix` → `templates/bugfix.md`
   - `refactor` → `templates/refactor.md`
   - `docs` → `templates/docs.md`
   - `hotfix` → `templates/hotfix.md`
4. Read the selected template and replace placeholders with real data
5. If the PR contains multiple features, use `feature.md` and split the body into multiple `## Feature: <name>` sections
6. Do not use mockups, placeholders, or unverified images/videos in the Image/Video column
7. If unclear, use `/ask-me`

### 5. Capture Or Build Source Images

> Goal: Get real source images before annotating

1. If the PR changes UI:
   - Run dev server or staging preview
   - Use `browser_preview` or `bunx playwright screenshot` to capture the screen
   - Use viewport `1280x720`
2. If the PR is terminal-only:
   - Use `capture-terminal` or `record-video-terminal`
   - Run test/build/lint specific to the test case
3. Save source images to `docs/screenshots/<release>/source/`

### 6. Annotate Screenshots

> Goal: Add arrows and text to point out what changed

1. Use the `create-github-pr` package CLI:
   ```bash
   bunx tsx src/annotate.ts --config homepage-hero.json
   ```
2. The `config` JSON specifies:
   - `input`: original image
   - `output`: output image
   - `annotations`: array of `text`, `arrow`, `box`
3. The script generates HTML and calls `bunx --bun playwright screenshot` automatically
4. Or use `bunx tsx src/pr-body.ts` to generate a PR body from JSON
5. Verify the output images before using them

### 7. Build PR Body With Test Cases

> Goal: Build a PR body with accordion test cases and evidence

```markdown
## Feature Summary

| No. | Feature | Status | Evidence |
|---|---|---|---|
| 1 | Docs migration to VitePress | Ready | [Screenshots](#feature-docs-migration-to-vitepress) |

---

## Feature: <name>

### Description
[Short feature description]

### Test Cases

<details>
<summary>Test case 1: Open docs homepage and see hero, nav, and feature cards</summary>

- Preview: [Open local docs preview](http://localhost:4173) (replace with staging URL)
- Evidence:

![docs homepage annotated](<url>)

</details>
```

Requirements:

- 1 test case = 1 `<details>`
- Each test case must have a staging preview link (not a clickable image)
- Place annotated images inside `<details>`
- If no staging is available, use a local preview URL with a note for reviewers

### 8. Create PR

> Goal: Create the pull request

1. Run `gh pr create --title "<title>" --body "<body>" --base <base-branch>`
2. Add labels with `--label "<label>"`
3. Add reviewers with `--reviewer <reviewer>`
4. Add assignees with `--assignee <user>`
5. If it is a draft, use `--draft`

### 9. Link Issue

> Goal: Link related issues

1. If an issue number exists, add `Closes #<issue>` to the body
2. If not, ask the user whether to link an issue
3. If a project board exists, use `gh project item-add`

### 10. Report

> Goal: Summarize the result

1. Report the PR number, URL, and title
2. Report status checks and labels
3. After creating the PR, open it in a browser with `/open-web` or `gh pr view --web`
4. If the user wants to merge next, use `/merge-github-pr`

## Rules

- Run checks before creating a PR
- Push the branch before creating a PR
- Do not create a PR directly on `main`
- Use a PR template if one exists
- Add `Closes #<issue>` if relevant
- Do not use mockups or placeholders for images/videos in feature tables; use evidence from `/record-video-terminal`, `/capture-terminal`, or the `create-github-pr` annotate CLI
- 1 test case must have at least 1 annotated image for UI changes
- Arrows and text must point directly to the changed feature
- Staging preview link must be separate from the image, not the image itself
- Use `<details>` for accordion test cases
- If you cannot capture UI, use a terminal screenshot with a note
- For private repos, use release assets or GitHub attachments to display images
- If the title/body is unclear, ask the user

## Expected Outcome

- PR is created with a feature-based title, body, and labels
- Each feature has a heading and a 5-column table (Description, Benefit, Why, File Change, Image/Video)
- Image/Video in the table is real evidence; no mockups
- Branch is pushed
- Checks pass before the PR is created
- Issue is linked if available
- UI-changing PRs include annotated screenshots inside accordion test cases

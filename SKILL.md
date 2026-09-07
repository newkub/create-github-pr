---
name: create-github-pr
description: สร้าง GitHub pull request จาก branch ปัจจุบัน พร้อม title, body, labels, reviewers, screenshots
argument-hint: "[scope]"
related:
  - git-commit
  - git-push
  - run-check
  - run-test
  - capture-terminal
  - record-video-terminal
  - open-github-pr
  - merge-github-pr
  - update-github-pr
  - implement-github-issue
  - ask-me
  - open-web
---

## Goal

สร้าง pull request จาก branch ปัจจุบัน พร้อม title, body, labels, reviewers และ screenshots ตาม conventions ของ project

## Scope

- ใช้หลัง `/implement-github-issue` หรือเมื่อต้องการ merge งานเข้า base branch
- รองรับ `/open-github-pr`, `/update-github-pr`, `/merge-github-pr`
- ใช้ annotated screenshots และ accordion test cases เมื่อ PR เปลี่ยน UI

## Execute

### 1. Prepare

> Goal: ตรวจสอบ state ก่อนสร้าง PR

1. ยืนยันว่าอยู่บน branch ที่ถูกต้อง ไม่ใช่ `main`
2. รัน `git status --short` เพื่อดูไฟล์ที่เปลี่ยน
3. ถ้ามี uncommitted changes ให้ใช้ `/git-commit` ก่อน
4. รัน `git log --oneline main..HEAD` เพื่อ review commits

### 2. Push Branch

> Goal: Push branch ขึ้น remote

1. รัน `/git-push` หรือ `git push -u origin <branch>`
2. ยืนยันว่า branch push สำเร็จ

### 3. Run Checks

> Goal: ตรวจคุณภาพก่อนสร้าง PR

1. รัน `/run-check` (lint, typecheck, scan)
2. รัน `/run-test` สำหรับ tests
3. ถ้า checks ล้มเหลว ให้ `/resolve-errors` ก่อน

### 4. Build PR Body

> Goal: สร้าง PR title และ body พร้อม evidence

1. สร้าง title จาก commit messages หรือ task โดยใช้ conventional commits: `<type>(<scope>): <subject>`
2. ถ้า repo มี `.github/pull_request_template.md` ให้อ่านและใช้เป็น base
3. ถ้าไม่มี ให้อ่าน `create-github-pr/templates/index.md` และเลือก template ตาม type:
   - `feature` → `templates/feature.md`
   - `bugfix` → `templates/bugfix.md`
   - `refactor` → `templates/refactor.md`
   - `docs` → `templates/docs.md`
   - `hotfix` → `templates/hotfix.md`
4. อ่าน template ที่เลือกแล้วแทนที่ placeholders ด้วยข้อมูลจริง
5. ถ้า PR มีหลาย feature ให้ใช้ `feature.md` แล้วแบ่ง body เป็นหลาย `## Feature: <name>`
6. อย่าใช้ mockups, placeholders หรือ images/videos ที่ยังไม่ verify ในคอลัมน์ Image/Video
7. ถ้าไม่ชัด ใช้ `/ask-me`

### 5. Capture Or Build Source Images

> Goal: หา source images จริงก่อน annotate

1. ถ้า PR เปลี่ยน UI:
   - รัน dev server หรือ staging preview
   - ใช้ `browser_preview` หรือ `bunx playwright screenshot` capture หน้าจอ
   - ใช้ viewport `1280x720`
2. ถ้า PR เป็น terminal-only:
   - ใช้ `capture-terminal` หรือ `record-video-terminal`
   - รัน test/build/lint เฉพาะ test case
3. บันทึก source images ลง `docs/screenshots/<release>/source/`

### 6. Annotate Screenshots

> Goal: เพิ่มลูกศรและข้อความบอกสิ่งที่เปลี่ยน

1. ใช้ CLI ของ `create-github-pr` package:
   ```bash
   bunx tsx src/annotate.ts --config homepage-hero.json
   ```
2. ไฟล์ `config` JSON ระบุ:
   - `input`: original image
   - `output`: output image
   - `annotations`: array ของ `text`, `arrow`, `box`
3. Script สร้าง HTML แล้วเรียก `bunx --bun playwright screenshot` อัตโนมัติ
4. หรือใช้ `bunx tsx src/pr-body.ts` เพื่อ generate PR body จาก JSON
5. ตรวจ output images ก่อนใช้

### 7. Build PR Body With Test Cases

> Goal: สร้าง PR body พร้อม accordion test cases และ evidence

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
- แต่ละ test case ต้องมี staging preview link แยกจาก image
- วาง annotated images ไว้ข้างใน `<details>`
- ถ้าไม่มี staging ให้ใช้ local preview URL พร้อมหมายเหตุสำหรับ reviewer

### 8. Create PR

> Goal: สร้าง pull request

1. รัน `gh pr create --title "<title>" --body "<body>" --base <base-branch>`
2. เพิ่ม labels ด้วย `--label "<label>"`
3. เพิ่ม reviewers ด้วย `--reviewer <reviewer>`
4. เพิ่ม assignees ด้วย `--assignee <user>`
5. ถ้าเป็น draft ใช้ `--draft`

### 9. Link Issue

> Goal: เชื่อมโยง issue ที่เกี่ยวข้อง

1. ถ้ามี issue number เพิ่ม `Closes #<issue>` ลง body
2. ถ้าไม่มี ถาม user ว่าต้องการ link issue หรือไม่
3. ถ้ามี project board ใช้ `gh project item-add`

### 10. Report

> Goal: สรุปผล

1. รายงาน PR number, URL, และ title
2. รายงาน status checks และ labels
3. หลังสร้าง PR เปิดดูใน browser ด้วย `/open-web` หรือ `gh pr view --web`
4. ถ้า user ต้องการ merge ต่อ ให้ส่งต่อ `/merge-github-pr`

## Rules

- รัน checks ก่อนสร้าง PR
- Push branch ก่อนสร้าง PR
- ห้ามสร้าง PR บน `main`
- ใช้ PR template ถ้ามี
- เพิ่ม `Closes #<issue>` ถ้าเกี่ยวข้อง
- อย่าใช้ mockups หรือ placeholders สำหรับ images/videos ในตาราง feature ให้ใช้ evidence จาก `/record-video-terminal`, `/capture-terminal` หรือ `create-github-pr` annotate CLI
- 1 test case ต้องมี annotated image อย่างน้อย 1 ภาพสำหรับ UI changes
- ลูกศรและข้อความต้องชี้ไปยัง feature ที่เปลี่ยนโดยตรง
- Staging preview link ต้องแยกจาก image ไม่ใช่ image เอง
- ใช้ `<details>` สำหรับ accordion test cases
- ถ้า capture UI ไม่ได้ ให้ใช้ terminal screenshot พร้อมหมายเหตุ
- สำหรับ private repo ใช้ release assets หรือ GitHub attachments เพื่อแสดง images
- ถ้า title/body ไม่ชัด ถาม user

## Expected Outcome

- PR ถูกสร้างด้วย feature-based title, body, labels
- แต่ละ feature มี heading และตาราง 5 คอลัมน์ (Description, Benefit, Why, File Change, Image/Video)
- Image/Video ในตารางเป้น evidence จริง ไม่ใช่ mockups
- Branch ถูก push
- Checks ผ่านก่อนสร้าง PR
- Issue ถูก link ถ้ามี
- PR ที่เปลี่ยน UI มี annotated screenshots ข้างใน accordion test cases

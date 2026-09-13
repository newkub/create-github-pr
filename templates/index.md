# PR Templates

เลือก template ตามประเภท PR:

| Type | Template File | ใช้เมื่อ |
|---|---|---|
| feature | [feature.md](feature.md) | เพิ่ม feature ใหม่ |
| bugfix | [bugfix.md](bugfix.md) | แก้ bug |
| refactor | [refactor.md](refactor.md) | ปรับปรุงโครงสร้างโดยไม่เปลี่ยน behavior |
| docs | [docs.md](docs.md) | อัปเดต documentation |
| hotfix | [hotfix.md](hotfix.md) | แก้ด่วนใน production |

## Selection Rules

- ถ้า project มี `.github/pull_request_template.md` → ใช้ template ของ repo ก่อน
- ถ้า PR ประกอบด้วยหลาย feature หรือ change → ใช้ `feature.md` แล้วแบ่งเป็น section ตาม feature
- title ใช้ conventional commit format: `<type>(<scope>): <subject>`
- body ห้ามใช้ mockup หรือ placeholder สำหรับ Image/Video ต้องเป็นหลักฐานจริงจาก `/record-video-terminal` หรือ `/capture-terminal`
- ถ้าไม่ชัดว่าใช้ type ไหน → ทำ `/ask-me`


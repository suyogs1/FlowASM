# .kiro/ Folder

## Purpose

This folder contains Kiroween 2024 submission materials and metadata for the FlowASM project.

## Contents

### Submission Metadata
- **submission_metadata.json** - Project metadata (name, description, tags, technologies)
- **devpost_payload.md** - Ready-to-copy Devpost submission text
- **CHECKLIST.md** - Complete list of what was built vs stubbed
- **CREDENTIALS_TEMPLATE.md** - Security and credential setup guide

### Demo Assets
- **demo_assets/** - Placeholder for screenshots, GIFs, videos
  - demo.gif - Visual demonstration (to be captured)
  - demo.mp4 - Video demonstration (to be recorded)
  - thumb.png - Thumbnail image (to be created)

### Documentation
- **README.md** - This file

## For Judges

This folder provides:
1. **Quick Overview** - submission_metadata.json has all key info
2. **Devpost Content** - devpost_payload.md is ready to copy/paste
3. **Verification** - CHECKLIST.md shows what's real vs stubbed
4. **Security** - CREDENTIALS_TEMPLATE.md explains credential handling

## Key Information

**Project:** FlowASM  
**Theme:** Combining separate systems into a unified whole  
**Status:** Complete and ready for demo  
**Setup:** `npm install && npm start`  
**Demo:** Works immediately in sandbox mode  

## What's Real

✅ ASM sandbox engine (complete compiler/executor)  
✅ Visual workflow builder (full drag-and-drop)  
✅ Monaco code editor (professional editing)  
✅ All UI features (no placeholders)  
✅ Execution engine (real orchestration)  

## What's Stubbed

⚠️ TK5 connector (can be enabled with TK5_ENDPOINT)  
⚠️ z/OS connector (can be enabled with ZOS_* vars)  
⚠️ ZeroFrame connector (can be enabled with ZEROFRAME_ENDPOINT)  

All stubs clearly marked in output with `"stubbed": true`

## Quick Start

```bash
cd FlowASM
npm install
npm start
# Open http://localhost:3000
```

## Documentation

Full documentation in `FlowASM/docs/`:
- README_DEMO.md - 60-90 second demo script
- README_UI.md - Complete UI guide
- ASSEMBLER_EDITOR_GUIDE.md - Code editor documentation
- CREDENTIALS_TEMPLATE.md - Security setup

---

**Kiroween 2024** 🎃

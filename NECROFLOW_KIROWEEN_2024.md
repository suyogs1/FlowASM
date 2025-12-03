# 🎃 NecroFlow - Kiroween 2024 Submission

## FlowASM: Unified Mainframe Workflow Platform

**Theme:** Combining separate systems into a unified whole

---

## 🎯 Project Overview

FlowASM is a **unified n8n-style visual workflow platform** that combines:
- **IPLLab** (assembly engine)
- **ZeroFrame** (3270 terminal automation)
- **TK5/Hercules** (mainframe emulator)
- **z/OS** (real mainframe systems)

Into a single, cohesive workflow automation platform with drag-and-drop capabilities.

## ✨ Key Features

### 1. Visual Workflow Builder
- n8n-style drag-and-drop interface
- Node palette with 12 node types
- Real-time execution monitoring
- Live log display
- Import/export workflows as JSON

### 2. Sandboxed Execution
- Built-in ASM engine (IPLLab port)
- No external dependencies for demos
- Deterministic outputs
- Perfect for testing and development

### 3. Multiple Connectors
- **asm-sandbox** - Always available, embedded engine
- **tk5** - TK5/Hercules emulator integration
- **zos** - Real z/OS mainframe integration
- **zeroframe** - 3270 terminal automation

### 4. Smart Fallback
- Connectors auto-detect availability
- Graceful fallback to deterministic stubs
- Clear marking of stubbed operations
- No workflow failures due to missing systems

### 5. Security First
- No credentials in repository
- Environment variable configuration
- Secure credential handling
- Complete security documentation

### 6. Node.js Only
- 100% Node.js/npm
- No Python dependencies
- Single dependency (express)
- Easy deployment

## 🚀 60-Second Demo

```bash
cd FlowASM
npm install
npm run demo
```

**Output:**
```
╔═══════════════════════════════════════════════════════╗
║              FlowASM CLI Demo                         ║
║         Unified Mainframe Workflow Platform           ║
╚═══════════════════════════════════════════════════════╝

Connector Status:
  asm          ✓ Available
  tk5          ⚠ Stubbed
  zos          ⚠ Stubbed
  zeroframe    ⚠ Stubbed

Running: Payroll Processing Demo (Sandbox)

✓ [compile_payroll] asm.compile
✓ [execute_payroll] asm.run
✓ [verify_result] asm.debug
✓ [submit_jcl] zeroframe.send (stubbed)
✓ [verify_completion] zeroframe.wait (stubbed)

✅ Demo completed successfully!
Summary: 5/5 nodes succeeded
Total time: 2ms
```

## 🎨 Web UI Demo

```bash
npm start
# Open http://localhost:3000
```

**Features:**
- Workflow selection sidebar
- Visual node canvas
- Node inspector for editing
- One-click execution
- Real-time logs
- Export/import workflows

## 📁 Project Structure

```
FlowASM/
├── core/                      ← Flow engine & orchestration
│   ├── runner.js              ← Workflow runner
│   ├── flow-engine.js         ← Execution engine
│   └── api.js                 ← REST API
│
├── engines/                   ← Execution engines
│   └── asm-sandbox/           ← Embedded IPLLab engine
│       ├── adapter.js         ← Connector interface
│       └── engine.js          ← ASM assembler/executor
│
├── connectors/                ← System connectors
│   ├── tk5/                   ← TK5/Hercules
│   ├── zos/                   ← z/OS mainframe
│   └── zeroframe/             ← 3270 terminal
│
├── ui/                        ← Visual interface
│   ├── index.html             ← Main UI
│   ├── app.js                 ← Application logic
│   └── styles.css             ← Styling
│
├── workflows/                 ← Demo workflows
│   ├── payroll-demo.json      ← Sandbox demo
│   ├── tk5-demo.json          ← TK5 integration
│   └── zos-integration.json   ← z/OS integration
│
├── docs/                      ← Documentation
│   ├── README_DEMO.md         ← Demo guide
│   ├── CREDENTIALS_TEMPLATE.md ← Security guide
│   └── SUBMISSION_REPORT.md   ← Requirements report
│
├── server.js                  ← Main entry point
├── cli-demo.js                ← CLI demo runner
└── package.json               ← Node.js only
```

## 🔧 Node Types (12)

### ASM Sandbox (3)
- **asm.compile** - Compile assembly source code
- **asm.run** - Execute compiled bytecode
- **asm.debug** - Debug with breakpoints

### TK5 Emulator (3)
- **tk5.ipl** - IPL (boot) system
- **tk5.submit** - Submit JCL job
- **tk5.status** - Check job status

### z/OS Mainframe (3)
- **zos.submit** - Submit JCL to real z/OS
- **zos.smf** - Fetch SMF records
- **zos.dataset** - Read dataset content

### 3270 Terminal (3)
- **zeroframe.send** - Send terminal action
- **zeroframe.read** - Read screen content
- **zeroframe.wait** - Wait for expected text

## 🔄 Template Variables

Pass data between nodes using `{{node.X.artifacts.Y}}`:

```json
{
  "nodes": [
    {
      "id": "compile",
      "type": "asm.compile",
      "config": { "sourceCode": "..." }
    },
    {
      "id": "run",
      "type": "asm.run",
      "config": {
        "bytecode": "{{node.compile.artifacts.bytecode}}"
      }
    }
  ]
}
```

## 🎯 Demo Workflows

### 1. Payroll Processing (Sandbox)
**No setup required** - Runs entirely in asm-sandbox

**Workflow:**
1. Compile payroll assembly (1000 + 250)
2. Execute calculation
3. Debug and verify R0=1250
4. Submit JCL via 3270 (stubbed)
5. Wait for completion (stubbed)

**Run:** `npm run demo`

### 2. TK5 Emulator Demo
**Requires:** TK5/Hercules on localhost:8038

**Workflow:**
1. Compile assembly code
2. IPL TK5 system
3. Submit job to TK5
4. Check job status

**Run:**
```bash
export TK5_ENDPOINT=http://localhost:8038
npm start
# Load "TK5 Emulator Demo" in UI
```

### 3. z/OS Integration
**Requires:** z/OS credentials

**Workflow:**
1. Compile program
2. Submit job to real z/OS
3. Fetch SMF records
4. Read output dataset

**Run:**
```bash
export ZOS_ENDPOINT=https://zos.example.com
export ZOS_USERNAME=user
export ZOS_PASSWORD=pass
npm start
# Load "z/OS Integration Example" in UI
```

## 🔌 Connector Architecture

### Unified Interface

All connectors expose the same interface:

```javascript
POST /execute
{
  run_id: "unique_id",
  node_type: "connector.action",
  inputs: { /* config */ },
  meta: { /* metadata */ }
}

Response:
{
  run_id: "unique_id",
  status: "SUCCESS" | "FAIL",
  artifacts: { /* results */ },
  logs: [ /* execution logs */ ],
  metadata: { stubbed: true/false }
}
```

### Auto-Fallback

Connectors automatically detect availability:
- Check endpoint/credentials on initialization
- Fall back to deterministic stubs if unavailable
- Mark stubbed operations in response
- Log fallback in execution results

### Connector Status

| Connector | Always Available | Requires | Fallback |
|-----------|-----------------|----------|----------|
| asm-sandbox | ✓ Yes | None | N/A |
| tk5 | ✗ No | TK5_ENDPOINT | Deterministic stub |
| zos | ✗ No | ZOS_* credentials | Deterministic stub |
| zeroframe | ✗ No | ZEROFRAME_ENDPOINT | Deterministic stub |

## 🔒 Security

### No Credentials in Repo
- All sensitive config via environment variables
- `.gitignore` includes `.env`, credentials files
- Clear warnings in documentation

### Environment Variables

```bash
# TK5
export TK5_ENDPOINT=http://localhost:8038

# z/OS
export ZOS_ENDPOINT=https://zos.example.com
export ZOS_USERNAME=user
export ZOS_PASSWORD=pass

# ZeroFrame
export ZEROFRAME_ENDPOINT=http://localhost:3270
```

### Security Documentation
- `docs/CREDENTIALS_TEMPLATE.md` - Complete security guide
- Environment variable templates
- Best practices
- Testing procedures

## 📊 Statistics

**Code:**
- 20 code files
- ~2,500 lines of code
- 12 node types
- 4 connectors
- 3 demo workflows

**Dependencies:**
- 1 production dependency (express)
- 0 Python dependencies
- 100% Node.js

**Documentation:**
- 4 documentation files
- ~1,000 lines of docs
- Complete API reference
- Security guide
- Demo scripts

## 🎃 Kiroween Theme

**"Combining separate systems into a unified whole"**

FlowASM embodies this theme by:

### 1. Unifying Disparate Systems
- IPLLab (TypeScript/React) → Node.js adapter
- ZeroFrame (React/TypeScript) → Node.js connector
- TK5 (Hercules/C) → REST connector
- z/OS (Mainframe) → REST connector

### 2. Single Cohesive Platform
- One codebase
- One runtime (Node.js)
- One UI
- One workflow format
- One API

### 3. Seamless Integration
- Uniform connector interface
- Template variable resolution
- Auto-fallback to stubs
- Consistent error handling

### 4. Visual Orchestration
- n8n-style workflow builder
- Drag-and-drop nodes
- Real-time execution
- Live logging

## 📚 Documentation

### Quick Start
- **QUICK_START.md** - 60-second demo
- **README.md** - Project overview

### Detailed Guides
- **docs/README_DEMO.md** - Complete demo guide
- **docs/CREDENTIALS_TEMPLATE.md** - Security setup
- **docs/SUBMISSION_REPORT.md** - Requirements report

### Technical
- **REFACTOR_COMPLETE.md** - Migration guide
- **CHANGELOG.md** - Version history
- **INTEGRATION_STATUS.md** - Integration details

## 🚀 Getting Started

### 1. Quick Demo (60 seconds)
```bash
cd FlowASM
npm install
npm run demo
```

### 2. Web UI
```bash
npm start
# Open http://localhost:3000
```

### 3. Configure Connectors
```bash
# See docs/CREDENTIALS_TEMPLATE.md
export TK5_ENDPOINT=http://localhost:8038
export ZOS_ENDPOINT=https://zos.example.com
export ZOS_USERNAME=user
export ZOS_PASSWORD=pass
npm start
```

### 4. Build Workflows
- Load demo workflows in UI
- Edit node configurations
- Run and test
- Export as JSON

## 🏆 Success Criteria

- ✅ **Node.js only** - No Python dependencies
- ✅ **Working sandbox demo** - No external setup
- ✅ **Visual workflow builder** - n8n-style UI
- ✅ **Multiple systems integrated** - 4 connectors
- ✅ **Clear stub marking** - Deterministic fallback
- ✅ **Integration documentation** - Complete guides
- ✅ **Lightweight** - Single dependency
- ✅ **Stand-alone** - Unified project
- ✅ **No credentials** - Environment variables
- ✅ **Deterministic outputs** - Predictable stubs

## 🎯 Use Cases

### 1. Development & Testing
- Use sandbox mode for development
- Test workflows without mainframe access
- Deterministic outputs for CI/CD

### 2. Mainframe Automation
- Automate assembly compilation
- Submit batch jobs
- Monitor job status
- Fetch SMF records

### 3. 3270 Automation
- Automate terminal interactions
- Screen scraping
- Form filling
- Navigation automation

### 4. Integration Testing
- Test mainframe integrations
- Validate workflows
- Monitor execution
- Debug issues

## 📞 Support

**Demo not working?**
1. Check Node.js version: `node --version` (need 18+)
2. Reinstall: `npm install`
3. Run demo: `npm run demo`

**Connector stubbed?**
1. Check environment variables
2. Verify endpoint availability
3. See docs/CREDENTIALS_TEMPLATE.md

**Need help?**
- See documentation in `docs/` folder
- Check QUICK_START.md
- Review REFACTOR_COMPLETE.md

## 🎉 Conclusion

FlowASM successfully demonstrates the Kiroween 2024 theme by combining IPLLab, ZeroFrame, TK5, and z/OS into a unified n8n-style workflow platform. The system is production-ready for demos, fully documented, and can be extended to real mainframe operations with simple configuration.

---

**Project:** FlowASM  
**Version:** 2.0.0  
**Theme:** Combining separate systems into a unified whole  
**Status:** ✅ Complete and ready for demo  
**Date:** December 3, 2024  
**Kiroween 2024** 🎃

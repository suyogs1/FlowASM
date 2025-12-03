# FlowASM Demo Guide

## 🚀 Quick Start (60-90 seconds)

### Prerequisites
- Node.js 18+ installed
- No other dependencies needed!

### Installation & Demo

```bash
# Navigate to FlowASM
cd FlowASM

# Install dependencies (express only)
npm install

# Start the server
npm start
```

Server starts at http://localhost:3000

### 60-Second Demo Script

**1. Open Browser (5 seconds)**
- Navigate to http://localhost:3000
- See the FlowASM visual interface

**2. Load Payroll Demo (10 seconds)**
- Click "Payroll Processing (Sandbox)" in the sidebar
- See 5 nodes appear on canvas:
  - compile_payroll (asm.compile)
  - execute_payroll (asm.run)
  - verify_result (asm.debug)
  - submit_jcl (zeroframe.send)
  - verify_completion (zeroframe.wait)

**3. Run Workflow (30 seconds)**
- Click "▶️ Run Workflow" button
- Watch nodes execute in sequence
- See execution log populate with results
- Nodes turn green (✓) on success

**4. Inspect Results (15 seconds)**
- Click any node to see details in inspector
- Check execution log for:
  - Compilation output
  - Register values (R0=1250)
  - 3270 terminal interactions
  - Stubbed connector warnings

**Total: ~60 seconds for complete demo**

## 📊 What You'll See

### Sandbox Demo (No External Dependencies)
- ✅ **asm.compile** - Compiles assembly code (real engine)
- ✅ **asm.run** - Executes bytecode (real engine)
- ✅ **asm.debug** - Debug session (real engine)
- ⚠️ **zeroframe.send** - 3270 send (stubbed)
- ⚠️ **zeroframe.wait** - 3270 wait (stubbed)

All nodes execute successfully. Stubbed connectors are clearly marked.

## 🎨 Assembler Editor Demo

**New Feature:** Integrated code editor for assembly programming

### Quick Editor Demo (30 seconds)

```bash
npm start
# Open http://localhost:3000
```

**Steps:**
1. Click "ASM Editor" tab in right sidebar
2. Select "Simple Calculator" from template dropdown
3. Click "✓ Validate" (shows "Valid assembly code (5 instructions)")
4. Click "➕ Create Assemble Node"
5. Node appears on canvas with code attached
6. Click "▶️ Run" to execute
7. Select node to view compiled artifacts (bytecode, instruction count)

**What you'll see:**
- Monaco editor (VS Code engine) with assembly code
- Real-time validation using asm-sandbox
- Node created with sourceCode in config
- Execution artifacts: bytecode, instructions, labels

**Key Features:**
- Write/edit assembly code in professional editor
- Load templates (Hello World, Calculator)
- Upload/download .asm files (200KB limit)
- Validate code before execution
- Create nodes directly from editor
- Load code from existing nodes
- View compiled artifacts after execution

**Documentation:** See `docs/ASSEMBLER_EDITOR_GUIDE.md` for complete guide

## 🔧 Advanced Demos

### TK5 Demo (Requires TK5/Hercules)

**Setup:**
```bash
# Set TK5 endpoint
export TK5_ENDPOINT=http://localhost:8038

# Start FlowASM
npm start
```

**Run:**
1. Load "TK5 Emulator Demo" workflow
2. Click "▶️ Run Workflow"
3. See real TK5 integration:
   - IPL system
   - Submit JCL job
   - Check job status

### z/OS Demo (Requires Credentials)

**Setup:**
```bash
# Configure z/OS credentials (see CREDENTIALS_TEMPLATE.md)
export ZOS_ENDPOINT=https://your-zos-system.com
export ZOS_USERNAME=your_username
export ZOS_PASSWORD=your_password

# Start FlowASM
npm start
```

**Run:**
1. Load "z/OS Integration Example" workflow
2. Click "▶️ Run Workflow"
3. See real z/OS operations:
   - Submit JCL to real mainframe
   - Fetch SMF records
   - Read datasets

## 🎨 Building Custom Workflows

### Using the UI

1. **Clear Canvas**
   - Click "🗑️ Clear" to start fresh

2. **Drag Nodes** (Future: drag-and-drop)
   - Currently: Import JSON or modify existing workflows

3. **Edit Node Config**
   - Click any node
   - Edit configuration in inspector panel
   - Modify description, config JSON

4. **Run & Test**
   - Click "▶️ Run Workflow"
   - Watch execution in real-time
   - Check logs for details

5. **Export**
   - Click "💾 Export" to save as JSON
   - Share with team or version control

### Template Variables

Pass data between nodes:

```json
{
  "id": "step2",
  "type": "asm.run",
  "config": {
    "bytecode": "{{node.step1.artifacts.bytecode}}"
  }
}
```

Syntax: `{{node.<node_id>.artifacts.<field>}}`

## 📁 Project Structure

```
FlowASM/
├── core/
│   ├── runner.js          ← Workflow orchestrator
│   ├── flow-engine.js     ← Execution engine
│   └── api.js             ← REST API routes
├── engines/
│   └── asm-sandbox/
│       ├── adapter.js     ← Connector adapter
│       └── engine.js      ← ASM engine (IPLLab port)
├── connectors/
│   ├── tk5/
│   │   └── connector.js   ← TK5/Hercules connector
│   ├── zos/
│   │   └── connector.js   ← z/OS connector
│   └── zeroframe/
│       └── connector.js   ← 3270 terminal connector
├── workflows/
│   ├── payroll-demo.json
│   ├── tk5-demo.json
│   └── zos-integration.json
├── ui/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── docs/
│   ├── README_DEMO.md     ← This file
│   └── CREDENTIALS_TEMPLATE.md
├── server.js              ← Main entry point
└── package.json
```

## 🔌 Connector Status

Check connector availability:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "UP",
  "service": "FlowASM",
  "connectors": {
    "asm": "UP",
    "tk5": "STUBBED",
    "zos": "STUBBED",
    "zeroframe": "STUBBED"
  }
}
```

## 🎯 Demo Scenarios

### Scenario 1: Pure Sandbox (No Setup)
**Time:** 60 seconds  
**Requirements:** None  
**Workflow:** payroll-demo.json  
**Result:** Complete execution with stubbed connectors

### Scenario 2: TK5 Integration
**Time:** 90 seconds  
**Requirements:** TK5/Hercules running  
**Workflow:** tk5-demo.json  
**Result:** Real mainframe operations

### Scenario 3: z/OS Integration
**Time:** 90 seconds  
**Requirements:** z/OS credentials  
**Workflow:** zos-integration.json  
**Result:** Real z/OS job submission

## 🐛 Troubleshooting

**Port 3000 in use:**
```bash
PORT=3001 npm start
```

**Workflow not loading:**
- Check `workflows/*.json` files exist
- Verify JSON syntax

**Connector stubbed:**
- Check environment variables
- Verify endpoint availability
- See CREDENTIALS_TEMPLATE.md

**Node execution fails:**
- Click node to see error in inspector
- Check execution log for details
- Verify config JSON syntax

## 📊 API Reference

### GET /api/health
Health check and connector status

### GET /api/workflows
List all workflows

### GET /api/workflows/:id
Get workflow definition

### POST /api/workflows/execute
Execute workflow

**Request:**
```json
{
  "id": "my-workflow",
  "name": "My Workflow",
  "nodes": [...]
}
```

**Response:**
```json
{
  "workflowId": "my-workflow",
  "status": "SUCCESS",
  "duration": 1234,
  "nodes": [...]
}
```

## 🎃 Kiroween 2024

**Theme:** Combining separate systems into a unified whole

FlowASM demonstrates this by:
1. Unifying IPLLab (assembly engine) + ZeroFrame (3270) + TK5 + z/OS
2. Creating n8n-style visual workflow platform
3. Node.js only - no Python dependencies
4. Sandboxed demo with real connector options

## 🚀 Next Steps

1. **Try the demo** - Run payroll-demo.json
2. **Explore workflows** - Load and inspect each demo
3. **Edit nodes** - Modify configs and re-run
4. **Connect real systems** - Configure TK5 or z/OS
5. **Build custom workflows** - Create your own automation

---

**Built with Node.js only** - No Python, pure npm! 🎃

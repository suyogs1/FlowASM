# FlowASM

**Unified n8n-style Mainframe Workflow Platform**

FlowASM combines IPLLab (assembly engine), ZeroFrame (3270 automation), TK5/Hercules, and z/OS into a single visual workflow platform with drag-and-drop capabilities.

## ✨ Features

- 🎨 **Visual Workflow Builder** - n8n-style drag-and-drop interface
- 🔧 **Sandboxed ASM Engine** - Built-in IPLLab engine for deterministic demos
- 🔌 **Multiple Connectors** - TK5, z/OS, 3270 terminal automation
- 📊 **Live Execution** - Watch workflows run with real-time logs
- 💾 **Import/Export** - Save and share workflows as JSON
- 🔄 **Template Variables** - Pass data between nodes
- 🚀 **Node.js Only** - No Python, pure npm

## 🚀 Quick Start

```bash
cd FlowASM
npm install
npm start
```

Open http://localhost:3000 and start building workflows!

Or run the CLI demo:

```bash
npm run demo
```

## 📖 What is FlowASM?

FlowASM is a visual workflow platform that chains mainframe operations:

```
Assemble Code → Execute → Submit JCL → Verify 3270 → Output
```

### Key Capabilities

1. **Sandboxed Execution** - Run assembly code locally without external dependencies
2. **TK5 Integration** - Connect to TK5/Hercules emulator for real mainframe ops
3. **z/OS Integration** - Submit jobs to real z/OS systems (secure credentials)
4. **3270 Automation** - Automate terminal interactions
5. **Visual Builder** - Create workflows with drag-and-drop UI

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              FlowASM Core Engine                │
│         (n8n-style orchestrator)                │
└──────────┬──────────────────────────────────────┘
           │
    ┌──────┴──────┬──────────┬──────────┐
    │             │          │          │
┌───▼────┐   ┌───▼────┐ ┌───▼────┐ ┌───▼────┐
│  ASM   │   │  TK5   │ │  z/OS  │ │3270/ZF │
│Sandbox │   │Connector│ │Connector│ │Connector│
└────────┘   └────────┘ └────────┘ └────────┘
```

## 📁 Project Structure

```
FlowASM/
├── core/
│   ├── runner.js          ← Workflow orchestrator
│   ├── flow-engine.js     ← Execution engine
│   └── api.js             ← REST API
├── engines/
│   └── asm-sandbox/
│       ├── adapter.js     ← Connector adapter
│       └── engine.js      ← ASM engine (IPLLab port)
├── connectors/
│   ├── tk5/               ← TK5/Hercules connector
│   ├── zos/               ← z/OS connector
│   └── zeroframe/         ← 3270 terminal connector
├── workflows/
│   ├── payroll-demo.json  ← Sandbox demo
│   ├── tk5-demo.json      ← TK5 demo
│   └── zos-integration.json ← z/OS demo
├── ui/
│   ├── index.html         ← Web interface
│   ├── app.js             ← UI logic
│   └── styles.css         ← Styling
├── docs/
│   ├── README_DEMO.md     ← Demo guide
│   └── CREDENTIALS_TEMPLATE.md ← Security guide
├── server.js              ← Main entry point
├── cli-demo.js            ← CLI demo runner
└── package.json
```

## 🎯 Demo Workflows

### 1. Payroll Processing (Sandbox)
**No setup required** - Runs entirely in asm-sandbox

- Compile payroll assembly code
- Execute calculation (1000 + 250 = 1250)
- Debug and verify result
- Submit JCL via 3270 (stubbed)
- Wait for completion (stubbed)

```bash
npm run demo
```

### 2. TK5 Emulator Demo
**Requires:** TK5/Hercules running on localhost:8038

- Compile assembly code
- IPL TK5 system
- Submit job to TK5
- Check job status

```bash
export TK5_ENDPOINT=http://localhost:8038
npm start
# Load "TK5 Emulator Demo" in UI
```

### 3. z/OS Integration
**Requires:** z/OS credentials (see docs/CREDENTIALS_TEMPLATE.md)

- Compile program
- Submit job to real z/OS
- Fetch SMF records
- Read output dataset

```bash
export ZOS_ENDPOINT=https://your-zos.com
export ZOS_USERNAME=user
export ZOS_PASSWORD=pass
npm start
# Load "z/OS Integration Example" in UI
```

## 🔧 Node Types

### ASM Sandbox Nodes

**asm.compile**
- Compiles assembly source code
- Returns: bytecode, instructions, labels

**asm.run**
- Executes compiled bytecode
- Returns: registers, output, exitCode

**asm.debug**
- Debug session with breakpoints
- Returns: breakpointsHit, stepsExecuted, finalState

### TK5 Nodes

**tk5.ipl**
- IPL (boot) TK5 system
- Config: `{ volume: "SYSRES" }`

**tk5.submit**
- Submit JCL job to TK5
- Config: `{ jobName, jcl }`

**tk5.status**
- Get job status
- Config: `{ jobId }`

### z/OS Nodes

**zos.submit**
- Submit JCL to real z/OS
- Config: `{ jcl }`

**zos.smf**
- Fetch SMF records
- Config: `{ dataset }`

**zos.dataset**
- Read dataset content
- Config: `{ dataset }`

### 3270 Terminal Nodes

**zeroframe.send**
- Send action to 3270 terminal
- Config: `{ action, text }`

**zeroframe.read**
- Read screen content
- Config: `{}`

**zeroframe.wait**
- Wait for expected text
- Config: `{ expectedText, timeout }`

## 🔄 Template Variables

Pass data between nodes:

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

## 📊 API Reference

### GET /api/health
Health check and connector status

### GET /api/workflows
List all workflows

### GET /api/workflows/:id
Get workflow definition

### POST /api/workflows/execute
Execute a workflow

## 🔒 Security

**NEVER commit credentials!**

All sensitive configuration via environment variables:

```bash
export TK5_ENDPOINT=http://localhost:8038
export ZOS_ENDPOINT=https://zos.example.com
export ZOS_USERNAME=user
export ZOS_PASSWORD=pass
export ZEROFRAME_ENDPOINT=http://localhost:3270
```

See `docs/CREDENTIALS_TEMPLATE.md` for details.

## 🔌 Connector Status

Connectors automatically fallback to stubbed mode when unavailable:

- **asm-sandbox**: Always available (built-in)
- **tk5**: Stubbed if TK5_ENDPOINT not set
- **zos**: Stubbed if credentials not configured
- **zeroframe**: Stubbed if ZEROFRAME_ENDPOINT not set

Stubbed connectors return deterministic responses marked with `stubbed: true`.

## 🎨 Building Workflows

### Via UI

1. Open http://localhost:3000
2. Select workflow from sidebar
3. Click nodes to edit configuration
4. Click "▶️ Run Workflow"
5. Watch execution in real-time

### Via JSON

Create `workflows/my-workflow.json`:

```json
{
  "id": "my-workflow",
  "name": "My Custom Workflow",
  "nodes": [
    {
      "id": "step1",
      "type": "asm.compile",
      "description": "Compile code",
      "config": {
        "sourceCode": ".TEXT\nmain:\n  MOV R0, #42\n  HLT"
      }
    }
  ]
}
```

Execute via API:

```bash
curl -X POST http://localhost:3000/api/workflows/execute \
  -H "Content-Type: application/json" \
  -d @workflows/my-workflow.json
```

## 🐛 Troubleshooting

**Port 3000 in use:**
```bash
PORT=3001 npm start
```

**Connector stubbed:**
- Check environment variables
- Verify endpoint availability
- See docs/CREDENTIALS_TEMPLATE.md

**Workflow fails:**
- Check execution log in UI
- Verify JSON syntax
- Inspect node configuration

## 📦 Dependencies

- `express` - HTTP server (only dependency!)

## 🎃 Kiroween 2024

**Theme:** Combining separate systems into a unified whole

FlowASM demonstrates this by unifying:
- IPLLab (assembly engine)
- ZeroFrame (3270 automation)
- TK5/Hercules (emulator)
- z/OS (real mainframe)

Into a single n8n-style visual workflow platform.

## 📚 Documentation

- [Demo Guide](docs/README_DEMO.md) - 60-90 second demo script
- [Credentials Template](docs/CREDENTIALS_TEMPLATE.md) - Security configuration

## 🚀 Next Steps

1. **Try the demo** - `npm run demo`
2. **Explore UI** - `npm start` → http://localhost:3000
3. **Configure connectors** - See docs/CREDENTIALS_TEMPLATE.md
4. **Build workflows** - Create custom automation
5. **Integrate systems** - Connect TK5, z/OS, 3270

---

**Built with Node.js only** - No Python, pure npm! 🚀

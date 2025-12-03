# FlowASM Quick Start

## 🚀 60-Second Demo

```bash
# 1. Navigate to FlowASM
cd FlowASM

# 2. Install (if not already done)
npm install

# 3. Run demo
npm run demo
```

**Expected output:**
```
✅ Demo completed successfully!
Summary: 5/5 nodes succeeded
Total time: 2ms
```

## 🎨 Web UI Demo

```bash
# Start server
npm start

# Open browser
# http://localhost:3000
```

**Steps:**
1. Click "Payroll Processing (Sandbox)" in sidebar
2. See 5 nodes on canvas
3. Click "▶️ Run Workflow"
4. Watch nodes execute (turn green ✓)
5. Check execution log for details

## 🔧 Node Types

### ASM Sandbox (Always Available)
- **asm.compile** - Compile assembly code
- **asm.run** - Execute bytecode
- **asm.debug** - Debug with breakpoints

### TK5 (Requires TK5_ENDPOINT)
- **tk5.ipl** - IPL system
- **tk5.submit** - Submit JCL
- **tk5.status** - Check job status

### z/OS (Requires Credentials)
- **zos.submit** - Submit JCL
- **zos.smf** - Fetch SMF records
- **zos.dataset** - Read dataset

### 3270 Terminal (Requires ZEROFRAME_ENDPOINT)
- **zeroframe.send** - Send terminal action
- **zeroframe.read** - Read screen
- **zeroframe.wait** - Wait for text

## 🔌 Enable Real Connectors

### TK5/Hercules
```bash
export TK5_ENDPOINT=http://localhost:8038
npm start
```

### z/OS
```bash
export ZOS_ENDPOINT=https://zos.example.com
export ZOS_USERNAME=user
export ZOS_PASSWORD=pass
npm start
```

### ZeroFrame
```bash
export ZEROFRAME_ENDPOINT=http://localhost:3270
npm start
```

## 📊 Check Status

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "UP",
  "connectors": {
    "asm": "UP",
    "tk5": "STUBBED",
    "zos": "STUBBED",
    "zeroframe": "STUBBED"
  }
}
```

## 🎯 Demo Workflows

### 1. Payroll (Sandbox) - No Setup
- Compile assembly
- Execute calculation
- Debug verification
- Submit JCL (stubbed)
- Verify completion (stubbed)

### 2. TK5 Demo - Requires TK5
- Compile code
- IPL system
- Submit job
- Check status

### 3. z/OS Integration - Requires Credentials
- Compile program
- Submit to z/OS
- Fetch SMF
- Read dataset

## 📚 Documentation

- **README.md** - Full project overview
- **docs/README_DEMO.md** - Detailed demo guide
- **docs/CREDENTIALS_TEMPLATE.md** - Security setup
- **REFACTOR_COMPLETE.md** - What changed

## 🐛 Troubleshooting

**Port in use:**
```bash
PORT=3001 npm start
```

**Connector stubbed:**
- Check environment variables
- Verify endpoint availability
- See docs/CREDENTIALS_TEMPLATE.md

**Demo fails:**
```bash
# Reinstall
npm install

# Try again
npm run demo
```

## 🎃 Kiroween 2024

**Theme:** Combining separate systems into a unified whole

FlowASM unifies IPLLab, ZeroFrame, TK5, and z/OS into one platform.

---

**Need help?** See full documentation in `docs/` folder.

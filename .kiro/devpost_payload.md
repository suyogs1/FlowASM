# FlowASM - Devpost Submission

## Title
FlowASM: Visual Mainframe Workflow Automation Platform

## Tagline
Drag-and-drop mainframe automation: compile assembly, submit jobs, automate terminals—all in your browser.

## Short Description (150 chars)
Visual n8n-style workflow builder for mainframe automation. Combines assembly engines, 3270 terminals, and z/OS connectors in pure Node.js.

## Full Description

### What is FlowASM?

FlowASM brings mainframe development into the modern era with a visual, n8n-style workflow builder that runs entirely in Node.js. It unifies multiple mainframe systems—assembly compilation, job submission, terminal automation, and z/OS integration—into a single, intuitive drag-and-drop interface.

### The Problem

Mainframe automation traditionally requires:
- Multiple disconnected tools (assemblers, job schedulers, terminal emulators)
- Complex scripting and manual coordination
- Steep learning curve for new developers
- No visual representation of workflows
- Difficult to test without access to real mainframes

### Our Solution

FlowASM provides:
- **Visual Workflow Builder**: Drag-and-drop nodes to create automation workflows
- **Integrated Code Editor**: Monaco editor (VS Code engine) for writing assembly code
- **Sandboxed Execution**: Built-in assembly engine for instant testing
- **Real-time Monitoring**: Live execution status and detailed logs
- **Multiple Connectors**: Support for TK5/Hercules, z/OS, and 3270 terminals
- **Template System**: Quick-start programs and examples
- **100% Node.js**: No Python dependencies, easy deployment

### Kiroween Theme: "Combining Separate Systems"

FlowASM perfectly embodies the Kiroween theme by unifying:
1. **IPLLab** (TypeScript assembly engine) → Node.js adapter
2. **ZeroFrame** (React 3270 automation) → Node.js connector
3. **TK5/Hercules** (C emulator) → REST connector
4. **z/OS** (Mainframe) → Secure REST connector

All integrated into one cohesive platform with a single UI, one workflow format, and one execution engine.

## Features

### Core Features
- ✅ **Visual Workflow Builder** - n8n-style drag-and-drop interface
- ✅ **12 Node Types** - Assembly, JCL, 3270, and z/OS operations
- ✅ **Monaco Code Editor** - Professional assembly code editing
- ✅ **Real-time Execution** - Live status updates and streaming logs
- ✅ **Sandboxed Engine** - Built-in assembly compiler and executor
- ✅ **Connection Lines** - Visual data flow with arrowheads
- ✅ **Auto-Layout** - Automatic node arrangement
- ✅ **Template System** - Sample programs for quick start
- ✅ **File Operations** - Upload/download .asm files
- ✅ **Code Validation** - Real-time syntax checking
- ✅ **Artifact Display** - View compiled bytecode and results
- ✅ **Keyboard Support** - Arrow keys, shortcuts, accessibility

### Node Types (12)
**ASM Sandbox:**
- compile - Compile assembly code
- run - Execute bytecode
- debug - Debug with breakpoints

**TK5 Emulator:**
- ipl - Boot system
- submit - Submit JCL job
- status - Check job status

**z/OS:**
- submit - Submit JCL to z/OS
- smf - Fetch SMF records
- dataset - Read dataset

**3270 Terminal:**
- send - Send terminal action
- read - Read screen
- wait - Wait for text

### Technical Highlights
- **Pure Node.js** - No Python, single dependency (Express)
- **Monaco Editor** - Same editor as VS Code
- **SVG Rendering** - Scalable connection lines
- **Responsive Design** - Works on desktop, tablet, mobile
- **Security** - No credentials in repo, environment variables only
- **Lightweight** - ~2,500 lines of code, fast startup

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express** - HTTP server and API

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Monaco Editor** - Code editing (CDN)
- **HTML5** - Semantic structure
- **CSS3** - Modern styling (Flexbox, Grid, Animations)
- **SVG** - Connection lines and graphics

### Architecture
- **Microkernel Pattern** - Pluggable connectors
- **Event-Driven** - Reactive UI updates
- **REST API** - Clean separation of concerns
- **State Management** - Centralized application state

## Demo Steps (60 seconds)

### Setup (5 seconds)
```bash
cd FlowASM
npm install
npm start
# Open http://localhost:3000
```

### Visual Workflow (20 seconds)
1. **Drag nodes** from palette to canvas (ASM Compile, ASM Run)
2. **Connect nodes** by dragging from output port to input port
3. **Configure** nodes by clicking and editing in inspector
4. **Auto-arrange** with Auto-Layout button

### Code Editor (15 seconds)
5. **Open ASM Editor** tab in right sidebar
6. **Load template** (Simple Calculator) from dropdown
7. **Validate code** - shows "Valid assembly code (5 instructions)"
8. **Create node** - Click "Create Assemble Node"

### Execution (20 seconds)
9. **Run workflow** - Click Run button in toolbar
10. **Watch execution** - Nodes turn green, logs stream
11. **View artifacts** - Select node to see bytecode, instruction count
12. **Check logs** - Execution panel shows detailed results

**Total: ~60 seconds for complete demo**

## What We Built

### ✅ Fully Implemented
- **Visual workflow builder** with drag-and-drop
- **Monaco code editor** with syntax highlighting
- **Sandboxed assembly engine** (real compiler/executor)
- **12 node types** across 4 connectors
- **Real-time execution** with live status
- **Connection drawing** with SVG bezier curves
- **File upload/download** with size limits
- **Code validation** using sandbox
- **Artifact display** in inspector
- **Comprehensive documentation** (10,000+ words)

### ⚠️ Stubbed (Marked in Output)
- **TK5 connector** - Returns mock data if TK5 not available
- **z/OS connector** - Returns mock data if credentials not configured
- **ZeroFrame connector** - Returns mock data if endpoint not configured

All stubs are clearly marked with `"stubbed": true` in execution results and show warnings in logs.

### 🚀 Next Steps
- Add more node types (COBOL, REXX, DB2)
- Implement real-time collaboration
- Add workflow scheduling
- Create marketplace for workflow templates
- Mobile app for monitoring

## Installation & Usage

### Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/FlowASM
cd FlowASM

# Install dependencies
npm install

# Run CLI demo
npm run demo

# Start web server
npm start

# Open browser
http://localhost:3000
```

### Enable Real Connectors
```bash
# TK5/Hercules
export TK5_ENDPOINT=http://localhost:8038

# z/OS
export ZOS_ENDPOINT=https://zos.example.com
export ZOS_USERNAME=user
export ZOS_PASSWORD=pass

# ZeroFrame
export ZEROFRAME_ENDPOINT=http://localhost:3270

# Restart server
npm start
```

## Challenges & Solutions

### Challenge 1: Unifying Different Technologies
**Problem:** IPLLab (TypeScript), ZeroFrame (React), TK5 (C), z/OS (Mainframe)  
**Solution:** Created uniform connector interface with standard execute endpoint

### Challenge 2: No Python Allowed
**Problem:** Many mainframe tools use Python  
**Solution:** Built pure Node.js adapters and ported assembly engine to JavaScript

### Challenge 3: Testing Without Real Mainframe
**Problem:** Not everyone has access to z/OS or TK5  
**Solution:** Built sandboxed assembly engine with deterministic stubs for other connectors

### Challenge 4: Complex UI Without Framework
**Problem:** Rich visual editor without React/Vue  
**Solution:** Vanilla JavaScript with efficient DOM manipulation and SVG rendering

## Accomplishments

- ✅ **2,500+ lines** of production-ready code
- ✅ **Zero Python** dependencies (100% Node.js)
- ✅ **Professional UI** with Monaco Editor
- ✅ **Real assembly engine** (not stubbed)
- ✅ **Complete documentation** (10,000+ words)
- ✅ **60-second demo** that works immediately
- ✅ **Responsive design** for all devices
- ✅ **Security-first** approach (no credentials in repo)

## What We Learned

- **Microkernel architecture** enables easy extension
- **Vanilla JavaScript** can compete with frameworks for performance
- **SVG** is perfect for dynamic connection lines
- **Monaco Editor** integration is straightforward via CDN
- **Stub pattern** allows development without external dependencies
- **Visual programming** makes complex workflows accessible

## Repository

**GitHub:** https://github.com/yourusername/FlowASM  
**License:** MIT  
**Documentation:** Complete guides in `docs/` folder

## Screenshots

1. **Visual Workflow Builder** - Drag-and-drop interface with connection lines
2. **Code Editor** - Monaco editor with assembly syntax
3. **Live Execution** - Real-time status updates and logs
4. **Artifact Display** - Compiled bytecode and results

## Video Demo

[Link to demo video - 60 seconds]

## Try It Now

```bash
git clone https://github.com/yourusername/FlowASM
cd FlowASM
npm install && npm start
# Open http://localhost:3000
```

---

**Made for Kiroween 2024** 🎃  
**Theme:** Combining separate systems into a unified whole

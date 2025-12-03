# FlowASM Assembler Editor Guide

## 🎨 Overview

The FlowASM Assembler Editor provides an integrated code editing experience for writing, validating, and managing assembly code within your workflows. Built with Monaco Editor (the same editor powering VS Code), it offers syntax highlighting, line numbers, and seamless integration with workflow nodes.

## 🚀 Quick Start

### Opening the Editor

1. **Start FlowASM:**
   ```bash
   cd FlowASM
   npm start
   # Open http://localhost:3000
   ```

2. **Access the Editor:**
   - Look at the right sidebar
   - Click the "ASM Editor" tab
   - The Monaco editor will load with a sample program

### Creating Your First Assemble Node

1. **Write Code:**
   - Type or paste assembly code in the editor
   - Or select a template from the dropdown

2. **Create Node:**
   - Click "➕ Create Assemble Node"
   - A new `asm.compile` node appears on canvas
   - The node contains your code

3. **Run Workflow:**
   - Click "▶️ Run" in the toolbar
   - Watch the node execute
   - View compiled artifacts in the inspector

## 📐 Editor Interface

### Layout

```
┌─────────────────────────────────────────┐
│ [Node Inspector] [ASM Editor] ← Tabs   │
├─────────────────────────────────────────┤
│ Attached to: node_123  [Load Template▼]│
├─────────────────────────────────────────┤
│                                         │
│  Monaco Editor                          │
│  (Code editing area)                    │
│                                         │
├─────────────────────────────────────────┤
│ [✓ Validate] [📂 Upload] [💾 Download] │
│ [➕ Create Assemble Node]               │
│ [📥 Load Node Code] [💾 Save to Node]  │
└─────────────────────────────────────────┘
```

### Editor Features

- **Syntax Highlighting** - Assembly code highlighting
- **Line Numbers** - Easy navigation
- **Auto-indent** - Smart indentation
- **Undo/Redo** - Full history (Ctrl+Z / Ctrl+Y)
- **Word Wrap** - Long lines wrap automatically
- **Dark Theme** - Matches FlowASM UI
- **Font Size** - 14px monospace font

## 🎯 Key Features

### 1. Template Dropdown

**Location:** Top-right of editor panel

**Available Templates:**
- **Hello World** - Simple program with basic operations
- **Simple Calculator** - Adds two numbers

**How to Use:**
1. Click the "Load Template..." dropdown
2. Select a template
3. Code loads into editor
4. Modify as needed

**Templates:**

**Hello World:**
```assembly
.TEXT
; Hello World Program
main:
  MOV R0, #42
  MOV R1, #8
  ADD R0, R0, R1
  HLT
```

**Simple Calculator:**
```assembly
.TEXT
; Simple Calculator
; Adds two numbers and stores result
main:
  MOV R0, #1000    ; First number
  MOV R1, #250     ; Second number
  ADD R0, R0, R1   ; R0 = R0 + R1
  MOV R2, R0       ; Store result in R2
  HLT
```

### 2. Code Validation

**Button:** ✓ Validate

**What it does:**
- Sends code to asm-sandbox for compilation
- Checks for syntax errors
- Reports instruction count
- Shows validation result below buttons

**How to Use:**
1. Write or paste code in editor
2. Click "✓ Validate"
3. Wait for result (1-2 seconds)
4. See success or error message

**Results:**
- ✓ **Success:** "Valid assembly code (X instructions)"
- ✗ **Error:** Shows specific error message
- **Auto-dismiss:** Result disappears after 5 seconds

### 3. File Upload

**Button:** 📂 Upload

**Supported Formats:**
- `.asm` - Assembly source files
- `.s` - Alternative assembly extension
- `.txt` - Plain text files

**File Size Limit:** 200KB maximum

**How to Use:**
1. Click "📂 Upload"
2. Select file from your computer
3. Code loads into editor
4. File name and size shown in log

**Error Handling:**
- Files over 200KB are rejected
- Invalid files show error message
- Log shows upload status

### 4. File Download

**Button:** 💾 Download

**Output:** `program.asm` file

**How to Use:**
1. Write code in editor
2. Click "💾 Download"
3. File downloads to your browser's download folder
4. Default name: `program.asm`

### 5. Create Assemble Node

**Button:** ➕ Create Assemble Node

**What it does:**
- Creates new `asm.compile` node on canvas
- Attaches current editor code to node
- Positions node automatically
- Switches to inspector tab
- Selects the new node

**How to Use:**
1. Write code in editor
2. Click "➕ Create Assemble Node"
3. Node appears on canvas
4. Editor shows "Attached to: [node_id]"
5. Node is ready to execute

**Node Properties:**
- **Type:** `asm.compile`
- **Description:** "Assembly from editor"
- **Config:** `{ sourceCode: "..." }`

### 6. Load Node Code

**Button:** 📥 Load Node Code

**Enabled When:** An `asm.compile` node is selected

**What it does:**
- Loads code from selected node into editor
- Attaches editor to that node
- Switches to editor tab
- Shows attachment status

**How to Use:**
1. Select an `asm.compile` node on canvas
2. Click "ASM Editor" tab
3. Click "📥 Load Node Code"
4. Code appears in editor
5. Editor shows "Attached to: [node_id]"

### 7. Save to Node

**Button:** 💾 Save to Node

**Enabled When:** Editor is attached to a node

**What it does:**
- Saves current editor code to attached node
- Updates node configuration
- Updates node description with line count
- Shows success message

**How to Use:**
1. Edit code in editor (must be attached to node)
2. Click "💾 Save to Node"
3. Code saves to node
4. Success message appears
5. Node updates on canvas

## 🔄 Workflow Integration

### Creating Workflows with Editor

**Method 1: Editor-First**
1. Write code in editor
2. Click "Create Assemble Node"
3. Add more nodes from palette
4. Connect nodes
5. Run workflow

**Method 2: Node-First**
1. Drag `asm.compile` node to canvas
2. Select the node
3. Click "Load Node Code"
4. Edit code in editor
5. Click "Save to Node"
6. Run workflow

### Execution Flow

```
Editor Code
    ↓
Create/Save to Node
    ↓
Node Config (sourceCode)
    ↓
Run Workflow
    ↓
POST /api/workflows/execute
    ↓
asm-sandbox Connector
    ↓
Compile Assembly
    ↓
Return Artifacts
    ↓
Display in Inspector
```

### Viewing Artifacts

After execution, select the assemble node to see:

**Artifacts Section in Inspector:**
```json
{
  "bytecode": "1,42,255",
  "instructions": 3,
  "labels": {
    "main": 0
  }
}
```

**Artifact Fields:**
- **bytecode** - Compiled instruction codes
- **instructions** - Number of instructions
- **labels** - Label addresses

## 💡 Usage Examples

### Example 1: Simple Program

**Goal:** Create a program that adds two numbers

**Steps:**
1. Open ASM Editor tab
2. Write code:
   ```assembly
   .TEXT
   main:
     MOV R0, #100
     MOV R1, #50
     ADD R0, R0, R1
     HLT
   ```
3. Click "✓ Validate" (should show 4 instructions)
4. Click "➕ Create Assemble Node"
5. Click "▶️ Run" in toolbar
6. Select node to see artifacts

**Expected Result:**
- Node turns green (success)
- Inspector shows: `"instructions": 4`
- Logs show: "Compiled 4 instructions"

### Example 2: Load and Modify

**Goal:** Load demo workflow and modify assembly code

**Steps:**
1. Load "Payroll Processing (Sandbox)" workflow
2. Select the `compile_payroll` node
3. Click "ASM Editor" tab
4. Click "📥 Load Node Code"
5. Modify the code (change numbers)
6. Click "💾 Save to Node"
7. Click "▶️ Run"
8. View updated results

### Example 3: Upload External File

**Goal:** Import assembly code from file

**Steps:**
1. Have a `.asm` file ready (under 200KB)
2. Click "ASM Editor" tab
3. Click "📂 Upload"
4. Select your file
5. Code loads into editor
6. Click "✓ Validate" to check
7. Click "➕ Create Assemble Node"
8. Run workflow

## 🔧 Advanced Features

### Editor Attachment System

**Attachment States:**
- **Not Attached:** "No node attached" (gray)
- **Attached:** "Attached to: node_123" (green)

**Attachment Rules:**
- Creating node attaches editor to it
- Loading node code attaches editor to it
- Only one node attached at a time
- Attachment persists until changed

**Button States:**
- **Load Node Code:** Enabled when `asm.compile` node selected
- **Save to Node:** Enabled when editor attached to node

### Code Persistence

**In Workflow JSON:**
```json
{
  "nodes": [
    {
      "id": "asm_1",
      "type": "asm.compile",
      "config": {
        "sourceCode": ".TEXT\nmain:\n  MOV R0, #42\n  HLT"
      }
    }
  ]
}
```

**Export/Import:**
- Code saved in workflow JSON
- Export workflow includes all code
- Import workflow restores code
- Load node code to view/edit

### Validation Details

**Client-Side:**
- Basic checks (empty code)
- File size validation
- JSON format validation

**Server-Side (Sandbox):**
- Full assembly compilation
- Syntax error detection
- Instruction counting
- Label resolution

**Validation Response:**
- Success: Instruction count
- Failure: Error message with details
- Timeout: Network error message

## 🎨 UI Indicators

### Editor Status

| Indicator | Meaning |
|-----------|---------|
| "No node attached" (gray) | Editor not linked to any node |
| "Attached to: node_X" (green) | Editor linked to specific node |
| Validation success (green) | Code compiled successfully |
| Validation error (red) | Compilation failed |

### Button States

| Button | Enabled When |
|--------|--------------|
| ✓ Validate | Always |
| 📂 Upload | Always |
| 💾 Download | Always |
| ➕ Create Node | Always |
| 📥 Load Node Code | `asm.compile` node selected |
| 💾 Save to Node | Editor attached to node |

## 🐛 Troubleshooting

### Editor Not Loading

**Problem:** Monaco editor shows error or blank

**Solutions:**
1. Check internet connection (CDN required)
2. Refresh the page
3. Clear browser cache
4. Check browser console for errors

### Validation Fails

**Problem:** "Validation error" message

**Solutions:**
1. Check assembly syntax
2. Ensure `.TEXT` section exists
3. Verify instruction format
4. Check for typos in mnemonics
5. Review error message details

### Upload Fails

**Problem:** "File too large" error

**Solutions:**
1. Check file size (must be < 200KB)
2. Remove unnecessary comments
3. Split into multiple files
4. Compress whitespace

### Save to Node Disabled

**Problem:** "Save to Node" button grayed out

**Solutions:**
1. Create node from editor first
2. Or load code from existing node
3. Check "Attached to:" shows node ID
4. Verify node still exists on canvas

### Artifacts Not Showing

**Problem:** No artifacts in inspector after execution

**Solutions:**
1. Ensure workflow executed successfully
2. Check node turned green (success)
3. Select the assemble node
4. Look for "Execution Artifacts" section
5. Check execution logs for errors

## 📊 Keyboard Shortcuts

### Monaco Editor

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+F | Find |
| Ctrl+H | Replace |
| Ctrl+/ | Toggle comment |
| Ctrl+] | Indent |
| Ctrl+[ | Outdent |
| Ctrl+A | Select all |
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Ctrl+X | Cut |

### FlowASM

| Shortcut | Action |
|----------|--------|
| Tab | Switch between tabs |
| Ctrl+S | (Suggest) Save to node |

## 🔒 Security & Limits

### File Size Limit

**Maximum:** 200KB per file

**Reason:** Prevent memory issues and ensure fast validation

**Enforcement:** Client-side check before upload

### Code Execution

**Sandbox:** All validation runs in asm-sandbox

**Isolation:** No access to file system or network

**Timeout:** Validation limited to reasonable time

### No Credentials

**Editor:** Never stores credentials

**Workflow:** Credentials in environment variables only

**Export:** No sensitive data in JSON

## 📚 Additional Resources

- **Main UI Guide:** `docs/README_UI.md`
- **Demo Guide:** `docs/README_DEMO.md`
- **API Reference:** See main README
- **Assembly Syntax:** Check IPLLab documentation

---

**Editor Version:** 2.0.0  
**Last Updated:** December 3, 2024  
**Kiroween 2024** 🎃

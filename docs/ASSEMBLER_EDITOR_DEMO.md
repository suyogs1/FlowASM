# Assembler Editor Demo Guide

## 🎬 Quick Demo (60 seconds)

### Setup
```bash
cd FlowASM
npm start
# Open http://localhost:3000
```

### Demo Steps

**1. Open Editor (5s)**
- Click "ASM Editor" tab in right sidebar
- Monaco editor loads with sample code

**2. Write/Load Code (10s)**
- Select "Simple Calculator" from template dropdown
- Code loads into editor
- Or type your own assembly code

**3. Validate Code (5s)**
- Click "✓ Validate" button
- Wait for result
- See "✓ Valid assembly code (5 instructions)"

**4. Create Node (10s)**
- Click "➕ Create Assemble Node"
- Node appears on canvas
- Editor shows "Attached to: asm_1"
- Node selected automatically

**5. Run Workflow (15s)**
- Click "▶️ Run" in toolbar
- Watch node turn green
- Execution log shows compilation
- See "Compiled 5 instructions"

**6. View Artifacts (15s)**
- Node Inspector shows execution artifacts
- See bytecode, instruction count, labels
- Artifacts in JSON format

**Total: ~60 seconds**

## 📸 Screenshot Guide

### Screenshot 1: Typing Code and Creating Node

**What to capture:**
- ASM Editor tab active
- Code visible in Monaco editor
- "Create Assemble Node" button highlighted
- Template dropdown visible

**Steps:**
1. Click "ASM Editor" tab
2. Load "Simple Calculator" template
3. Position cursor over "Create Assemble Node" button
4. **Capture screenshot**

**Expected elements:**
- Monaco editor with assembly code
- Template dropdown at top
- Action buttons at bottom
- "No node attached" status

**Filename:** `editor-demo-create-node.png`

### Screenshot 2: Node with Attached Code in Inspector

**What to capture:**
- Canvas with assemble node
- Node selected (orange border)
- Inspector showing configuration with sourceCode
- Editor tab showing "Attached to: node_id"

**Steps:**
1. After creating node from editor
2. Ensure node is selected
3. Click "Node Inspector" tab
4. Scroll to show configuration JSON
5. **Capture screenshot**

**Expected elements:**
- Node on canvas (selected)
- Inspector showing full config
- sourceCode field with assembly code
- Node type: "asm.compile"

**Filename:** `editor-demo-node-inspector.png`

### Screenshot 3: Execution with Artifacts

**What to capture:**
- Executed workflow with green node
- Inspector showing "Execution Artifacts" section
- Artifacts JSON with bytecode, instructions, labels
- Execution log with compilation messages

**Steps:**
1. Run workflow (node turns green)
2. Select the assemble node
3. Inspector shows artifacts section
4. Execution panel expanded
5. **Capture screenshot**

**Expected elements:**
- Green node with ✓ and SANDBOX badge
- Execution Artifacts section in inspector
- JSON with bytecode, instructions count
- Logs showing "Compiled X instructions"

**Filename:** `editor-demo-execution-artifacts.png`

## 🎥 Alternative: 10-Second GIF

**Timeline:**
- **0-2s:** Show ASM Editor tab, load template
- **2-4s:** Click "Create Assemble Node", node appears
- **4-6s:** Click Run button, node executes
- **6-8s:** Select node, show inspector with artifacts
- **8-10s:** Highlight bytecode and instruction count

**Filename:** `editor-demo-complete.gif`

## 📋 Acceptance Criteria

### ✅ Criterion 1: Create Node from Editor
**Evidence:** Screenshot showing code in editor and "Create Assemble Node" action

**Demonstrates:**
- Monaco editor with assembly code
- Template system working
- Create node button functional
- Editor UI integrated

### ✅ Criterion 2: Node with Attached Code
**Evidence:** Screenshot showing node on canvas with code in inspector

**Demonstrates:**
- Node created successfully
- Code attached to node config
- Inspector shows sourceCode field
- Node-editor integration working

### ✅ Criterion 3: Execution with Artifacts
**Evidence:** Screenshot showing executed node with artifacts in inspector

**Demonstrates:**
- Workflow execution successful
- Assembly code compiled
- Artifacts returned (bytecode, instructions, labels)
- Results visible in inspector
- Sandbox connector working

## 🎯 Full Demo Script

### Part 1: Editor Features (2 minutes)

**1. Open Editor**
- Navigate to http://localhost:3000
- Click "ASM Editor" tab
- Show Monaco editor interface

**2. Template System**
- Click template dropdown
- Select "Hello World"
- Code loads into editor
- Point out syntax highlighting

**3. File Operations**
- Click "📂 Upload" (show dialog)
- Click "💾 Download" (file downloads)
- Show file size limit (200KB)

**4. Validation**
- Click "✓ Validate"
- Show success message
- Modify code to break it
- Show error message

### Part 2: Node Integration (2 minutes)

**5. Create Node**
- Write simple code
- Click "➕ Create Assemble Node"
- Node appears on canvas
- Editor shows attachment

**6. Load Node Code**
- Select existing assemble node
- Click "📥 Load Node Code"
- Code loads into editor
- Show attachment status

**7. Save to Node**
- Modify code in editor
- Click "💾 Save to Node"
- Show success message
- Verify node updated

### Part 3: Execution (2 minutes)

**8. Build Workflow**
- Create assemble node
- Add run node from palette
- Connect them
- Configure run node with template variable

**9. Execute**
- Click "▶️ Run"
- Watch nodes execute
- Show live status updates
- Execution log streams

**10. View Artifacts**
- Select assemble node
- Show "Execution Artifacts" section
- Point out bytecode
- Point out instruction count
- Show labels if any

**Total: ~6 minutes for complete demo**

## 💡 Demo Tips

### Preparation
- Have FlowASM running before demo
- Clear canvas for clean start
- Prepare sample code if needed
- Test validation beforehand

### Presentation
- Explain each feature briefly
- Show both success and error cases
- Highlight integration points
- Emphasize Node.js-only implementation

### Common Issues
- **Editor not loading:** Refresh page
- **Validation slow:** Normal, uses sandbox
- **Node not attaching:** Check status indicator
- **Artifacts not showing:** Ensure execution succeeded

## 📝 Demo Checklist

Before demo:
- [ ] FlowASM server running
- [ ] Browser open to http://localhost:3000
- [ ] Screen recording tool ready (if making GIF)
- [ ] Sample code prepared
- [ ] Test validation works
- [ ] Test node creation works
- [ ] Test execution works

During demo:
- [ ] Show editor interface
- [ ] Demonstrate template loading
- [ ] Show validation (success and error)
- [ ] Create node from editor
- [ ] Show node-editor attachment
- [ ] Execute workflow
- [ ] Display artifacts in inspector

After demo:
- [ ] Capture screenshots
- [ ] Save GIF if recorded
- [ ] Document any issues
- [ ] Note improvements needed

---

**Demo Version:** 2.0.0  
**Kiroween 2024** 🎃

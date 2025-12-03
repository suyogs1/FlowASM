# FlowASM Visual Builder Guide

## 🎨 Overview

FlowASM now includes a full drag-and-drop visual workflow builder, similar to n8n, for creating mainframe automation workflows.

## ✨ Features

### 1. Drag-and-Drop Canvas
- **Visual Node Palette** - Drag nodes from the left sidebar onto the canvas
- **Free-form Positioning** - Place nodes anywhere on the canvas
- **Pan and Zoom** - Navigate large workflows easily
- **Grid Background** - Visual guides for alignment

### 2. Node Types

**IPLLab Nodes** (Assembly Engine):
- **Assemble** - Compile MicroZ assembly code
- **Execute** - Run compiled bytecode
- **Debug** - Debug assembly code with breakpoints

**ZeroFrame Nodes** (Microkernel):
- **Submit JCL** - Submit batch jobs to mainframe
- **3270 Action** - Automate 3270 terminal interactions
- **Job Status** - Check job execution status

### 3. Node Configuration
- **Click any node** to edit its properties in the right sidebar
- **Configure parameters** - Set source code, job names, actions, etc.
- **Template variables** - Use `{{node.X.artifact}}` to pass data between nodes
- **Save changes** - Properties are saved automatically

### 4. Workflow Management
- **New** - Create a new workflow
- **Import** - Load workflow from JSON file
- **Export** - Save workflow as JSON
- **Run** - Execute the workflow and see results

## 🚀 Quick Start

### 1. Start the Server

```bash
cd FlowASM
npm install
npm start
```

Open http://localhost:3000

### 2. Create Your First Workflow

1. **Drag an "Assemble" node** from the left palette onto the canvas
2. **Click the node** to select it
3. **Edit the assembly code** in the right sidebar
4. **Drag an "Execute" node** onto the canvas
5. **Configure it** to use `{{node.assemble.bytecode}}`
6. **Click "Run Workflow"** to execute

### 3. Use the Demo Workflow

A demo payroll workflow is pre-loaded:
- Assemble → Execute → Submit JCL → Verify 3270

Click "Run Workflow" to see it in action!

## 📖 User Guide

### Canvas Controls

**Toolbar Buttons**:
- 🔍+ **Zoom In** - Increase canvas zoom
- 🔍- **Zoom Out** - Decrease canvas zoom
- ⛶ **Fit Canvas** - Reset zoom and pan
- 🗑️ **Clear Canvas** - Remove all nodes

**Mouse Controls**:
- **Click and drag** on empty space to pan
- **Click a node** to select and edit
- **Drag a node** to reposition it

### Node Properties

When a node is selected, the right sidebar shows:

1. **Node ID** - Unique identifier (read-only)
2. **Node Type** - Type of node (read-only)
3. **Description** - Human-readable description
4. **Configuration** - Node-specific parameters

**Example: Assemble Node**
```
Assembly Code:
.TEXT
main:
    MOV R0, #1000
    MOV R1, #250
    ADD R0, R1
    HLT
```

**Example: Execute Node**
```
Bytecode: {{node.assemble.bytecode}}
```

### Template Variables

Pass data between nodes using template syntax:

```
{{node.NODE_ID.ARTIFACT}}
```

**Examples**:
- `{{node.assemble.bytecode}}` - Get bytecode from assemble node
- `{{node.submit.jobId}}` - Get job ID from submit node
- `{{node.execute.registers}}` - Get register values

### Workflow Operations

**New Workflow**:
1. Click "New" in the top bar
2. Confirm to clear current workflow
3. Start building from scratch

**Import Workflow**:
1. Click "Import"
2. Select a JSON file
3. Workflow loads onto canvas

**Export Workflow**:
1. Click "Export"
2. Workflow saves as JSON file
3. Use for backup or sharing

**Run Workflow**:
1. Click "Run Workflow"
2. Execution modal opens
3. Watch real-time logs
4. See success/failure status

## 🎯 Example Workflows

### Example 1: Simple Assembly Test

```
1. Assemble Node
   - Source: MOV R0, #42; HLT

2. Execute Node
   - Bytecode: {{node.assemble.bytecode}}
```

### Example 2: Payroll Processing

```
1. Assemble Node
   - Source: Payroll calculation code

2. Execute Node
   - Bytecode: {{node.assemble.bytecode}}

3. Submit JCL Node
   - Job Name: PAYROLL
   - JCL Content: //PAYROLL JOB...

4. 3270 Action Node
   - Action: PF3
   - Expected: PAYROLL COMPLETE
```

### Example 3: Debug Workflow

```
1. Assemble Node
   - Source: Complex assembly code

2. Debug Node
   - Bytecode: {{node.assemble.bytecode}}
   - Breakpoints: 5,10,15

3. Execute Node
   - Bytecode: {{node.assemble.bytecode}}
```

## 🔧 Advanced Features

### Keyboard Shortcuts

- **Ctrl+S** - Save workflow (export)
- **Delete** - Delete selected node
- **Ctrl+Z** - Undo (coming soon)
- **Ctrl+Y** - Redo (coming soon)

### Node Styling

Each node type has a unique color:
- **Assemble** - Blue (#00aaff)
- **Execute** - Pink (#ff00aa)
- **Debug** - Orange (#ffaa00)
- **Submit JCL** - Purple (#aa00ff)
- **3270 Action** - Green (#00ff88)
- **Job Status** - Orange (#ff8800)

### Execution Logs

The execution modal shows:
- **Node-by-node progress** - See each step execute
- **Timing information** - Duration for each node
- **Success/failure status** - Visual indicators
- **Detailed logs** - Output from each operation
- **Stub markers** - Shows which operations are stubbed

## 🐛 Troubleshooting

**Nodes not dragging?**
- Ensure you're dragging from the palette, not the canvas
- Try refreshing the page

**Properties not saving?**
- Click the "Save" button after editing
- Check for validation errors

**Workflow not executing?**
- Ensure all nodes have valid configuration
- Check template variables are correct
- Look for error messages in execution log

**Canvas not panning?**
- Click and drag on empty space, not on nodes
- Use zoom controls if canvas is too small

## 📊 What's Implemented vs Stubbed

### ✅ Fully Implemented

1. **Visual Builder**
   - Drag-and-drop from palette
   - Free-form node positioning
   - Pan and zoom controls
   - Node selection and editing

2. **Node Configuration**
   - Dynamic property panels
   - Text and textarea inputs
   - Template variable support
   - Save and delete operations

3. **Workflow Management**
   - New workflow creation
   - Import from JSON
   - Export to JSON
   - Workflow execution

4. **UI/UX**
   - Modern, professional design
   - Responsive layout
   - Toast notifications
   - Execution modal with logs

### 🔨 Stubbed Features

1. **Node Connections**
   - Visual arrows between nodes (displayed but not interactive)
   - Automatic execution order (uses node array order)
   - **Future**: Click to connect nodes, define execution flow

2. **Advanced Canvas**
   - Undo/redo (not implemented)
   - Copy/paste nodes (not implemented)
   - Multi-select (not implemented)
   - **Future**: Full canvas editing features

3. **Collaboration**
   - Real-time collaboration (not implemented)
   - Version control (not implemented)
   - **Future**: Team features

## 🚀 Next Steps

### Immediate Enhancements
1. Add interactive node connections
2. Implement undo/redo
3. Add copy/paste functionality
4. Support multi-select

### Future Features
1. Conditional branching (if/else nodes)
2. Loop nodes (for/while)
3. Parallel execution
4. Sub-workflows
5. Custom node types
6. Workflow templates
7. Real-time collaboration

## 📝 Tips and Best Practices

1. **Name your workflows** - Use descriptive names in the toolbar
2. **Use template variables** - Connect nodes with `{{node.X.artifact}}`
3. **Test incrementally** - Run workflow after adding each node
4. **Export regularly** - Save your work as JSON files
5. **Keep it simple** - Start with small workflows, then expand

## 🎓 Learning Resources

- **Demo Workflow** - Pre-loaded example showing all features
- **Node Palette** - Hover over nodes to see descriptions
- **Execution Logs** - Learn from execution output
- **Template Variables** - See examples in demo workflow

---

**Built with**: D3.js for canvas, Font Awesome for icons, pure JavaScript for logic

**Status**: ✅ Fully functional visual builder ready for use!

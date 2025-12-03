# FlowASM Visual Builder UI Guide

## 🎨 Overview

The FlowASM Visual Builder provides an intuitive n8n-style interface for creating and managing mainframe workflow automation. This guide covers all UI features and interactions.

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   cd FlowASM
   npm start
   ```

2. **Open browser:**
   Navigate to http://localhost:3000

3. **Start building:**
   - Drag nodes from the palette to the canvas
   - Connect nodes by dragging from output ports to input ports
   - Configure nodes in the inspector panel
   - Click "Run" to execute your workflow

## 📐 Main UI Components

### Toolbar (Top)

Located at the top of the canvas area, the toolbar contains:

- **📐 Auto-Layout** - Automatically arranges nodes in a tidy grid layout with proper spacing
- **▶️ Run** - Executes the current workflow and shows live status updates
- **⏹️ Stop** - Stops workflow execution (appears during execution)
- **Zoom Controls** (+, 100%, -) - Adjust canvas zoom level
- **💾 Export** - Downloads the workflow as JSON file
- **📂 Import** - Loads a workflow from JSON file
- **🗑️ Clear** - Clears the entire canvas

### Left Sidebar

**Workflows Section:**
- Lists available demo workflows
- Click any workflow to load it
- "+ New Workflow" button creates a blank canvas

**Node Palette:**
- Organized by connector type (ASM Sandbox, TK5, z/OS, 3270)
- Drag any node type to the canvas to add it
- Each node shows an icon and label

### Canvas (Center)

The main workspace where you build workflows:

- **Grid background** - Helps with visual alignment
- **Drag nodes** - Click and drag nodes to reposition
- **Connection ports** - Small circles on left (input) and right (output) of each node
- **Connection lines** - Curved lines with arrowheads showing data flow
- **Keyboard navigation** - Arrow keys nudge selected node (Shift for larger steps)

### Right Sidebar (Inspector / Editor)

The right sidebar has two tabs:

**Node Inspector Tab:**
Shows details for the selected node or connection:
- **Node ID** - Unique identifier (read-only)
- **Type** - Node type like "asm.compile" (read-only)
- **Description** - Editable label for the node
- **Configuration** - JSON config for node-specific settings
- **Execution Artifacts** - Compiled bytecode, instruction count (after execution)
- **Apply Changes** - Saves inspector edits
- **Delete Node** - Removes the node and its connections

**ASM Editor Tab:**
Integrated assembly code editor with Monaco Editor:
- **Code Editor** - Full-featured editor with syntax highlighting
- **Template Dropdown** - Load sample programs (Hello World, Calculator)
- **Validate Button** - Check assembly syntax
- **Upload/Download** - Import/export .asm files (200KB limit)
- **Create Assemble Node** - Add node with current code
- **Load Node Code** - Load code from selected `asm.compile` node
- **Save to Node** - Save editor changes to attached node
- **Attachment Status** - Shows which node (if any) is attached

### Bottom Panel (Execution Log)

Displays real-time execution information:

- **Toggle button** (▼/▲) - Expand or collapse the panel
- **Clear button** (🗑️) - Clears all log entries
- **Timestamped logs** - Color-coded by type (success=green, error=red, info=blue, warning=yellow)
- **Auto-scroll** - Automatically scrolls to show latest logs

## 🎯 Key Features

### 1. Drag-and-Drop Node Creation

**How to add nodes:**
1. Find the node type in the left palette
2. Click and drag the node onto the canvas
3. Drop it at your desired position
4. The node appears with default configuration

**Node types available:**
- **ASM Sandbox:** compile, run, debug
- **TK5 Emulator:** ipl, submit, status
- **z/OS:** submit, smf, dataset
- **3270 Terminal:** send, read, wait

### 2. Visual Connection Drawing

**How to connect nodes:**
1. Hover over the output port (right side) of a source node
2. Port highlights and cursor changes to crosshair
3. Click and drag from the output port
4. A temporary line follows your cursor
5. Drop on the input port (left side) of a target node
6. Connection line appears with arrowhead

**Connection features:**
- Curved bezier lines for visual clarity
- Arrowheads indicate data flow direction
- Click a line to select it (turns blue)
- Delete key removes selected connection
- Connections update automatically when nodes move

### 3. Auto-Layout

**What it does:**
- Arranges all nodes in a clean grid pattern
- Maintains 3 nodes per row
- Applies consistent spacing (80px horizontal, 60px vertical)
- Snaps to 20px grid for alignment
- Preserves all connections

**When to use:**
- After adding multiple nodes manually
- When the canvas becomes cluttered
- To create professional-looking workflows quickly

**How to use:**
Click the "📐 Auto-Layout" button in the toolbar

### 4. Node Inspector & Quick Edits

**Editing nodes:**
1. Click any node to select it (orange border appears)
2. Inspector panel shows node details
3. Edit the description field for a custom label
4. Modify the configuration JSON for node-specific settings
5. Click "Apply Changes" to save

**Configuration examples:**

**asm.compile:**
```json
{
  "sourceCode": ".TEXT\nmain:\n  MOV R0, #42\n  HLT"
}
```

**tk5.submit:**
```json
{
  "jobName": "MYJOB",
  "jcl": "//MYJOB JOB\n//STEP1 EXEC PGM=IEFBR14"
}
```

**Template variables:**
Reference previous node outputs:
```json
{
  "bytecode": "{{node.compile_step.artifacts.bytecode}}"
}
```

### 5. Live Workflow Execution

**Running workflows:**
1. Build your workflow with nodes and connections
2. Click the "▶️ Run" button
3. Execution panel expands automatically
4. Watch nodes change status in real-time:
   - **Yellow border** - Queued
   - **Blue border + pulse** - Running
   - **Green border + ✓** - Success
   - **Red border + ✗** - Failed

**Status indicators:**
- **Connector badges** appear on nodes during execution:
  - **SANDBOX** (green) - Running in local asm-sandbox
  - **TK5/ZOS/ZEROFRAME** (blue) - Running on remote connector
  - **STUBBED** (yellow) - Connector unavailable, using stub

**Execution logs:**
- Timestamped entries for each operation
- Node-by-node execution details
- Success/failure indicators
- Duration metrics
- Warnings for stubbed connectors

### 6. Keyboard & Touch Support

**Keyboard shortcuts:**
- **Arrow keys** - Nudge selected node by 5px
- **Shift + Arrow keys** - Nudge selected node by 20px
- **Delete/Backspace** - Delete selected node or connection
- **Tab** - Focus canvas for keyboard navigation

**Touch support:**
- Touch-drag nodes on mobile devices
- Larger touch targets for ports (20px on touch devices)
- Responsive layout for tablets

**Accessibility:**
- Keyboard-navigable interface
- Focus indicators on interactive elements
- ARIA labels for screen readers
- High contrast color scheme

## 🎬 Common Workflows

### Creating a Simple Workflow

1. **Add nodes:**
   - Drag "Compile" from ASM Sandbox to canvas
   - Drag "Run" from ASM Sandbox to canvas

2. **Connect them:**
   - Drag from Compile's output port to Run's input port

3. **Configure:**
   - Click Compile node
   - Edit sourceCode in inspector
   - Click Run node
   - Set bytecode to `{{node.compile.artifacts.bytecode}}`

4. **Execute:**
   - Click "▶️ Run"
   - Watch execution in log panel

### Loading and Modifying Demo Workflows

1. **Load demo:**
   - Click "Payroll Processing (Sandbox)" in left sidebar
   - Workflow loads with 5 pre-configured nodes

2. **Modify:**
   - Click any node to edit its configuration
   - Add new nodes by dragging from palette
   - Connect new nodes to existing workflow

3. **Save:**
   - Click "💾 Export" to save as JSON
   - Import later with "📂 Import"

### Building from Scratch

1. **Start fresh:**
   - Click "+ New Workflow" or "🗑️ Clear"

2. **Add nodes:**
   - Drag desired node types to canvas
   - Position them logically (left to right flow)

3. **Connect:**
   - Draw connections to define execution order
   - Use template variables to pass data

4. **Arrange:**
   - Click "📐 Auto-Layout" for clean arrangement
   - Or manually position nodes

5. **Test:**
   - Click "▶️ Run" to execute
   - Check logs for any issues
   - Adjust configuration as needed

## 🔧 Tips & Tricks

### Visual Organization

- **Use Auto-Layout** after adding multiple nodes for instant organization
- **Color coding** - Node borders show status (green=success, red=fail, blue=running)
- **Connector badges** - Quickly identify which system is executing each node
- **Grid snapping** - Nodes snap to 20px grid when using Auto-Layout

### Efficient Editing

- **Keyboard nudging** - Fine-tune node positions with arrow keys
- **Quick delete** - Select and press Delete key instead of using inspector
- **Template variables** - Use `{{node.X.artifacts.Y}}` to chain operations
- **JSON validation** - Config editor validates JSON before applying

### Debugging Workflows

- **Check connections** - Ensure all nodes are properly connected
- **Review logs** - Execution panel shows detailed error messages
- **Stubbed warnings** - Yellow badges indicate connector unavailable
- **Step-by-step** - Logs show each node's execution time and status

### Performance

- **Zoom controls** - Zoom out for overview, zoom in for detail work
- **Collapsed panel** - Collapse execution panel when not needed
- **Clear logs** - Use 🗑️ button to clear old logs and improve performance

## 🎨 Visual Indicators

### Node States

| State | Visual | Meaning |
|-------|--------|---------|
| Normal | Gray border | Node is idle |
| Selected | Orange border + glow | Node is selected for editing |
| Queued | Yellow border | Waiting to execute |
| Running | Blue border + pulse | Currently executing |
| Success | Green border + ✓ | Executed successfully |
| Failed | Red border + ✗ | Execution failed |

### Connection States

| State | Visual | Meaning |
|-------|--------|---------|
| Normal | Gray line | Standard connection |
| Hover | Thicker line | Mouse over connection |
| Selected | Blue line | Connection selected |

### Connector Badges

| Badge | Color | Meaning |
|-------|-------|---------|
| SANDBOX | Green | Local asm-sandbox engine |
| TK5/ZOS/ZEROFRAME | Blue | Remote connector |
| STUBBED | Yellow | Connector unavailable |

## 📱 Responsive Design

The UI adapts to different screen sizes:

- **Desktop (>1200px)** - Full three-column layout
- **Tablet (900-1200px)** - Narrower sidebars
- **Mobile (<900px)** - Sidebars become overlays

## 🐛 Troubleshooting

**Nodes won't connect:**
- Ensure you're dragging from output (right) to input (left)
- Can't connect a node to itself
- Check if connection already exists

**Auto-Layout not working:**
- Ensure you have nodes on the canvas
- Try clearing and re-adding nodes

**Execution fails:**
- Check node configuration JSON is valid
- Verify template variables reference existing nodes
- Review execution logs for specific errors

**UI not responding:**
- Refresh the page
- Check browser console for errors
- Ensure server is running (npm start)

## 📚 Additional Resources

- **Main README:** `FlowASM/README.md` - Project overview
- **Demo Guide:** `FlowASM/docs/README_DEMO.md` - 60-second demo script
- **Credentials:** `FlowASM/docs/CREDENTIALS_TEMPLATE.md` - Connector setup
- **API Reference:** Check main README for API endpoints

---

**UI Version:** 2.0.0  
**Last Updated:** December 3, 2024  
**Kiroween 2024** 🎃

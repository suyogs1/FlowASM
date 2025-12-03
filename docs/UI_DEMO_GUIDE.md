# FlowASM UI Demo Guide

## 🎬 Visual Demonstrations

This guide provides step-by-step instructions for capturing the three required demonstration artifacts.

## 📸 Screenshot 1: Drag Node from Palette

**What to capture:** Dragging a node from the palette to the canvas

**Steps:**
1. Start FlowASM: `npm start`
2. Open http://localhost:3000
3. Position your screen capture tool
4. Click and hold on "Compile" node in ASM Sandbox palette
5. Drag the node toward the canvas (cursor should show "grabbing")
6. **Capture screenshot** while dragging (before releasing)
7. Release to drop the node

**Expected visual:**
- Node being dragged with cursor
- Palette node highlighted
- Canvas visible as drop target
- Cursor shows drag state

**Filename:** `ui-demo-drag-node.png`

---

## 📸 Screenshot 2: Connect Nodes with Lines

**What to capture:** Drawing a connection line between two nodes

**Steps:**
1. Ensure you have at least 2 nodes on canvas
2. Hover over the output port (right side) of first node
3. Port should highlight and cursor changes to crosshair
4. Click and drag from the output port
5. **Capture screenshot** while dragging (line following cursor)
6. Complete by dropping on input port of second node

**Expected visual:**
- Two nodes visible
- Connection line being drawn (temporary orange line)
- Cursor at end of line
- Source port highlighted
- Arrowhead on line

**Filename:** `ui-demo-connect-nodes.png`

---

## 📸 Screenshot 3: Workflow Execution with Live Status

**What to capture:** Workflow running with live status indicators

**Steps:**
1. Load "Payroll Processing (Sandbox)" workflow
2. Click "▶️ Run" button
3. **Capture screenshot** during execution or immediately after
4. Ensure execution panel is expanded

**Expected visual:**
- Multiple nodes with status indicators:
  - Green borders with ✓ for success
  - Connector badges (SANDBOX, STUBBED)
- Execution panel expanded at bottom
- Logs showing timestamped entries
- Color-coded log messages
- Node descriptions visible

**Filename:** `ui-demo-execution.png`

---

## 🎥 Alternative: Single GIF (10-12 seconds)

Instead of three screenshots, you can create one GIF showing all interactions:

**Timeline:**
- **0-3s:** Drag "Compile" node from palette to canvas
- **3-6s:** Drag "Run" node from palette to canvas
- **6-8s:** Draw connection from Compile output to Run input
- **8-10s:** Click Run button
- **10-12s:** Show execution with status updates

**Tools for GIF creation:**
- **Windows:** ScreenToGif (free)
- **Mac:** Kap (free)
- **Cross-platform:** LICEcap (free)

**Settings:**
- Frame rate: 15-20 fps
- Resolution: 1280x720 or higher
- File size: <5MB

**Filename:** `ui-demo-complete.gif`

---

## 📋 Quick Demo Script

For live demonstrations or video recording:

### Setup (30 seconds)
```bash
cd FlowASM
npm start
# Open http://localhost:3000
```

### Demo Flow (60 seconds)

**1. Show Interface (10s)**
- Point out three main areas: palette, canvas, inspector
- Highlight toolbar with Auto-Layout, Run, Export buttons

**2. Drag-and-Drop (15s)**
- Drag "Compile" from ASM Sandbox palette
- Drop on canvas
- Drag "Run" from palette
- Drop below first node

**3. Connect Nodes (10s)**
- Hover over Compile output port (right side)
- Drag to Run input port (left side)
- Connection line appears with arrow

**4. Configure (10s)**
- Click Compile node
- Show inspector with configuration
- Point out JSON config editor

**5. Execute (15s)**
- Click "▶️ Run" button
- Watch nodes turn green with ✓
- Show execution logs in bottom panel
- Point out SANDBOX badges

**Total:** ~60 seconds

---

## 🎯 Key Features to Highlight

### Visual Elements
- ✅ Grid background for alignment
- ✅ Connection ports on nodes
- ✅ Curved lines with arrowheads
- ✅ Status colors (green/red/blue/yellow)
- ✅ Connector badges (SANDBOX/STUBBED)

### Interactions
- ✅ Drag-and-drop from palette
- ✅ Node repositioning
- ✅ Connection drawing
- ✅ Node selection and editing
- ✅ Live execution updates

### Toolbar Features
- ✅ Auto-Layout button
- ✅ Run/Stop buttons
- ✅ Export/Import
- ✅ Zoom controls

---

## 📝 Screenshot Checklist

Before capturing, ensure:

- [ ] Browser window is maximized or at least 1280px wide
- [ ] All UI elements are visible (no scrolling needed)
- [ ] Cursor is visible in drag/connect screenshots
- [ ] Execution panel is expanded for execution screenshot
- [ ] At least 2-3 nodes visible in execution screenshot
- [ ] Logs show multiple entries with colors
- [ ] No personal information visible
- [ ] High resolution (at least 1920x1080)

---

## 🖼️ Screenshot Locations

Save all screenshots/GIF to:
```
FlowASM/docs/screenshots/
├── ui-demo-drag-node.png
├── ui-demo-connect-nodes.png
├── ui-demo-execution.png
└── ui-demo-complete.gif (optional)
```

Or include in the main docs folder:
```
FlowASM/docs/
├── ui-demo-drag-node.png
├── ui-demo-connect-nodes.png
└── ui-demo-execution.png
```

---

## 📖 Reference in Documentation

Add to README_UI.md:

```markdown
## 🎬 Visual Demonstrations

See these screenshots for key UI interactions:

1. **Drag-and-Drop:** [ui-demo-drag-node.png](ui-demo-drag-node.png)
2. **Connection Drawing:** [ui-demo-connect-nodes.png](ui-demo-connect-nodes.png)
3. **Live Execution:** [ui-demo-execution.png](ui-demo-execution.png)

Or watch the complete demo: [ui-demo-complete.gif](ui-demo-complete.gif)
```

---

## 🎓 Tips for Best Results

### Lighting & Clarity
- Use dark theme (already default)
- Ensure good contrast
- Avoid glare on screen
- Use high DPI display if available

### Timing
- For drag screenshots: capture mid-drag
- For connection: capture while line is being drawn
- For execution: capture when 2-3 nodes have completed

### Composition
- Center the action in frame
- Include enough context (toolbar, panels)
- Show cursor position clearly
- Ensure text is readable

### File Format
- PNG for screenshots (lossless)
- GIF for animation (optimized)
- Compress if needed (TinyPNG, etc.)

---

**Ready to capture?** Follow the steps above and create your demonstration artifacts! 📸

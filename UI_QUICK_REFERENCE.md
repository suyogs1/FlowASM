# FlowASM UI Quick Reference Card

## 🚀 Getting Started

```bash
cd FlowASM
npm start
# Open http://localhost:3000
```

## 🎨 Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│  🎃 FlowASM - Visual Mainframe Workflow Builder        │
├──────────┬──────────────────────────────────┬──────────┤
│          │  📐 Auto-Layout  ▶️ Run  💾 Export │          │
│ Palette  ├──────────────────────────────────┤ Inspector│
│          │                                   │          │
│ [Nodes]  │         Canvas Area              │ [Props]  │
│          │      (Drag nodes here)            │          │
│          │                                   │          │
│          ├──────────────────────────────────┤          │
│          │  📊 Execution Log (▼ expand)     │          │
└──────────┴──────────────────────────────────┴──────────┘
```

## 🎯 Quick Actions

| Action | How To |
|--------|--------|
| **Add Node** | Drag from palette → Drop on canvas |
| **Connect Nodes** | Drag from output port (right) → input port (left) |
| **Move Node** | Click & drag node |
| **Select Node** | Click node (orange border) |
| **Edit Node** | Select → Edit in inspector → Apply Changes |
| **Delete Node** | Select → Press Delete OR inspector button |
| **Auto-Arrange** | Click 📐 Auto-Layout button |
| **Run Workflow** | Click ▶️ Run button |
| **Export** | Click 💾 Export button |

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Arrow Keys** | Nudge selected node (5px) |
| **Shift + Arrows** | Nudge selected node (20px) |
| **Delete / Backspace** | Delete selected node/connection |
| **Tab** | Focus canvas |

## 🎨 Node Status Colors

| Color | Status | Icon |
|-------|--------|------|
| **Gray** | Idle | - |
| **Orange** | Selected | - |
| **Yellow** | Queued | ⏳ |
| **Blue + Pulse** | Running | ⏳ |
| **Green** | Success | ✓ |
| **Red** | Failed | ✗ |

## 🏷️ Connector Badges

| Badge | Color | Meaning |
|-------|-------|---------|
| **SANDBOX** | Green | Local asm-sandbox engine |
| **TK5/ZOS/ZEROFRAME** | Blue | Remote connector |
| **STUBBED** | Yellow | Connector unavailable |

## 📦 Node Types (12)

### ASM Sandbox
- 📝 **Compile** - Compile assembly code
- ▶️ **Run** - Execute bytecode
- 🐛 **Debug** - Debug with breakpoints

### TK5 Emulator
- 🚀 **IPL** - Boot system
- 📤 **Submit** - Submit JCL job
- 📊 **Status** - Check job status

### z/OS
- 📤 **Submit** - Submit JCL to z/OS
- 📈 **SMF** - Fetch SMF records
- 📁 **Dataset** - Read dataset

### 3270 Terminal
- ⌨️ **Send** - Send terminal action
- 👁️ **Read** - Read screen
- ⏱️ **Wait** - Wait for text

## 🔧 Toolbar Buttons

| Button | Function |
|--------|----------|
| 📐 **Auto-Layout** | Arrange nodes in grid |
| ▶️ **Run** | Execute workflow |
| ⏹️ **Stop** | Stop execution |
| **+** | Zoom in |
| **100%** | Reset zoom |
| **-** | Zoom out |
| 💾 **Export** | Download JSON |
| 📂 **Import** | Load JSON |
| 🗑️ **Clear** | Clear canvas |

## 📊 Execution Panel

| Control | Function |
|---------|----------|
| **▼ / ▲** | Expand/collapse panel |
| **🗑️** | Clear logs |
| **Logs** | Timestamped execution logs |

## 🎯 Common Workflows

### 1. Quick Start (30 seconds)
1. Drag "Compile" to canvas
2. Drag "Run" to canvas
3. Connect Compile → Run
4. Click ▶️ Run

### 2. Edit Node (15 seconds)
1. Click node
2. Edit description/config in inspector
3. Click "Apply Changes"

### 3. Arrange Nodes (5 seconds)
1. Click 📐 Auto-Layout
2. Nodes arrange in grid

### 4. Save Workflow (10 seconds)
1. Click 💾 Export
2. Save JSON file

## 💡 Pro Tips

- **Use Auto-Layout** after adding multiple nodes
- **Shift + Arrow keys** for faster positioning
- **Template variables** like `{{node.X.artifacts.Y}}` pass data
- **Check logs** for detailed execution info
- **Connector badges** show where code runs

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect nodes | Drag from output (right) to input (left) |
| Node won't move | Click node body, not ports |
| Config won't save | Check JSON is valid |
| Execution fails | Check logs for error details |
| UI not responding | Refresh page, check server running |

## 📚 Full Documentation

- **Complete UI Guide:** `docs/README_UI.md`
- **Demo Instructions:** `docs/UI_DEMO_GUIDE.md`
- **Technical Report:** `docs/UI_IMPLEMENTATION_REPORT.md`
- **Main README:** `README.md`

## 🎓 Learn More

### Tutorials
1. **Basic Workflow** - See `docs/README_UI.md` → "Creating a Simple Workflow"
2. **Demo Workflows** - Load from left sidebar
3. **Advanced Features** - See full UI guide

### Support
- Check documentation in `docs/` folder
- Review execution logs for errors
- See troubleshooting section in README_UI.md

---

**Quick Reference v2.0** | Kiroween 2024 🎃

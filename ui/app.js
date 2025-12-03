/**
 * FlowASM Visual Workflow Builder
 * Enhanced UI with drag-and-drop, connection lines, and live execution
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  currentWorkflow: null,
  nodes: new Map(),
  connections: [],
  selectedNode: null,
  selectedConnection: null,
  draggedNode: null,
  connectingFrom: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  isExecuting: false,
  nodeCounter: 0,
  monacoEditor: null,
  editorAttachedNode: null
};

// Assembly templates
const ASM_TEMPLATES = {
  hello: `.TEXT
; Hello World Program
main:
  MOV R0, #42
  MOV R1, #8
  ADD R0, R0, R1
  HLT
`,
  calculator: `.TEXT
; Simple Calculator
; Adds two numbers and stores result
main:
  MOV R0, #1000    ; First number
  MOV R1, #250     ; Second number
  ADD R0, R0, R1   ; R0 = R0 + R1
  MOV R2, R0       ; Store result in R2
  HLT
`
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadWorkflows();
});

async function initializeApp() {
  console.log('FlowASM Visual Builder initialized');
  
  // Setup SVG markers for arrows
  setupSVGMarkers();
  
  // Initialize Monaco Editor
  await initializeMonacoEditor();
  
  // Load demo workflow by default
  setTimeout(() => {
    const firstWorkflow = document.querySelector('.workflow-item');
    if (firstWorkflow) firstWorkflow.click();
  }, 500);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
  // Toolbar buttons
  document.getElementById('auto-layout').addEventListener('click', autoLayoutNodes);
  document.getElementById('run-workflow').addEventListener('click', runWorkflow);
  document.getElementById('stop-workflow').addEventListener('click', stopWorkflow);
  document.getElementById('export-workflow').addEventListener('click', exportWorkflow);
  document.getElementById('import-workflow').addEventListener('click', importWorkflow);
  document.getElementById('clear-canvas').addEventListener('click', clearCanvas);
  document.getElementById('new-workflow').addEventListener('click', createNewWorkflow);
  
  // Zoom controls
  document.getElementById('zoom-in').addEventListener('click', () => adjustZoom(0.1));
  document.getElementById('zoom-out').addEventListener('click', () => adjustZoom(-0.1));
  document.getElementById('zoom-reset').addEventListener('click', resetZoom);
  
  // Execution panel
  document.getElementById('toggle-panel').addEventListener('click', toggleExecutionPanel);
  document.getElementById('clear-log').addEventListener('click', clearLog);
  
  // Canvas interactions
  const canvas = document.getElementById('canvas');
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('drop', handleCanvasDrop);
  canvas.addEventListener('dragover', handleCanvasDragOver);
  
  // Keyboard support
  canvas.addEventListener('keydown', handleKeyDown);
  
  // Palette drag setup
  setupPaletteDrag();
  
  // Editor tabs
  setupEditorTabs();
  
  // Editor actions
  setupEditorActions();
}

// ============================================================================
// WORKFLOW MANAGEMENT
// ============================================================================

async function loadWorkflows() {
  try {
    const response = await fetch('/api/workflows');
    const workflows = await response.json();
    
    const listEl = document.getElementById('workflow-list');
    listEl.innerHTML = '';
    
    workflows.forEach(workflow => {
      const item = document.createElement('div');
      item.className = 'workflow-item';
      item.textContent = workflow.name;
      item.dataset.workflowId = workflow.id;
      item.addEventListener('click', () => loadWorkflow(workflow.id));
      listEl.appendChild(item);
    });
  } catch (error) {
    console.error('Failed to load workflows:', error);
    addLog('error', 'Failed to load workflows');
  }
}

async function loadWorkflow(id) {
  try {
    const response = await fetch(`/api/workflows/${id}`);
    state.currentWorkflow = await response.json();
    
    // Update UI
    document.querySelectorAll('.workflow-item').forEach(item => {
      item.classList.toggle('active', item.dataset.workflowId === id);
    });
    
    renderWorkflow();
    addLog('info', `Loaded workflow: ${state.currentWorkflow.name}`);
  } catch (error) {
    console.error('Failed to load workflow:', error);
    addLog('error', `Failed to load workflow: ${error.message}`);
  }
}

function renderWorkflow() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';
  state.nodes.clear();
  state.connections = [];
  
  if (!state.currentWorkflow || !state.currentWorkflow.nodes || state.currentWorkflow.nodes.length === 0) {
    canvas.innerHTML = '<div class="canvas-placeholder">Drag nodes from the palette to start building</div>';
    clearConnections();
    return;
  }
  
  // Render nodes
  state.currentWorkflow.nodes.forEach((node, index) => {
    const position = node.position || { x: 50 + (index * 220), y: 50 + (Math.floor(index / 3) * 150) };
    createNodeElement(node, position);
  });
  
  // Render connections (if workflow has connections defined)
  if (state.currentWorkflow.connections) {
    state.connections = state.currentWorkflow.connections;
    renderConnections();
  } else {
    // Auto-create connections based on node order
    autoConnectNodes();
  }
}

function createNodeElement(nodeData, position) {
  const nodeEl = document.createElement('div');
  nodeEl.className = 'workflow-node';
  nodeEl.dataset.nodeId = nodeData.id;
  nodeEl.style.left = position.x + 'px';
  nodeEl.style.top = position.y + 'px';
  
  nodeEl.innerHTML = `
    <div class="node-header">
      <span class="node-type">${nodeData.type}</span>
      <span class="node-status-badge"></span>
    </div>
    <div class="node-description">${nodeData.description || nodeData.id}</div>
    <div class="node-ports">
      <div class="port port-input" data-port="input"></div>
      <div class="port port-output" data-port="output"></div>
    </div>
  `;
  
  // Store node data
  state.nodes.set(nodeData.id, {
    data: nodeData,
    element: nodeEl,
    position: position
  });
  
  // Setup node interactions
  setupNodeInteractions(nodeEl, nodeData.id);
  
  document.getElementById('canvas').appendChild(nodeEl);
  return nodeEl;
}

// ============================================================================
// NODE INTERACTIONS
// ============================================================================

function setupNodeInteractions(nodeEl, nodeId) {
  // Node selection
  nodeEl.addEventListener('click', (e) => {
    e.stopPropagation();
    selectNode(nodeId);
  });
  
  // Node dragging
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  nodeEl.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('port')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const pos = state.nodes.get(nodeId).position;
    initialX = pos.x;
    initialY = pos.y;
    nodeEl.classList.add('dragging');
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newX = Math.max(0, initialX + dx);
    const newY = Math.max(0, initialY + dy);
    
    nodeEl.style.left = newX + 'px';
    nodeEl.style.top = newY + 'px';
    state.nodes.get(nodeId).position = { x: newX, y: newY };
    
    renderConnections();
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      nodeEl.classList.remove('dragging');
    }
  });
  
  // Port interactions
  const ports = nodeEl.querySelectorAll('.port');
  ports.forEach(port => {
    port.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      startConnection(nodeId, port.dataset.port);
    });
    
    port.addEventListener('mouseenter', () => {
      if (state.connectingFrom) {
        port.classList.add('active');
      }
    });
    
    port.addEventListener('mouseleave', () => {
      port.classList.remove('active');
    });
    
    port.addEventListener('mouseup', (e) => {
      e.stopPropagation();
      if (state.connectingFrom) {
        completeConnection(nodeId, port.dataset.port);
      }
    });
  });
}

function selectNode(nodeId) {
  state.selectedNode = nodeId;
  state.selectedConnection = null;
  
  // Update visual selection
  document.querySelectorAll('.workflow-node').forEach(el => {
    el.classList.toggle('selected', el.dataset.nodeId === nodeId);
  });
  
  document.querySelectorAll('.connection-line').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Show inspector
  showNodeInspector(nodeId);
  
  // Update editor buttons
  updateEditorButtons();
}

function showNodeInspector(nodeId) {
  const node = state.nodes.get(nodeId);
  if (!node) return;
  
  const inspector = document.getElementById('inspector-content');
  
  let artifactsHTML = '';
  if (node.executionResult && node.executionResult.artifacts) {
    const artifacts = node.executionResult.artifacts;
    artifactsHTML = `
      <div class="form-group">
        <label>Execution Artifacts</label>
        <textarea readonly style="min-height: 150px; font-family: 'Courier New', monospace;">${JSON.stringify(artifacts, null, 2)}</textarea>
      </div>
    `;
  }
  
  inspector.innerHTML = `
    <div class="form-group">
      <label>Node ID</label>
      <input type="text" value="${node.data.id}" readonly>
    </div>
    <div class="form-group">
      <label>Type</label>
      <input type="text" value="${node.data.type}" readonly>
    </div>
    <div class="form-group">
      <label>Description</label>
      <input type="text" id="node-description" value="${node.data.description || ''}" 
             placeholder="Enter node description">
    </div>
    <div class="form-group">
      <label>Configuration (JSON)</label>
      <textarea id="node-config">${JSON.stringify(node.data.config || {}, null, 2)}</textarea>
    </div>
    ${artifactsHTML}
    <div class="form-actions">
      <button class="btn-secondary" onclick="updateNodeFromInspector('${nodeId}')">Apply Changes</button>
      <button class="btn-delete" onclick="deleteNode('${nodeId}')">Delete Node</button>
    </div>
  `;
}

function updateNodeFromInspector(nodeId) {
  const node = state.nodes.get(nodeId);
  if (!node) return;
  
  const description = document.getElementById('node-description').value;
  const configText = document.getElementById('node-config').value;
  
  try {
    const config = JSON.parse(configText);
    node.data.description = description;
    node.data.config = config;
    
    // Update node element
    const descEl = node.element.querySelector('.node-description');
    descEl.textContent = description || node.data.id;
    
    addLog('success', `Updated node: ${nodeId}`);
  } catch (error) {
    addLog('error', 'Invalid JSON configuration');
    alert('Invalid JSON configuration');
  }
}

function deleteNode(nodeId) {
  if (!confirm('Delete this node?')) return;
  
  const node = state.nodes.get(nodeId);
  if (node) {
    node.element.remove();
    state.nodes.delete(nodeId);
    
    // Remove connections
    state.connections = state.connections.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    );
    renderConnections();
    
    // Clear inspector
    document.getElementById('inspector-content').innerHTML = 
      '<p class="placeholder">Select a node to edit</p>';
    
    addLog('info', `Deleted node: ${nodeId}`);
  }
}

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

function startConnection(nodeId, portType) {
  if (portType !== 'output') return; // Only start from output ports
  
  state.connectingFrom = { nodeId, portType };
  
  const tempSvg = document.getElementById('temp-connection');
  tempSvg.style.display = 'block';
  
  document.addEventListener('mousemove', updateTempConnection);
  document.addEventListener('mouseup', cancelConnection);
}

function updateTempConnection(e) {
  if (!state.connectingFrom) return;
  
  const fromNode = state.nodes.get(state.connectingFrom.nodeId);
  if (!fromNode) return;
  
  const fromPort = fromNode.element.querySelector('.port-output');
  const fromRect = fromPort.getBoundingClientRect();
  const fromX = fromRect.left + fromRect.width / 2;
  const fromY = fromRect.top + fromRect.height / 2;
  
  const toX = e.clientX;
  const toY = e.clientY;
  
  const path = createConnectionPath(fromX, fromY, toX, toY);
  const tempSvg = document.getElementById('temp-connection');
  const pathEl = tempSvg.querySelector('path');
  pathEl.setAttribute('d', path);
}

function completeConnection(toNodeId, toPortType) {
  if (!state.connectingFrom || toPortType !== 'input') {
    cancelConnection();
    return;
  }
  
  const fromNodeId = state.connectingFrom.nodeId;
  
  // Don't connect to self
  if (fromNodeId === toNodeId) {
    cancelConnection();
    return;
  }
  
  // Check if connection already exists
  const exists = state.connections.some(conn => 
    conn.from === fromNodeId && conn.to === toNodeId
  );
  
  if (!exists) {
    state.connections.push({ from: fromNodeId, to: toNodeId });
    renderConnections();
    addLog('info', `Connected ${fromNodeId} → ${toNodeId}`);
  }
  
  cancelConnection();
}

function cancelConnection() {
  state.connectingFrom = null;
  const tempSvg = document.getElementById('temp-connection');
  tempSvg.style.display = 'none';
  document.removeEventListener('mousemove', updateTempConnection);
  document.removeEventListener('mouseup', cancelConnection);
}

function renderConnections() {
  const svg = document.getElementById('connections-layer');
  svg.innerHTML = '';
  
  // Re-add marker definitions
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#666" />
    </marker>
    <marker id="arrowhead-selected" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#2196f3" />
    </marker>
  `;
  svg.appendChild(defs);
  
  state.connections.forEach((conn, index) => {
    const fromNode = state.nodes.get(conn.from);
    const toNode = state.nodes.get(conn.to);
    
    if (!fromNode || !toNode) return;
    
    const fromPort = fromNode.element.querySelector('.port-output');
    const toPort = toNode.element.querySelector('.port-input');
    
    const fromRect = fromPort.getBoundingClientRect();
    const toRect = toPort.getBoundingClientRect();
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    
    const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
    const fromY = fromRect.top - canvasRect.top + fromRect.height / 2;
    const toX = toRect.left - canvasRect.left + toRect.width / 2;
    const toY = toRect.top - canvasRect.top + toRect.height / 2;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', createConnectionPath(fromX, fromY, toX, toY));
    path.setAttribute('stroke', '#666');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.classList.add('connection-line');
    path.dataset.connectionIndex = index;
    
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      selectConnection(index);
    });
    
    svg.appendChild(path);
  });
}

function createConnectionPath(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const curve = Math.abs(dx) * 0.5;
  
  return `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`;
}

function selectConnection(index) {
  state.selectedConnection = index;
  state.selectedNode = null;
  
  document.querySelectorAll('.workflow-node').forEach(el => {
    el.classList.remove('selected');
  });
  
  document.querySelectorAll('.connection-line').forEach((el, i) => {
    el.classList.toggle('selected', i === index);
    if (i === index) {
      el.setAttribute('marker-end', 'url(#arrowhead-selected)');
    } else {
      el.setAttribute('marker-end', 'url(#arrowhead)');
    }
  });
  
  const conn = state.connections[index];
  document.getElementById('inspector-content').innerHTML = `
    <div class="form-group">
      <label>Connection</label>
      <input type="text" value="${conn.from} → ${conn.to}" readonly>
    </div>
    <div class="form-actions">
      <button class="btn-delete" onclick="deleteConnection(${index})">Delete Connection</button>
    </div>
  `;
}

function deleteConnection(index) {
  state.connections.splice(index, 1);
  renderConnections();
  document.getElementById('inspector-content').innerHTML = 
    '<p class="placeholder">Select a node to edit</p>';
  addLog('info', 'Connection deleted');
}

function clearConnections() {
  const svg = document.getElementById('connections-layer');
  svg.innerHTML = '';
}

function autoConnectNodes() {
  // Auto-connect nodes in sequence
  const nodeIds = Array.from(state.nodes.keys());
  state.connections = [];
  
  for (let i = 0; i < nodeIds.length - 1; i++) {
    state.connections.push({
      from: nodeIds[i],
      to: nodeIds[i + 1]
    });
  }
  
  renderConnections();
}

// ============================================================================
// DRAG AND DROP FROM PALETTE
// ============================================================================

function setupPaletteDrag() {
  const paletteNodes = document.querySelectorAll('.palette-node');
  
  paletteNodes.forEach(node => {
    node.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('nodeType', node.dataset.nodeType);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });
}

function handleCanvasDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}

function handleCanvasDrop(e) {
  e.preventDefault();
  
  const nodeType = e.dataTransfer.getData('nodeType');
  if (!nodeType) return;
  
  const canvas = document.getElementById('canvas');
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left + canvas.scrollLeft;
  const y = e.clientY - rect.top + canvas.scrollTop;
  
  addNodeToCanvas(nodeType, { x, y });
}

function addNodeToCanvas(nodeType, position) {
  const nodeId = `node_${++state.nodeCounter}`;
  const [connector, action] = nodeType.split('.');
  
  const nodeData = {
    id: nodeId,
    type: nodeType,
    description: `${action} operation`,
    config: getDefaultConfig(nodeType),
    position: position
  };
  
  // Remove placeholder if exists
  const placeholder = document.querySelector('.canvas-placeholder');
  if (placeholder) placeholder.remove();
  
  createNodeElement(nodeData, position);
  addLog('success', `Added node: ${nodeType}`);
  
  return nodeId;
}

function getDefaultConfig(nodeType) {
  const configs = {
    'asm.compile': { sourceCode: '.TEXT\nmain:\n  MOV R0, #42\n  HLT' },
    'asm.run': { bytecode: '{{node.X.artifacts.bytecode}}' },
    'asm.debug': { bytecode: '{{node.X.artifacts.bytecode}}', breakpoints: [] },
    'tk5.ipl': { volume: 'SYSRES' },
    'tk5.submit': { jobName: 'MYJOB', jcl: '//MYJOB JOB\n//STEP1 EXEC PGM=IEFBR14' },
    'tk5.status': { jobId: '{{node.X.artifacts.jobId}}' },
    'zos.submit': { jcl: '//MYJOB JOB\n//STEP1 EXEC PGM=IEFBR14' },
    'zos.smf': { dataset: 'SYS1.SMFDATA' },
    'zos.dataset': { dataset: 'USER.OUTPUT' },
    'zeroframe.send': { action: 'ENTER', text: '' },
    'zeroframe.read': {},
    'zeroframe.wait': { expectedText: 'READY', timeout: 5000 }
  };
  
  return configs[nodeType] || {};
}

// ============================================================================
// AUTO-LAYOUT
// ============================================================================

function autoLayoutNodes() {
  const nodeArray = Array.from(state.nodes.values());
  if (nodeArray.length === 0) return;
  
  const GRID_SIZE = 20;
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 120;
  const HORIZONTAL_SPACING = 80;
  const VERTICAL_SPACING = 60;
  const NODES_PER_ROW = 3;
  
  nodeArray.forEach((node, index) => {
    const row = Math.floor(index / NODES_PER_ROW);
    const col = index % NODES_PER_ROW;
    
    const x = Math.round((50 + col * (NODE_WIDTH + HORIZONTAL_SPACING)) / GRID_SIZE) * GRID_SIZE;
    const y = Math.round((50 + row * (NODE_HEIGHT + VERTICAL_SPACING)) / GRID_SIZE) * GRID_SIZE;
    
    node.position = { x, y };
    node.element.style.left = x + 'px';
    node.element.style.top = y + 'px';
  });
  
  renderConnections();
  addLog('success', 'Nodes auto-arranged');
}

// ============================================================================
// ZOOM AND PAN
// ============================================================================

function adjustZoom(delta) {
  state.zoom = Math.max(0.5, Math.min(2, state.zoom + delta));
  updateZoomDisplay();
}

function resetZoom() {
  state.zoom = 1;
  updateZoomDisplay();
}

function updateZoomDisplay() {
  const canvas = document.getElementById('canvas');
  canvas.style.transform = `scale(${state.zoom})`;
  canvas.style.transformOrigin = 'top left';
  document.getElementById('zoom-reset').textContent = `${Math.round(state.zoom * 100)}%`;
}

// ============================================================================
// WORKFLOW EXECUTION
// ============================================================================

async function runWorkflow() {
  if (state.isExecuting) return;
  if (state.nodes.size === 0) {
    addLog('error', 'No nodes to execute');
    return;
  }
  
  state.isExecuting = true;
  document.getElementById('run-workflow').style.display = 'none';
  document.getElementById('stop-workflow').style.display = 'flex';
  
  // Expand execution panel
  const panel = document.getElementById('execution-panel');
  panel.classList.remove('collapsed');
  
  // Clear previous logs
  clearLog();
  addLog('info', '▶️ Starting workflow execution...');
  
  // Build workflow JSON
  const workflow = buildWorkflowJSON();
  
  try {
    const response = await fetch('/api/workflows/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    });
    
    const result = await response.json();
    displayExecutionResult(result);
  } catch (error) {
    addLog('error', `Execution failed: ${error.message}`);
  } finally {
    state.isExecuting = false;
    document.getElementById('run-workflow').style.display = 'flex';
    document.getElementById('stop-workflow').style.display = 'none';
  }
}

function buildWorkflowJSON() {
  const nodes = [];
  
  // Build ordered node list based on connections
  const nodeOrder = topologicalSort();
  
  nodeOrder.forEach(nodeId => {
    const node = state.nodes.get(nodeId);
    if (node) {
      nodes.push({
        id: node.data.id,
        type: node.data.type,
        description: node.data.description,
        config: node.data.config
      });
    }
  });
  
  return {
    id: state.currentWorkflow?.id || 'custom_workflow',
    name: state.currentWorkflow?.name || 'Custom Workflow',
    description: 'Workflow created in visual builder',
    nodes: nodes,
    connections: state.connections
  };
}

function topologicalSort() {
  const nodeIds = Array.from(state.nodes.keys());
  const visited = new Set();
  const result = [];
  
  function visit(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    // Visit dependencies first
    const incomingConns = state.connections.filter(c => c.to === nodeId);
    incomingConns.forEach(conn => visit(conn.from));
    
    result.push(nodeId);
  }
  
  nodeIds.forEach(nodeId => visit(nodeId));
  return result;
}

function displayExecutionResult(result) {
  addLog('info', `Workflow: ${result.name}`);
  addLog('info', `Status: ${result.status}`);
  addLog('info', `Duration: ${result.duration}ms`);
  addLog('info', '─'.repeat(50));
  
  result.nodes.forEach((nodeResult, index) => {
    const node = state.nodes.get(nodeResult.id);
    if (!node) return;
    
    // Store execution result in node for inspector
    node.executionResult = nodeResult;
    
    // Update node visual status
    node.element.classList.remove('queued', 'running', 'success', 'failed');
    node.element.classList.add(nodeResult.success ? 'success' : 'failed');
    
    const statusBadge = node.element.querySelector('.node-status-badge');
    statusBadge.textContent = nodeResult.success ? '✓' : '✗';
    
    // Add connector badge
    const connectorBadge = document.createElement('span');
    connectorBadge.className = 'node-connector-badge';
    
    if (nodeResult.metadata && nodeResult.metadata.stubbed) {
      connectorBadge.classList.add('stubbed');
      connectorBadge.textContent = 'STUBBED';
    } else if (nodeResult.metadata && nodeResult.metadata.engine === 'asm-sandbox') {
      connectorBadge.classList.add('sandbox');
      connectorBadge.textContent = 'SANDBOX';
    } else {
      connectorBadge.classList.add('remote');
      connectorBadge.textContent = nodeResult.type.split('.')[0].toUpperCase();
    }
    
    const header = node.element.querySelector('.node-header');
    const existingBadge = header.querySelector('.node-connector-badge');
    if (existingBadge) existingBadge.remove();
    header.appendChild(connectorBadge);
    
    // Log node result
    const logType = nodeResult.success ? 'success' : 'error';
    addLog(logType, `[${nodeResult.id}] ${nodeResult.type} - ${nodeResult.success ? 'SUCCESS' : 'FAILED'} (${nodeResult.duration}ms)`);
    
    // Log artifacts for assemble nodes
    if (nodeResult.type === 'asm.compile' && nodeResult.artifacts) {
      if (nodeResult.artifacts.instructions) {
        addLog('info', `  📝 Compiled ${nodeResult.artifacts.instructions} instructions`);
      }
      if (nodeResult.artifacts.bytecode) {
        addLog('info', `  💾 Bytecode: ${nodeResult.artifacts.bytecode.substring(0, 50)}...`);
      }
    }
    
    // Log node messages
    if (nodeResult.logs && nodeResult.logs.length) {
      nodeResult.logs.forEach(log => {
        addLog('info', `  ${log}`);
      });
    }
    
    // Stubbed warning
    if (nodeResult.metadata && nodeResult.metadata.stubbed) {
      addLog('warning', `  ⚠️ Stubbed connector`);
    }
  });
  
  addLog('info', '─'.repeat(50));
  const successCount = result.nodes.filter(n => n.success).length;
  addLog(result.status === 'SUCCESS' ? 'success' : 'error', 
    `✓ ${successCount}/${result.nodes.length} nodes succeeded`);
  
  // Refresh inspector if an executed node is selected
  if (state.selectedNode && state.nodes.get(state.selectedNode)?.executionResult) {
    showNodeInspector(state.selectedNode);
  }
}

function stopWorkflow() {
  state.isExecuting = false;
  document.getElementById('run-workflow').style.display = 'flex';
  document.getElementById('stop-workflow').style.display = 'none';
  addLog('warning', '⏹️ Workflow execution stopped');
}

// ============================================================================
// LOGGING
// ============================================================================

function addLog(type, message) {
  const logContent = document.getElementById('log-content');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  
  const timestamp = new Date().toLocaleTimeString();
  entry.innerHTML = `
    <span class="log-timestamp">${timestamp}</span>
    <span class="log-message">${message}</span>
  `;
  
  logContent.appendChild(entry);
  logContent.scrollTop = logContent.scrollHeight;
}

function clearLog() {
  document.getElementById('log-content').innerHTML = '';
}

function toggleExecutionPanel() {
  const panel = document.getElementById('execution-panel');
  panel.classList.toggle('collapsed');
  
  const button = document.getElementById('toggle-panel');
  button.textContent = panel.classList.contains('collapsed') ? '▲' : '▼';
}

// ============================================================================
// CANVAS INTERACTIONS
// ============================================================================

function handleCanvasClick(e) {
  if (e.target.id === 'canvas' || e.target.classList.contains('canvas-placeholder')) {
    // Deselect all
    state.selectedNode = null;
    state.selectedConnection = null;
    
    document.querySelectorAll('.workflow-node').forEach(el => {
      el.classList.remove('selected');
    });
    
    document.querySelectorAll('.connection-line').forEach(el => {
      el.classList.remove('selected');
      el.setAttribute('marker-end', 'url(#arrowhead)');
    });
    
    document.getElementById('inspector-content').innerHTML = 
      '<p class="placeholder">Select a node to edit</p>';
  }
}

// ============================================================================
// KEYBOARD SUPPORT
// ============================================================================

function handleKeyDown(e) {
  if (!state.selectedNode) return;
  
  const node = state.nodes.get(state.selectedNode);
  if (!node) return;
  
  const NUDGE_AMOUNT = e.shiftKey ? 20 : 5;
  let moved = false;
  
  switch (e.key) {
    case 'ArrowUp':
      node.position.y = Math.max(0, node.position.y - NUDGE_AMOUNT);
      moved = true;
      break;
    case 'ArrowDown':
      node.position.y += NUDGE_AMOUNT;
      moved = true;
      break;
    case 'ArrowLeft':
      node.position.x = Math.max(0, node.position.x - NUDGE_AMOUNT);
      moved = true;
      break;
    case 'ArrowRight':
      node.position.x += NUDGE_AMOUNT;
      moved = true;
      break;
    case 'Delete':
    case 'Backspace':
      e.preventDefault();
      deleteNode(state.selectedNode);
      return;
  }
  
  if (moved) {
    e.preventDefault();
    node.element.style.left = node.position.x + 'px';
    node.element.style.top = node.position.y + 'px';
    renderConnections();
  }
}

// ============================================================================
// IMPORT/EXPORT
// ============================================================================

function exportWorkflow() {
  const workflow = buildWorkflowJSON();
  
  // Add positions to nodes
  workflow.nodes.forEach(node => {
    const nodeState = state.nodes.get(node.id);
    if (nodeState) {
      node.position = nodeState.position;
    }
  });
  
  const json = JSON.stringify(workflow, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${workflow.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  addLog('success', 'Workflow exported');
}

function importWorkflow() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const workflow = JSON.parse(text);
      state.currentWorkflow = workflow;
      renderWorkflow();
      addLog('success', `Imported workflow: ${workflow.name}`);
    } catch (error) {
      addLog('error', 'Invalid workflow JSON');
      alert('Invalid workflow JSON file');
    }
  };
  input.click();
}

function clearCanvas() {
  if (!confirm('Clear the canvas? This will remove all nodes and connections.')) return;
  
  state.nodes.clear();
  state.connections = [];
  state.selectedNode = null;
  state.selectedConnection = null;
  state.currentWorkflow = null;
  
  document.getElementById('canvas').innerHTML = 
    '<div class="canvas-placeholder">Drag nodes from the palette to start building</div>';
  clearConnections();
  document.getElementById('inspector-content').innerHTML = 
    '<p class="placeholder">Select a node to edit</p>';
  
  addLog('info', 'Canvas cleared');
}

function createNewWorkflow() {
  clearCanvas();
  state.currentWorkflow = {
    id: 'new_workflow',
    name: 'New Workflow',
    description: 'Custom workflow',
    nodes: [],
    connections: []
  };
  addLog('success', 'New workflow created');
}

// ============================================================================
// SVG SETUP
// ============================================================================

function setupSVGMarkers() {
  const svg = document.getElementById('connections-layer');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#666" />
    </marker>
    <marker id="arrowhead-selected" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#2196f3" />
    </marker>
  `;
  svg.appendChild(defs);
}

// Make functions globally accessible for inline event handlers
window.updateNodeFromInspector = updateNodeFromInspector;
window.deleteNode = deleteNode;
window.deleteConnection = deleteConnection;


// ============================================================================
// MONACO EDITOR INITIALIZATION
// ============================================================================

async function initializeMonacoEditor() {
  return new Promise((resolve, reject) => {
    require.config({ 
      paths: { 
        vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
      } 
    });
    
    require(['vs/editor/editor.main'], function() {
      try {
        state.monacoEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
          value: '; Assembly code editor\n; Write your assembly code here\n\n.TEXT\nmain:\n  MOV R0, #42\n  HLT\n',
          language: 'plaintext', // Using plaintext as assembly syntax
          theme: 'vs-dark',
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2
        });
        
        addLog('success', 'Assembly editor initialized');
        resolve();
      } catch (error) {
        console.error('Monaco initialization error:', error);
        document.getElementById('monaco-editor').innerHTML = 
          '<div class="editor-error">Failed to load editor. Please refresh the page.</div>';
        reject(error);
      }
    });
  });
}

// ============================================================================
// EDITOR TAB MANAGEMENT
// ============================================================================

function setupEditorTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      // Update button states
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update tab content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      // Refresh Monaco layout when switching to editor tab
      if (tabName === 'editor' && state.monacoEditor) {
        setTimeout(() => state.monacoEditor.layout(), 100);
      }
    });
  });
}

// ============================================================================
// EDITOR ACTIONS
// ============================================================================

function setupEditorActions() {
  // Template selection
  document.getElementById('template-select').addEventListener('change', (e) => {
    const template = e.target.value;
    if (template && ASM_TEMPLATES[template]) {
      state.monacoEditor.setValue(ASM_TEMPLATES[template]);
      addLog('info', `Loaded template: ${template}`);
    }
    e.target.value = ''; // Reset selection
  });
  
  // Validate code
  document.getElementById('validate-code').addEventListener('click', validateAssemblyCode);
  
  // Upload .asm file
  document.getElementById('upload-asm').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.asm,.s,.txt';
    input.onchange = handleAsmFileUpload;
    input.click();
  });
  
  // Download .asm file
  document.getElementById('download-asm').addEventListener('click', downloadAsmFile);
  
  // Create node from editor
  document.getElementById('create-node-from-editor').addEventListener('click', createNodeFromEditor);
  
  // Load node code
  document.getElementById('load-node-code').addEventListener('click', loadNodeCodeToEditor);
  
  // Save to node
  document.getElementById('save-to-node').addEventListener('click', saveEditorToNode);
}


// ============================================================================
// ASSEMBLY CODE VALIDATION
// ============================================================================

async function validateAssemblyCode() {
  const code = state.monacoEditor.getValue();
  
  if (!code.trim()) {
    showValidationResult('error', 'No code to validate');
    return;
  }
  
  addLog('info', 'Validating assembly code...');
  
  try {
    // Call sandbox assemble endpoint for validation
    const response = await fetch('/api/workflows/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'validation_workflow',
        name: 'Validation',
        nodes: [{
          id: 'validate',
          type: 'asm.compile',
          config: { sourceCode: code }
        }]
      })
    });
    
    const result = await response.json();
    
    if (result.nodes && result.nodes[0]) {
      const nodeResult = result.nodes[0];
      if (nodeResult.success) {
        const instructions = nodeResult.artifacts?.instructions || 0;
        showValidationResult('success', `✓ Valid assembly code (${instructions} instructions)`);
        addLog('success', `Validation passed: ${instructions} instructions`);
      } else {
        const error = nodeResult.error || 'Unknown error';
        showValidationResult('error', `✗ Validation failed: ${error}`);
        addLog('error', `Validation failed: ${error}`);
      }
    }
  } catch (error) {
    showValidationResult('error', `✗ Validation error: ${error.message}`);
    addLog('error', `Validation error: ${error.message}`);
  }
}

function showValidationResult(type, message) {
  // Remove existing validation result
  const existing = document.querySelector('.validation-result');
  if (existing) existing.remove();
  
  const result = document.createElement('div');
  result.className = `validation-result ${type}`;
  result.textContent = message;
  
  const editorActions = document.querySelector('.editor-actions');
  editorActions.insertBefore(result, editorActions.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => result.remove(), 5000);
}

// ============================================================================
// FILE UPLOAD/DOWNLOAD
// ============================================================================

async function handleAsmFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Check file size (200KB limit)
  const MAX_SIZE = 200 * 1024; // 200KB
  if (file.size > MAX_SIZE) {
    alert(`File too large! Maximum size is 200KB. Your file is ${Math.round(file.size / 1024)}KB.`);
    addLog('error', `File upload failed: File too large (${Math.round(file.size / 1024)}KB)`);
    return;
  }
  
  try {
    const text = await file.text();
    state.monacoEditor.setValue(text);
    addLog('success', `Loaded file: ${file.name} (${Math.round(file.size / 1024)}KB)`);
  } catch (error) {
    alert('Failed to read file');
    addLog('error', `File upload failed: ${error.message}`);
  }
}

function downloadAsmFile() {
  const code = state.monacoEditor.getValue();
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'program.asm';
  a.click();
  URL.revokeObjectURL(url);
  addLog('success', 'Downloaded program.asm');
}


// ============================================================================
// NODE-EDITOR INTEGRATION
// ============================================================================

function createNodeFromEditor() {
  const code = state.monacoEditor.getValue();
  
  if (!code.trim()) {
    alert('Editor is empty. Please write some assembly code first.');
    return;
  }
  
  // Create node on canvas
  const nodeId = `asm_${++state.nodeCounter}`;
  const position = {
    x: 100 + (state.nodes.size * 50),
    y: 100 + (Math.floor(state.nodes.size / 3) * 150)
  };
  
  const nodeData = {
    id: nodeId,
    type: 'asm.compile',
    description: 'Assembly from editor',
    config: {
      sourceCode: code
    },
    position: position
  };
  
  // Remove placeholder if exists
  const placeholder = document.querySelector('.canvas-placeholder');
  if (placeholder) placeholder.remove();
  
  createNodeElement(nodeData, position);
  
  // Attach editor to this node
  state.editorAttachedNode = nodeId;
  updateEditorNodeInfo(nodeId);
  updateEditorButtons();
  
  // Switch to inspector tab to show the node
  document.querySelector('.tab-button[data-tab="inspector"]').click();
  selectNode(nodeId);
  
  addLog('success', `Created assemble node: ${nodeId}`);
}

function loadNodeCodeToEditor() {
  if (!state.selectedNode) {
    alert('No node selected');
    return;
  }
  
  const node = state.nodes.get(state.selectedNode);
  if (!node) return;
  
  if (node.data.type !== 'asm.compile') {
    alert('Selected node is not an assemble node');
    return;
  }
  
  const sourceCode = node.data.config?.sourceCode || '';
  state.monacoEditor.setValue(sourceCode);
  
  state.editorAttachedNode = state.selectedNode;
  updateEditorNodeInfo(state.selectedNode);
  updateEditorButtons();
  
  // Switch to editor tab
  document.querySelector('.tab-button[data-tab="editor"]').click();
  
  addLog('info', `Loaded code from node: ${state.selectedNode}`);
}

function saveEditorToNode() {
  if (!state.editorAttachedNode) {
    alert('No node attached to editor');
    return;
  }
  
  const node = state.nodes.get(state.editorAttachedNode);
  if (!node) {
    alert('Attached node not found');
    state.editorAttachedNode = null;
    updateEditorNodeInfo(null);
    updateEditorButtons();
    return;
  }
  
  const code = state.monacoEditor.getValue();
  node.data.config.sourceCode = code;
  
  // Update node description if it's still default
  if (node.data.description === 'Assembly from editor' || node.data.description === 'compile operation') {
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith(';'));
    node.data.description = `Assembly (${lines.length} lines)`;
    const descEl = node.element.querySelector('.node-description');
    if (descEl) descEl.textContent = node.data.description;
  }
  
  addLog('success', `Saved code to node: ${state.editorAttachedNode}`);
  showValidationResult('success', '✓ Code saved to node');
}

function updateEditorNodeInfo(nodeId) {
  const infoEl = document.getElementById('editor-node-info');
  if (nodeId) {
    infoEl.textContent = `Attached to: ${nodeId}`;
    infoEl.classList.add('attached');
  } else {
    infoEl.textContent = 'No node attached';
    infoEl.classList.remove('attached');
  }
}

function updateEditorButtons() {
  const hasAttachedNode = !!state.editorAttachedNode;
  const hasSelectedAssembleNode = state.selectedNode && 
    state.nodes.get(state.selectedNode)?.data.type === 'asm.compile';
  
  document.getElementById('load-node-code').disabled = !hasSelectedAssembleNode;
  document.getElementById('save-to-node').disabled = !hasAttachedNode;
}

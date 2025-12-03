/**
 * FlowASM Server
 * Main entry point for the unified n8n-style platform
 */

import express from 'express';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { WorkflowRunner } from './core/runner.js';
import { createAPI } from './core/api.js';
import { AsmSandboxConnector } from './engines/asm-sandbox/adapter.js';
import { TK5Connector } from './connectors/tk5/connector.js';
import { ZOSConnector } from './connectors/zos/connector.js';
import { ZeroFrameConnector } from './connectors/zeroframe/connector.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Initialize runner and connectors
const runner = new WorkflowRunner();

// Register connectors
runner.registerConnector('asm', new AsmSandboxConnector());
runner.registerConnector('tk5', new TK5Connector());
runner.registerConnector('zos', new ZOSConnector());
runner.registerConnector('zeroframe', new ZeroFrameConnector());

runner.initialize();

// Load demo workflows
async function loadDemoWorkflows() {
  const workflowFiles = ['payroll-demo', 'tk5-demo', 'zos-integration'];
  
  for (const file of workflowFiles) {
    try {
      const content = await readFile(join(__dirname, 'workflows', `${file}.json`), 'utf-8');
      const workflow = JSON.parse(content);
      runner.loadWorkflow(workflow);
      console.log(`✓ Loaded workflow: ${workflow.name}`);
    } catch (error) {
      console.log(`⚠ Could not load ${file}.json: ${error.message}`);
    }
  }
}

// Create Express app
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'ui')));

// API routes
app.use('/api', createAPI(runner));

// Start server
async function start() {
  await loadDemoWorkflows();
  
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║              FlowASM Server Started                   ║
╚═══════════════════════════════════════════════════════╝

🚀 Server:    http://localhost:${PORT}
📊 API:       http://localhost:${PORT}/api/health
🎨 UI:        http://localhost:${PORT}

Connectors:
  • asm-sandbox:  ${runner.connectors.asm.isAvailable ? '✓ Available' : '✗ Unavailable'}
  • tk5:          ${runner.connectors.tk5.isAvailable ? '✓ Available' : '✗ Stubbed'}
  • zos:          ${runner.connectors.zos.isAvailable ? '✓ Available' : '✗ Stubbed'}
  • zeroframe:    ${runner.connectors.zeroframe.isAvailable ? '✓ Available' : '✗ Stubbed'}

Ready for workflows! 🎃
`);
  });
}

start().catch(console.error);

/**
 * FlowASM REST API
 * Express routes for workflow management and execution
 */

import express from 'express';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createAPI(runner) {
  const router = express.Router();

  // Health check
  router.get('/health', (req, res) => {
    const connectorStatus = {};
    for (const [name, connector] of Object.entries(runner.connectors)) {
      connectorStatus[name] = connector.isAvailable ? 'UP' : 'STUBBED';
    }

    res.json({
      status: 'UP',
      service: 'FlowASM',
      connectors: connectorStatus
    });
  });

  // List workflows
  router.get('/workflows', (req, res) => {
    res.json(runner.listWorkflows());
  });

  // Get workflow by ID
  router.get('/workflows/:id', async (req, res) => {
    try {
      const workflowPath = join(__dirname, '../workflows', `${req.params.id}.json`);
      const content = await readFile(workflowPath, 'utf-8');
      res.json(JSON.parse(content));
    } catch (error) {
      res.status(404).json({ error: 'Workflow not found' });
    }
  });

  // Execute workflow
  router.post('/workflows/execute', async (req, res) => {
    try {
      const workflow = req.body;
      const result = await runner.execute(workflow);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        status: 'ERROR'
      });
    }
  });

  return router;
}

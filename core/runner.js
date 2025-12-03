/**
 * FlowASM Workflow Runner
 * Loads and executes workflows with connector management
 */

import { FlowEngine } from './flow-engine.js';

export class WorkflowRunner {
  constructor() {
    this.workflows = new Map();
    this.connectors = {};
    this.engine = null;
  }

  /**
   * Register a connector
   */
  registerConnector(name, connector) {
    this.connectors[name] = connector;
  }

  /**
   * Initialize engine with registered connectors
   */
  initialize() {
    this.engine = new FlowEngine(this.connectors);
  }

  /**
   * Load a workflow
   */
  loadWorkflow(workflow) {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Execute a workflow by ID
   */
  async executeWorkflow(workflowId) {
    if (!this.engine) {
      throw new Error('Runner not initialized. Call initialize() first.');
    }

    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    return await this.engine.execute(workflow);
  }

  /**
   * Execute a workflow definition directly
   */
  async execute(workflow) {
    if (!this.engine) {
      this.initialize();
    }
    return await this.engine.execute(workflow);
  }

  /**
   * List all loaded workflows
   */
  listWorkflows() {
    return Array.from(this.workflows.values()).map(w => ({
      id: w.id,
      name: w.name,
      description: w.description,
      nodeCount: w.nodes.length
    }));
  }
}

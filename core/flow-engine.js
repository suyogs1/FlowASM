/**
 * FlowASM Core Engine
 * n8n-style workflow orchestrator with template resolution
 */

export class FlowEngine {
  constructor(connectors = {}) {
    this.connectors = connectors;
    this.executionLog = [];
  }

  /**
   * Execute a workflow
   * @param {Object} workflow - Workflow definition
   * @returns {Promise<Object>} Execution result
   */
  async execute(workflow) {
    const startTime = Date.now();
    const results = {
      workflowId: workflow.id,
      name: workflow.name,
      status: 'RUNNING',
      nodes: [],
      logs: [],
      duration: 0
    };

    try {
      for (const node of workflow.nodes) {
        const nodeResult = await this.executeNode(node, results.nodes);
        results.nodes.push(nodeResult);
        
        if (!nodeResult.success) {
          results.status = 'FAILED';
          results.logs.push(`Node ${node.id} failed: ${nodeResult.error}`);
          break;
        }
      }

      if (results.status === 'RUNNING') {
        results.status = 'SUCCESS';
      }
    } catch (error) {
      results.status = 'ERROR';
      results.logs.push(`Workflow error: ${error.message}`);
    }

    results.duration = Date.now() - startTime;
    return results;
  }

  /**
   * Execute a single node
   */
  async executeNode(node, previousNodes) {
    const startTime = Date.now();
    const result = {
      id: node.id,
      type: node.type,
      description: node.description,
      success: false,
      artifacts: {},
      logs: [],
      metadata: {},
      duration: 0
    };

    try {
      // Resolve template variables in config
      const resolvedConfig = this.resolveTemplates(node.config, previousNodes);
      
      // Parse node type (e.g., "asm.compile" -> connector="asm", action="compile")
      const [connectorName, action] = node.type.split('.');
      
      // Get connector
      const connector = this.connectors[connectorName];
      if (!connector) {
        throw new Error(`Connector not found: ${connectorName}`);
      }

      // Execute via connector
      const response = await connector.execute({
        run_id: `${node.id}_${Date.now()}`,
        node_type: node.type,
        inputs: resolvedConfig,
        meta: node.meta || {}
      });

      result.success = response.status === 'SUCCESS';
      result.artifacts = response.artifacts || {};
      result.logs = response.logs || [];
      result.metadata = response.metadata || {};
      
    } catch (error) {
      result.success = false;
      result.error = error.message;
      result.logs.push(`Error: ${error.message}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Resolve template variables like {{node.X.artifacts.Y}}
   */
  resolveTemplates(config, previousNodes) {
    const resolved = {};
    
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string' && value.includes('{{')) {
        resolved[key] = this.resolveTemplate(value, previousNodes);
      } else {
        resolved[key] = value;
      }
    }
    
    return resolved;
  }

  resolveTemplate(template, previousNodes) {
    // Match {{node.X.artifacts.Y}} or {{node.X.Y}}
    const regex = /\{\{node\.([^.}]+)\.(.+?)\}\}/g;
    
    return template.replace(regex, (match, nodeId, path) => {
      const node = previousNodes.find(n => n.id === nodeId);
      if (!node) return match;
      
      // Navigate path (e.g., "artifacts.bytecode")
      const parts = path.split('.');
      let value = node;
      for (const part of parts) {
        value = value[part];
        if (value === undefined) return match;
      }
      
      return value;
    });
  }
}

/**
 * ASM Sandbox Engine Adapter
 * Embeds IPLLab asm engine for sandboxed assembly execution
 */

import { AsmEngine } from './engine.js';

export class AsmSandboxConnector {
  constructor() {
    this.engine = new AsmEngine();
    this.isAvailable = true;
  }

  /**
   * Unified execute endpoint
   */
  async execute({ run_id, node_type, inputs, meta }) {
    const [, action] = node_type.split('.');
    
    switch (action) {
      case 'compile':
        return await this.compile(inputs, run_id);
      case 'run':
        return await this.run(inputs, run_id);
      case 'debug':
        return await this.debug(inputs, run_id);
      default:
        return {
          run_id,
          status: 'FAIL',
          logs: [`Unknown action: ${action}`],
          artifacts: {},
          metadata: {}
        };
    }
  }

  async compile(inputs, run_id) {
    try {
      const result = this.engine.assemble(inputs.sourceCode || inputs.code);
      
      return {
        run_id,
        status: 'SUCCESS',
        artifacts: {
          bytecode: result.bytecode,
          instructions: result.instructions,
          labels: result.labels || {}
        },
        logs: [`Compiled ${result.instructions} instructions`],
        metadata: {
          engine: 'asm-sandbox',
          stubbed: false
        }
      };
    } catch (error) {
      return {
        run_id,
        status: 'FAIL',
        artifacts: {},
        logs: [`Compilation error: ${error.message}`],
        metadata: { engine: 'asm-sandbox' }
      };
    }
  }

  async run(inputs, run_id) {
    try {
      const result = this.engine.execute(inputs.bytecode);
      
      return {
        run_id,
        status: 'SUCCESS',
        artifacts: {
          registers: result.registers,
          output: result.output,
          exitCode: result.exitCode
        },
        logs: result.logs || [`Executed successfully`],
        metadata: {
          engine: 'asm-sandbox',
          cycles: result.cycles || 0,
          stubbed: false
        }
      };
    } catch (error) {
      return {
        run_id,
        status: 'FAIL',
        artifacts: {},
        logs: [`Execution error: ${error.message}`],
        metadata: { engine: 'asm-sandbox' }
      };
    }
  }

  async debug(inputs, run_id) {
    try {
      const result = this.engine.debug(inputs.bytecode, inputs.breakpoints || []);
      
      return {
        run_id,
        status: 'SUCCESS',
        artifacts: {
          breakpointsHit: result.breakpointsHit,
          stepsExecuted: result.stepsExecuted,
          finalState: result.finalState
        },
        logs: [`Debug session completed`],
        metadata: {
          engine: 'asm-sandbox',
          stubbed: false
        }
      };
    } catch (error) {
      return {
        run_id,
        status: 'FAIL',
        artifacts: {},
        logs: [`Debug error: ${error.message}`],
        metadata: { engine: 'asm-sandbox' }
      };
    }
  }
}

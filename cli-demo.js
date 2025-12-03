/**
 * FlowASM CLI Demo
 * Run workflows from command line
 */

import { readFile } from 'fs/promises';
import { WorkflowRunner } from './core/runner.js';
import { AsmSandboxConnector } from './engines/asm-sandbox/adapter.js';
import { TK5Connector } from './connectors/tk5/connector.js';
import { ZOSConnector } from './connectors/zos/connector.js';
import { ZeroFrameConnector } from './connectors/zeroframe/connector.js';

async function runDemo() {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║              FlowASM CLI Demo                         ║
║         Unified Mainframe Workflow Platform           ║
╚═══════════════════════════════════════════════════════╝
`);

  // Initialize runner
  const runner = new WorkflowRunner();
  
  // Register connectors
  console.log('Initializing connectors...');
  runner.registerConnector('asm', new AsmSandboxConnector());
  runner.registerConnector('tk5', new TK5Connector());
  runner.registerConnector('zos', new ZOSConnector());
  runner.registerConnector('zeroframe', new ZeroFrameConnector());
  
  runner.initialize();
  
  // Show connector status
  console.log('\nConnector Status:');
  for (const [name, connector] of Object.entries(runner.connectors)) {
    const status = connector.isAvailable ? '✓ Available' : '⚠ Stubbed';
    console.log(`  ${name.padEnd(12)} ${status}`);
  }
  
  // Load and run payroll demo
  console.log('\n' + '='.repeat(55));
  console.log('Running: Payroll Processing Demo (Sandbox)');
  console.log('='.repeat(55) + '\n');
  
  try {
    const workflowJson = await readFile('./workflows/payroll-demo.json', 'utf-8');
    const workflow = JSON.parse(workflowJson);
    
    const result = await runner.execute(workflow);
    
    // Display results
    console.log(`\nWorkflow: ${result.name}`);
    console.log(`Status: ${result.status}`);
    console.log(`Duration: ${result.duration}ms\n`);
    
    result.nodes.forEach((node, index) => {
      const icon = node.success ? '✓' : '✗';
      const color = node.success ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';
      
      console.log(`${color}${icon}${reset} [${node.id}] ${node.type}`);
      console.log(`  ${node.description}`);
      console.log(`  Duration: ${node.duration}ms`);
      
      if (node.logs && node.logs.length) {
        node.logs.forEach(log => {
          console.log(`  📝 ${log}`);
        });
      }
      
      if (node.metadata && node.metadata.stubbed) {
        console.log(`  ⚠️  Stubbed connector`);
      }
      
      console.log('');
    });
    
    // Summary
    const successCount = result.nodes.filter(n => n.success).length;
    const totalCount = result.nodes.length;
    
    console.log('='.repeat(55));
    console.log(`Summary: ${successCount}/${totalCount} nodes succeeded`);
    console.log(`Total time: ${result.duration}ms`);
    console.log('='.repeat(55));
    
    if (result.status === 'SUCCESS') {
      console.log('\n✅ Demo completed successfully!\n');
      console.log('Next steps:');
      console.log('  • Run web UI: npm start');
      console.log('  • Configure TK5: export TK5_ENDPOINT=http://localhost:8038');
      console.log('  • Configure z/OS: see docs/CREDENTIALS_TEMPLATE.md');
    } else {
      console.log('\n❌ Demo failed. Check logs above for details.\n');
    }
    
  } catch (error) {
    console.error('\n❌ Error running demo:', error.message);
    process.exit(1);
  }
}

runDemo();

/**
 * FlowASM Setup Test
 * Verifies all components are properly configured
 */

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

console.log('🔍 FlowASM Setup Verification\n');

const checks = [];

// Check core files
const coreFiles = [
  'core/runner.js',
  'core/flow-engine.js',
  'core/api.js'
];

console.log('Checking core files...');
for (const file of coreFiles) {
  const exists = existsSync(file);
  checks.push({ name: `Core: ${file}`, status: exists });
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}

// Check engines
const engineFiles = [
  'engines/asm-sandbox/adapter.js',
  'engines/asm-sandbox/engine.js'
];

console.log('\nChecking engines...');
for (const file of engineFiles) {
  const exists = existsSync(file);
  checks.push({ name: `Engine: ${file}`, status: exists });
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}

// Check connectors
const connectorFiles = [
  'connectors/tk5/connector.js',
  'connectors/zos/connector.js',
  'connectors/zeroframe/connector.js'
];

console.log('\nChecking connectors...');
for (const file of connectorFiles) {
  const exists = existsSync(file);
  checks.push({ name: `Connector: ${file}`, status: exists });
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}

// Check UI
const uiFiles = [
  'ui/index.html',
  'ui/app.js',
  'ui/styles.css'
];

console.log('\nChecking UI...');
for (const file of uiFiles) {
  const exists = existsSync(file);
  checks.push({ name: `UI: ${file}`, status: exists });
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}

// Check workflows
const workflowFiles = [
  'workflows/payroll-demo.json',
  'workflows/tk5-demo.json',
  'workflows/zos-integration.json'
];

console.log('\nChecking workflows...');
for (const file of workflowFiles) {
  const exists = existsSync(file);
  checks.push({ name: `Workflow: ${file}`, status: exists });
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}

// Check documentation
const docFiles = [
  'README.md',
  'docs/README_DEMO.md',
  'docs/CREDENTIALS_TEMPLATE.md',
  'docs/SUBMISSION_REPORT.md'
];

console.log('\nChecking documentation...');
for (const file of docFiles) {
  const exists = existsSync(file);
  checks.push({ name: `Doc: ${file}`, status: exists });
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}

// Check main files
const mainFiles = [
  'server.js',
  'cli-demo.js',
  'package.json',
  '.gitignore'
];

console.log('\nChecking main files...');
for (const file of mainFiles) {
  const exists = existsSync(file);
  checks.push({ name: `Main: ${file}`, status: exists });
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}

// Verify package.json
console.log('\nVerifying package.json...');
try {
  const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
  const hasExpress = pkg.dependencies && pkg.dependencies.express;
  const noPython = !JSON.stringify(pkg).includes('python');
  
  checks.push({ name: 'Express dependency', status: hasExpress });
  checks.push({ name: 'No Python dependencies', status: noPython });
  
  console.log(`  ${hasExpress ? '✓' : '✗'} Express dependency`);
  console.log(`  ${noPython ? '✓' : '✗'} No Python dependencies`);
} catch (error) {
  console.log(`  ✗ Error reading package.json: ${error.message}`);
}

// Summary
console.log('\n' + '='.repeat(50));
const passed = checks.filter(c => c.status).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`Summary: ${passed}/${total} checks passed (${percentage}%)`);

if (passed === total) {
  console.log('\n✅ All checks passed! FlowASM is ready to run.');
  console.log('\nNext steps:');
  console.log('  • Run demo: npm run demo');
  console.log('  • Start server: npm start');
  console.log('  • Open UI: http://localhost:3000');
} else {
  console.log('\n⚠️ Some checks failed. Please review the output above.');
  process.exit(1);
}

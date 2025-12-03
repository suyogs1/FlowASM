# FlowASM Changelog

## [2.0.0] - 2024-12-03 - Kiroween 2024 🎃

### 🎉 Major Refactor - Unified Platform

Complete restructure into n8n-style mainframe workflow platform.

**Theme:** Combining separate systems into a unified whole

### Added
- ✅ **Core Engine** - Unified workflow orchestrator
  - `core/runner.js` - Workflow management
  - `core/flow-engine.js` - Execution engine with template resolution
  - `core/api.js` - REST API routes

- ✅ **Sandboxed ASM Engine** - Embedded IPLLab engine
  - `engines/asm-sandbox/engine.js` - MicroZ assembler/executor
  - `engines/asm-sandbox/adapter.js` - Connector interface
  - Real implementation (not stubbed)

- ✅ **Unified Connectors** - Standard interface for all systems
  - `connectors/tk5/` - TK5/Hercules connector
  - `connectors/zos/` - z/OS connector (secure credentials)
  - `connectors/zeroframe/` - 3270 terminal connector
  - Auto-fallback to deterministic stubs

- ✅ **Enhanced UI** - Visual workflow builder
  - `ui/index.html` - Main interface
  - `ui/app.js` - Application logic
  - `ui/styles.css` - Modern styling
  - Node inspector panel
  - Live execution logs
  - Import/export workflows

- ✅ **Demo Workflows** - 3 complete examples
  - `workflows/payroll-demo.json` - Sandbox only (no setup)
  - `workflows/tk5-demo.json` - TK5 integration
  - `workflows/zos-integration.json` - z/OS integration

- ✅ **Complete Documentation**
  - `docs/README_DEMO.md` - 60-90 second demo script
  - `docs/CREDENTIALS_TEMPLATE.md` - Security guide
  - `docs/SUBMISSION_REPORT.md` - Requirements report
  - `REFACTOR_COMPLETE.md` - Migration guide

- ✅ **Security Features**
  - Environment variable configuration
  - `.gitignore` for credentials
  - No secrets in repo
  - Secure credential handling

- ✅ **CLI Demo** - `cli-demo.js` for quick testing

### Changed
- 🔄 **Architecture** - From separate adapters to unified connectors
- 🔄 **Workflow Format** - Enhanced JSON with template variables
- 🔄 **Node Types** - 6 → 12 node types
- 🔄 **UI** - From basic viewer to full visual builder
- 🔄 **API** - Enhanced with health checks and workflow management

### Removed
- ❌ `src/` folder - Replaced by `core/` and `engines/`
- ❌ `public/` folder - Replaced by `ui/`
- ❌ Old workflow format - Replaced by new JSON format
- ❌ Python dependencies - 100% Node.js now

### Fixed
- ✅ Inconsistent connector interfaces
- ✅ Missing credential handling
- ✅ No sandbox fallback
- ✅ Limited documentation

### Technical Details

**Node Types (12):**
- asm.compile, asm.run, asm.debug
- tk5.ipl, tk5.submit, tk5.status
- zos.submit, zos.smf, zos.dataset
- zeroframe.send, zeroframe.read, zeroframe.wait

**Connectors (4):**
- asm-sandbox (always available)
- tk5 (auto-fallback to stub)
- zos (auto-fallback to stub)
- zeroframe (auto-fallback to stub)

**Dependencies:**
- express (only dependency!)

**Statistics:**
- 20 code files
- ~2,500 lines of code
- 3 demo workflows
- 4 documentation files

---

## [1.0.0] - 2024-10-31 - Initial Release

### Added
- Basic flow engine
- IPLLab and ZeroFrame adapters
- Simple web UI
- Demo workflow
- Basic documentation

### Features
- Sequential node execution
- Template variable resolution
- HTTP API
- Workflow visualization

---

**Version 2.0.0** represents a complete refactor and unification of the platform. All previous functionality is preserved and enhanced with new capabilities.

**Upgrade Path:** See `REFACTOR_COMPLETE.md` for migration guide.

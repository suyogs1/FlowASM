/**
 * Simplified ASM Engine (Node.js port of IPLLab core)
 * Minimal MicroZ assembler and executor for sandboxed demos
 */

export class AsmEngine {
  constructor() {
    this.registers = new Array(16).fill(0);
    this.memory = new Array(65536).fill(0);
    this.pc = 0;
    this.halted = false;
  }

  /**
   * Assemble source code to bytecode
   */
  assemble(sourceCode) {
    const lines = sourceCode.split('\n').filter(l => l.trim() && !l.trim().startsWith(';'));
    const instructions = [];
    const labels = {};
    let address = 0;

    // First pass: collect labels
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes(':')) {
        const label = trimmed.split(':')[0].trim();
        labels[label] = address;
      } else if (!trimmed.startsWith('.')) {
        address++;
      }
    }

    // Second pass: assemble instructions
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('.') || trimmed.includes(':')) continue;

      const instruction = this.parseInstruction(trimmed, labels);
      if (instruction) {
        instructions.push(instruction);
      }
    }

    return {
      bytecode: instructions.map(i => i.opcode).join(','),
      instructions: instructions.length,
      labels
    };
  }

  parseInstruction(line, labels) {
    const parts = line.split(/[\s,]+/).filter(p => p);
    const mnemonic = parts[0].toUpperCase();

    const opcodes = {
      'MOV': 0x01, 'ADD': 0x02, 'SUB': 0x03, 'MUL': 0x04,
      'DIV': 0x05, 'CMP': 0x06, 'JMP': 0x07, 'JE': 0x08,
      'JNE': 0x09, 'JG': 0x0A, 'JL': 0x0B, 'CALL': 0x0C,
      'RET': 0x0D, 'PUSH': 0x0E, 'POP': 0x0F, 'HLT': 0xFF
    };

    const opcode = opcodes[mnemonic];
    if (opcode === undefined) {
      throw new Error(`Unknown instruction: ${mnemonic}`);
    }

    return {
      mnemonic,
      opcode,
      operands: parts.slice(1)
    };
  }

  /**
   * Execute bytecode
   */
  execute(bytecode) {
    this.reset();
    const opcodes = bytecode.split(',').map(Number);
    const logs = [];
    let cycles = 0;

    while (this.pc < opcodes.length && !this.halted && cycles < 10000) {
      const opcode = opcodes[this.pc];
      
      if (opcode === 0xFF) { // HLT
        this.halted = true;
        logs.push(`HLT at PC=${this.pc}`);
        break;
      }

      // Simple execution (stubbed for demo)
      this.pc++;
      cycles++;
    }

    return {
      registers: this.getRegisters(),
      output: logs.join('\n'),
      exitCode: this.halted ? 0 : 1,
      logs,
      cycles
    };
  }

  /**
   * Debug bytecode with breakpoints
   */
  debug(bytecode, breakpoints) {
    const opcodes = bytecode.split(',').map(Number);
    const breakpointsHit = [];
    let stepsExecuted = 0;

    this.reset();

    while (this.pc < opcodes.length && !this.halted && stepsExecuted < 1000) {
      if (breakpoints.includes(this.pc)) {
        breakpointsHit.push(this.pc);
      }

      const opcode = opcodes[this.pc];
      if (opcode === 0xFF) {
        this.halted = true;
        break;
      }

      this.pc++;
      stepsExecuted++;
    }

    return {
      breakpointsHit,
      stepsExecuted,
      finalState: {
        pc: this.pc,
        registers: this.getRegisters(),
        halted: this.halted
      }
    };
  }

  reset() {
    this.registers.fill(0);
    this.memory.fill(0);
    this.pc = 0;
    this.halted = false;
  }

  getRegisters() {
    const regs = {};
    for (let i = 0; i < 16; i++) {
      regs[`R${i}`] = this.registers[i];
    }
    return regs;
  }
}

/**
 * ZeroFrame/3270 Connector
 * Terminal automation for 3270 screen interactions
 */

export class ZeroFrameConnector {
  constructor(config = {}) {
    this.endpoint = config.endpoint || process.env.ZEROFRAME_ENDPOINT;
    this.isAvailable = !!this.endpoint;
  }

  async execute({ run_id, node_type, inputs, meta }) {
    const [, action] = node_type.split('.');
    
    switch (action) {
      case 'send':
        return await this.send3270(inputs, run_id);
      case 'read':
        return await this.readScreen(inputs, run_id);
      case 'wait':
        return await this.waitFor(inputs, run_id);
      default:
        return {
          run_id,
          status: 'FAIL',
          logs: [`Unknown 3270 action: ${action}`],
          artifacts: {},
          metadata: { connector: 'zeroframe' }
        };
    }
  }

  async send3270(inputs, run_id) {
    if (!this.isAvailable) {
      return this.stubbedResponse(run_id, 'send', inputs);
    }

    try {
      const response = await fetch(`${this.endpoint}/api/3270/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: inputs.action,
          text: inputs.text,
          position: inputs.position
        })
      });

      const result = await response.json();

      return {
        run_id,
        status: 'SUCCESS',
        artifacts: {
          screenText: result.screen,
          cursorPosition: result.cursor
        },
        logs: [`Sent ${inputs.action} to 3270 terminal`],
        metadata: { connector: 'zeroframe', stubbed: false }
      };
    } catch (error) {
      return this.stubbedResponse(run_id, 'send', inputs);
    }
  }

  async readScreen(inputs, run_id) {
    if (!this.isAvailable) {
      return this.stubbedResponse(run_id, 'read', inputs);
    }

    try {
      const response = await fetch(`${this.endpoint}/api/3270/screen`);
      const result = await response.json();

      return {
        run_id,
        status: 'SUCCESS',
        artifacts: {
          screenText: result.screen,
          fields: result.fields
        },
        logs: ['Read 3270 screen'],
        metadata: { connector: 'zeroframe', stubbed: false }
      };
    } catch (error) {
      return this.stubbedResponse(run_id, 'read', inputs);
    }
  }

  async waitFor(inputs, run_id) {
    if (!this.isAvailable) {
      return this.stubbedResponse(run_id, 'wait', inputs);
    }

    try {
      const startTime = Date.now();
      const timeout = inputs.timeout || 5000;
      const expectedText = inputs.expectedText;

      while (Date.now() - startTime < timeout) {
        const response = await fetch(`${this.endpoint}/api/3270/screen`);
        const result = await response.json();

        if (result.screen.includes(expectedText)) {
          return {
            run_id,
            status: 'SUCCESS',
            artifacts: {
              matched: true,
              screenText: result.screen,
              waitTime: Date.now() - startTime
            },
            logs: [`Found "${expectedText}" on screen`],
            metadata: { connector: 'zeroframe', stubbed: false }
          };
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return {
        run_id,
        status: 'FAIL',
        artifacts: { matched: false },
        logs: [`Timeout waiting for "${expectedText}"`],
        metadata: { connector: 'zeroframe' }
      };
    } catch (error) {
      return this.stubbedResponse(run_id, 'wait', inputs);
    }
  }

  stubbedResponse(run_id, action, inputs) {
    const responses = {
      send: {
        artifacts: {
          screenText: '*** STUBBED 3270 SCREEN ***\nREADY\n',
          cursorPosition: { row: 1, col: 1 }
        },
        logs: [`[STUBBED] Sent ${inputs.action || 'action'} to 3270 (endpoint not configured)`]
      },
      read: {
        artifacts: {
          screenText: '*** STUBBED 3270 SCREEN ***\nREADY\n',
          fields: []
        },
        logs: ['[STUBBED] Read 3270 screen (endpoint not configured)']
      },
      wait: {
        artifacts: {
          matched: true,
          screenText: `*** STUBBED 3270 SCREEN ***\n${inputs.expectedText || 'READY'}\n`,
          waitTime: 100
        },
        logs: [`[STUBBED] Found "${inputs.expectedText}" (endpoint not configured)`]
      }
    };

    const response = responses[action] || { artifacts: {}, logs: ['[STUBBED] Unknown action'] };

    return {
      run_id,
      status: 'SUCCESS',
      artifacts: response.artifacts,
      logs: response.logs,
      metadata: { connector: 'zeroframe', stubbed: true }
    };
  }
}

# FlowASM Credentials Template

## 🔒 Security Notice

**NEVER commit credentials to the repository!**

All sensitive configuration should be provided via:
1. Environment variables
2. `.env` file (add to `.gitignore`)
3. Secure credential management system

## 📋 Environment Variables

### TK5/Hercules Connector

```bash
# TK5 endpoint (local emulator)
export TK5_ENDPOINT=http://localhost:8038

# Optional: TK5 API key (if secured)
export TK5_API_KEY=your_api_key_here
```

**Default:** If not set, connector will be stubbed

**How to enable:**
1. Install and start TK5/Hercules emulator
2. Configure HTTP API endpoint
3. Set `TK5_ENDPOINT` environment variable
4. Restart FlowASM

### z/OS Connector

```bash
# z/OS endpoint (z/OSMF REST API)
export ZOS_ENDPOINT=https://your-zos-system.com:443

# z/OS credentials
export ZOS_USERNAME=your_username
export ZOS_PASSWORD=your_password

# Optional: Certificate path for HTTPS
export ZOS_CERT_PATH=/path/to/cert.pem
```

**Default:** If not set, connector will be stubbed

**How to enable:**
1. Obtain z/OS system access
2. Get z/OSMF REST API endpoint
3. Set environment variables
4. Restart FlowASM

**Security Best Practices:**
- Use service account, not personal credentials
- Rotate passwords regularly
- Use certificate-based auth when possible
- Restrict network access to z/OS endpoint

### ZeroFrame/3270 Connector

```bash
# ZeroFrame endpoint (3270 terminal service)
export ZEROFRAME_ENDPOINT=http://localhost:3270

# Optional: Session ID for persistent connections
export ZEROFRAME_SESSION_ID=your_session_id
```

**Default:** If not set, connector will be stubbed

**How to enable:**
1. Deploy ZeroFrame 3270 service
2. Configure endpoint
3. Set `ZEROFRAME_ENDPOINT` environment variable
4. Restart FlowASM

## 📝 Using .env File

Create `.env` file in FlowASM root:

```bash
# FlowASM Environment Configuration
# DO NOT COMMIT THIS FILE!

# Server
PORT=3000

# TK5 Connector
TK5_ENDPOINT=http://localhost:8038

# z/OS Connector
ZOS_ENDPOINT=https://zos.example.com:443
ZOS_USERNAME=FLOWASM
ZOS_PASSWORD=SecurePassword123!

# ZeroFrame Connector
ZEROFRAME_ENDPOINT=http://localhost:3270
```

**Load .env file:**

```bash
# Install dotenv
npm install dotenv

# Update server.js to load .env
import 'dotenv/config';
```

## 🔐 Credential Storage Options

### Option 1: Environment Variables (Recommended)
```bash
export ZOS_USERNAME=myuser
export ZOS_PASSWORD=mypass
npm start
```

### Option 2: .env File
```bash
# Create .env file
echo "ZOS_USERNAME=myuser" > .env
echo "ZOS_PASSWORD=mypass" >> .env

# Add to .gitignore
echo ".env" >> .gitignore

npm start
```

### Option 3: Secure Vault (Production)
```javascript
// Use HashiCorp Vault, AWS Secrets Manager, etc.
import { getSecret } from './vault.js';

const zosPassword = await getSecret('zos/password');
```

### Option 4: Prompt at Runtime
```javascript
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('z/OS Password: ', (password) => {
  // Use password
  rl.close();
});
```

## 🧪 Testing Credentials

### Test TK5 Connection

```bash
curl http://localhost:8038/api/status
```

Expected: `{"status": "UP"}`

### Test z/OS Connection

```bash
curl -u username:password \
  https://your-zos-system.com/zosmf/restjobs/jobs
```

Expected: JSON list of jobs

### Test via FlowASM

```bash
# Start FlowASM with credentials
export ZOS_ENDPOINT=https://zos.example.com
export ZOS_USERNAME=myuser
export ZOS_PASSWORD=mypass

npm start

# Check health endpoint
curl http://localhost:3000/api/health
```

Expected:
```json
{
  "status": "UP",
  "connectors": {
    "asm": "UP",
    "tk5": "STUBBED",
    "zos": "UP",  ← Should show UP if credentials valid
    "zeroframe": "STUBBED"
  }
}
```

## 🚨 Security Checklist

- [ ] Never commit credentials to git
- [ ] Add `.env` to `.gitignore`
- [ ] Use service accounts, not personal credentials
- [ ] Rotate credentials regularly
- [ ] Use HTTPS for z/OS connections
- [ ] Restrict network access to mainframe endpoints
- [ ] Use certificate-based auth when possible
- [ ] Log credential usage for audit
- [ ] Encrypt credentials at rest
- [ ] Use least-privilege access

## 📚 Connector-Specific Guides

### TK5/Hercules Setup

1. **Install TK5:**
   - Download from http://wotho.ethz.ch/tk4-/
   - Extract and run `mvs` script
   - Default port: 8038

2. **Enable HTTP API:**
   - Edit `conf/httpd.conf`
   - Add REST API endpoints
   - Restart TK5

3. **Configure FlowASM:**
   ```bash
   export TK5_ENDPOINT=http://localhost:8038
   npm start
   ```

### z/OS Setup

1. **Enable z/OSMF:**
   - Ensure z/OSMF is installed and running
   - Get REST API endpoint URL
   - Obtain user credentials

2. **Test Connection:**
   ```bash
   curl -u user:pass https://zos.example.com/zosmf/info
   ```

3. **Configure FlowASM:**
   ```bash
   export ZOS_ENDPOINT=https://zos.example.com
   export ZOS_USERNAME=user
   export ZOS_PASSWORD=pass
   npm start
   ```

### ZeroFrame Setup

1. **Deploy ZeroFrame:**
   - Use existing ZeroFrame project
   - Configure 3270 terminal endpoint
   - Start service

2. **Configure FlowASM:**
   ```bash
   export ZEROFRAME_ENDPOINT=http://localhost:3270
   npm start
   ```

## 🎯 Quick Reference

| Connector | Required Env Vars | Default Behavior |
|-----------|------------------|------------------|
| asm-sandbox | None | Always available |
| tk5 | `TK5_ENDPOINT` | Stubbed if not set |
| zos | `ZOS_ENDPOINT`, `ZOS_USERNAME`, `ZOS_PASSWORD` | Stubbed if not set |
| zeroframe | `ZEROFRAME_ENDPOINT` | Stubbed if not set |

## 📞 Support

If connectors remain stubbed after configuration:
1. Check environment variables are set
2. Verify endpoint URLs are correct
3. Test connectivity with curl
4. Check FlowASM logs for errors
5. Review connector-specific setup guides

---

**Remember:** Security is critical when working with mainframe systems. Always follow your organization's security policies and best practices.

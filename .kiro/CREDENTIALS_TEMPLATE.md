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
export TK5_ENDPOINT=http://localhost:8038
```

### z/OS Connector

```bash
export ZOS_ENDPOINT=https://your-zos-system.com:443
export ZOS_USERNAME=your_username
export ZOS_PASSWORD=your_password
```

### ZeroFrame/3270 Connector

```bash
export ZEROFRAME_ENDPOINT=http://localhost:3270
```

## Quick Reference

| Connector | Required Env Vars | Default Behavior |
|-----------|------------------|------------------|
| asm-sandbox | None | Always available |
| tk5 | `TK5_ENDPOINT` | Stubbed if not set |
| zos | `ZOS_ENDPOINT`, `ZOS_USERNAME`, `ZOS_PASSWORD` | Stubbed if not set |
| zeroframe | `ZEROFRAME_ENDPOINT` | Stubbed if not set |

See `FlowASM/docs/CREDENTIALS_TEMPLATE.md` for complete guide.

---

**Kiroween 2024** 🎃

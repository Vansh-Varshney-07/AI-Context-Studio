# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public GitHub issue
2. Email us at **security@ai-context-studio.dev** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. We'll acknowledge receipt within 48 hours
4. We'll provide a fix timeline within 7 days
5. We'll coordinate disclosure after a fix is available

## Security Considerations

### Local-First Architecture

AI Context Studio is designed as a local-first application:
- All data stays on your machine by default
- No telemetry or analytics sent without explicit consent
- No required account creation or authentication
- Assets are stored locally in your chosen directory

### Asset Security

- **Asset verification**: All `.acs` assets are verified via SHA-256 checksums before installation
- **Sandboxed execution**: Assets run in isolated contexts with no direct system access
- **No arbitrary code execution**: Assets contain declarative configuration only (prompts, instructions, workflows)
- **Supply chain**: Official assets are signed and verified

### Network Security

- **Optional connectivity**: Network access only for:
  - Marketplace browsing (opt-in)
  - Asset downloads (user-initiated)
  - Update checks (configurable)
- **TLS only**: All external connections use HTTPS/TLS
- **No tracking**: No analytics, fingerprinting, or user tracking

### Desktop App (Tauri)

- **Minimal permissions**: Only required Tauri capabilities enabled
- **CSP enforcement**: Strict Content Security Policy in production
- **No remote code**: All frontend code bundled at build time
- **Allowlist**: Explicit IPC command allowlist

### Web App

- **Static export**: No server-side rendering, no backend attack surface
- **CSP headers**: Security headers configured for static hosting
- **No secrets**: No API keys or secrets in client bundle

## Best Practices for Users

1. **Verify checksums** before installing community assets
2. **Review asset contents** before applying to your AI assistants
3. **Keep app updated** for latest security patches
4. **Use official assets** when possible
5. **Report suspicious assets** via GitHub Issues

## Disclosure Timeline

- **Day 0**: Vulnerability reported
- **Day 1-2**: Acknowledgment and initial assessment
- **Day 3-7**: Fix development and testing
- **Day 7-14**: Patch release and coordinated disclosure
- **Day 14+**: Public advisory (CVE if applicable)

## Contact

Security team: security@ai-context-studio.dev
PGP key: Available on request
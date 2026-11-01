---
name: security-review
description: Review the SPA source and Vercel configuration for security vulnerabilities
argument-hint: '[file path, or empty for everything]'
allowed-tools: Read Glob Grep
---

# Security Review

Read the target source code and configuration, identify vulnerabilities, and report them. Write the report in Japanese.

This is a client-only Vite SPA hosted on Vercel: there is no server code, so everything bundled into `dist/` is public. Review with that threat model, not a server-side one.

## Scope

- If `$ARGUMENTS` is given, review only that file or directory
- Otherwise, review `src/`, `index.html`, `vite.config.ts`, `vercel.json`, `.github/`, and `package.json`

## What to look for

### Secrets and bundle exposure

- Hard-coded secrets (API keys, tokens, passwords) anywhere, including tests and fixtures
- Secrets in a `VITE_`-prefixed variable (everything with that prefix ends up in the public bundle)
- `.env*` files (other than `.env.example`) or `.vercel/` tracked by git
- Source maps or debug code shipped to production

### Client-side injection

- XSS: `dangerouslySetInnerHTML`, direct `innerHTML`, unsanitized HTML from user input or URLs
- Open redirects or unvalidated navigation targets built from `location` / query params (React Router `navigate`, `<a href>`)
- `javascript:` or untrusted URLs placed in `href` / `src`
- Use of `eval`, `new Function`, or string-based timers

### Data handling

- Sensitive data in `localStorage` / `sessionStorage` or written to `console`
- Trusting client-side checks (role flags, hidden UI) as authorization: the real check must be server-side
- Unvalidated data from external APIs rendered or used without schema checks

### Hosting configuration (`vercel.json`)

- Missing security headers: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, frame protection (`X-Frame-Options` / `frame-ancestors`)
- The SPA fallback rewrite exposing paths that should 404

### Dependencies and CI

- Dependencies with known vulnerabilities (`pnpm audit`)
- Unnecessary or unmaintained dependencies
- GitHub Actions not pinned by SHA, or workflows with broader `permissions` than needed
- Workflow injection: untrusted event data (PR title, branch name) interpolated into `run:` steps

## Output format

Report in this form:

1. Order findings by severity (High → Medium → Low)
2. For each finding, include:
   - Severity (High / Medium / Low)
   - Location (file path:line number)
   - The problematic code snippet
   - A concrete description of the risk
   - A suggested fix
3. End with a summary table

## Notes

- Base findings on the code, not on speculation
- Report problems that actually exist, not a generic list of best practices
- Include concrete code in each suggested fix
- If nothing is found in a category, say so briefly rather than inventing issues

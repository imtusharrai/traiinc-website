# Rules
- **Production Deployments:** Always wait for explicit user approval before running `git push` on the main branch or deploying to a live production environment. Do not treat a verification request as optional, even if the code has been thoroughly checked.
- **Shared Class Regression Checks:** Before applying CSS or logic fixes to generic/shared class names (e.g., `.tech-item-link`, `.mega-dropdown`, `buildMegaMenu()`), always perform a quick "what else uses this class" scope check to prevent regressions in unintended areas.
- **No Browser Automation:** Never invoke browser automation/subagents on this project — confirmed unsupported (no Chrome remote debugging on this macOS host). Always go straight to asking the user for manual visual QA.

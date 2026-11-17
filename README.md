[README.md](https://github.com/user-attachments/files/34948501/README.md)

# Neobank — Educational Savings Goal Simulator (FIN506)

**Team:** Sofía Torres and Bruno Aguirre · Universidad Panamericana · November 2026.

## What it is

Neobank is an **educational prototype** of a savings experience. A fictional person named Alex can create a savings goal, record **simulated** contributions, and view a balance, progress, and history. **It is not a bank**: it does not open accounts, receive money, process transfers, issue loans, or pay interest.

> **Status:** The repository contains `index.html`, `styles.css`, `app.js`, `money.mjs`, `money.test.mjs`, and `seed.json`. The four automated money-logic tests passed during the November 16, 2026 review. **The complete run in an external browser and a public URL still need to be verified by the team.** Do not describe the application as deployed until this has been confirmed.

## Requirements

- A modern browser with JavaScript and `localStorage` enabled.
- Node.js 20 or later for automated tests.
- No third-party dependencies are required.

## How to run the prototype locally

1. Download the repository and open a terminal inside the folder containing `index.html`.
2. Start a static file server, for example:

   ```bash
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000/` in a modern browser.
4. Follow the demo flow: **Enter demo → Save goal → Add simulated contribution → Review contribution → Confirm simulation → View goal and history**.
5. To start over, select **Reset demo**.

**Verification pending:** the command above is a standard way to serve static files, but it must be tested on a clean computer and the result must be documented. If the browser does not support the JSON import used by `app.js`, compatibility must be fixed before submission.

## Data and simulations

- `seed.json` contains only one fictional user: **Alex**.
- The goal and contributions are stored only in the browser's `localStorage`.
- All monetary amounts are calculated in **integer MXN cents**.
- Contributions, folios, balances, and progress are **simulated**. Fees and interest in the demo are MXN 0.00.
- No banking credentials or real personal data are stored.
- The **MXN 29 per month** subscription exists only as a **financial-model assumption**, not as a payment feature of the prototype.

## Automated tests

From the repository root:

```bash
node --test money.test.mjs
```

**Observed result on November 16, 2026:** 4 tests passed; they verify cent parsing, exact summation, rejection of invalid amounts, and safe-integer limits. **They are not an end-to-end test of the browser, double-click handling, or user separation.**

## Main structure

- `SPEC.md`: scope, flow, data model, and assumptions.
- `DECISIONS.md`: team decisions and rationale.
- `BITACORA.md`: session log to be completed by team members.
- `PROJECT_METHOD.md` and `AGENTS.md`: working method and constraints.
- `index.html`, `styles.css`, `app.js`: prototype interface and logic.
- `money.mjs`, `money.test.mjs`: money logic and tests.
- `seed.json`: initial fictional data.

## Important FIN506 items pending

- [ ] **Review the scope discrepancy with the professor:** `SPEC.md` excludes login and multi-user support, while the final guide requires authentication and per-user data isolation. Do not claim that this requirement is met.
- [ ] Confirm with the professor that the scope was adopted after the Advancement 2 freeze (`TODO-verify`).
- [ ] Verify the complete browser flow, including cancellation, double confirmation, errors, and persistence.
- [ ] Provide a public URL or build that the professor can open without assistance; do not place credentials in GitHub.
- [ ] Record a backup of the demo, no longer than two minutes.
- [ ] Align the visible `compass` name in `index.html` with the **Neobank** project brand, after a team decision.
- [ ] Document pull requests reviewed by the teammate and complete `BITACORA.md` with real sessions.
- [ ] Mark any unconfirmed legal statement as `TODO-verify`.

## Financial model and validation

The team's exploratory survey received **30 responses**; the pricing question had **28 valid responses**, of which **8** said they would pay MXN 29 per month. This **does not represent actual customers**. User, CAC, churn, revenue, and valuation projections are hypotheses documented in the FIN506 financial spreadsheet.

---

**Before replacing the repository README:** both team members should review this text, run the instructions, approve the changes through a pull request, and record the actual session in `BITACORA.md`.

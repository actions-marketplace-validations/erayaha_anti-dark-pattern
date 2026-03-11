# Examples — Real-World Dark Pattern Cases

Each subdirectory contains a React component (`.jsx`) that closely recreates the
actual UI from a high-profile legal case. Use these as ground-truth test fixtures
for the `anti-dark-pattern` linter.

---

## Case 1 — Amazon Prime Cancellation ("Iliad Flow")

| | |
|---|---|
| **File** | `amazon-prime-cancellation/AmazonPrimeCancellation.jsx` |
| **Legal action** | FTC v. Amazon.com, Inc. (filed 2023) → **$2.5B settlement** (Sep 2025) |
| **Dark patterns** | `confirm-shaming` · `roach-motel` · `misdirection` · `forced-continuity` |
| **What happened** | Amazon forced users through 4–6 screens to cancel Prime, including a surprise retention offer, a mandatory reason survey, and buttons whose copy shamed users ("No thanks, I don't want FREE delivery") |

**To run:**
```bash
npx anti-dark-pattern scan examples/amazon-prime-cancellation/
```

---

## Case 2 — LinkedIn "Add Connections" Email Harvesting

| | |
|---|---|
| **File** | `linkedin-add-connections/LinkedInAddConnections.jsx` |
| **Legal action** | Perkins v. LinkedIn Corp. (N.D. Cal., 2015) → **$13M settlement** |
| **Dark patterns** | `trick-question` · `roach-motel` |
| **What happened** | LinkedIn pre-checked all imported contacts and sent invitation emails (plus up to 2 reminders) on behalf of new users without explicit per-contact consent |

**To run:**
```bash
npx anti-dark-pattern scan examples/linkedin-add-connections/
```

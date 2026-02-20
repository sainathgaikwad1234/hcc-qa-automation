# Login – Test Scenarios

Test scenarios for the HCC EMR Portal login functionality (`/counselor/clinician/login`).

---

## Positive / Happy Path

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 1 | **Valid credentials** | User enters valid username and password; clicks Sign In → redirects to post-login page (e.g. dashboard/home). | P0 |
| 2 | **Remember session** | If “Remember me” exists, session persists after browser close (optional). | P2 |

---

## Negative – Invalid Credentials

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 3 | **Wrong password** | Valid username + wrong password → stay on login page, error message shown. | P0 |
| 4 | **Wrong username** | Invalid/unknown username + any password → stay on login page, error message shown. | P0 |
| 5 | **Wrong username and password** | Both invalid → stay on login page, error message shown. | P1 |

---

## Negative – Empty / Missing Input

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 6 | **Empty username** | Password filled, username blank → submit disabled or validation error. | P0 |
| 7 | **Empty password** | Username filled, password blank → submit disabled or validation error. | P0 |
| 8 | **Both fields empty** | No input → submit disabled or validation errors for both. | P1 |

---

## Negative – Format / Validation

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 9 | **Invalid email/username format** | Username not in expected format (e.g. missing @) → inline validation or error on submit. | P1 |
| 10 | **Spaces only** | Username and/or password contain only spaces → treated as invalid. | P2 |

---

## UI & Security

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 11 | **Password masked** | Password field type is password (input not visible as plain text). | P0 |
| 12 | **Login page loads** | Login URL loads; username and password fields and Sign In button are visible. | P0 |
| 13 | **Sign In button state** | Sign In is enabled when form is valid; disabled or loading state as per design. | P2 |

---

## Edge Cases

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 14 | **Case sensitivity** | Verify username/password handling (case-sensitive or not) per product behavior. | P2 |
| 15 | **Multiple failed attempts** | After N failed logins, account lockout or rate limit message (if applicable). | P2 |
| 16 | **Direct URL after login** | When already logged in, visiting login URL redirects to app (no duplicate login form). | P1 |

---

## Summary

- **P0 (Critical):** 1, 3, 4, 6, 7, 11, 12  
- **P1 (Important):** 5, 8, 9, 16  
- **P2 (Nice-to-have):** 2, 10, 13, 14, 15  

**Implemented in this suite:** All scenarios above (1–16, except 2 and 15) in `login.spec.ts`. Scenario 2 (Remember session) and 15 (Multiple failed attempts) are optional/P2 and can be added when the app supports them.

# Scheduling – Test Scenarios

Test scenarios for Scheduling module: Availability, Calendar, Clients, Groups, Book Appointment.

---

## Availability

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 1 | **Configure availability (full flow)** | Create role → add user → Configure Availability → select clinician, date, weeks, timezone, slots, days → Save. | P0 |
| 2 | **View Availability page** | Navigate to Scheduling → Availability → Configure Availability button and/or list visible. | P0 |
| 3 | **Select clinician and open form** | Configure Availability → Select Clinician → pick user → date/time form visible. | P1 |
| 4 | **Edit availability** | Open existing clinician availability → change time or days → Save → changes visible. | P1 |

---

## Calendar

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 5 | **View Calendar** | Navigate to Scheduling → Calendar → calendar view visible. | P0 |
| 6 | **Navigate calendar by date** | Open calendar → change month/week → dates update. | P2 |

---

## Create Client

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 7 | **View Clients page** | Navigate to Clients → Add Client / list visible. | P0 |
| 8 | **Create client** | Add Client → fill first name, last name, DOB → Save → client visible. | P0 |
| 9 | **View clients list** | Clients → list/table visible. | P1 |
| 10 | **Open Add Client form** | Add Client → form with required fields visible. | P1 |

---

## Create Group

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 11 | **Create group with clinician and availability time** | Setup (role, user, availability) → Create Group → select created clinician, set time from availability (e.g. 10:00 AM) → Save. | P0 |
| 12 | **View Groups page** | Navigate to Groups → page visible. | P1 |
| 13 | **Open Create Group form** | Add Group → form visible. | P1 |

---

## Book Appointment

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 14 | **Book appt with clinician and availability slot** | Setup → create client → Calendar → Book Appointment → select created clinician → pick date → time slots (from availability) → select time → select client → Save. | P0 |
| 15 | **View Calendar / booking entry** | Scheduling → Calendar visible. | P0 |
| 16 | **Time slots only when clinician has availability** | Select created clinician → pick date → time slots visible (from configured availability). | P1 |

---

## Summary

- **P0:** 1, 2, 5, 7, 8, 11, 14, 15  
- **P1:** 3, 4, 9, 10, 12, 13, 16  
- **P2:** 6  

**Implemented:** availability.spec.ts, create-client.spec.ts, create-group.spec.ts, book-appt.spec.ts.  
**Shared setup:** `helpers/scheduling-setup.ts` (role, user, availability) used by create-group and book-appt so they use the same clinician and availability times.

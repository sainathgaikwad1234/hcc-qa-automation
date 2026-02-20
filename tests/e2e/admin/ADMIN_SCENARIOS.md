# Admin – Test Scenarios

Test scenarios for Admin module: Roles & Permissions and User Management.

---

## Roles & Permissions

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 1 | **Create clinician role** | New Role → Select Type Clinician → Enter name → Create Role → role visible in list. | P0 |
| 2 | **View roles list** | Navigate to Roles & Permissions → roles table/list and New Role button visible. | P0 |
| 3 | **Edit role** | Create role → click Edit on row → change name → Save → updated name visible. | P1 |
| 4 | **Create role – different type** | Create role with type other than Clinician (if app supports, e.g. Admin). | P2 |

---

## User Management

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 5 | **Add new user** | Add New User → fill form (username, name, role, phone, email, location) → Save → user visible. | P0 |
| 6 | **View users list** | Navigate to User Management → users list and Add New User button visible. | P0 |
| 7 | **Edit user** | Add user → click Edit on row → change name/email → Save → updated data visible. | P1 |
| 8 | **Add user with required role** | Add user and assign existing role; user appears in list with correct role. | P1 |

---

## Summary

- **P0:** 1, 2, 5, 6  
- **P1:** 3, 7, 8  
- **P2:** 4  

**Implemented:** 1, 2, 3, 5, 6, 7, 8 (create role, view roles, edit role, add user, view users, edit user, add user with role).  
**To add:** 4 (other role type).

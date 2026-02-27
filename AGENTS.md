# AGENTS.md

## Purpose

This file defines how AI coding agents (Codex, Copilot Agents, etc.) should operate within this repository. It ensures consistent, safe, and high‑quality automated changes.

Agents must follow these rules unless explicitly instructed otherwise by the user.

---

## Project Overview

* **Frontend:** Angular
* **Backend:** Spring Boot microservices
* **Database:** MongoDB
* **Architecture:** Full‑stack web + mobile responsive

Agents should preserve this stack unless the user explicitly requests a change.

---

## General Behavior Rules

### ✅ Allowed

Agents MAY:

* Read any file in the workspace
* Modify existing code
* Create new files when necessary
* Refactor for clarity and performance
* Fix build and lint errors
* Add unit tests
* Improve TypeScript and Java type safety

### ❌ Not Allowed

Agents MUST NOT:

* Introduce new major frameworks
* Delete large sections of code without reason
* Change authentication logic without instruction
* Modify environment or secret files
* Add paid or proprietary dependencies
* Break existing API contracts

---

## Coding Standards

### Angular

* Use standalone components where appropriate
* Follow Angular style guide
* Prefer reactive forms
* Use strict TypeScript typing
* Avoid `any` unless absolutely necessary
* Keep components small and focused

### Spring Boot

* Follow REST best practices
* Use constructor injection
* Use DTOs for API boundaries
* Validate inputs
* Keep controllers thin
* Business logic belongs in services

### MongoDB

* Use clear document structure
* Avoid deeply nested documents
* Add indexes when querying frequently

---

## Safety and Approval Policy

Agents should assume:

* **Workspace write access only**
* Do NOT execute destructive shell commands
* Do NOT modify files outside the repository

### High‑Risk Changes (Require Explicit User Approval)

* Database schema changes
* Security/authentication changes
* Dependency upgrades across major versions
* Large refactors (>10 files)

---

## Commit Guidelines

When generating commits, agents should:

* Use clear, concise messages
* Start with a verb
* Include scope when possible

### Examples

* `fix: resolve Angular build error`
* `feat: add catering booking calendar`
* `refactor: simplify order service logic`

---

## Testing Expectations

Agents should:

* Add tests for new business logic
* Ensure existing tests pass
* Prefer lightweight unit tests
* Avoid brittle end‑to‑end tests unless requested

---

## Performance Guidelines

Prefer:

* Lazy loading in Angular
* Pagination for large datasets
* MongoDB indexed queries
* Avoid unnecessary API calls

Avoid:

* N+1 queries
* Large synchronous loops in UI
* Blocking operations

---

## When Uncertain

If requirements are ambiguous, agents should:

1. Make the smallest safe change
2. Preserve existing behavior
3. Leave clear TODO comments
4. Prefer non‑destructive edits

---

## Priority Order

Agents must prioritize in this order:

1. **Correctness**
2. **Security**
3. **Stability**
4. **Performance**
5. **Code style**

---

## Maintainer Notes

Primary maintainer prefers:

* Angular + Spring Boot + MongoDB
* Clean architecture
* Strong typing
* Production‑ready code
* Minimal unnecessary dependencies

Agents should optimize for these preferences.

---

**End of AGENTS.md**

<!--
  Sync Impact Report
  - Version change: n/a (initial) → 1.0.0
  - Modified principles: n/a (first ratification)
  - Added sections: Core Principles (5), Technology Constraints, Development Workflow & Quality Gates, Governance
  - Removed sections: n/a
  - Follow-up TODOs: none (stack decision deferred to plan phase by design)
-->

# sdd-spec-kit Constitution

## Core Principles

### I. Spec-First
Every feature begins as a written specification under `specs/` before any code is written. The
specification captures WHAT users need and WHY, expressed as prioritized, independently testable
user stories. No implementation detail (languages, frameworks, APIs) belongs in a specification.

### II. Test-First (NON-NEGOTIABLE)
TDD is mandatory. Tests are written and user-approved, then run and shown to fail, and only then is
the implementation built. The Red-Green-Refactor cycle is strictly enforced. A feature is not
"done" until its tests pass and are part of the suite.

### III. REST API Interface
Every feature that exposes functionality does so through a RESTful HTTP interface. Contracts follow
the resource model, use standard HTTP verbs and status codes, and speak JSON. Interface contracts
are documented in the feature's `contracts/` directory before implementation.

### IV. Integration Testing
Integration testing is required for: new interface contract acceptance, contract changes,
inter-service communication, and shared schemas. Unit tests alone are not sufficient for the
feature's public interface.

### V. Simplicity (YAGNI)
Start simple. Build only what the specification requires; do not add speculative generality,
abstractions, or unused endpoints. Any added complexity must be justified against a real
requirement from the specification.

## Technology Constraints

The project is developed on Windows with PowerShell scripts available in `.specify/scripts/`.
The concrete technology stack (runtime, framework, persistence) is NOT decided in this
constitution by design; it is chosen during the planning phase (`/speckit.plan`) for each feature
and recorded in that feature's `plan.md` and `research.md`. Persistence MUST be required for the
ToDo data model (tasks must survive restarts). Any stack choice must support automated tests.

## Development Workflow & Quality Gates

The Spec-Driven Development cycle is followed for every feature: specify → clarify → plan → tasks →
implement. The feature does not advance to the next phase until the current one passes its gates:

- **Spec gate**: specification passes `checklists/requirements.md` (no `[NEEDS CLARIFICATION]`
  markers, testable requirements, measurable success criteria).
- **Plan gate**: `plan.md` shows no constitution violations and `research.md` resolves all
  unknowns.
- **Tasks gate**: `tasks.md` covers every user story with executable, dependency-ordered tasks in
  the required checklist format.
- **Implement gate**: all tasks marked `[x]`, tests pass, and behavior matches the specification.

## Governance

This constitution supersedes all other development practices. Amendments require a documented
change, approval, and a migration plan. Versioning follows semantic versioning:
MAJOR for principle removals/redefinitions, MINOR for new principles, PATCH for clarifications.

Compliance expectations:
- All pull requests and reviews MUST verify compliance with the principles above.
- Complexity must be justified against a specification requirement (Principle V).
- The current specification and its plan/tasks take precedence for implementation details.

**Version**: 1.0.0 | **Ratified**: 2026-09-06 | **Last Amended**: 2026-09-06
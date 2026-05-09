# Skill Registry — lucianosottile.xyz

## Project Context
- Stack: Astro + Notion CMS (planned)
- Type: Personal website / greenfield
- Hosting: Vercel

## User Skills

| Skill | Trigger |
|-------|---------|
| branch-pr | Creating PRs or preparing changes for review |
| issue-creation | Creating GitHub issues, bugs, feature requests |
| judgment-day | "judgment day", "dual review", "juzgar", "que lo juzguen" |
| skill-creator | Creating new AI skills or agent instructions |
| skill-registry | "update skills", "skill registry", "actualizar skills" |

## SDD Skills (auto-managed by orchestrator)

| Skill | Phase |
|-------|-------|
| sdd-explore | Investigation and discovery |
| sdd-propose | Formal proposal creation |
| sdd-spec | Requirements and scenarios |
| sdd-design | Technical architecture |
| sdd-tasks | Task breakdown |
| sdd-apply | Implementation |
| sdd-verify | Validation |
| sdd-archive | Close and persist |

## Compact Rules

### branch-pr
- Always create issue first, reference it in PR title
- PR title: `type(scope): description (#issue)`
- Include test plan in PR body

### issue-creation
- Title: clear, actionable, scoped
- Include acceptance criteria
- Label appropriately

### judgment-day
- Launches two blind parallel judges
- Synthesizes findings, applies fixes
- Re-judges until both pass or escalates after 2 iterations

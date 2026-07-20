# Graph Report - linear-app-clone-frontend  (2026-07-19)

## Corpus Check
- 192 files · ~92,388 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 7 nodes · 5 edges · 2 communities (1 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `108986c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AGENTS.md
- codegraph

## God Nodes (most connected - your core abstractions)
1. `codegraph` - 2 edges
2. `codegraph` - 1 edges
3. `graphify` - 1 edges
4. `Mandatory Project Rules` - 1 edges
5. `CodeGraph` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (2 total, 1 thin omitted)

### Community 0 - "AGENTS.md"
Cohesion: 0.50
Nodes (3): CodeGraph, graphify, Mandatory Project Rules

## Knowledge Gaps
- **4 isolated node(s):** `codegraph`, `graphify`, `Mandatory Project Rules`, `CodeGraph`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `codegraph`, `graphify`, `Mandatory Project Rules` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
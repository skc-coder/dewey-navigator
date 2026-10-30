# Dewey Navigator

https://community.obsidian.md/plugins/dewey-navigator

Dewey Navigator organizes Obsidian notes using decimal numbers stored in YAML frontmatter.

Add a `dwno` property to a note, and Dewey Navigator uses it to build the sidebar hierarchy, chapter indexes, topic navigation, and note outlines.

## Features

- **Decimal Hierarchy**: Organize notes using hierarchical decimal identifiers (`a.b.c.d...`). Supports any number of levels, from top-level indexes to individual concepts.
- **Note Outline**: Displays the headings of the current note and highlights the section corresponding to your current reading position.
- **Previous / Next Navigation**: Navigate between notes using their sequential decimal numbers.
- **Book Presets**: Generate chapter and subtopic rollups, as well as subject-level chapter indexes.
- **Custom Sections**: Create sidebar sections by specifying a decimal prefix and hierarchy depth. Assign custom icons to each section.
- **Prefix Suppression**: Hide notes belonging to specified decimal prefixes from the sidebar, such as `01` or `99`.
- **Configuration Backup**: Export and restore plugin configuration using JSON files.

## Quick Start

Add a `dwno` property to your note's YAML frontmatter:

```yaml
---
dwno: "00.01.03.01"
---
```

The decimal number determines the note's position in the hierarchy.

The filename does not matter. For example, the note can be named:

`A simple note.md`

Dewey Navigator uses `dwno` to organize it, regardless of its filename.

## How It Works

### Decimal Segments

Dewey Navigator interprets dot-separated decimal segments as hierarchy levels:

- `00` &mdash; Level 1 (e.g. Master Knowledge Index)
- `00.01` &mdash; Level 2 (e.g. Computer Science Domain)
- `00.01.03` &mdash; Level 3 (e.g. Databases Subject)
- `00.01.03.01` &mdash; Level 4 (e.g. Relational Model Chapter)
- `00.01.03.01.02` &mdash; Level 5 (e.g. Normalization Topic)
- `00.01.03.01.02.01` &mdash; Level 6+ (e.g. BCNF Decomposition Note)

There is **no hard limit** on depth; add as many levels as needed.

### Sidebar Overview

When a note with `dwno` is opened, the Dewey Navigator sidebar automatically updates:
1. **This Page (In-Note Outline)**: Displays all headings with real-time viewport highlight indicating your reading position.
2. **Topic Step Navigation**: Instant Previous (`←`) and Next (`→`) buttons computed from decimal sequencing.
3. **Chapter & Subject Rollups (Book Preset)**: Scans notes sharing the same chapter or subject prefix.
4. **Custom Sections**: Define filtered views based on custom prefixes and display depths with custom icons.

## License

MIT License. See [LICENSE](LICENSE) for details.

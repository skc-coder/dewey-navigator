# Dewey Navigator – Obsidian Plugin Guide & Architecture

## 1. Directory & Environment Verification

You have two locations on your machine for **Dewey Navigator**:

1. **Source / Git Development Repository (Current Workspace)**:
   - Path: [`/home/skc/dev/dewey-navigator`](file:///home/skc/dev/dewey-navigator)
   - Git remote: `https://github.com/skc-coder/dewey-navigator.git`
   - Purpose: Source repository containing code, git tracking, styles, build files, and documentation.

2. **Active Installed Obsidian Plugin Directory**:
   - Path: [`/home/skc/Documents/notevault/.obsidian/plugins/dewey-navigator`](file:///home/skc/Documents/notevault/.obsidian/plugins/dewey-navigator)
   - Purpose: Where Obsidian executes the plugin in your personal vault (`notevault`), holding your live `data.json` configuration.

---

## 2. What is Dewey Navigator?

**Dewey Navigator** is an Obsidian knowledge navigation and sequencing engine. It organizes, groups, and traverses notes using **decimal dot notation** stored in YAML frontmatter (`dwno`).

Instead of rigid physical folders or artificial file naming conventions, Dewey Navigator decouples note identity from physical filesystem paths. Notes can have arbitrary filenames (e.g. `Relational Calculus Notes.md`), but their exact place in a curriculum, syllabus, or subject hierarchy is controlled by their decimal coordinate (`dwno`).

### YAML Frontmatter Format

```yaml
---
title: "Relational Data Model"
dwno: "00.01.03.01"
---
```

- **`dwno`**: Dot-separated decimal coordinates (e.g., `00.01.03.01`). Segments represent progressive levels of conceptual depth (Subject $\rightarrow$ Module $\rightarrow$ Chapter $\rightarrow$ Topic $\rightarrow$ Subtopic). There is no hard limit on depth.
- **`title`**: Clean display name rendered throughout the plugin's navigation paths, rollups, and trees. When omitted, it cleanly falls back to the file basename.

---

## 3. Sidebar Architecture & Functional Components

The plugin provides a dedicated view in Obsidian's sidebar. When a note is opened or edited, the sidebar reacts dynamically and renders the following functional sections in order:

### 1. Hierarchical Breadcrumb Trail

- Displays the full ancestral lineage of the active note.
- Scans all vault notes to resolve each parent prefix (e.g., `00` $\rightarrow$ `00.01` $\rightarrow$ `00.01.03` $\rightarrow$ `00.01.03.01`).
- Each ancestor segment is an interactive link that opens its corresponding index or summary note.

### 2. In-Note Outline Indexer

- Indexes structure within the currently active note.
- Supports two indexing engines:
  - **Heading Mode**: Parses standard markdown heading levels (`#` through `######`).
  - **Regex Mode**: Custom user regex to index arbitrary line patterns (such as task checkboxes, callouts, or question markers).
- Tracks reader position in real-time, automatically highlighting the active section as you scroll.
- Clicking any outline entry jumps directly to that section in the editor.
- Note: This section remains functional even if a note does not have a `dwno` property.

### 3. Topic Step Navigation

- Enables book-like sequential linear reading.
- Computes direct previous and next sibling notes by incrementing and decrementing the trailing decimal segment (e.g. `00.01.03.01` $\rightarrow$ `00.01.03.02`).
- Preserves zero-padded numbering formats (e.g., `.01` to `.02`).
- Clicking either step navigates directly to that note. If a target number has no corresponding note created yet, it displays a missing placeholder state.

### 4. Chapter Topics Rollup (Book Preset)

- Gathers and displays all sibling topics and child notes belonging to the current chapter boundary.
- Filters and orders subtopics that share the parent chapter's decimal prefix down to a configurable scan depth.
- Displays decimal badges alongside titles and highlights the currently active note.

### 5. Subject Chapters Index (Book Preset)

- Displays all major chapters belonging to the active broader subject or domain.
- Allows jumping across chapters within a subject without returning to a master index note.

### 6. Custom Filtered Sections

- Custom user-defined grouping views evaluated dynamically against the active note.
- Matches notes that share a specified prefix depth with the active note and filters them by target depth.
- Renders custom icons and custom section headings to group related notes (e.g., labs, exercises, derivations).

---

## 4. Settings Page Configuration

The settings tab (`DeweyNavSettingTab`) manages the behavior, boundaries, and filtering logic of the navigation system:

### 1. Help & Walkthrough Modal

- An interactive guide explaining decimal structure design, best practices for numbering conventions, and YAML examples.

### 2. Prefix Exclusions & Suppression

- **Suppressed Dewey Prefixes**: A comma-separated list of top-level or sub-level prefixes (e.g., `01, 99`).
- Notes matching these prefixes are hidden from the sidebar rollups and navigation bars (ideal for excluding templates, scratch notes, drafts, or archive folders).

### 3. Outline Indexer Settings

- **Show This Note Outline**: Master toggle to enable or disable in-file outline tracking.
- **Outline Index Mode**: Dropdown to select between standard Markdown Headings (`#`, `##`, `###`) or a Custom Regular Expression pattern.
- **Custom Regex Pattern**: Configurable expression with capturing groups (e.g. `^#{1,6}\s+(.*)$` or checkbox tasks `^-\s+\[ \]\s+(.*)$`) used when regex mode is selected.

### 4. Topic Step Navigation Toggle

- Toggle to enable or disable the sequential previous/next topic traversal component.

### 5. Book Navigation Preset Controls

- **Preset Toggle**: Quickly activates or deactivates standard book structure navigation.
- **Chapter Topics Toggle**: Enables listing all subtopics under the active note's chapter.
- **Chapter Segment Depth**: Slider (range 2 to 6, default 4) defining the decimal depth at which a "chapter" starts (e.g., 4 segments corresponds to `a.b.c.d`).
- **Chapter Max Scan Depth**: Slider (range 4 to 8, default 6) setting the deepest sub-level notes included in chapter rollups.
- **Subject Chapters Index Toggle**: Enables listing all chapters within the active subject.
- **Subject Segment Depth**: Slider (range 1 to 5, default 3) defining the decimal depth for subject boundaries (e.g., 3 segments corresponds to `a.b.c`).

### 6. Custom Sections Manager

Allows creating and editing an arbitrary number of contextual sidebar sections. For each custom section:
- **Section Title**: Display name for the section header.
- **Enable/Disable Toggle**: Turn individual custom sections on or off without deleting them.
- **Icon Selection**: Predefined icon sets or custom SVG injection.
- **Shared Prefix Length (Match Parent Level)**: Slider (range 1 to 5) specifying how many segments of the active note must match (e.g., `2` matches `a.b`).
- **Target Segment Depth**: Slider (range 0 to 6) specifying the exact segment depth of notes to display (or `0` to show all depths).
- **Minimum Note Depth**: Slider (range 1 to 5) specifying the minimum segment depth an active note must have before this section activates.

### 7. Configuration Profiles (Import / Export)

- **Save Configuration to File**: Exports all active settings, custom sections, suppression lists, and depth sliders into a timestamped JSON file.
- **Load Configuration from File**: Imports and validates an exported JSON profile to quickly restore or transfer configurations across vaults.

feasture to add 
- map numbers to words, show them by defualt, convert words to numbers
- improve ui
- make setting ui more well and option more readble and natural with examples
- add an ability to add dwno based on moc page to pages and sub pages….
- creaete an index file to map the dwnos and pages, their short readble code/word, and pages show…
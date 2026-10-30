# Dewey Navigator - Project History

## [2026-10-30 12:33:00 IST] Settings Card Alignment, Input Normalization & Unified Sections Layout
- **User Request / Issue**:
  1. Fix card alignment issues where card containers cut off prematurely or misalign across themes.
  2. Fix input field enlargement caused by theme overrides (such as LYT Mode expanding `input[type="text"]` font size and dimensions).
  3. Keep navigation sections in a unified "Sections" group with standard sections at the top and custom fields directly below, without artificial category groups.
  4. Ensure a clean install state (no prefilled custom fields, clean defaults).
- **AI Action / Implementation**:
  - In `styles.css`:
    - Added strict `box-sizing: border-box` across `.dewey-nav-settings-container`, `.dewey-nav-card`, `.setting-item`, `.dewey-nav-subrow`, and `.dewey-nav-field-head`.
    - Added theme-proof input normalization rules (`.dewey-nav-card .setting-item-control input[type="text"]`, `select`) enforcing standard font size (`var(--font-ui-small, 13px) !important`) and max width (`240px`) to prevent themes like LYT Mode from inflating input elements.
    - Set `.dewey-nav-card > .setting-item` margin to `0 !important` and borders to hairlines, preventing theme margin overrides from breaking card alignment.
  - In `main.js`:
    - Unified the "Sections" view with "+ Add Custom Field" CTA button at the top.
    - Rendered standard sections (`Topic Step Navigation`, `Chapter Topics`, `Subject Chapters Index`) at the top of the card.
    - Rendered custom fields directly below in a clean list without category groupings.
  - Synced changes to vault plugin at `.obsidian/plugins/vault-book-toc/` and pushed to standalone repository `skc-coder/dewey-navigator`.
  - Updated release `1.0.0` assets on GitHub.

## [2026-10-30 12:15:00 IST] Initial Repository Setup and Release
- **User Request / Problem**:
  - Finalize Dewey Navigator plugin according to Obsidian official developer guidelines and create a standalone GitHub repo for community submission.
- **AI Action / Implementation**:
  - Initialized Git repository at `/home/skc/dev/dewey-navigator` and linked remote `skc-coder/dewey-navigator`.
  - Created documentation files (`README.md`, `LICENSE`, `PUBLISHING_GUIDE.md`, `COMMUNITY_SUBMISSION_ABOUT.md`).
  - Created GitHub release `1.0.0` with `manifest.json`, `main.js`, and `styles.css`.

## [2026-10-30 12:49:00 IST] Outline Active Section Highlighting, Book Preset & Subsetting Visual Hierarchy
- **User Request / Issue**:
  1. Highlight the heading item in "This Note Outline" corresponding to the user's active viewport/scroll position on the note.
  2. Isolate "Chapter Topics" and "Subject Chapters Index" under a dedicated "Book Preset" (`+ Add Book Preset`), not present by default.
  3. Keep "Topic Step Navigation" independent and enabled by default (auto-enable if disabled when Book Preset is clicked).
  4. Place the "+ Add Book Preset" CTA button directly above the Configuration Profiles section.
  5. Auto-scroll and auto-focus the section title input whenever "+ Add Custom Section" is clicked.
  6. Replaced all occurrences of "field" terminology with "section" ("(Untitled Section)", "Section Title", "Custom Sections Manager").
  7. Add a clean continuous vertical left indicator line (`border-left`) to clearly indent and visually anchor subsettings.
- **AI Action / Implementation**:
  - In `styles.css`:
    - Added `.dewey-nav-outline-item.active` styling with accent indicator border and colored font.
    - Updated `.dewey-nav-subrow` to feature `border-left: 2px solid var(--interactive-accent)` and `margin-left: 14px` for clear visual hierarchy.
  - In `main.js`:
    - Added scroll listener tracking reading position with debouncing, dynamically toggling `.active` on the matching outline item.
    - Separated Book Preset into its own card with a "Remove Preset" button, enabled via "+ Add Book Preset".
    - Added autofocus logic focusing newly created custom section card on creation.
  - Synced to local vault `.obsidian/plugins/vault-book-toc/`, pushed to GitHub repo, and updated release `1.0.0` assets.

## [2026-10-30 12:55:00 IST] Settings Reorganization & Apple-Style Straight Subsetting Guidelines
- **User Request / Issue**:
  1. Move "In-Note Outline Indexer" directly into the "Sections" group.
  2. Create a dedicated section card for "Preset Section Templates" (matching Configuration Profiles).
  3. Replace curved/indented sub-setting visuals with a crisp straight vertical indicator line matching Apple Settings.
- **AI Action / Implementation**:
  - Reordered settings tab layout:
    1. **Prefix Exclusions** (Suppressed prefixes card)
    2. **Sections** (Manager button, In-Note Outline card, Topic Step Navigation card, Book Preset card if active, Custom Sections)
    3. **Preset Section Templates** (Dedicated section card with "+ Add Book Preset")
    4. **Configuration Profiles** (Dedicated section card for export/import)
  - In `styles.css`:
    - Updated `.dewey-nav-subrow` with an absolute vertical guide line (`::before` at `left: 14px`, `width: 2px`, `border-radius: 0`) providing clean, straight-edge Apple system hierarchy.
  - Synced to local vault and pushed to GitHub release `1.0.0`.

## [2026-10-30 12:57:00 IST] Subsetting Visual Indentation & Font Hierarchy Polish
- **User Request / Issue**:
  1. Fix the guideline cutting through text in subsetting rows.
  2. Ensure subsettings are properly indented.
  3. Make subsetting font sizes distinctly smaller than parent settings (Apple-style sub-options).
- **AI Action / Implementation**:
  - In `styles.css`:
    - Set `.dewey-nav-card > .setting-item.dewey-nav-subrow` with `padding-left: 36px !important`, positioning the straight vertical guideline at `left: 16px` so it floats cleanly in the gutter margin without touching or cutting into labels.
    - Set parent setting titles explicitly to `14px` (`var(--font-ui-medium)`).
    - Reduced subsetting names to `11.5px` (`var(--text-muted)`) and descriptions to `10.5px` (`var(--text-faint)`), creating an unmistakable Apple-style visual hierarchy.
  - Synced to local vault and pushed to remote release `1.0.0`.

const { ItemView, WorkspaceLeaf, Plugin, PluginSettingTab, Setting, Modal, Notice, MarkdownView } = require("obsidian");

const VIEW_TYPE_DEWEY_NAV = "dewey-navigator-view";

const PHOSPHOR_ICONS = {
  listDashes: `<svg viewBox="0 0 256 256"><path d="M88,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H96A8,8,0,0,1,88,64Zm128,56H96a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H96a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM48,56a12,12,0,1,0,12,12A12,12,0,0,0,48,56Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,48,120Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,48,184Z"/></svg>`,
  arrowsLeftRight: `<svg viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,11.32L168,102.63V176a8,8,0,0,1-16,0V102.63l-26.34,26.35a8,8,0,0,1-11.32-11.32l40-40a8,8,0,0,1,11.32,0ZM99.31,138.34l-40,40a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L45.66,153.37V80a8,8,0,0,1,16,0v73.37l26.33-26.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  bookOpenText: `<svg viewBox="0 0 256 256"><path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM168,96a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H176A8,8,0,0,1,168,96Zm0,32a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H176A8,8,0,0,1,168,128Zm-88,0a8,8,0,0,1,0,16H48a8,8,0,0,1,0-16Zm0-32a8,8,0,0,1,0,16H48a8,8,0,0,1,0-16Z"/></svg>`,
  books: `<svg viewBox="0 0 256 256"><path d="M104,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16h56a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM48,48h56V80H48ZM104,208H48V96h56ZM223.41,60.67l-48-27.71a16,16,0,0,0-21.86,5.86L125.68,87a8,8,0,0,0,13.86,8l27.87-48.27,48,27.71-68.56,118.77a8,8,0,0,0,2.93,10.93,8.08,8.08,0,0,0,4,.11,8,8,0,0,0,6.93-4l68.56-118.77A16,16,0,0,0,223.41,60.67Z"/></svg>`,
  folders: `<svg viewBox="0 0 256 256"><path d="M216,72H130.67L102.93,50.4a16.12,16.12,0,0,0-9.6-3.2H40A16,16,0,0,0,24,63.2V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm0,120H40V64H93.33l27.74,21.6A16.12,16.12,0,0,0,130.67,88H216Z"/></svg>`,
  compass: `<svg viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-133.66a8,8,0,0,0-7.32-2l-64,16a8,8,0,0,0-5.8,5.8l-16,64a8,8,0,0,0,9.66,9.66l64-16a8,8,0,0,0,5.8-5.8l16-64A8,8,0,0,0,173.66,82.34ZM133.47,133.47a16,16,0,1,1,4.69-11.31A15.9,15.9,0,0,1,133.47,133.47Z"/></svg>`,
  tag: `<svg viewBox="0 0 256 256"><path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"/></svg>`,
  bookmark: `<svg viewBox="0 0 256 256"><path d="M192,24H64A16,16,0,0,0,48,40V224a8,8,0,0,0,12.65,6.51L128,183.3l67.35,47.21A8,8,0,0,0,208,224V40A16,16,0,0,0,192,24Z"/></svg>`,
  atom: `<svg viewBox="0 0 256 256"><path d="M246.3,103.74C236.4,69.58,206.18,48,168,48a79.29,79.29,0,0,0-37.49,9.45c-1-.53-2.07-1-3.13-1.55C114.77,49.27,97.71,48,88,48,49.82,48,19.6,69.58,9.7,103.74a47.38,47.38,0,0,0,5.77,41.22c9.9,34.16,40.12,55.74,78.3,55.74a79.29,79.29,0,0,0,37.49-9.45c1,.53,2.07,1,3.13,1.55C147.23,199.43,164.29,200.7,174,200.7c38.18,0,68.4-21.58,78.3-55.74A47.38,47.38,0,0,0,246.3,103.74ZM128,144a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z"/></svg>`,
  chartLine: `<svg viewBox="0 0 256 256"><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V166.69l50.34-50.35a8,8,0,0,1,11.32,0L144,158.69l66.34-66.35a8,8,0,0,1,11.32,11.32l-72,72a8,8,0,0,1-11.32,0L96,133.31,48,181.31V208H224A8,8,0,0,1,232,208Z"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>`,
  arrowRight: `<svg viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>`,
  caretDown: `<svg viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"/></svg>`
};

const DEFAULT_SETTINGS = {
  disabledPrefixes: "",
  outlineSelector: "headings",
  outlineRegex: "^#{1,6}\\s+(.*)$",
  enableOutline: true,
  enableBookSections: false, // Default: zero preset sections present
  enableTopicNav: true,
  enableChapterTopics: true,
  enableSubjectIndex: true,
  chapterLevel: 4,
  chapterMaxDepth: 6,
  subjectLevel: 3,
  customSections: [] // Clean install: zero default user sections
};

function cleanDwno(val) {
  if (val === undefined || val === null) return "";
  let s = String(val).trim();
  s = s.replace(/^["'\s]+|["'\s]+$/g, "");
  return s.trim();
}

function cleanTitle(rawTitle, fallbackBasename) {
  if (!rawTitle) return fallbackBasename;
  const t = String(rawTitle).trim();
  if (t === "{{title}}" || t.includes("{{") || t.length === 0) {
    return fallbackBasename;
  }
  return t;
}

class DeweyGuideModal extends Modal {
  constructor(app) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dewey-nav-guide-modal");

    contentEl.createEl("h2", { text: "Learn How to Use Dewey Navigator" });

    contentEl.createEl("p", {
      text: "Dewey Navigator organizes Obsidian notes using decimal numbers stored in YAML frontmatter.",
    });

    contentEl.createEl("p", {
      text: "Add a dwno property to a note, and Dewey Navigator uses it to build the sidebar hierarchy, chapter indexes, topic navigation, and note outlines.",
    });

    contentEl.createEl("h3", { text: "Features" });
    const ul = contentEl.createEl("ul");
    ul.innerHTML = `
      <li><strong>Decimal Hierarchy</strong>: Organize notes using hierarchical decimal identifiers (a.b.c.d...). Supports any number of levels, from top-level indexes to individual concepts.</li>
      <li><strong>Note Outline</strong>: Displays the headings of the current note and highlights the section corresponding to your current reading position.</li>
      <li><strong>Previous / Next Navigation</strong>: Navigate between notes using their sequential decimal numbers.</li>
      <li><strong>Book Presets</strong>: Generate chapter and subtopic rollups, as well as subject-level chapter indexes.</li>
      <li><strong>Custom Sections</strong>: Create sidebar sections by specifying a decimal prefix and hierarchy depth. Assign custom icons to each section.</li>
      <li><strong>Prefix Suppression</strong>: Hide notes belonging to specified decimal prefixes from the sidebar, such as 01 or 99.</li>
      <li><strong>Configuration Backup</strong>: Export and restore plugin configuration using JSON files.</li>
    `;

    contentEl.createEl("h3", { text: "Quick Start" });
    contentEl.createEl("p", {
      text: "Add a dwno property to your note's YAML frontmatter:",
    });

    const codePre = contentEl.createEl("pre");
    codePre.createEl("code", {
      text: `---\ndwno: "00.01.03.01"\n---`,
    });

    contentEl.createEl("p", {
      text: "The decimal number determines the note's position in the hierarchy.",
    });

    contentEl.createEl("p", {
      text: "The filename does not matter. For example, the note can be named:",
    });

    const samplePre = contentEl.createEl("pre");
    samplePre.createEl("code", {
      text: `A simple note.md`,
    });

    contentEl.createEl("p", {
      text: "Dewey Navigator uses dwno to organize it, regardless of its filename.",
    });

    new Setting(contentEl).addButton((btn) =>
      btn.setButtonText("Close").setCta().onClick(() => this.close())
    );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class DeweyNavSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("dewey-nav-settings-container");

    containerEl.createEl("h2", { text: "Dewey Navigator Settings" });

    // Help Button (inside card for consistent boundary borders)
    const cardHelp = containerEl.createDiv({ cls: "dewey-nav-card" });
    new Setting(cardHelp)
      .setName("Learn How to Use Dewey Navigator")
      .setDesc("Read the decimal structure guide, YAML examples, and setup walkthrough.")
      .addButton((btn) =>
        btn
          .setButtonText("Learn How to Use Dewey Navigator")
          .setCta()
          .onClick(() => {
            new DeweyGuideModal(this.app).open();
          })
      );

    // Section 1: Exclusions (Unified Card)
    containerEl.createEl("div", { cls: "dewey-nav-section-title", text: "Prefix Exclusions" });
    const cardExcl = containerEl.createDiv({ cls: "dewey-nav-card" });

    new Setting(cardExcl)
      .setName("Suppressed Dewey Prefixes")
      .setDesc("Disable the sidebar for notes starting with these numbers (comma-separated).")
      .addText((text) =>
        text
          .setPlaceholder("e.g., 01, 99")
          .setValue(this.plugin.settings.disabledPrefixes || "")
          .onChange(async (val) => {
            this.plugin.settings.disabledPrefixes = val.trim();
            await this.plugin.saveSettings();
            this.plugin.refreshView();
          })
      );

    // Section 2: Sections (Unified header: Outline indexer, Step Nav, Book Preset, and Custom Sections)
    containerEl.createEl("div", { cls: "dewey-nav-section-title", text: "Sections" });

    // Action Header with Top "+ Add Custom Section" Button (inside card for boundary border)
    const cardAddSection = containerEl.createDiv({ cls: "dewey-nav-card" });
    new Setting(cardAddSection)
      .setName("Custom Sections Manager")
      .setDesc("Create custom sidebar sections matched on shared decimal prefixes.")
      .addButton((btn) =>
        btn
          .setButtonText("+ Add Custom Section")
          .setCta()
          .onClick(async () => {
            const newId = "custom_" + Date.now();
            this.plugin.settings.customSections.push({
              id: newId,
              name: "",
              icon: "folders",
              customSvg: "",
              enabled: true,
              matchParentLevel: 2,
              targetLevel: 3,
              minActiveLevel: 2,
            });
            await this.plugin.saveSettings();
            this.focusCustomId = newId;
            this.display();
            this.plugin.refreshView();
          })
      );

    // 2.1 This Note Outline Indexer Card
    const cardOutline = containerEl.createDiv({ cls: "dewey-nav-card" });

    new Setting(cardOutline)
      .setName("Show This Note Outline")
      .setDesc("Display an in-file outline in the sidebar.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableOutline)
          .onChange(async (val) => {
            this.plugin.settings.enableOutline = val;
            await this.plugin.saveSettings();
            this.display();
            this.plugin.refreshView();
          })
      );

    if (this.plugin.settings.enableOutline) {
      new Setting(cardOutline)
        .setName("Outline Index Mode")
        .setDesc("Choose how items are indexed from the current file.")
        .addDropdown((dd) =>
          dd
            .addOption("headings", "Markdown Headings (#, ##, ###)")
            .addOption("regex", "Custom Regex Pattern")
            .setValue(this.plugin.settings.outlineSelector || "headings")
            .onChange(async (v) => {
              this.plugin.settings.outlineSelector = v;
              await this.plugin.saveSettings();
              this.display();
              this.plugin.refreshView();
            })
        );

      if (this.plugin.settings.outlineSelector === "regex") {
        new Setting(cardOutline)
          .setName("Custom Regex Pattern")
          .setDesc("Regex to match lines on page (capturing group 1 is used as title).")
          .addText((t) =>
            t
              .setPlaceholder("^#{1,6}\\s+(.*)$ or ^-\\s+\\[ \\]\\s+(.*)$")
              .setValue(this.plugin.settings.outlineRegex || "")
              .onChange(async (v) => {
                this.plugin.settings.outlineRegex = v;
                await this.plugin.saveSettings();
                this.plugin.refreshView();
              })
          );
      }
    }

    // 2.2 Topic Step Navigation Card (Always present & enabled by default)
    const cardStepNav = containerEl.createDiv({ cls: "dewey-nav-card" });
    new Setting(cardStepNav)
      .setName("Topic Step Navigation")
      .setDesc("Shows previous and next notes based on the last decimal number.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableTopicNav)
          .onChange(async (val) => {
            this.plugin.settings.enableTopicNav = val;
            await this.plugin.saveSettings();
            this.plugin.refreshView();
          })
      );

    // 2.3 Book Preset Sections Card (Only present when Book Preset is enabled)
    if (this.plugin.settings.enableBookSections) {
      const cardBook = containerEl.createDiv({ cls: "dewey-nav-card" });

      const bookHead = cardBook.createDiv({ cls: "dewey-nav-field-head" });
      bookHead.createSpan({
        cls: "dewey-nav-field-title",
        text: "Preset: Book Navigation Sections",
      });
      const removeBookBtn = bookHead.createEl("button", {
        cls: "clickable-icon",
        text: "Remove Preset",
      });
      removeBookBtn.addEventListener("click", async () => {
        this.plugin.settings.enableBookSections = false;
        await this.plugin.saveSettings();
        this.display();
        this.plugin.refreshView();
      });

      // Chapter Topics Parent Toggle
      new Setting(cardBook)
        .setName("Chapter Topics")
        .setDesc("Lists subtopics under the active note's chapter.")
        .addToggle((toggle) =>
          toggle
            .setValue(this.plugin.settings.enableChapterTopics)
            .onChange(async (val) => {
              this.plugin.settings.enableChapterTopics = val;
              await this.plugin.saveSettings();
              this.display();
              this.plugin.refreshView();
            })
        );

      // Chapter Topics Sub-rows inside same card
      const chLevelSetting = new Setting(cardBook)
        .setName("Chapter Segment Depth")
        .setDesc("Number of segments defining the chapter boundary (default: 4 for a.b.c.d).")
        .addSlider((slider) =>
          slider
            .setLimits(2, 6, 1)
            .setValue(this.plugin.settings.chapterLevel)
            .setDynamicTooltip()
            .onChange(async (val) => {
              this.plugin.settings.chapterLevel = val;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );
      chLevelSetting.settingEl.addClass("dewey-nav-subrow");
      if (!this.plugin.settings.enableChapterTopics) {
        chLevelSetting.settingEl.addClass("is-disabled");
      }

      const chMaxSetting = new Setting(cardBook)
        .setName("Chapter Max Scan Depth")
        .setDesc("Deepest level to display in chapter topics (default: 6 stops at a.b.c.d.e.f).")
        .addSlider((slider) =>
          slider
            .setLimits(4, 8, 1)
            .setValue(this.plugin.settings.chapterMaxDepth)
            .setDynamicTooltip()
            .onChange(async (val) => {
              this.plugin.settings.chapterMaxDepth = val;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );
      chMaxSetting.settingEl.addClass("dewey-nav-subrow");
      if (!this.plugin.settings.enableChapterTopics) {
        chMaxSetting.settingEl.addClass("is-disabled");
      }

      // Subject Chapters Parent Toggle
      new Setting(cardBook)
        .setName("Subject Chapters Index")
        .setDesc("Lists chapters under the active subject.")
        .addToggle((toggle) =>
          toggle
            .setValue(this.plugin.settings.enableSubjectIndex)
            .onChange(async (val) => {
              this.plugin.settings.enableSubjectIndex = val;
              await this.plugin.saveSettings();
              this.display();
              this.plugin.refreshView();
            })
        );

      // Subject Chapters Sub-row inside same card
      const subLevelSetting = new Setting(cardBook)
        .setName("Subject Segment Depth")
        .setDesc("Number of segments defining the subject boundary (default: 3 for a.b.c).")
        .addSlider((slider) =>
          slider
            .setLimits(1, 5, 1)
            .setValue(this.plugin.settings.subjectLevel)
            .setDynamicTooltip()
            .onChange(async (val) => {
              this.plugin.settings.subjectLevel = val;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );
      subLevelSetting.settingEl.addClass("dewey-nav-subrow");
      if (!this.plugin.settings.enableSubjectIndex) {
        subLevelSetting.settingEl.addClass("is-disabled");
      }
    }

    // 2.4 User Defined Custom Sections List
    const customList = this.plugin.settings.customSections || [];
    if (customList.length > 0) {
      const rulesContainer = containerEl.createDiv({ cls: "dewey-nav-custom-list" });
      this.renderCustomSectionSettings(rulesContainer);
    }

    // Section 3: Preset Section Templates (Dedicated Unified Section Card)
    containerEl.createEl("div", { cls: "dewey-nav-section-title", text: "Preset Section Templates" });
    const cardPreset = containerEl.createDiv({ cls: "dewey-nav-card" });

    new Setting(cardPreset)
      .setName("Book Navigation Preset")
      .setDesc("Add Chapter Topics and Subject Chapters Index to your Sections hierarchy.")
      .addButton((btn) =>
        btn
          .setButtonText("+ Add Book Preset")
          .setCta()
          .onClick(async () => {
            this.plugin.settings.enableBookSections = true;
            this.plugin.settings.enableChapterTopics = true;
            this.plugin.settings.enableSubjectIndex = true;
            this.plugin.settings.enableTopicNav = true;
            await this.plugin.saveSettings();
            this.display();
            this.plugin.refreshView();
            new Notice("Book navigation preset added to Sections.");
          })
      );

    // Section 4: Configuration Profiles (Dedicated Unified Section Card at Bottom)
    containerEl.createEl("div", { cls: "dewey-nav-section-title", text: "Configuration Profiles" });
    const cardProfile = containerEl.createDiv({ cls: "dewey-nav-card" });

    new Setting(cardProfile)
      .setName("Save Configuration to File")
      .setDesc("Export your active settings and custom fields as a .json file.")
      .addButton((btn) =>
        btn.setButtonText("Save to File (.json)").onClick(() => {
          const jsonStr = JSON.stringify(this.plugin.settings, null, 2);
          const blob = new Blob([jsonStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `dewey-navigator-config-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          new Notice("Dewey Navigator configuration downloaded.");
        })
      );

    new Setting(cardProfile)
      .setName("Load Configuration from File")
      .setDesc("Import and restore a previously saved .json configuration file.")
      .addButton((btn) => {
        btn.setButtonText("Load from File (.json)").onClick(() => {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = ".json,application/json";
          fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                const parsed = JSON.parse(event.target.result);
                this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS, parsed);
                await this.plugin.saveSettings();
                this.display();
                this.plugin.refreshView();
                new Notice("Configuration restored successfully.");
              } catch (err) {
                new Notice("Failed to read JSON file. Check format.");
              }
            };
            reader.readAsText(file);
          };
          fileInput.click();
        });
      });
  }

  renderCustomSectionSettings(container) {
    container.empty();
    const list = this.plugin.settings.customSections || [];

    list.forEach((rule, index) => {
      const card = container.createDiv({ cls: "dewey-nav-card" });
      card.setAttribute("data-section-id", rule.id);

      const cardHead = card.createDiv({ cls: "dewey-nav-field-head" });
      const titleSpan = cardHead.createSpan({
        cls: "dewey-nav-field-title",
        text: rule.name ? rule.name : "(Untitled Section)",
      });

      const delBtn = cardHead.createEl("button", {
        cls: "clickable-icon",
        text: "Remove",
      });
      delBtn.addEventListener("click", async () => {
        this.plugin.settings.customSections.splice(index, 1);
        await this.plugin.saveSettings();
        this.display();
        this.plugin.refreshView();
      });

      const titleSetting = new Setting(card)
        .setName("Section Title")
        .addText((t) => {
          t
            .setPlaceholder("e.g., Sibling Topics in Section")
            .setValue(rule.name || "")
            .onChange(async (v) => {
              rule.name = v.trim();
              titleSpan.setText(rule.name || "(Untitled Section)");
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            });

          if (this.focusCustomId && this.focusCustomId === rule.id) {
            setTimeout(() => {
              card.scrollIntoView({ behavior: "smooth", block: "center" });
              t.inputEl.focus();
              this.focusCustomId = null;
            }, 60);
          }
        })
        .addToggle((toggle) =>
          toggle.setValue(rule.enabled).onChange(async (v) => {
            rule.enabled = v;
            await this.plugin.saveSettings();
            this.plugin.refreshView();
          })
        );

      new Setting(card)
        .setName("Icon Selection")
        .addDropdown((dd) =>
          dd
            .addOption("folders", "Folders")
            .addOption("books", "Books")
            .addOption("bookOpenText", "Book Chapter")
            .addOption("compass", "Compass")
            .addOption("listDashes", "List Dashes")
            .addOption("tag", "Tag")
            .addOption("bookmark", "Bookmark")
            .addOption("atom", "Atom")
            .addOption("chartLine", "Chart")
            .setValue(rule.icon || "folders")
            .onChange(async (v) => {
              rule.icon = v;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );

      new Setting(card)
        .setName("Custom SVG Icon (Optional)")
        .setDesc("Paste raw <svg...>...</svg> code to override standard icon.")
        .addText((t) =>
          t
            .setPlaceholder("Paste <svg...> or leave empty")
            .setValue(rule.customSvg || "")
            .onChange(async (v) => {
              rule.customSvg = v.trim();
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );

      new Setting(card)
        .setName("Shared Prefix Length")
        .setDesc("Segments of active note to match (e.g., 2 matches a.b).")
        .addSlider((s) =>
          s
            .setLimits(1, 5, 1)
            .setValue(rule.matchParentLevel)
            .setDynamicTooltip()
            .onChange(async (v) => {
              rule.matchParentLevel = v;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );

      new Setting(card)
        .setName("Target Segment Depth")
        .setDesc("Depth of notes to show (e.g., 3 shows a.b.c). Set to 0 for all depths.")
        .addSlider((s) =>
          s
            .setLimits(0, 6, 1)
            .setValue(rule.targetLevel)
            .setDynamicTooltip()
            .onChange(async (v) => {
              rule.targetLevel = v;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );

      new Setting(card)
        .setName("Minimum Note Depth")
        .setDesc("Only activate if note has at least this many segments.")
        .addSlider((s) =>
          s
            .setLimits(1, 5, 1)
            .setValue(rule.minActiveLevel)
            .setDynamicTooltip()
            .onChange(async (v) => {
              rule.minActiveLevel = v;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );
    });
  }
}


class DeweyNavView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.sectionsCollapsed = {};
    this.outlineItems = [];
    this.activeHeadingIdx = -1;
    this.scrollThrottleTimer = null;
  }

  getViewType() {
    return VIEW_TYPE_DEWEY_NAV;
  }

  getDisplayText() {
    return "Dewey Navigator";
  }

  getIcon() {
    return "book-open";
  }

  async onOpen() {
    this.registerEvent(this.app.workspace.on("file-open", () => this.render()));
    this.registerEvent(this.app.metadataCache.on("changed", () => this.render()));
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.updateActiveHeadingHighlight()));

    // Scroll listener on active window to dynamically highlight corresponding section of note
    this.onScrollHandler = () => {
      if (this.scrollThrottleTimer) return;
      this.scrollThrottleTimer = setTimeout(() => {
        this.scrollThrottleTimer = null;
        this.updateActiveHeadingHighlight();
      }, 50);
    };
    activeWindow.document.addEventListener("scroll", this.onScrollHandler, true);

    this.render();
  }

  async onClose() {
    if (this.onScrollHandler) {
      activeWindow.document.removeEventListener("scroll", this.onScrollHandler, true);
    }
    if (this.scrollThrottleTimer) {
      clearTimeout(this.scrollThrottleTimer);
    }
  }

  updateActiveHeadingHighlight() {
    if (!this.plugin.settings.enableOutline || !this.outlineItems || this.outlineItems.length === 0) return;

    let activeLine = 0;
    try {
      const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (mdView && mdView.editor) {
        if (mdView.currentMode && typeof mdView.currentMode.getScroll === "function") {
          activeLine = mdView.currentMode.getScroll();
        } else {
          activeLine = mdView.editor.getCursor()?.line || 0;
        }
      }
    } catch (e) {
      return;
    }

    // Binary search for closest heading above or at activeLine
    let targetIdx = 0;
    for (let i = 0; i < this.outlineItems.length; i++) {
      if (this.outlineItems[i].line <= activeLine + 1) {
        targetIdx = i;
      } else {
        break;
      }
    }

    if (this.activeHeadingIdx !== targetIdx) {
      this.activeHeadingIdx = targetIdx;
      for (let i = 0; i < this.outlineItems.length; i++) {
        const el = this.outlineItems[i].el;
        if (el) {
          el.toggleClass("active", i === targetIdx);
        }
      }
    }
  }

  getAllDwnoNotes() {
    const markdownFiles = this.app.vault.getMarkdownFiles();
    const map = new Map();

    for (const file of markdownFiles) {
      if (file.path.startsWith("templates/")) continue;

      const cache = this.app.metadataCache.getFileCache(file);
      const rawDwno = cache?.frontmatter?.dwno;
      const dwno = cleanDwno(rawDwno);

      if (dwno) {
        const title = cleanTitle(cache?.frontmatter?.title, file.basename);
        map.set(file.path, { file, title, dwno });
      }
    }

    const list = Array.from(map.values());
    list.sort((a, b) => {
      const partsA = a.dwno.split(".").map((p) => {
        const num = parseInt(p, 10);
        return isNaN(num) ? p : num;
      });
      const partsB = b.dwno.split(".").map((p) => {
        const num = parseInt(p, 10);
        return isNaN(num) ? p : num;
      });
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        if (partsA[i] === undefined) return -1;
        if (partsB[i] === undefined) return 1;
        if (partsA[i] !== partsB[i]) {
          return partsA[i] < partsB[i] ? -1 : 1;
        }
      }
      return a.file.basename.localeCompare(b.file.basename);
    });

    return list;
  }

  openNote(file) {
    this.app.workspace.getLeaf(false).openFile(file);
  }

  isPrefixDisabled(dwno) {
    const raw = this.plugin.settings.disabledPrefixes || "";
    const prefixes = raw.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
    for (const p of prefixes) {
      if (dwno === p || dwno.startsWith(p + ".")) {
        return true;
      }
    }
    return false;
  }

  render() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("dewey-nav-view");

    const activeFile = this.app.workspace.getActiveFile();
    const allNotes = this.getAllDwnoNotes();

    const activeNote = activeFile
      ? allNotes.find((n) => n.file.path === activeFile.path)
      : null;

    if (!activeFile) {
      container.createDiv({ cls: "dewey-nav-trail", text: "No active file selected." });
      return;
    }

    if (!activeNote) {
      const trailEl = container.createDiv({ cls: "dewey-nav-trail" });
      trailEl.createSpan({ text: activeFile.basename, cls: "current-node" });
      container.createDiv({
        cls: "dewey-nav-banner",
        text: 'This note does not have a "dwno" frontmatter property.',
      });
      return;
    }

    if (this.isPrefixDisabled(activeNote.dwno)) {
      const trailEl = container.createDiv({ cls: "dewey-nav-trail" });
      trailEl.createSpan({ text: `${activeNote.dwno} ${activeNote.title}`, cls: "current-node" });
      container.createDiv({
        cls: "dewey-nav-banner",
        text: `Dewey Navigator is suppressed for prefix "${activeNote.dwno.split(".")[0]}" in settings.`,
      });
      return;
    }

    // Breadcrumb Trail
    this.renderBreadcrumbTrail(container, allNotes, activeNote);

    // Section 1: In-Note Heading Outline
    if (this.plugin.settings.enableOutline) {
      this.renderNoteOutlineSection(container, activeFile);
    }

    // Section 2: Topic Step Navigation (Always available if enabled)
    if (this.plugin.settings.enableTopicNav) {
      this.renderTopicNavSection(container, allNotes, activeNote);
    }

    // Section 3: Book Navigation Preset Sections (Only if book preset is enabled)
    if (this.plugin.settings.enableBookSections) {
      if (this.plugin.settings.enableChapterTopics) {
        this.renderChapterTopicsSection(container, allNotes, activeNote);
      }
      if (this.plugin.settings.enableSubjectIndex) {
        this.renderSubjectIndexSection(container, allNotes, activeNote);
      }
    }

    // Section 4: User Defined Custom Sections (Below)
    const customList = this.plugin.settings.customSections || [];
    for (const rule of customList) {
      if (rule.enabled) {
        this.renderCustomSection(container, allNotes, activeNote, rule);
      }
    }
  }

  renderBreadcrumbTrail(container, allNotes, activeNote) {
    const trailEl = container.createDiv({ cls: "dewey-nav-trail" });
    const ancestors = [];
    const segments = activeNote.dwno.split(".");
    for (let i = 1; i < segments.length; i++) {
      const prefix = segments.slice(0, i).join(".");
      const anc = allNotes.find((n) => n.dwno === prefix);
      if (anc) ancestors.push(anc);
    }

    for (const anc of ancestors) {
      const link = trailEl.createEl("a", { text: anc.title });
      link.addEventListener("click", () => this.openNote(anc.file));
      trailEl.createSpan({ text: " / ", cls: "separator" });
    }
    trailEl.createSpan({ text: activeNote.title, cls: "current-node" });
  }

  async renderNoteOutlineSection(container, activeFile) {
    const mode = this.plugin.settings.outlineSelector || "headings";
    const sec = container.createDiv({ cls: "dewey-nav-section" });
    const header = sec.createDiv({ cls: "dewey-nav-header" });
    const left = header.createDiv({ cls: "dewey-nav-header-left" });
    left.innerHTML = `${PHOSPHOR_ICONS.listDashes} <span>This Note Outline</span>`;
    const toggle = header.createDiv({ cls: "toggle-icon" });
    toggle.innerHTML = PHOSPHOR_ICONS.caretDown;

    const content = sec.createDiv({ cls: "dewey-nav-content" });
    if (this.sectionsCollapsed["outline"]) {
      content.addClass("collapsed");
      header.addClass("collapsed");
    }

    header.addEventListener("click", () => {
      this.sectionsCollapsed["outline"] = !this.sectionsCollapsed["outline"];
      content.toggleClass("collapsed", this.sectionsCollapsed["outline"]);
      header.toggleClass("collapsed", this.sectionsCollapsed["outline"]);
    });

    this.outlineItems = [];
    this.activeHeadingIdx = -1;

    if (mode === "headings") {
      const cache = this.app.metadataCache.getFileCache(activeFile);
      const headings = cache?.headings || [];
      if (headings.length === 0) {
        content.createEl("span", { text: "No headings in this note.", cls: "dewey-nav-empty-msg" });
        return;
      }
      const list = content.createDiv({ cls: "dewey-nav-outline-list" });
      headings.forEach((h, idx) => {
        const item = list.createDiv({ cls: `dewey-nav-outline-item dewey-nav-heading-h${h.level}` });
        const prefix = "#".repeat(h.level);
        item.createSpan({ text: prefix, cls: "dewey-nav-heading-prefix" });
        item.createSpan({ text: h.heading, cls: "note-title" });

        this.outlineItems.push({ line: h.position.start.line, el: item });

        item.addEventListener("click", () => {
          const leaf = this.app.workspace.getLeaf(false);
          leaf.openFile(activeFile, { eState: { line: h.position.start.line } });
        });
      });
      this.updateActiveHeadingHighlight();
    } else {
      const regexStr = this.plugin.settings.outlineRegex || "^#{1,6}\\s+(.*)$";
      let regex;
      try {
        regex = new RegExp(regexStr);
      } catch (e) {
        content.createEl("span", { text: "Invalid custom regex pattern.", cls: "dewey-nav-empty-msg" });
        return;
      }

      const fileText = await this.app.vault.cachedRead(activeFile);
      const lines = fileText.split("\n");
      const matchedItems = [];

      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(regex);
        if (match) {
          const displayStr = match[1] || match[0];
          matchedItems.push({ line: i, text: displayStr.trim() });
        }
      }

      if (matchedItems.length === 0) {
        content.createEl("span", { text: "No items matched regex.", cls: "dewey-nav-empty-msg" });
        return;
      }

      const list = content.createDiv({ cls: "dewey-nav-outline-list" });
      matchedItems.forEach((item, idx) => {
        const row = list.createDiv({ cls: "dewey-nav-outline-item dewey-nav-heading-h2" });
        row.createSpan({ text: "•", cls: "dewey-nav-heading-prefix" });
        row.createSpan({ text: item.text, cls: "note-title" });

        this.outlineItems.push({ line: item.line, el: row });

        row.addEventListener("click", () => {
          const leaf = this.app.workspace.getLeaf(false);
          leaf.openFile(activeFile, { eState: { line: item.line } });
        });
      });
      this.updateActiveHeadingHighlight();
    }
  }

  renderTopicNavSection(container, allNotes, activeNote) {
    const sec = container.createDiv({ cls: "dewey-nav-section" });
    const header = sec.createDiv({ cls: "dewey-nav-header" });
    const left = header.createDiv({ cls: "dewey-nav-header-left" });
    left.innerHTML = `${PHOSPHOR_ICONS.arrowsLeftRight} <span>Topic Navigation</span>`;
    const toggle = header.createDiv({ cls: "toggle-icon" });
    toggle.innerHTML = PHOSPHOR_ICONS.caretDown;

    const content = sec.createDiv({ cls: "dewey-nav-content" });
    if (this.sectionsCollapsed["nav"]) {
      content.addClass("collapsed");
      header.addClass("collapsed");
    }

    header.addEventListener("click", () => {
      this.sectionsCollapsed["nav"] = !this.sectionsCollapsed["nav"];
      content.toggleClass("collapsed", this.sectionsCollapsed["nav"]);
      header.toggleClass("collapsed", this.sectionsCollapsed["nav"]);
    });

    const segs = activeNote.dwno.split(".");
    const lastSeg = segs[segs.length - 1];
    const basePrefix = segs.slice(0, -1).join(".");
    const num = parseInt(lastSeg, 10);
    const padLen = lastSeg.length;

    let prevDwno = null;
    let nextDwno = null;

    if (!isNaN(num)) {
      if (num > 1) {
        const prevNumStr = String(num - 1).padStart(padLen, "0");
        prevDwno = basePrefix ? `${basePrefix}.${prevNumStr}` : prevNumStr;
      }
      const nextNumStr = String(num + 1).padStart(padLen, "0");
      nextDwno = basePrefix ? `${basePrefix}.${nextNumStr}` : nextNumStr;
    }

    const prevNote = prevDwno ? allNotes.find((n) => n.dwno === prevDwno) : null;
    const nextNote = nextDwno ? allNotes.find((n) => n.dwno === nextDwno) : null;

    const grid = content.createDiv({ cls: "dewey-nav-grid" });

    // Previous Box
    const prevBox = grid.createDiv({ cls: "dewey-nav-box" });
    const prevLabel = prevBox.createDiv({ cls: "dewey-nav-label" });
    prevLabel.innerHTML = `${PHOSPHOR_ICONS.arrowLeft} <span>Previous Topic</span>`;

    if (prevNote) {
      prevBox.createSpan({ text: `${prevNote.dwno} ${prevNote.title}`, cls: "dewey-nav-title" });
      prevBox.addEventListener("click", () => this.openNote(prevNote.file));
    } else {
      prevBox.addClass("disabled");
      prevBox.createSpan({
        text: prevDwno ? `No note (${prevDwno})` : "Start of topics",
        cls: "dewey-nav-title",
      });
    }

    // Next Box
    const nextBox = grid.createDiv({ cls: "dewey-nav-box" });
    const nextLabel = nextBox.createDiv({ cls: "dewey-nav-label" });
    nextLabel.innerHTML = `${PHOSPHOR_ICONS.arrowRight} <span>Next Topic</span>`;

    if (nextNote) {
      nextBox.createSpan({ text: `${nextNote.dwno} ${nextNote.title}`, cls: "dewey-nav-title" });
      nextBox.addEventListener("click", () => this.openNote(nextNote.file));
    } else {
      nextBox.addClass("disabled");
      nextBox.createSpan({
        text: nextDwno ? `No note (${nextDwno})` : "End of topics",
        cls: "dewey-nav-title",
      });
    }
  }

  renderChapterTopicsSection(container, allNotes, activeNote) {
    const sec = container.createDiv({ cls: "dewey-nav-section" });
    const header = sec.createDiv({ cls: "dewey-nav-header" });
    const left = header.createDiv({ cls: "dewey-nav-header-left" });
    left.innerHTML = `${PHOSPHOR_ICONS.bookOpenText} <span>Chapter Topics</span>`;
    const toggle = header.createDiv({ cls: "toggle-icon" });
    toggle.innerHTML = PHOSPHOR_ICONS.caretDown;

    const content = sec.createDiv({ cls: "dewey-nav-content" });
    if (this.sectionsCollapsed["chapter"]) {
      content.addClass("collapsed");
      header.addClass("collapsed");
    }

    header.addEventListener("click", () => {
      this.sectionsCollapsed["chapter"] = !this.sectionsCollapsed["chapter"];
      content.toggleClass("collapsed", this.sectionsCollapsed["chapter"]);
      header.toggleClass("collapsed", this.sectionsCollapsed["chapter"]);
    });

    const chLevel = this.plugin.settings.chapterLevel;
    const maxDepth = this.plugin.settings.chapterMaxDepth;
    const segs = activeNote.dwno.split(".");

    if (segs.length < chLevel) {
      content.createEl("span", {
        text: `Active note is above Chapter level (${segs.length} < ${chLevel}).`,
        cls: "dewey-nav-empty-msg",
      });
      return;
    }

    const chapterPrefix = segs.slice(0, chLevel).join(".");

    const chapterTopics = allNotes.filter((n) => {
      if (n.dwno !== chapterPrefix && !n.dwno.startsWith(chapterPrefix + ".")) return false;
      const count = n.dwno.split(".").length;
      return count <= maxDepth;
    });

    if (chapterTopics.length === 0) {
      content.createEl("span", { text: "No chapter topics found.", cls: "dewey-nav-empty-msg" });
      return;
    }

    const list = content.createEl("ul", { cls: "dewey-nav-tree" });

    for (const item of chapterTopics) {
      const depth = item.dwno.split(".").length - chLevel;
      const li = list.createEl("li", { cls: "dewey-nav-item" });
      if (item.dwno === activeNote.dwno) {
        li.addClass("active");
      }

      li.style.paddingLeft = `${Math.max(0, depth) * 12 + 6}px`;

      li.createSpan({ text: item.dwno, cls: "dwno-badge" });
      li.createSpan({ text: item.title, cls: "note-title" });

      li.addEventListener("click", () => this.openNote(item.file));
    }
  }

  renderSubjectIndexSection(container, allNotes, activeNote) {
    const sec = container.createDiv({ cls: "dewey-nav-section" });
    const header = sec.createDiv({ cls: "dewey-nav-header" });
    const left = header.createDiv({ cls: "dewey-nav-header-left" });
    left.innerHTML = `${PHOSPHOR_ICONS.books} <span>Subject Chapters</span>`;
    const toggle = header.createDiv({ cls: "toggle-icon" });
    toggle.innerHTML = PHOSPHOR_ICONS.caretDown;

    const content = sec.createDiv({ cls: "dewey-nav-content" });
    if (this.sectionsCollapsed["subject"]) {
      content.addClass("collapsed");
      header.addClass("collapsed");
    }

    header.addEventListener("click", () => {
      this.sectionsCollapsed["subject"] = !this.sectionsCollapsed["subject"];
      content.toggleClass("collapsed", this.sectionsCollapsed["subject"]);
      header.toggleClass("collapsed", this.sectionsCollapsed["subject"]);
    });

    const subLevel = this.plugin.settings.subjectLevel;
    const chLevel = this.plugin.settings.chapterLevel;
    const segs = activeNote.dwno.split(".");

    if (segs.length < subLevel) {
      content.createEl("span", {
        text: `Active note is above Subject level (${segs.length} < ${subLevel}).`,
        cls: "dewey-nav-empty-msg",
      });
      return;
    }

    const subjectPrefix = segs.slice(0, subLevel).join(".");
    const currentChapterPrefix = segs.length >= chLevel ? segs.slice(0, chLevel).join(".") : null;

    const chapters = allNotes.filter((n) => {
      const parts = n.dwno.split(".");
      return parts.length === chLevel && n.dwno.startsWith(subjectPrefix + ".");
    });

    if (chapters.length === 0) {
      content.createEl("span", { text: "No chapters found in this subject.", cls: "dewey-nav-empty-msg" });
      return;
    }

    const list = content.createEl("ul", { cls: "dewey-nav-tree" });

    for (const ch of chapters) {
      const li = list.createEl("li", { cls: "dewey-nav-item" });
      if (currentChapterPrefix && ch.dwno === currentChapterPrefix) {
        li.addClass("active");
      }

      li.createSpan({ text: ch.dwno, cls: "dwno-badge" });
      li.createSpan({ text: ch.title, cls: "note-title" });

      li.addEventListener("click", () => this.openNote(ch.file));
    }
  }

  renderCustomSection(container, allNotes, activeNote, rule) {
    const segs = activeNote.dwno.split(".");
    if (segs.length < rule.minActiveLevel) return;

    const parentLevel = rule.matchParentLevel;
    if (segs.length < parentLevel) return;

    const sharedParentPrefix = segs.slice(0, parentLevel).join(".");
    const targetLevel = rule.targetLevel;

    const matchedNotes = allNotes.filter((n) => {
      const parts = n.dwno.split(".");
      if (parts.length < parentLevel) return false;
      const nPrefix = parts.slice(0, parentLevel).join(".");
      if (nPrefix !== sharedParentPrefix) return false;

      if (targetLevel > 0) {
        return parts.length === targetLevel;
      }
      return true;
    });

    if (matchedNotes.length === 0) return;

    const sec = container.createDiv({ cls: "dewey-nav-section" });
    const header = sec.createDiv({ cls: "dewey-nav-header" });
    const left = header.createDiv({ cls: "dewey-nav-header-left" });

    const iconSvg = rule.customSvg && rule.customSvg.startsWith("<svg")
      ? rule.customSvg
      : (PHOSPHOR_ICONS[rule.icon] || PHOSPHOR_ICONS.folders);

    const displayName = rule.name || "Custom Section";
    left.innerHTML = `${iconSvg} <span>${displayName}</span>`;
    const toggle = header.createDiv({ cls: "toggle-icon" });
    toggle.innerHTML = PHOSPHOR_ICONS.caretDown;

    const content = sec.createDiv({ cls: "dewey-nav-content" });
    const secKey = "custom_" + rule.id;
    if (this.sectionsCollapsed[secKey]) {
      content.addClass("collapsed");
      header.addClass("collapsed");
    }

    header.addEventListener("click", () => {
      this.sectionsCollapsed[secKey] = !this.sectionsCollapsed[secKey];
      content.toggleClass("collapsed", this.sectionsCollapsed[secKey]);
      header.toggleClass("collapsed", this.sectionsCollapsed[secKey]);
    });

    const list = content.createEl("ul", { cls: "dewey-nav-tree" });

    for (const item of matchedNotes) {
      const li = list.createEl("li", { cls: "dewey-nav-item" });
      const isActive =
        activeNote.dwno === item.dwno ||
        (targetLevel > 0 && activeNote.dwno.startsWith(item.dwno + "."));

      if (isActive) {
        li.addClass("active");
      }

      li.createSpan({ text: item.dwno, cls: "dwno-badge" });
      li.createSpan({ text: item.title, cls: "note-title" });

      li.addEventListener("click", () => this.openNote(item.file));
    }
  }
}

module.exports = class DeweyNavigatorPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.registerView(VIEW_TYPE_DEWEY_NAV, (leaf) => new DeweyNavView(leaf, this));

    this.addRibbonIcon("book-open", "Open Dewey Navigator", () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-dewey-navigator",
      name: "Open Dewey Navigator Sidebar",
      callback: () => {
        this.activateView();
      },
    });

    this.addSettingTab(new DeweyNavSettingTab(this.app, this));

    this.app.workspace.onLayoutReady(() => {
      this.initView();
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (!this.settings.customSections) {
      this.settings.customSections = DEFAULT_SETTINGS.customSections;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  refreshView() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_DEWEY_NAV);
    for (const leaf of leaves) {
      if (leaf.view instanceof DeweyNavView) {
        leaf.view.render();
      }
    }
  }

  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_DEWEY_NAV);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }

    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({
        type: VIEW_TYPE_DEWEY_NAV,
        active: true,
      });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  async initView() {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_DEWEY_NAV).length === 0) {
      const leaf = this.app.workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({
          type: VIEW_TYPE_DEWEY_NAV,
          active: false,
        });
      }
    }
  }
};

export class ProjectModel {
  getDocumentSources() {
    return [
      { title: "Game Concept Document", file: "./GAME_CONCEPT_DOCUMENT.md" },
      { title: "GDD", file: "./GDD.md" },
      { title: "Pitch Document", file: "./PITCH_DOCUMENT.md" },
      { title: "Narrative Bible", file: "./NARRATIVE_BIBLE.md" },
      { title: "Technical Design Document", file: "./TECHNICAL_DESIGN_DOCUMENT.md" },
      { title: "Production Plan MVP", file: "./PRODUCTION_PLAN_MVP.md" },
    ];
  }

  getExcalidrawSources() {
    return {
      main: "./2026-03-11-1536.excalidraw",
      concept: "./TRONO_2415_concept.excalidraw",
    };
  }
}

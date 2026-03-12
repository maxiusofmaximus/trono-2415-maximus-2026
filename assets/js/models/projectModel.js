export class ProjectModel {
  getDocumentSources() {
    return [
      { title: "Game Concept Document", titleEs: "Documento de Concepto de Juego", file: "./GAME_CONCEPT_DOCUMENT.md" },
      { title: "GDD", titleEs: "GDD", file: "./GDD.md" },
      { title: "Pitch Document", titleEs: "Documento de Pitch", file: "./PITCH_DOCUMENT.md" },
      { title: "Narrative Bible", titleEs: "Biblia Narrativa", file: "./NARRATIVE_BIBLE.md" },
      { title: "Technical Design Document", titleEs: "Documento de Diseño Técnico", file: "./TECHNICAL_DESIGN_DOCUMENT.md" },
      { title: "Production Plan MVP", titleEs: "Plan de Producción MVP", file: "./PRODUCTION_PLAN_MVP.md" },
    ];
  }

  getExcalidrawSources() {
    return {
      main: "./2026-03-11-1536.excalidraw",
      concept: "./TRONO_2415_concept.excalidraw",
    };
  }
}

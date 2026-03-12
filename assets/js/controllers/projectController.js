export class ProjectController {
  constructor(model, contentView, excalidrawView, demoView, i18n = null) {
    this.model = model;
    this.i18n = i18n;
    this.contentView = contentView;
    this.excalidrawView = excalidrawView;
    this.demoView = demoView;
  }

  async init() {
    await Promise.all([this.loadDocuments(), this.loadExcalidraw()]);
    await this.demoView.mount();
    window.addEventListener("app:localeChanged", (event) => {
      this.i18n = this.i18n || { locale: event.detail?.locale || document.documentElement.lang || "en" };
      this.i18n.locale = event.detail?.locale || this.i18n.locale;
      this.loadDocuments();
      this.demoView.refreshLocale();
    });
  }

  async loadDocuments() {
    const sources = this.model.getDocumentSources();
    const documents = await Promise.all(
      sources.map(async (item) => {
        const response = await fetch(item.file);
        const locale = this.i18n?.locale || document.documentElement.lang || "en";
        const content = response.ok
          ? await response.text()
          : locale === "es"
            ? "No se pudo cargar este documento."
            : "This document could not be loaded.";
        return { title: locale === "es" ? item.titleEs || item.title : item.title, content };
      })
    );
    this.contentView.renderDocuments(documents);
  }

  async loadExcalidraw() {
    const sources = this.model.getExcalidrawSources();
    const [mainResponse, conceptResponse] = await Promise.all([fetch(sources.main), fetch(sources.concept)]);
    const [mainData, conceptData] = await Promise.all([mainResponse.json(), conceptResponse.json()]);
    this.excalidrawView.render(mainData, conceptData);
  }
}

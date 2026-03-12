export class ProjectController {
  constructor(model, contentView, excalidrawView, demoView) {
    this.model = model;
    this.contentView = contentView;
    this.excalidrawView = excalidrawView;
    this.demoView = demoView;
  }

  async init() {
    await Promise.all([this.loadDocuments(), this.loadExcalidraw()]);
    await this.demoView.mount();
  }

  async loadDocuments() {
    const sources = this.model.getDocumentSources();
    const documents = await Promise.all(
      sources.map(async (item) => {
        const response = await fetch(item.file);
        const content = response.ok ? await response.text() : "No se pudo cargar este documento.";
        return { title: item.title, content };
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

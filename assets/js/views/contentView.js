export class ContentView {
  constructor(container) {
    this.container = container;
  }

  renderDocuments(documents) {
    this.container.innerHTML = "";
    documents.forEach((doc) => {
      const article = document.createElement("article");
      article.className = "doc-card";
      const title = document.createElement("h3");
      title.textContent = doc.title;
      const content = document.createElement("pre");
      content.className = "doc-content";
      content.textContent = doc.content;
      article.append(title, content);
      this.container.appendChild(article);
    });
  }
}

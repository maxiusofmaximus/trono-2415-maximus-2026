export class ExcalidrawView {
  constructor({ mainCanvas, conceptCanvas }) {
    this.mainCanvas = mainCanvas;
    this.conceptCanvas = conceptCanvas;
  }

  render(mainScene, conceptScene) {
    this.drawScene(mainScene, this.mainCanvas);
    this.drawScene(conceptScene, this.conceptCanvas);
  }

  drawScene(scene, canvas) {
    const context = canvas.getContext("2d");
    const elements = (scene.elements || []).filter((element) => !element.isDeleted);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (elements.length === 0) {
      return;
    }

    const bounds = this.computeBounds(elements);
    const padding = 24;
    const scaleX = (canvas.width - padding * 2) / Math.max(1, bounds.maxX - bounds.minX);
    const scaleY = (canvas.height - padding * 2) / Math.max(1, bounds.maxY - bounds.minY);
    const scale = Math.min(scaleX, scaleY);
    const offsetX = padding - bounds.minX * scale;
    const offsetY = padding - bounds.minY * scale;
    const projectX = (value) => value * scale + offsetX;
    const projectY = (value) => value * scale + offsetY;

    elements
      .filter((element) => element.type === "arrow")
      .forEach((arrow) => this.drawArrow(context, arrow, projectX, projectY, scale));

    elements
      .filter((element) => element.type === "rectangle")
      .forEach((rectangle) => this.drawRectangle(context, rectangle, projectX, projectY, scale));

    elements
      .filter((element) => element.type === "text")
      .forEach((text) => this.drawText(context, text, projectX, projectY, scale));
  }

  computeBounds(elements) {
    const initial = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    return elements.reduce((acc, element) => {
      if (element.type === "arrow" && Array.isArray(element.points) && element.points.length > 1) {
        const points = element.points.map((point) => [point[0] + element.x, point[1] + element.y]);
        const xs = points.map((point) => point[0]);
        const ys = points.map((point) => point[1]);
        acc.minX = Math.min(acc.minX, ...xs);
        acc.minY = Math.min(acc.minY, ...ys);
        acc.maxX = Math.max(acc.maxX, ...xs);
        acc.maxY = Math.max(acc.maxY, ...ys);
        return acc;
      }
      acc.minX = Math.min(acc.minX, element.x);
      acc.minY = Math.min(acc.minY, element.y);
      acc.maxX = Math.max(acc.maxX, element.x + (element.width || 0));
      acc.maxY = Math.max(acc.maxY, element.y + (element.height || 0));
      return acc;
    }, initial);
  }

  drawRectangle(context, rectangle, projectX, projectY, scale) {
    const x = projectX(rectangle.x);
    const y = projectY(rectangle.y);
    const width = (rectangle.width || 0) * scale;
    const height = (rectangle.height || 0) * scale;
    const radius = Math.min(width, height) * 0.08;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    if (rectangle.backgroundColor && rectangle.backgroundColor !== "transparent") {
      context.fillStyle = rectangle.backgroundColor;
      context.fill();
    }
    context.strokeStyle = rectangle.strokeColor || "#223";
    context.lineWidth = Math.max(1, (rectangle.strokeWidth || 1) * Math.max(0.6, scale * 0.03));
    context.stroke();
  }

  drawText(context, textElement, projectX, projectY, scale) {
    const x = projectX(textElement.x);
    const y = projectY(textElement.y);
    const lines = String(textElement.text || "").split("\n");
    const fontSize = Math.max(9, (textElement.fontSize || 16) * Math.max(0.45, scale * 0.045));
    context.fillStyle = textElement.strokeColor || "#202020";
    context.font = `${fontSize}px "Segoe UI", Arial, sans-serif`;
    context.textBaseline = "top";
    const lineHeight = fontSize * 1.25;
    lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  }

  drawArrow(context, arrow, projectX, projectY, scale) {
    if (!Array.isArray(arrow.points) || arrow.points.length < 2) {
      return;
    }
    const points = arrow.points.map((point) => [projectX(point[0] + arrow.x), projectY(point[1] + arrow.y)]);
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach((point) => context.lineTo(point[0], point[1]));
    context.strokeStyle = arrow.strokeColor || "#0b7285";
    context.lineWidth = Math.max(1.2, (arrow.strokeWidth || 1) * Math.max(0.7, scale * 0.03));
    context.stroke();

    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
    const headLength = Math.max(6, 8 * Math.max(0.8, scale * 0.04));
    context.beginPath();
    context.moveTo(last[0], last[1]);
    context.lineTo(last[0] - headLength * Math.cos(angle - Math.PI / 6), last[1] - headLength * Math.sin(angle - Math.PI / 6));
    context.lineTo(last[0] - headLength * Math.cos(angle + Math.PI / 6), last[1] - headLength * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fillStyle = arrow.strokeColor || "#0b7285";
    context.fill();
  }
}

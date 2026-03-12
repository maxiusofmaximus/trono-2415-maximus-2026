import { ProjectController } from "./controllers/projectController.js";
import { ProjectModel } from "./models/projectModel.js";
import { ContentView } from "./views/contentView.js";
import { ExcalidrawView } from "./views/excalidrawView.js";
import { DemoView } from "./views/demoView.js";

const controller = new ProjectController(
  new ProjectModel(),
  new ContentView(document.getElementById("documents-container")),
  new ExcalidrawView({
    mainCanvas: document.getElementById("diagram-canvas-main"),
    conceptCanvas: document.getElementById("diagram-canvas-concept"),
  }),
  new DemoView(document.getElementById("three-demo"))
);

controller.init();

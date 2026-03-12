import { ProjectController } from "./controllers/projectController.js";
import { ProjectModel } from "./models/projectModel.js";
import { ContentView } from "./views/contentView.js";
import { ExcalidrawView } from "./views/excalidrawView.js";
import { DemoView } from "./views/demoView.js";
import { I18n } from "./i18n.js";

const i18n = new I18n("en");
i18n.init();

const controller = new ProjectController(
  new ProjectModel(),
  new ContentView(document.getElementById("documents-container")),
  new ExcalidrawView({
    mainCanvas: document.getElementById("diagram-canvas-main"),
    conceptCanvas: document.getElementById("diagram-canvas-concept"),
  }),
  new DemoView(document.getElementById("three-demo"), i18n),
  i18n
);

controller.init();

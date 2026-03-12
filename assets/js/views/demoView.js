export class DemoView {
  constructor(container, i18n) {
    this.container = container;
    this.i18n = i18n;
    this.phase = "cinematic";
    this.phaseStart = 0;
    this.assets = {};
    this.actions = [];
    this.selectedMission = null;
  }

  async mount() {
    this.container.innerHTML = "";
    this.canvas = document.createElement("canvas");
    this.canvas.className = "story-canvas";
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
    this.overlay = document.createElement("div");
    this.overlay.className = "demo-ui";
    this.container.appendChild(this.overlay);
    await this.loadAssets();
    this.onResize = () => this.resize();
    window.addEventListener("resize", this.onResize);
    this.resize();
    this.phase = "cinematic";
    this.phaseStart = performance.now();
    this.renderUI();
    this.tick = (now) => {
      this.draw(now);
      requestAnimationFrame(this.tick);
    };
    requestAnimationFrame(this.tick);
  }

  refreshLocale() {
    if (!this.overlay) {
      return;
    }
    this.renderUI();
  }

  async loadAssets() {
    const sources = {
      soldier: "https://api.dicebear.com/9.x/adventurer/svg?seed=Soldier-2415",
      founderOne: "./assets/founder-washington.png",
      founderTwo: "./assets/founder-lincoln.png",
      founderThree: "./assets/founder-franklin.png",
    };
    const entries = await Promise.all(
      Object.entries(sources).map(async ([key, url]) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;
        await image.decode().catch(() => null);
        return [key, image];
      })
    );
    this.assets = Object.fromEntries(entries);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.canvas.width = Math.max(1, Math.floor(width * dpr));
    this.canvas.height = Math.max(1, Math.floor(height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = width;
    this.height = height;
  }

  transitionTo(phase) {
    this.phase = phase;
    this.phaseStart = performance.now();
    this.renderUI();
  }

  setActions(actions) {
    this.actions = actions;
    this.overlay.querySelectorAll("button").forEach((button) => button.remove());
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "demo-btn";
      button.textContent = action.label;
      button.addEventListener("click", action.onClick);
      this.overlay.appendChild(button);
    });
  }

  renderUI() {
    this.overlay.innerHTML = "";
    const title = document.createElement("p");
    title.className = "demo-title";
    const body = document.createElement("p");
    body.className = "demo-copy";
    this.overlay.appendChild(title);
    this.overlay.appendChild(body);
    if (this.phase === "cinematic") {
      title.textContent = this.i18n.t("demo.story.cinematicTitle");
      body.textContent = this.i18n.t("demo.story.cinematicBody");
      this.setActions([]);
    } else if (this.phase === "briefing") {
      title.textContent = this.i18n.t("demo.story.briefingTitle");
      body.textContent = this.i18n.t("demo.story.briefingBody");
      this.setActions([
        {
          label: this.i18n.t("demo.story.continue"),
          onClick: () => this.transitionTo("choice"),
        },
      ]);
    } else if (this.phase === "choice") {
      title.textContent = this.i18n.t("demo.story.choiceTitle");
      body.textContent = this.i18n.t("demo.story.choiceBody");
      this.setActions([
        {
          label: this.i18n.t("demo.story.accept"),
          onClick: () => this.transitionTo("missions"),
        },
        {
          label: this.i18n.t("demo.story.reject"),
          onClick: () => this.transitionTo("declined"),
        },
      ]);
    } else if (this.phase === "declined") {
      title.textContent = this.i18n.t("demo.story.declinedTitle");
      body.textContent = this.i18n.t("demo.story.declinedBody");
      this.setActions([
        {
          label: this.i18n.t("demo.story.retry"),
          onClick: () => this.transitionTo("choice"),
        },
      ]);
    } else if (this.phase === "missions") {
      title.textContent = this.i18n.t("demo.story.missionsTitle");
      body.textContent = this.i18n.t("demo.story.missionsBody");
      this.setActions([
        {
          label: this.i18n.t("demo.story.m1Label"),
          onClick: () => this.selectMission("m1"),
        },
        {
          label: this.i18n.t("demo.story.m2Label"),
          onClick: () => this.selectMission("m2"),
        },
        {
          label: this.i18n.t("demo.story.m3Label"),
          onClick: () => this.selectMission("m3"),
        },
        {
          label: this.i18n.t("demo.story.m4Label"),
          onClick: () => this.selectMission("m4"),
        },
      ]);
    } else {
      title.textContent = this.i18n.t("demo.story.lockedTitle");
      body.textContent = this.i18n.t(`demo.story.${this.selectedMission}Result`);
      this.setActions([
        {
          label: this.i18n.t("demo.story.restart"),
          onClick: () => this.transitionTo("briefing"),
        },
      ]);
    }
  }

  selectMission(mission) {
    this.selectedMission = mission;
    this.transitionTo("locked");
  }

  draw(now) {
    if (!this.ctx) {
      return;
    }
    const elapsed = (now - this.phaseStart) / 1000;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, "#041120");
    sky.addColorStop(1, "#0d2746");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);
    this.drawStars(elapsed);
    if (this.phase === "cinematic") {
      this.drawCinematic(elapsed);
      if (elapsed > 9.5) {
        this.transitionTo("briefing");
      }
    } else if (this.phase === "briefing" || this.phase === "choice" || this.phase === "missions" || this.phase === "declined" || this.phase === "locked") {
      this.drawBriefingScene(elapsed);
    }
  }

  drawStars(elapsed) {
    const ctx = this.ctx;
    for (let i = 0; i < 42; i += 1) {
      const x = ((i * 79) % this.width) + Math.sin(elapsed * 0.3 + i) * 6;
      const y = ((i * 53) % (this.height * 0.65)) + Math.cos(elapsed * 0.25 + i * 0.8) * 4;
      const alpha = 0.35 + ((Math.sin(elapsed * 1.8 + i) + 1) / 2) * 0.5;
      this.ctx.fillStyle = `rgba(163,219,255,${alpha})`;
      this.ctx.fillRect(x, y, 2, 2);
    }
  }

  drawCinematic(elapsed) {
    const ctx = this.ctx;
    const groundY = this.height * 0.72;
    ctx.fillStyle = "#111a22";
    ctx.fillRect(0, groundY, this.width, this.height - groundY);
    const soldierX = -80 + Math.min(1, elapsed / 4.8) * (this.width * 0.45 + 80);
    const soldierY = groundY - 110 + Math.sin(elapsed * 6) * 4;
    if (this.assets.soldier?.naturalWidth > 0) {
      ctx.drawImage(this.assets.soldier, soldierX, soldierY, 96, 96);
    } else {
      ctx.fillStyle = "#71c7ff";
      ctx.fillRect(soldierX + 28, soldierY + 20, 38, 62);
    }
    if (elapsed > 4.8) {
      const shock = Math.min(1, (elapsed - 4.8) / 1.6);
      ctx.fillStyle = `rgba(255,115,90,${0.2 + shock * 0.55})`;
      ctx.beginPath();
      ctx.arc(soldierX + 52, soldierY + 48, 35 + shock * 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,240,179,${0.25 + shock * 0.5})`;
      ctx.beginPath();
      ctx.arc(soldierX + 52, soldierY + 48, 18 + shock * 50, 0, Math.PI * 2);
      ctx.fill();
    }
    if (elapsed > 6) {
      ctx.fillStyle = "rgba(0,0,0,0.58)";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#e0f2ff";
      ctx.font = "700 24px Rajdhani, sans-serif";
      ctx.fillText(this.i18n.t("demo.story.fall"), 30, this.height * 0.23);
    }
  }

  drawBriefingScene(elapsed) {
    const ctx = this.ctx;
    const floor = this.height * 0.78;
    ctx.fillStyle = "#121e2f";
    ctx.fillRect(0, floor, this.width, this.height - floor);
    const pulse = 0.55 + Math.sin(elapsed * 2.2) * 0.08;
    ctx.fillStyle = `rgba(61,177,255,${pulse})`;
    ctx.fillRect(0, floor - 6, this.width, 4);
    const cards = [
      { key: "founderOne", x: this.width * 0.2, y: this.height * 0.33 },
      { key: "founderTwo", x: this.width * 0.45, y: this.height * 0.28 },
      { key: "founderThree", x: this.width * 0.7, y: this.height * 0.33 },
    ];
    cards.forEach((card, index) => {
      ctx.fillStyle = "rgba(13,26,43,0.8)";
      ctx.fillRect(card.x - 10, card.y - 10, 106, 116);
      const image = this.assets[card.key];
      if (image?.naturalWidth > 0) {
        ctx.drawImage(image, card.x, card.y, 86, 86);
      } else {
        ctx.fillStyle = "#86d6ff";
        ctx.fillRect(card.x + 20, card.y + 16, 42, 42);
      }
      ctx.fillStyle = "#d8ebff";
      ctx.font = "600 13px IBM Plex Sans, sans-serif";
      ctx.fillText(this.i18n.t(`demo.story.founder.${index + 1}`), card.x - 8, card.y + 102);
    });
  }

}

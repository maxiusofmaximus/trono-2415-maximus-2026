export class DemoView {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const camera = new THREE.OrthographicCamera(-12, 12, 6, -6, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    this.container.appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(24, 24, 0x1f4f79, 0x17324f);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    const player = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 24),
      new THREE.MeshBasicMaterial({ color: 0x3ad5ff })
    );
    player.position.set(-9, -4.5, 0.2);
    scene.add(player);

    const objectiveMaterial = new THREE.MeshBasicMaterial({ color: 0x78f06a });
    const objectives = [
      new THREE.Mesh(new THREE.CircleGeometry(0.28, 20), objectiveMaterial),
      new THREE.Mesh(new THREE.CircleGeometry(0.28, 20), objectiveMaterial),
      new THREE.Mesh(new THREE.CircleGeometry(0.28, 20), objectiveMaterial),
    ];
    objectives[0].position.set(-5, -1.2, 0.1);
    objectives[1].position.set(1.5, 1.8, 0.1);
    objectives[2].position.set(6.2, -2.2, 0.1);
    objectives.forEach((target) => scene.add(target));

    const alertMaterial = new THREE.MeshBasicMaterial({ color: 0xff5b5b, transparent: true, opacity: 0.28 });
    const alertZones = [
      new THREE.Mesh(new THREE.CircleGeometry(1.2, 26), alertMaterial),
      new THREE.Mesh(new THREE.CircleGeometry(1.6, 26), alertMaterial),
      new THREE.Mesh(new THREE.CircleGeometry(1.1, 26), alertMaterial),
    ];
    alertZones[0].position.set(-2.2, -3.2, 0.05);
    alertZones[1].position.set(3.8, 0.2, 0.05);
    alertZones[2].position.set(8.1, -3.5, 0.05);
    alertZones.forEach((zone) => scene.add(zone));

    const status = document.createElement("p");
    status.style.margin = "0.7rem 0 0";
    status.style.color = "#b6d8f8";
    status.textContent = "Objetivos protegidos: 0/3";
    this.container.appendChild(status);

    let collected = 0;
    const keys = new Set();

    const onKeyDown = (event) => keys.add(event.key.toLowerCase());
    const onKeyUp = (event) => keys.delete(event.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const resize = () => renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    window.addEventListener("resize", resize);

    const updateMovement = () => {
      const speed = 0.085;
      if (keys.has("w") || keys.has("arrowup")) player.position.y += speed;
      if (keys.has("s") || keys.has("arrowdown")) player.position.y -= speed;
      if (keys.has("a") || keys.has("arrowleft")) player.position.x -= speed;
      if (keys.has("d") || keys.has("arrowright")) player.position.x += speed;
      player.position.x = Math.min(11.2, Math.max(-11.2, player.position.x));
      player.position.y = Math.min(5.2, Math.max(-5.2, player.position.y));
    };

    const checkObjectives = () => {
      objectives.forEach((target) => {
        if (!target.visible) return;
        const distance = player.position.distanceTo(target.position);
        if (distance < 0.75) {
          target.visible = false;
          collected += 1;
          status.textContent = `Objetivos protegidos: ${collected}/3`;
          if (collected === 3) {
            status.textContent = "Misión limpia completada: 3/3 objetivos protegidos";
          }
        }
      });
    };

    const checkAlerts = () => {
      const isInside = alertZones.some((zone) => player.position.distanceTo(zone.position) < zone.geometry.parameters.radius);
      player.material.color.set(isInside ? 0xffc14d : 0x3ad5ff);
      if (isInside && collected < 3) {
        status.textContent = `Zona de alerta detectada · Objetivos protegidos: ${collected}/3`;
      } else if (collected < 3) {
        status.textContent = `Objetivos protegidos: ${collected}/3`;
      }
    };

    const tick = () => {
      updateMovement();
      checkObjectives();
      checkAlerts();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
  }
}

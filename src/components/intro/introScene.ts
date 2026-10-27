import * as THREE from "three";

// three.js 인트로 씬. Portfolio.dc.html의 initIntro() 이식.
// 스펙: design README "3D 인트로"
const INTRO = {
  fov: 38,
  cameraZ: 17,
  cardRadiusPx: 28,
  extrude: { depth: 0.42, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.06, bevelSegments: 6, curveSegments: 16 },
  // 흰 카드가 많아서 색 카드가 가장자리에 고르게 퍼지도록 짠 각도 순서 (±7° 랜덤)
  scatterAngles: [70, 295, 30, 330, 150, 210, 115, 250],
  scatterRadius: 0.4,
  idleScaleMax: 0.62,
  staggerMs: 55,
  durationMs: 1600,
  arcZ: 2.2,
  wallShadowOpacity: 0.13,
} as const;

export interface IntroSceneOptions {
  /** 모든 카드 착지 시 1회 호출 */
  onAssembled: () => void;
}

export interface IntroSceneHandle {
  /** 조립 시작: 목표 위치를 다시 측정(retarget)한 뒤 애니메이션 */
  assemble: () => void;
  dispose: () => void;
}

interface Card {
  el: Element;
  mesh: THREE.Mesh;
  face: THREE.MeshPhysicalMaterial;
  side: THREE.MeshPhysicalMaterial;
  base: THREE.Color;
  sideC: THREE.Color;
  nw: number;
  nh: number;
  target: THREE.Vector3;
  tsx: number;
  tsy: number;
  scatter: THREE.Vector3;
  srot: THREE.Euler;
  idle: number;
  ph: number;
  dir: 1 | -1;
  lift: number;
  from?: THREE.Vector3;
  fromRot?: THREE.Euler;
  fromS?: number;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** 밝은 패널 3개짜리 스튜디오 환경맵 */
function createStudioEnv(renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x77776f, side: THREE.BackSide })));
  const panels: [number, number, number, number, number, number][] = [
    [0, 13, 2, 18, 3, 4],
    [-13, 3, 6, 3, 12, 2.5],
    [13, 0, 8, 3, 10, 2],
  ];
  for (const [x, y, z, w, h, k] of panels) {
    const p = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(k), side: THREE.DoubleSide }),
    );
    p.position.set(x, y, z);
    p.lookAt(0, 0, 0);
    env.add(p);
  }
  const texture = pmrem.fromScene(env, 0.04).texture;
  const dispose = () => {
    texture.dispose();
    pmrem.dispose();
    env.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
  };
  return { texture, dispose };
}

/**
 * host에 WebGL 캔버스를 붙이고 document의 [data-bento] 요소로 카드를 만든다.
 * 그리드 카드가 바뀌면 인트로 카드도 자동으로 따라 바뀐다.
 * WebGL 생성 실패 / 카드 없음 → throw (호출부에서 인트로 종료)
 */
export function createIntroScene(host: HTMLElement, options: IntroSceneOptions): IntroSceneHandle {
  const doms = [...document.querySelectorAll("[data-bento]")];
  if (!doms.length) throw new Error("no [data-bento] elements");

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const env = createStudioEnv(renderer);
  scene.environment = env.texture;

  const camera = new THREE.PerspectiveCamera(INTRO.fov, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, INTRO.cameraZ);

  // 화면(px) ↔ z=0 평면(world) 변환
  const view = { W: 0, H: 0, vw: 1, vh: 1 };
  const fit = () => {
    view.vw = host.clientWidth;
    view.vh = host.clientHeight;
    camera.aspect = view.vw / view.vh;
    camera.updateProjectionMatrix();
    view.H = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    view.W = view.H * camera.aspect;
  };
  fit();
  const toWorld = (r: DOMRect) => ({
    x: ((r.left + r.width / 2) / view.vw - 0.5) * view.W,
    y: (0.5 - (r.top + r.height / 2) / view.vh) * view.H,
    w: (r.width / view.vw) * view.W,
    h: (r.height / view.vh) * view.H,
  });

  // 조명 · 그림자 벽
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d8d0, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(7, 10, 14);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  Object.assign(key.shadow.camera, { left: -20, right: 20, top: 14, bottom: -14, near: 1, far: 50 });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);

  const wallMat = new THREE.ShadowMaterial({ opacity: INTRO.wallShadowOpacity });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(160, 100), wallMat);
  wall.position.z = -5;
  wall.receiveShadow = true;
  scene.add(wall);

  // 카드 생성 (고정 시드로 매번 같은 배치)
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const group = new THREE.Group();
  scene.add(group);
  const rad = (INTRO.cardRadiusPx / view.vw) * view.W;

  const cards: Card[] = doms.map((el, i) => {
    const t = toWorld(el.getBoundingClientRect());
    const base = new THREE.Color().setStyle(getComputedStyle(el).backgroundColor, THREE.SRGBColorSpace);
    const geo = new THREE.ExtrudeGeometry(
      roundedRect(t.w, t.h, Math.min(rad, t.w / 2 - 0.01, t.h / 2 - 0.01)),
      INTRO.extrude,
    );
    geo.center();
    const face = new THREE.MeshPhysicalMaterial({
      color: base.clone(),
      emissive: base.clone(),
      emissiveIntensity: 0,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      envMapIntensity: 0.9,
    });
    // 측면은 기본색을 어둡게 (흰 카드는 덜 어둡게)
    const sideC = base.clone().multiplyScalar(base.getHSL({ h: 0, s: 0, l: 0 }).l > 0.9 ? 0.86 : 0.78);
    const side = new THREE.MeshPhysicalMaterial({
      color: sideC.clone(),
      emissive: base.clone(),
      emissiveIntensity: 0,
      roughness: 0.4,
      clearcoat: 0.6,
      envMapIntensity: 0.9,
    });
    const mesh = new THREE.Mesh(geo, [face, side]);
    mesh.castShadow = true;
    group.add(mesh);

    const ang = ((INTRO.scatterAngles[i % INTRO.scatterAngles.length] + (rnd() - 0.5) * 14) * Math.PI) / 180;
    const scatter = new THREE.Vector3(
      Math.cos(ang) * view.W * INTRO.scatterRadius,
      Math.sin(ang) * view.H * INTRO.scatterRadius,
      -2.8 + rnd() * 4.6,
    );
    const srot = new THREE.Euler((rnd() - 0.5) * 1.4, (rnd() - 0.5) * 2.0, (rnd() - 0.5) * 0.9);
    const idle = Math.min(INTRO.idleScaleMax, (view.H * 0.3) / t.h);
    return {
      el,
      mesh,
      face,
      side,
      base,
      sideC,
      nw: t.w,
      nh: t.h,
      target: new THREE.Vector3(t.x, t.y, 0),
      tsx: 1,
      tsy: 1,
      scatter,
      srot,
      idle,
      ph: rnd() * Math.PI * 2,
      dir: rnd() > 0.5 ? 1 : -1,
      lift: 0,
    };
  });

  const retarget = () =>
    cards.forEach((c) => {
      const t = toWorld(c.el.getBoundingClientRect());
      c.target.set(t.x, t.y, 0);
      c.tsx = t.w / c.nw;
      c.tsy = t.h / c.nh;
    });

  // 입력
  const mouse = { x: 0, y: 0 };
  const ndc = new THREE.Vector2(9, 9); // 화면 밖 → 첫 프레임 hover 없음
  const ray = new THREE.Raycaster();
  const onMove = (e: MouseEvent) => {
    const r = host.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width - 0.5;
    mouse.y = (e.clientY - r.top) / r.height - 0.5;
    ndc.set(mouse.x * 2, -mouse.y * 2);
  };
  const onResize = () => {
    renderer.setSize(host.clientWidth, host.clientHeight);
    fit();
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("resize", onResize);

  // 루프
  const black = new THREE.Color(0, 0, 0);
  const meshes = cards.map((c) => c.mesh);
  const t0 = performance.now();
  let assembling = false;
  let start = 0;
  let done = false;
  let raf = 0;
  let gFrom = new THREE.Euler();

  const idleFrame = (t: number) => {
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(meshes, false)[0];
    group.rotation.y += (mouse.x * 0.75 - group.rotation.y) * 0.05;
    group.rotation.x += (mouse.y * 0.5 - group.rotation.x) * 0.05;
    for (const c of cards) {
      c.lift += ((hit && hit.object === c.mesh ? 1 : 0) - c.lift) * 0.1;
      c.mesh.scale.setScalar(c.idle * (1 + c.lift * 0.08));
      c.mesh.position.set(
        c.scatter.x + Math.cos(t * 0.4 + c.ph) * 0.3,
        c.scatter.y + Math.sin(t * 0.7 + c.ph) * 0.4,
        c.scatter.z + Math.sin(t * 0.5 + c.ph) * 0.8 + c.lift * 2,
      );
      c.mesh.rotation.set(
        c.srot.x + Math.sin(t * 0.5 + c.ph) * 0.3,
        c.srot.y + Math.sin(t * 0.35 + c.ph) * 0.6 + c.lift * c.dir * 0.8,
        c.srot.z + Math.cos(t * 0.3 + c.ph) * 0.12,
      );
    }
  };

  const assembleFrame = (now: number) => {
    if (!start) {
      start = now;
      retarget();
      for (const c of cards) {
        c.from = c.mesh.position.clone();
        c.fromRot = c.mesh.rotation.clone();
        c.fromS = c.mesh.scale.x;
      }
      gFrom = group.rotation.clone();
    }
    let allDone = true;
    cards.forEach((c, i) => {
      const from = c.from!;
      const fromRot = c.fromRot!;
      const fromS = c.fromS!;
      const p = Math.min(Math.max((now - start - i * INTRO.staggerMs) / INTRO.durationMs, 0), 1);
      if (p < 1) allDone = false;
      const e = easeInOutCubic(p);
      const k = 1 - e;
      const s = easeOutQuart(p);
      // 위치: 포물선으로 z를 띄우며 목표로
      c.mesh.position.lerpVectors(from, c.target, e);
      c.mesh.position.z += Math.sin(Math.min(p / 0.85, 1) * Math.PI) * INTRO.arcZ;
      // 회전: Y축 반 바퀴 돌며 0으로
      c.mesh.rotation.set(fromRot.x * k, fromRot.y * k + c.dir * Math.PI * k, fromRot.z * k);
      // 스케일: 실제 크기로, 후반에 두께 3%로 납작하게
      const flat = smoothstep(0.55, 1, p);
      c.mesh.scale.set(
        fromS + (c.tsx - fromS) * s,
        fromS + (c.tsy - fromS) * s,
        (fromS + (1 - fromS) * s) * (1 - flat * 0.97),
      );
      // 재질: 반사·광택 제거하고 emissive 원색 → 착지 시 2D 카드와 동일
      const m = smoothstep(0.62, 1, p);
      c.face.color.copy(c.base).lerp(black, m);
      c.face.emissiveIntensity = m;
      c.face.clearcoat = 1 - m;
      c.face.envMapIntensity = 0.9 * (1 - m);
      c.side.color.copy(c.sideC).lerp(black, m);
      c.side.emissiveIntensity = m;
      c.side.envMapIntensity = 0.9 * (1 - m);
    });
    const ge = easeInOutCubic(Math.min((now - start) / INTRO.durationMs, 1));
    group.rotation.set(gFrom.x * (1 - ge), gFrom.y * (1 - ge), 0);
    wallMat.opacity = INTRO.wallShadowOpacity * (1 - smoothstep(0.4, 0.9, ge));
    if (allDone && !done) {
      done = true;
      options.onAssembled();
    }
  };

  const loop = (now: number) => {
    if (assembling) assembleFrame(now);
    else idleFrame((now - t0) / 1000);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return {
    assemble: () => {
      assembling = true;
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      for (const c of cards) {
        c.mesh.geometry.dispose();
        c.face.dispose();
        c.side.dispose();
      }
      wall.geometry.dispose();
      wallMat.dispose();
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

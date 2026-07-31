import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02050b);
scene.fog = new THREE.FogExp2(0x02050b, 0.075);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

const root = new THREE.Group();
root.position.x = innerWidth > 800 ? 0.75 : 0;
scene.add(root);

const themes = {
  cyan: { color: new THREE.Color('#54e6ff'), css: '#62e9ff', rgb: '98, 233, 255' },
  violet: { color: new THREE.Color('#ae72ff'), css: '#b98aff', rgb: '185, 138, 255' },
  amber: { color: new THREE.Color('#ff9b42'), css: '#ffb261', rgb: '255, 178, 97' }
};
let activeTheme = themes.cyan;

// Lights
scene.add(new THREE.AmbientLight(0x17314b, 1.6));
const key = new THREE.PointLight(0x72eeff, 45, 20);
key.position.set(3, 4, 5);
scene.add(key);
const rim = new THREE.PointLight(0x7440ff, 32, 18);
rim.position.set(-4, -2, 3);
scene.add(rim);

// Star / dust field
const particleCount = 900;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const r = 5 + Math.random() * 14;
  const a = Math.random() * Math.PI * 2;
  const b = Math.acos(2 * Math.random() - 1);
  particlePositions[i * 3] = r * Math.sin(b) * Math.cos(a);
  particlePositions[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
  particlePositions[i * 3 + 2] = r * Math.cos(b);
}
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const dustMat = new THREE.PointsMaterial({
  color: 0x87dfff, size: 0.018, transparent: true, opacity: 0.4,
  depthWrite: false, blending: THREE.AdditiveBlending
});
const dust = new THREE.Points(dustGeo, dustMat);
scene.add(dust);

// Core layers
const coreGeometry = new THREE.IcosahedronGeometry(1.28, 7);
const originalPositions = coreGeometry.attributes.position.array.slice();

const coreMaterial = new THREE.MeshPhysicalMaterial({
  color: activeTheme.color,
  emissive: activeTheme.color,
  emissiveIntensity: 1.35,
  roughness: 0.22,
  metalness: 0.15,
  transmission: 0.25,
  thickness: 1.4,
  transparent: true,
  opacity: 0.92,
  clearcoat: 1,
  clearcoatRoughness: 0.1
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
root.add(core);

const shellGeo = new THREE.IcosahedronGeometry(1.52, 5);
const shellMat = new THREE.MeshPhysicalMaterial({
  color: activeTheme.color,
  emissive: activeTheme.color,
  emissiveIntensity: 0.12,
  roughness: 0.05,
  metalness: 0.08,
  transmission: 0.94,
  thickness: 0.45,
  transparent: true,
  opacity: 0.28,
  clearcoat: 1,
  side: THREE.DoubleSide,
  depthWrite: false
});
const shell = new THREE.Mesh(shellGeo, shellMat);
root.add(shell);

const wireGeo = new THREE.IcosahedronGeometry(1.57, 2);
const wireMat = new THREE.MeshBasicMaterial({
  color: activeTheme.color, wireframe: true, transparent: true, opacity: 0.14,
  blending: THREE.AdditiveBlending, depthWrite: false
});
const wire = new THREE.Mesh(wireGeo, wireMat);
root.add(wire);

// Orbit rings
const rings = new THREE.Group();
for (const [radius, tilt, opacity] of [[2.0, .32, .32], [2.25, -0.6, .18], [1.82, 1.05, .23]]) {
  const geo = new THREE.TorusGeometry(radius, 0.008, 8, 180);
  const mat = new THREE.MeshBasicMaterial({
    color: activeTheme.color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2 + tilt;
  ring.rotation.y = tilt * .7;
  rings.add(ring);
}
root.add(rings);

// Outer halo sprites
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 4, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(.12, 'rgba(255,255,255,.6)');
  g.addColorStop(.42, 'rgba(255,255,255,.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
  return new THREE.CanvasTexture(c);
}
const glowMat = new THREE.SpriteMaterial({
  map: glowTexture(), color: activeTheme.color, transparent: true,
  opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false
});
const glow = new THREE.Sprite(glowMat);
glow.scale.set(5.1, 5.1, 1);
root.add(glow);
glow.renderOrder = -1;

// Ground ring
const ground = new THREE.Mesh(
  new THREE.RingGeometry(1.4, 3.4, 128),
  new THREE.MeshBasicMaterial({
    color: activeTheme.color, transparent: true, opacity: .07,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2.05;
scene.add(ground);

// Interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let isPressing = false;
let pressure = 0;
let targetPressure = 0;
let releases = 0;
let pointerWorld = new THREE.Vector3(0, 0, 1);
let soundEnabled = true;
let audioContext, oscillator, gain;

function startSound() {
  if (!soundEnabled) return;
  audioContext ??= new AudioContext();
  oscillator = audioContext.createOscillator();
  gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 70;
  gain.gain.value = 0.0001;
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
}
function updateSound(p) {
  if (!gain || !oscillator) return;
  gain.gain.setTargetAtTime(0.015 + p * .055, audioContext.currentTime, .03);
  oscillator.frequency.setTargetAtTime(70 + p * 95, audioContext.currentTime, .03);
}
function stopSound() {
  if (!gain || !oscillator) return;
  gain.gain.setTargetAtTime(.0001, audioContext.currentTime, .08);
  oscillator.stop(audioContext.currentTime + .2);
  oscillator = gain = null;
}

function updatePointer(event) {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(shell);
  if (hits.length) {
    pointerWorld.copy(hits[0].point);
    return true;
  }
  return false;
}
canvas.addEventListener('pointerdown', e => {
  if (!updatePointer(e)) return;
  isPressing = true;
  targetPressure = .42;
  canvas.setPointerCapture(e.pointerId);
  startSound();
});
canvas.addEventListener('pointermove', e => {
  updatePointer(e);
  if (isPressing) {
    const movement = Math.hypot(e.movementX || 0, e.movementY || 0);
    targetPressure = Math.min(1, targetPressure + movement * .007 + .006);
  }
});
function release() {
  if (!isPressing) return;
  isPressing = false;
  if (pressure > .18) {
    releases++;
    document.querySelector('#releaseValue').textContent = String(releases).padStart(3, '0');
    const flash = document.querySelector('#flash');
    flash.animate([{opacity: pressure * .65}, {opacity: 0}], {duration: 540, easing: 'ease-out'});
    if (navigator.vibrate) navigator.vibrate(Math.round(20 + pressure * 35));
  }
  targetPressure = 0;
  stopSound();
}
canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);

// UI
document.querySelector('#soundToggle').addEventListener('click', e => {
  soundEnabled = !soundEnabled;
  e.currentTarget.textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
});
document.querySelectorAll('.mode').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    activeTheme = themes[button.dataset.theme];
    document.documentElement.style.setProperty('--accent', activeTheme.css);
    document.documentElement.style.setProperty('--accent-rgb', activeTheme.rgb);
    [coreMaterial, shellMat].forEach(m => {
      m.color.copy(activeTheme.color);
      m.emissive.copy(activeTheme.color);
    });
    wireMat.color.copy(activeTheme.color);
    glowMat.color.copy(activeTheme.color);
    ground.material.color.copy(activeTheme.color);
    rings.children.forEach(r => r.material.color.copy(activeTheme.color));
    key.color.copy(activeTheme.color);
  });
});

const clock = new THREE.Clock();
let frames = 0, fpsTimer = 0;
function animate() {
  const t = clock.getElapsedTime();
  const dt = Math.min(clock.getDelta(), .05);
  pressure += (targetPressure - pressure) * (isPressing ? .12 : .075);
  if (isPressing) targetPressure = Math.min(1, targetPressure + .0035);
  updateSound(pressure);

  const pos = coreGeometry.attributes.position;
  const localTouch = core.worldToLocal(pointerWorld.clone()).normalize();
  for (let i = 0; i < pos.count; i++) {
    const ix = i * 3;
    const ox = originalPositions[ix], oy = originalPositions[ix + 1], oz = originalPositions[ix + 2];
    const len = Math.hypot(ox, oy, oz);
    const nx = ox / len, ny = oy / len, nz = oz / len;
    const dot = nx * localTouch.x + ny * localTouch.y + nz * localTouch.z;
    const dent = pressure * Math.pow(Math.max(0, dot), 5) * .48;
    const ripple = Math.sin(t * 4.2 + nx * 7 + ny * 5 + nz * 6) * (.018 + pressure * .026);
    const scale = 1 + ripple - dent;
    pos.setXYZ(i, ox * scale, oy * scale, oz * scale);
  }
  pos.needsUpdate = true;
  coreGeometry.computeVertexNormals();

  const pulse = 1 + Math.sin(t * 2.1) * .018;
  shell.scale.setScalar(pulse - pressure * .055);
  wire.scale.setScalar(1 + pressure * .08);
  coreMaterial.emissiveIntensity = 1.25 + pressure * 3.6 + Math.sin(t * 3) * .12;
  shellMat.emissiveIntensity = .12 + pressure * .8;
  glowMat.opacity = .36 + pressure * .58 + Math.sin(t * 2) * .05;
  glow.scale.setScalar(5.0 + pressure * 1.4);
  wireMat.opacity = .11 + pressure * .34;

  core.rotation.y = t * .11;
  core.rotation.x = Math.sin(t * .25) * .13;
  shell.rotation.y = -t * .07;
  shell.rotation.z = t * .025;
  wire.rotation.x = t * .05;
  wire.rotation.y = t * .08;
  rings.rotation.y = t * .12;
  rings.rotation.z = t * .035;
  rings.children[1].rotation.z = t * -.15;
  dust.rotation.y = t * .006;
  ground.material.opacity = .045 + pressure * .09;
  ground.scale.setScalar(1 + pressure * .12);

  root.position.y = Math.sin(t * .75) * .11;
  root.rotation.z = Math.sin(t * .21) * .025;

  const pct = Math.round(pressure * 100);
  document.querySelector('#pressureValue').textContent = String(pct).padStart(2, '0') + '%';
  document.querySelector('#pressureBar').style.width = pct + '%';
  document.querySelector('#stateValue').textContent =
    pct > 92 ? 'OVERCHARGE' : pct > 65 ? 'COMPRESSED' : pct > 10 ? 'RESPONDING' : 'STABLE';

  frames++;
  fpsTimer += dt;
  if (fpsTimer > .5) {
    document.querySelector('#fps').textContent = `${Math.round(frames / fpsTimer)} FPS`;
    frames = 0; fpsTimer = 0;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  root.position.x = innerWidth > 800 ? .75 : 0;
});

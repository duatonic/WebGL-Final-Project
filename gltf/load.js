import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import gsap from "https://cdn.skypack.dev/gsap";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xADD8E6);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Grid Visualization
const axesHelper = new THREE.AxesHelper(5); // The number 5 is the length of the axes.
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(100, 10); // 100 is the size, 20 is the number of divisions.
scene.add(gridHelper);
gridHelper.visible = false; // Hide the grid by default
axesHelper.visible = false; // Hide the axes by default
// End of Grid Visualization

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(-5, 1.5, 2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI/2

const targetPoint = new THREE.Vector3(0, 0.4, 0);
controls.target.copy(targetPoint);
controls.update();

const dawnColor = new THREE.Color(0xffcc99); // Warm dawn/sunset color
const dayColor = new THREE.Color(0x87ceeb); // Bright blue daytime color
const nightColor = new THREE.Color(0x000033); // Deep blue/black night sky

// Sunlight
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(-100, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);

// Moonlight
const moonLight = new THREE.DirectionalLight(0x8888ff, 0.1);
moonLight.position.set(100, 0, 0);
sunLight.castShadow = true;
scene.add(moonLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Add ambient light with initial intensity
scene.add(ambientLight);

const groundTexture = new THREE.TextureLoader().load('./textures/ground-plane.png', function(texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0, 0)
  plane.receiveShadow = true;
  scene.add(plane);
}, undefined, function(err) {
  console.error('An error happened while loading the texture.', err);
});

// Load the GLTF model
const loader = new GLTFLoader().setPath('models/');
loader.load('Environment2.gltf', (gltf) => {
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  document.getElementById('progress').innerHTML = `LOADING ${Math.max(xhr.loaded / xhr.total, 1) * 100}/100`;
}, (error) => {
  console.error('An error happened', error);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// // Create white orbs
// const orbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const orbGeometry = new THREE.SphereGeometry(0.05, 16, 16);
// const orbs = [];

// const orbPositions = [
//   new THREE.Vector3(2, 1, -3),
//   new THREE.Vector3(-3, 0.5, 1),
//   new THREE.Vector3(1, 1.5, 4),
//   new THREE.Vector3(-2, 0.5, -3)
// ];

// orbPositions.forEach(pos => {
//   const orb = new THREE.Mesh(orbGeometry, orbMaterial);
//   orb.position.copy(pos);
//   scene.add(orb);
//   orbs.push(orb);
// });

// // Raycasting for click detection
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// function onClick(event) {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(orbs);
//   if (intersects.length > 0) {
//     const targetOrb = intersects[0].object;
//     animateCamera(targetOrb.position);
//   }
// }

// function animateCamera(targetPosition) {
//   gsap.to(camera.position, {
//     x: targetPosition.x,
//     y: targetPosition.y + 0.5, // Adjust for height offset
//     z: targetPosition.z + 2, // Adjust for distance
//     duration: 1.5,
//     ease: "power3.inOut",
//     onUpdate: () => controls.update(),
//   });

//   gsap.to(controls.target, {
//     x: 0,
//     y: 0.4,
//     z: 0,
//     duration: 1.5,
//     ease: "power2.inOut",
//     onUpdate: () => controls.update(), // Recalculate controls
//   });
// }

// window.addEventListener('click', onClick);

function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

  const starVertices = [];
  for (let i = 0; i < 1000; i++) {
    starVertices.push(
      THREE.MathUtils.randFloatSpread(600, 1000), // X
      THREE.MathUtils.randFloatSpread(600, 1000), // Y
      THREE.MathUtils.randFloatSpread(600, 1000)  // Z
    );
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
createStars();

scene.fog = new THREE.Fog(new THREE.Color(dawnColor), 50, 300); // Update fog color in the loop

// Update the background color based on the sun's position
function updateBackgroundColor() {
  const sunHeight = sunLight.position.y;

  if (sunHeight > 0) {
    // Daytime (lerp from dawn to day as sun rises)
    const t = Math.min(sunHeight / 10, 1); // Normalize sun height between 0 and 1
    const bgColor = dawnColor.clone().lerp(dayColor, t);
    scene.background = bgColor;
    scene.fog.color.copy(bgColor);
  } else {
    // Nighttime (lerp from sunset to night as sun sets)
    const t = Math.min(Math.abs(sunHeight) / 10, 1); // Normalize negative sun height
    const bgColor = dawnColor.clone().lerp(nightColor, t);
    scene.background = bgColor;
    scene.fog.color.copy(bgColor);
  }
}
updateBackgroundColor();

// Add a lens flare to the sun
const lensFlareTexture = new THREE.TextureLoader().load('./textures/lens-flare.png');
const lensFlare = new Lensflare();
lensFlare.addElement(new LensflareElement(lensFlareTexture, 256, 0));
sunLight.add(lensFlare);

// day/night cycle
let clock = new THREE.Clock();
let elapsedTime = 0;
let timeSpeed = 0.1;
let paused = true;

function speedUp() {
  timeSpeed *= 1.5;
}

function slowDown() {
  timeSpeed = Math.max(0.1, timeSpeed / 2);
}

function toggleSunMovement() {
  var sunResumeButton = document.getElementById('resume-sun');
  var sunPauseButton = document.getElementById('pause-sun');

  if (sunResumeButton.hidden === true && sunPauseButton.hidden === false) {
    sunResumeButton.hidden = false;
    sunPauseButton.hidden = true;
    paused = !paused;
  }
  else {
    sunResumeButton.hidden = true;
    sunPauseButton.hidden = false;
    paused = !paused;
    clock.getDelta();
    clock.start();
  }
}

function resetSun() {
  elapsedTime = 0;
  timeSpeed = 0.1;
  sunLight.position.set(-100, 0, 0);
  moonLight.position.set(100, 0, 0);
  updateBackgroundColor();
}

function toggleGrid() {
  var gridShowButton = document.getElementById('show-grid');
  var gridHideButton = document.getElementById('hide-grid');

  if (gridShowButton.hidden === true && gridHideButton.hidden === false) {
    gridShowButton.hidden = false;
    gridHideButton.hidden = true;
    gridHelper.visible = !gridHelper.visible;
    axesHelper.visible = !axesHelper.visible;
  }
  else {
    gridShowButton.hidden = true;
    gridHideButton.hidden = false;
    gridHelper.visible = !gridHelper.visible;
    axesHelper.visible = !axesHelper.visible;
  }
};

var sidebarOpen = false;

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('toggle-sidebar');
  sidebar.classList.toggle('open');
  toggleButton.classList.toggle('open');

  sidebarOpen = !sidebarOpen;
  
  if (sidebarOpen === false) {
    sidebar.style.right = '-300px';
    toggleButton.innerHTML = '&#9664;'; // Left arrow
  } else {
    sidebar.style.right = '0px';
    toggleButton.innerHTML = '&#9658;'; // Right arrow
  }
}

window.speedUp = speedUp;
window.slowDown = slowDown;
window.resetSun = resetSun;
window.toggleGrid = toggleGrid;
window.toggleSunMovement = toggleSunMovement;
window.toggleSidebar = toggleSidebar;

function animate() {
  requestAnimationFrame(animate);

  if (!paused) {
    elapsedTime += clock.getDelta() * timeSpeed;
    let angle = elapsedTime * 0.1;

    sunLight.position.set(-100 * Math.cos(angle), 100 * Math.sin(angle), 100 * Math.sin(angle));
    moonLight.position.set(100 * Math.cos(angle), -100 * Math.sin(angle), -100 * Math.sin(angle));

    sunLight.intensity = Math.max(0.1, sunLight.position.y / 100);
    moonLight.intensity = Math.max(0.1, moonLight.position.y / 100);

    ambientLight.intensity = Math.max(0.2, sunLight.intensity);

    updateBackgroundColor();
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
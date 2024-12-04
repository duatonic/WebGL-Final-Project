import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xADD8E6);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(5, 4, 20);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;

// Add lighting to the scene
const ambientLightDay = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLightDay = new THREE.DirectionalLight(0xffffff, 1);
directionalLightDay.position.set(5, 10, 7.5);
directionalLightDay.castShadow = true;

const ambientLightNight = new THREE.AmbientLight(0x404040, 0.2);
const directionalLightNight = new THREE.DirectionalLight(0x404040, 0.5);
directionalLightNight.position.set(5, 10, 7.5);
directionalLightNight.castShadow = true;

let isDay = true;

function setDayMode() {
  scene.add(ambientLightDay);
  scene.add(directionalLightDay);
  scene.remove(ambientLightNight);
  scene.remove(directionalLightNight);
  renderer.setClearColor(0xADD8E6); // Light blue background for day mode
}

function setNightMode() {
  scene.add(ambientLightNight);
  scene.add(directionalLightNight);
  scene.remove(ambientLightDay);
  scene.remove(directionalLightDay);
  renderer.setClearColor(0x00008B); // Dark blue background for night mode
}

// Function to toggle between day and night modes
function toggleDayNightMode() {
  if (isDay) {
    setNightMode();
  } else {
    setDayMode();
  }
  isDay = !isDay;
}

// Initial lighting mode
setDayMode();

// Function to show the overlay
function showOverlay() {
  document.getElementById('overlay').style.display = 'flex';
}

// Load the GLTF model
const loader = new GLTFLoader().setPath('models/');
loader.load('scene1.gltf', (gltf) => {
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';
  showOverlay(); // Show the overlay after the load is completed
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

// Add an event listener to toggle day/night mode on button click
document.getElementById('toggle-lighting').addEventListener('click', () => {
  toggleDayNightMode();
});

// Add an event listener to toggle day/night mode on key press (e.g., 'D' key)
window.addEventListener('keydown', (event) => {
  if (event.key === 'd' || event.key === 'D') {
    toggleDayNightMode();
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
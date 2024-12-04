import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";
// setup góc nhìn, máy
const camera = new THREE.PerspectiveCamera(
  20, // Góc nhìn (FOV - Field of View)
  window.innerWidth / window.innerHeight, // Tỷ lệ khung hình (aspect ratio)
  0.1, // Khoảng cách gần nhất mà camera có thể hiển thị (near plane)
  1000 // Khoảng cách xa nhất mà camera có thể hiển thị (far plane)
);
// dịch chuyển camera ra xa trục Z 1 khoảng
camera.position.z = 13;

// khung cảnh 3d chứa hình ảnh
const scene = new THREE.Scene();
let bee;
let mixer;
const loader = new GLTFLoader();
loader.load(
  "./bee_adventure_time.glb", // Đường dẫn đến tệp GLB/GLTF
  function (gltf) {
    // Hàm được gọi khi tải thành công
    bee = gltf.scene; // Truy cập vào cảnh của mô hình

    scene.add(bee); // Thêm mô hình vào cảnh
    mixer = new THREE.AnimationMixer(bee); // Tạo một mixer để tổng hợp animation
    mixer.clipAction(gltf.animations[0]).play(); // Khơi đầu animation đầu tiên
    console.log(gltf.animations);
  },
  function (xhr) {}, // Hàm được gọi trong quá trình tải (không bắt buộc)
  function (error) {} // Hàm được gọi khi tải thất bại
);

// hiển thị các cảnh 3d trên trình duyệt website
const renderer = new THREE.WebGLRenderer({
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);
// ánh sáng cho mô hình 3d
const light = new THREE.AmbientLight(0xffffff, 1.4); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);
const reRender3d = () => {
  requestAnimationFrame(reRender3d);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(0.02);
  }
};
reRender3d();
let arrPositionModel = [
  {
    id: "banner",
    position: { x: -3, y: -2, z: 0 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 1, y: -1, z: -5 },
    rotation: { x: 0.5, y: -0.5, z: 0 },
  },
  {
    id: "description",
    position: { x: -3, y: -1, z: -5 },
    rotation: { x: 0, y: 0.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: 1, y: -1, z: 0 },
    rotation: { x: 0.3, y: -0.5, z: 0 },
  },
];
const modelMove = () => {
  const sections = document.querySelectorAll(".section");
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );
  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(bee.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });
    gsap.to(bee.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: "power1.out",
    });
  }
};
window.addEventListener("scroll", () => {
  if (bee) {
    modelMove();
  }
});
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

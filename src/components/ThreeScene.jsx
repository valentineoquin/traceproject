import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * ThreeScene - Affiche le modèle 3D testtee.glb
 */
export default function ThreeScene() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;

    // === SETUP SCENE ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // === CONTROLS ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;       // Rotation automatique de la caméra
    controls.autoRotateSpeed = 2.0;   // Vitesse de rotation
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 1;
    controls.maxDistance = 100;

    // === LIGHTS ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // === LOAD GLB MODEL ===
    const loader = new GLTFLoader();

    loader.load(
      '/testtee.glb',
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Centre le modèle dans la scène
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Ajuste la caméra selon la taille du modèle
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.set(center.x, center.y + maxDim * 0.5, center.z + maxDim * 2);
        controls.target.copy(center);
        controls.update();

        console.log('✅ Modèle GLB chargé avec succès');
      },
      (progress) => {
        if (progress.total > 0) {
          console.log(`Chargement: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
        }
      },
      (error) => {
        console.error('❌ Erreur chargement GLB:', error);
      }
    );

    // === ANIMATION LOOP ===
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Nécessaire pour autoRotate et damping
      renderer.render(scene, camera);
    };
    animate();

    // === RESIZE HANDLER ===
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Store reference for cleanup
    sceneRef.current = { renderer, controls, handleResize };

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    />
  );
}

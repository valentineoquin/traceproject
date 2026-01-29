import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// liste des sapes avec leurs pos
const PEOPLE = [
  { id: 1, name: 'le t-shirt', x: 2, z: 0 },
  { id: 2, name: 'le pantalon', x: -1.5, z: -4 },
  { id: 3, name: 'la chemise', x: 1, z: -8 },
  { id: 4, name: 'la veste', x: -2, z: -12 },
  { id: 5, name: 'le pull', x: 0.5, z: -16 },
  { id: 6, name: 'le jean', x: -1, z: -20 },
  { id: 7, name: 'la jupe', x: 2.5, z: -24 },
  { id: 8, name: 'les baskets', x: -0.5, z: -28 },
  { id: 9, name: 'le manteau', x: 1.5, z: -32 },
  { id: 10, name: "l'écharpe", x: -1.8, z: -36 },
];

export default function ThreeScene() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;

    // === setup de la scene ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // === cam ===
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    // pos de départ
    const firstPerson = PEOPLE[0];
    camera.position.set(firstPerson.x, 1.5, firstPerson.z + 4);
    
    // === renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // === lumieres ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // === créa des cylindres avec ombres ===
    const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const shadowGeometry = new THREE.CircleGeometry(0.5, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: true,
      opacity: 0.15
    });
    
    const cylinders = [];
    
    PEOPLE.forEach((person, index) => {
      const hue = (index / PEOPLE.length) * 0.3 + 0.5;
      const material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color().setHSL(hue, 0.6, 0.5),
        roughness: 0.4,
        metalness: 0.1
      });
      
      // le cylindre
      const cylinder = new THREE.Mesh(cylinderGeometry, material);
      cylinder.position.set(person.x, 1, person.z);
      cylinder.userData = { personIndex: index };
      cylinders.push(cylinder);
      scene.add(cylinder);
      
      // l'ombre au sol
      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(person.x, 0.01, person.z);
      scene.add(shadow);
    });

    // === raycaster pour le hover ===
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePos({ x: e.clientX, y: e.clientY });
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cylinders);
      
      if (intersects.length > 0) {
        const personIndex = intersects[0].object.userData.personIndex;
        // on affiche l'infobulle que si c la pers active
        if (personIndex === currentIndexRef.current) {
          setHoveredPerson(PEOPLE[personIndex]);
          containerRef.current.style.cursor = 'pointer';
        } else {
          setHoveredPerson(null);
          containerRef.current.style.cursor = 'default';
        }
      } else {
        setHoveredPerson(null);
        containerRef.current.style.cursor = 'default';
      }
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // === anim cam ===
    let targetPosition = new THREE.Vector3(firstPerson.x, 1.5, firstPerson.z + 4);
    let targetLookAt = new THREE.Vector3(firstPerson.x, 1, firstPerson.z);
    let currentLookAt = new THREE.Vector3(firstPerson.x, 1, firstPerson.z);

    const animateToIndex = (index) => {
      const person = PEOPLE[index];
      targetPosition.set(person.x, 1.5, person.z + 4);
      targetLookAt.set(person.x, 1, person.z);
      isAnimatingRef.current = true;
      // on cache l'infobulle pdt le move
      setHoveredPerson(null);
    };

    // === gestion du scroll ===
    const scrollCooldown = 600;

    const handleWheel = (e) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollCooldown) return;
      if (isAnimatingRef.current) return;
      
      lastScrollTimeRef.current = now;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(PEOPLE.length - 1, currentIndexRef.current + direction));
      
      if (newIndex !== currentIndexRef.current) {
        currentIndexRef.current = newIndex;
        animateToIndex(newIndex);
      }
    };

    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });

    // === boucle anim ===
    const animate = () => {
      requestAnimationFrame(animate);

      camera.position.lerp(targetPosition, 0.05);
      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      if (isAnimatingRef.current && camera.position.distanceTo(targetPosition) < 0.1) {
        isAnimatingRef.current = false;
      }

      renderer.render(scene, camera);
    };
    animate();

    // === resize ===
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // sauvegarde refs
    sceneRef.current = { renderer, handleResize, handleWheel, handleMouseMove };

    // netoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('wheel', handleWheel);
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      renderer.dispose();
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
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* infobulle sur la souris */}
      {hoveredPerson && (
        <div
          style={{
            position: 'fixed',
            left: mousePos.x + 15,
            top: mousePos.y + 15,
            backgroundColor: '#F56E00', // orange
            color: '#0A1AB5', // bleu
            padding: '12px 20px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '600',
            fontSize: '16px',
            // pas de caps lock ici
            letterSpacing: '0.5px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            zIndex: 1000,
            whiteSpace: 'nowrap',
          }}
        >
          <span>{hoveredPerson.name}</span>
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#0A1AB5"
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
      )}
    </div>
  );
}

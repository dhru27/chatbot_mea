
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';

const MechanicalModel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    
    // Set background color based on theme
    const backgroundColor = resolvedTheme === 'dark' ? 0x222222 : 0xf4f4f4;
    scene.background = new THREE.Color(backgroundColor);
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create materials based on theme
    const gearColor = resolvedTheme === 'dark' ? 0xF5B200 : 0x143B63; // Gold or dark blue
    const material = new THREE.MeshStandardMaterial({
      color: gearColor,
      metalness: 0.7,
      roughness: 0.3,
    });
    
    // Create main gear
    const mainGearGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
    const mainGear = new THREE.Mesh(mainGearGeometry, material);
    scene.add(mainGear);
    
    // Create gear teeth
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const toothGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const tooth = new THREE.Mesh(toothGeometry, material);
      tooth.position.x = Math.cos(angle) * 1.7;
      tooth.position.y = Math.sin(angle) * 1.7;
      scene.add(tooth);
    }
    
    // Create secondary gears
    const smallGearGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const smallGear1 = new THREE.Mesh(smallGearGeometry, material);
    smallGear1.position.set(2.5, 1.5, 0);
    scene.add(smallGear1);
    
    const smallGear2 = new THREE.Mesh(smallGearGeometry, material);
    smallGear2.position.set(-2.5, -1.5, 0);
    scene.add(smallGear2);
    
    // Create connectors/rods
    const rodGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const rod1 = new THREE.Mesh(rodGeometry, material);
    rod1.position.set(1.5, 0.8, 0);
    rod1.rotation.z = Math.PI / 4;
    scene.add(rod1);
    
    const rod2 = new THREE.Mesh(rodGeometry, material);
    rod2.position.set(-1.5, -0.8, 0);
    rod2.rotation.z = Math.PI / 4;
    scene.add(rod2);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate gears at different speeds
      mainGear.rotation.z -= 0.005;
      smallGear1.rotation.z += 0.01;
      smallGear2.rotation.z += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      mainGearGeometry.dispose();
      smallGearGeometry.dispose();
      rodGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [resolvedTheme]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden"
    />
  );
};

export default MechanicalModel;

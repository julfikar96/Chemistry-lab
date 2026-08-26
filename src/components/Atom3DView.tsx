import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ElementData } from '../types';

interface Atom3DViewProps {
  element: ElementData;
}

export const Atom3DView: React.FC<Atom3DViewProps> = ({ element }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shellsRef = useRef<{ group: THREE.Group; speed: number }[]>([]);
  const animationFrameId = useRef<number>(0);

  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const mainGroup = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = 240; // Fixed height

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Adjust camera distance based on number of shells
    const maxRadius = 2.5 + (element.shellConfig.length - 1) * 1.5;
    camera.position.z = Math.max(12, maxRadius * 2.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Tone mapping for cool glows
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 3, 50);
    pointLight.position.set(0, 0, 0); // Nucleus light
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    scene.add(mainGroup.current);
    mainGroup.current.rotation.set(0, 0, 0); // Reset on element change
    
    // Clear previous children just in case
    while (mainGroup.current.children.length > 0) {
        mainGroup.current.remove(mainGroup.current.children[0]);
    }
    shellsRef.current = [];

    // 1. Nucleus
    const nucleusGroup = new THREE.Group();
    const protonGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const neutronGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const protonMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xef4444, roughness: 0.2, clearcoat: 0.5 
    });
    const neutronMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x3b82f6, roughness: 0.2, clearcoat: 0.5 
    });

    // Cap particles for heavy elements to maintain performance and visual clarity
    const particleCount = Math.min(element.number * 2, 60); 
    const nucleusRadius = 0.5 + Math.pow(particleCount, 1/3) * 0.25;

    for (let i = 0; i < particleCount; i++) {
        const isProton = i % 2 === 0;
        const mesh = new THREE.Mesh(isProton ? protonGeo : neutronGeo, isProton ? protonMat : neutronMat);
        
        // Random distribution within a sphere
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * nucleusRadius;

        mesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        nucleusGroup.add(mesh);
    }
    mainGroup.current.add(nucleusGroup);

    // Core glow
    const glowGeo = new THREE.SphereGeometry(nucleusRadius * 1.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    nucleusGroup.add(glowMesh);

    // 2. Electron Shells
    const electronGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const electronMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x22d3ee,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        clearcoat: 1.0
    });
    const orbitMat = new THREE.LineBasicMaterial({ 
        color: 0x334155, 
        transparent: true, 
        opacity: 0.4 
    });

    element.shellConfig.forEach((electronCount, shellIndex) => {
        const radius = nucleusRadius + 2.0 + shellIndex * 1.5;

        const orbitCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
        const orbitPoints = orbitCurve.getPoints(64);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        
        const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMat);
        orbitLine.rotation.x = Math.PI / 2; // Lie flat initially

        const shellContainer = new THREE.Group();
        
        // Randomly tilt the shell for a 3D atomic model look
        shellContainer.rotation.x = (Math.random() - 0.5) * Math.PI;
        shellContainer.rotation.y = (Math.random() - 0.5) * Math.PI;

        const orbitGroup = new THREE.Group();
        orbitGroup.add(orbitLine);

        for (let e = 0; e < electronCount; e++) {
            const angle = (e / electronCount) * Math.PI * 2;
            const electron = new THREE.Mesh(electronGeo, electronMat);
            electron.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            orbitGroup.add(electron);
        }

        shellContainer.add(orbitGroup);
        mainGroup.current.add(shellContainer);
        
        // Speed inversely proportional to radius
        shellsRef.current.push({ group: orbitGroup, speed: 1.5 / Math.sqrt(radius) });
    });

    // Mouse Events
    const onMouseDown = (e: MouseEvent) => { 
        isDragging.current = true; 
        prevMousePos.current = { x: e.clientX, y: e.clientY }; 
    };
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
            const deltaX = e.clientX - prevMousePos.current.x;
            const deltaY = e.clientY - prevMousePos.current.y;
            mainGroup.current.rotation.y += deltaX * 0.005;
            mainGroup.current.rotation.x += deltaY * 0.005;
            prevMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    // Animation
    let lastTime = performance.now();
    const animate = (time: number) => {
        const delta = (time - lastTime) * 0.001;
        lastTime = time;

        nucleusGroup.rotation.y += 0.2 * delta;
        nucleusGroup.rotation.x += 0.1 * delta;

        shellsRef.current.forEach(({ group, speed }) => {
            // Rotate the orbit group around its local Y axis
            group.rotation.y -= speed * delta;
        });

        // Auto-rotate the whole atom slowly if not dragging
        if (!isDragging.current) {
            mainGroup.current.rotation.y += 0.1 * delta;
        }

        renderer.render(scene, camera);
        animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(animationFrameId.current);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
        
        // Cleanup geometries and materials
        mainGroup.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        renderer.dispose();
    };
  }, [element]);

  return (
    <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group">
      <div ref={mountRef} className="w-full h-60 cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-cyan-500/70 font-mono bg-slate-950/50 px-2 py-1 rounded-full backdrop-blur-sm border border-cyan-900/30">
        3D Interactive (Drag to rotate)
      </div>
    </div>
  );
};

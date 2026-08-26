import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Atom {
  elem: string;
  pos: [number, number, number];
}

interface Bond {
  from: number;
  to: number;
  type: 1 | 2 | 3; // single, double, triple
}

export interface MoleculeData {
  id: string;
  formula: string;
  name: string;
  banglaName: string;
  atoms: Atom[];
  bonds: Bond[];
}

interface Molecule3DViewProps {
  molecule: MoleculeData;
}

// Basic element colors CPK
const elementColors: Record<string, number> = {
  H: 0xffffff,
  C: 0x222222,
  N: 0x3b82f6,
  O: 0xef4444,
  P: 0xf97316,
  S: 0xeab308,
  Cl: 0x22c55e,
  Na: 0xa855f7,
  Ca: 0x8b5cf6,
  Fe: 0xd97706,
  Cu: 0xb45309,
  K: 0xd946ef,
};

const elementSizes: Record<string, number> = {
  H: 0.3,
  C: 0.6,
  N: 0.55,
  O: 0.5,
  P: 0.7,
  S: 0.7,
  Cl: 0.75,
  Na: 0.8,
  Ca: 0.9,
  Fe: 0.8,
  Cu: 0.8,
  K: 0.9,
};

export const Molecule3DView: React.FC<Molecule3DViewProps> = ({ molecule }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number>(0);
  const mainGroup = useRef<THREE.Group>(new THREE.Group());
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    scene.add(mainGroup.current);
    mainGroup.current.rotation.set(0, 0, 0); 
    
    while (mainGroup.current.children.length > 0) {
        mainGroup.current.remove(mainGroup.current.children[0]);
    }

    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.6 });

    molecule.atoms.forEach((atom, i) => {
        const mat = new THREE.MeshPhysicalMaterial({
            color: elementColors[atom.elem] || 0xcccccc,
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 0.5,
        });
        const mesh = new THREE.Mesh(sphereGeo, mat);
        const r = elementSizes[atom.elem] || 0.6;
        mesh.scale.set(r, r, r);
        mesh.position.set(atom.pos[0], atom.pos[1], atom.pos[2]);
        mainGroup.current.add(mesh);
    });

    molecule.bonds.forEach(bond => {
        const a1 = molecule.atoms[bond.from];
        const a2 = molecule.atoms[bond.to];
        if(!a1 || !a2) return;

        const p1 = new THREE.Vector3(...a1.pos);
        const p2 = new THREE.Vector3(...a2.pos);
        const distance = p1.distanceTo(p2);
        const center = p1.clone().lerp(p2, 0.5);

        const buildBond = (offset: number) => {
            const cylGeo = new THREE.CylinderGeometry(0.12, 0.12, distance, 16);
            const cyl = new THREE.Mesh(cylGeo, bondMat);
            
            // Orient cylinder
            cyl.position.copy(center);
            cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
            
            // Handle double/triple bonds offset
            if (offset !== 0) {
                // cross product to get perpendicular vector
                const dir = p2.clone().sub(p1).normalize();
                let up = new THREE.Vector3(0, 1, 0);
                if (Math.abs(dir.y) > 0.9) up = new THREE.Vector3(1, 0, 0);
                const right = new THREE.Vector3().crossVectors(dir, up).normalize();
                cyl.position.add(right.multiplyScalar(offset));
            }
            
            mainGroup.current.add(cyl);
        };

        if (bond.type === 1) {
            buildBond(0);
        } else if (bond.type === 2) {
            buildBond(0.25);
            buildBond(-0.25);
        } else if (bond.type === 3) {
            buildBond(0);
            buildBond(0.35);
            buildBond(-0.35);
        }
    });

    // Auto center and scale
    const box = new THREE.Box3().setFromObject(mainGroup.current);
    const boxCenter = box.getCenter(new THREE.Vector3());
    const boxSize = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
    
    mainGroup.current.position.sub(boxCenter); // Center it
    const scale = 4 / Math.max(0.1, maxDim);
    mainGroup.current.scale.set(scale, scale, scale);

    const onMouseDown = (e: MouseEvent) => { 
        isDragging.current = true; 
        prevMousePos.current = { x: e.clientX, y: e.clientY }; 
    };
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
            const deltaX = e.clientX - prevMousePos.current.x;
            const deltaY = e.clientY - prevMousePos.current.y;
            
            // Rotate around global axes
            const quaternionX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.01);
            const quaternionY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * 0.01);
            
            mainGroup.current.quaternion.premultiply(quaternionX);
            mainGroup.current.quaternion.premultiply(quaternionY);
            
            prevMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    let lastTime = performance.now();
    const animate = (time: number) => {
        const delta = (time - lastTime) * 0.001;
        lastTime = time;

        if (!isDragging.current) {
            const autoRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.3 * delta);
            mainGroup.current.quaternion.premultiply(autoRot);
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
  }, [molecule]);

  return (
    <div className="relative w-full h-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing min-h-[300px]" />
      <div className="absolute bottom-3 left-3 pointer-events-none">
        <h3 className="text-xl font-bold text-slate-100">{molecule.formula}</h3>
        <p className="text-xs text-slate-400">{molecule.banglaName} 3D Model</p>
      </div>
      <div className="absolute top-3 right-3 pointer-events-none text-[10px] text-emerald-500/70 font-mono bg-slate-950/50 px-2 py-1 rounded-full backdrop-blur-sm border border-emerald-900/30">
        Drag to rotate
      </div>
    </div>
  );
};

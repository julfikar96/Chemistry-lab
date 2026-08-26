import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GlasswareType, PrecipitateInfo, GasInfo } from '../types';

interface Lab3DThreeViewProps {
  experimentId?: string;
  glassware: GlasswareType;
  volume: number; // in mL (0 to 500)
  maxCapacity: number; // 500 mL
  liquidColorHex: string;
  isPouring: boolean;
  pourColorHex: string;
  isStirring: boolean;
  isHeating: boolean;
  isBubbling: boolean;
  gasInfo?: GasInfo | null;
  precipitateInfo?: PrecipitateInfo | null;
  temperature: number;
  ph: number;
  autoRotate: boolean;
  cameraPreset: 'isometric' | 'front' | 'top';
  onResetCamera?: () => void;
}

export const Lab3DThreeView: React.FC<Lab3DThreeViewProps> = ({
  experimentId,
  glassware,
  volume,
  maxCapacity,
  liquidColorHex,
  isPouring,
  pourColorHex,
  isStirring,
  isHeating,
  isBubbling,
  gasInfo,
  precipitateInfo,
  temperature,
  ph,
  autoRotate,
  cameraPreset,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const precipitateMeshRef = useRef<THREE.Mesh | null>(null);
  const pourStreamRef = useRef<THREE.Mesh | null>(null);
  const stirrerRef = useRef<THREE.Group | null>(null);
  const burnerFlameRef = useRef<THREE.Group | null>(null);
  const bubblesGroupRef = useRef<THREE.Group | null>(null);
  const glassGroupRef = useRef<THREE.Group | null>(null);

  // Mouse interaction state for orbital drag rotation
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationAnglesRef = useRef({ theta: 0.4, phi: 0.35, radius: 14 });

  // Animation state targets
  const targetLiquidHeightRef = useRef<number>(0.01);
  const currentLiquidHeightRef = useRef<number>(0.01);
  const targetLiquidColorRef = useRef<THREE.Color>(new THREE.Color());
  const currentLiquidColorRef = useRef<THREE.Color>(new THREE.Color());
  const isPouringRef = useRef(false);
  const pourScaleYRef = useRef(0);
  const targetPrecipitateScaleRef = useRef(0);
  const currentPrecipitateScaleRef = useRef(0);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer with high quality & alpha transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Tone mapping for realistic glass
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting setup (Laboratory aesthetic)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(8, 14, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueRimLight = new THREE.PointLight(0x38bdf8, 2.0, 30);
    blueRimLight.position.set(-8, 6, -8);
    scene.add(blueRimLight);

    const warmLight = new THREE.PointLight(0xf59e0b, 1.0, 20);
    warmLight.position.set(6, -2, 6);
    scene.add(warmLight);

    // 5. Grid Bench Surface
    const benchGeometry = new THREE.CylinderGeometry(7, 7, 0.4, 64);
    const benchMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
    });
    const bench = new THREE.Mesh(benchGeometry, benchMaterial);
    bench.position.y = -3.2;
    bench.receiveShadow = true;
    scene.add(bench);

    // Bench reflective circle ring
    const ringGeo = new THREE.RingGeometry(2.5, 6.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -2.99;
    scene.add(ring);

    // 6. Build Laboratory Glassware
    buildGlassware(scene, glassware);

    // 7. Stirrer Rod
    const stirrerGroup = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 6, 16);
    const rodMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      roughness: 0.0,
      transmission: 1.0,
      ior: 1.5,
    });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.rotation.z = -0.25;
    rod.position.set(0.5, 0.5, 0);
    stirrerGroup.add(rod);
    scene.add(stirrerGroup);
    stirrerRef.current = stirrerGroup;

    // 8. Bunsen Burner Flame (Beneath Bench)
    const flameGroup = new THREE.Group();
    const flameInnerGeo = new THREE.ConeGeometry(0.35, 1.2, 16);
    const flameInnerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const flameInner = new THREE.Mesh(flameInnerGeo, flameInnerMat);

    const flameOuterGeo = new THREE.ConeGeometry(0.6, 1.8, 16);
    const flameOuterMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const flameOuter = new THREE.Mesh(flameOuterGeo, flameOuterMat);

    flameGroup.add(flameInner);
    flameGroup.add(flameOuter);
    flameGroup.position.set(0, -3.0, 0);
    flameGroup.visible = false;
    scene.add(flameGroup);
    burnerFlameRef.current = flameGroup;

    // 9. Pouring Stream (Animated)
    const streamGeo = new THREE.CylinderGeometry(0.08, 0.06, 4.5, 16);
    const streamMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.33,
    });
    const pourStream = new THREE.Mesh(streamGeo, streamMat);
    pourStream.position.set(0.5, 2.5, 0);
    pourStream.rotation.z = -0.15;
    pourStream.visible = false;
    scene.add(pourStream);
    pourStreamRef.current = pourStream;

    // 10. Bubbles Group
    const bubblesGroup = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      roughness: 0.0,
      transmission: 0.9,
      ior: 1.1,
    });
    for (let i = 0; i < 30; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      bubble.position.set(
        (Math.random() - 0.5) * 2.2,
        -2.5 + Math.random() * 3,
        (Math.random() - 0.5) * 2.2
      );
      bubblesGroup.add(bubble);
    }
    bubblesGroup.visible = false;
    scene.add(bubblesGroup);
    bubblesGroupRef.current = bubblesGroup;

    // 11. Additional NCTB Lab Equipment (Background Static Props)
    const equipmentGroup = new THREE.Group();

    // Shared Materials for Props
    const staticGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      roughness: 0.05,
      transmission: 0.98,
      ior: 1.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.4 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.8 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    // --- A. Retort Stand & Filter Funnel (Left) ---
    const standGroup = new THREE.Group();
    standGroup.position.set(-4.5, -3.0, -2.5);

    // Stand Base
    const standBaseGeo = new THREE.BoxGeometry(1.8, 0.15, 1.2);
    const standBase = new THREE.Mesh(standBaseGeo, ironMat);
    standBase.position.y = 0.075;
    standGroup.add(standBase);

    // Stand Vertical Rod
    const standRodGeo = new THREE.CylinderGeometry(0.08, 0.08, 7, 16);
    const standRod = new THREE.Mesh(standRodGeo, steelMat);
    standRod.position.set(0, 3.5, -0.4);
    standGroup.add(standRod);

    // Clamp Ring
    const clampRingGeo = new THREE.TorusGeometry(0.9, 0.06, 16, 32);
    const clampRing = new THREE.Mesh(clampRingGeo, ironMat);
    clampRing.rotation.x = Math.PI / 2;
    clampRing.position.set(0, 3.5, 0.8);
    standGroup.add(clampRing);

    // Filter Funnel on Ring
    const filterFunnelGroup = new THREE.Group();
    filterFunnelGroup.position.set(0, 3.5, 0.8);
    
    const filterConeGeo = new THREE.ConeGeometry(0.8, 1.2, 32, 1, true);
    const filterCone = new THREE.Mesh(filterConeGeo, staticGlassMat);
    filterCone.rotation.x = Math.PI;
    filterCone.position.y = 0.6;
    filterFunnelGroup.add(filterCone);

    const filterStemGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16, 1, true);
    const filterStem = new THREE.Mesh(filterStemGeo, staticGlassMat);
    filterStem.position.y = -0.75;
    filterFunnelGroup.add(filterStem);
    standGroup.add(filterFunnelGroup);

    // Receiving Beaker
    const smallBeakerGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const smallBeaker = new THREE.Mesh(smallBeakerGeo, staticGlassMat);
    smallBeaker.position.set(0, 0.75, 0.8);
    standGroup.add(smallBeaker);

    equipmentGroup.add(standGroup);

    // --- B. Woulfe Bottle, Thistle Funnel & Gas Jar (Right) ---
    const woulfeGroup = new THREE.Group();
    woulfeGroup.position.set(4.0, -3.0, -2.5);

    // Bottle Body
    const woulfeBodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.8, 32);
    const woulfeBody = new THREE.Mesh(woulfeBodyGeo, staticGlassMat);
    woulfeBody.position.y = 0.9;
    woulfeGroup.add(woulfeBody);

    // Bottle Dome
    const woulfeDomeGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const woulfeDome = new THREE.Mesh(woulfeDomeGeo, staticGlassMat);
    woulfeDome.position.y = 1.8;
    woulfeGroup.add(woulfeDome);

    // Bottle Necks
    const neckGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
    const leftNeck = new THREE.Mesh(neckGeo, staticGlassMat);
    leftNeck.position.set(-0.5, 2.3, 0);
    woulfeGroup.add(leftNeck);

    const rightNeck = new THREE.Mesh(neckGeo, staticGlassMat);
    rightNeck.position.set(0.5, 2.3, 0);
    woulfeGroup.add(rightNeck);

    // Rubber Corks
    const corkGeo = new THREE.CylinderGeometry(0.26, 0.22, 0.3, 16);
    const leftCork = new THREE.Mesh(corkGeo, rubberMat);
    leftCork.position.set(-0.5, 2.65, 0);
    woulfeGroup.add(leftCork);

    const rightCork = new THREE.Mesh(corkGeo, rubberMat);
    rightCork.position.set(0.5, 2.65, 0);
    woulfeGroup.add(rightCork);

    // Thistle Funnel (Thin Funnel) through Left Cork 
const thistleStemGeo = new THREE.CylinderGeometry(0.05, 0.05, 4.5, 16);
    const thistleStem = new THREE.Mesh(thistleStemGeo, staticGlassMat);
    thistleStem.position.set(-0.5, 2.0, 0); // Goes deep inside
    woulfeGroup.add(thistleStem);

    const thistleCupGeo = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const thistleCup = new THREE.Mesh(thistleCupGeo, staticGlassMat);
    thistleCup.rotation.x = Math.PI; // Invert to make a cup
    thistleCup.position.set(-0.5, 4.25, 0);
    woulfeGroup.add(thistleCup);

    // Delivery Tube (Exhaust Pipe) through Right Cork 
const tubeUpGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const tubeUp = new THREE.Mesh(tubeUpGeo, staticGlassMat);
    tubeUp.position.set(0.5, 3.2, 0);
    woulfeGroup.add(tubeUp);

    const tubeHorizGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 16);
    const tubeHoriz = new THREE.Mesh(tubeHorizGeo, staticGlassMat);
    tubeHoriz.rotation.z = Math.PI / 2;
    tubeHoriz.position.set(1.75, 3.8, 0);
    woulfeGroup.add(tubeHoriz);

    const tubeDownGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.5, 16);
    const tubeDown = new THREE.Mesh(tubeDownGeo, staticGlassMat);
    tubeDown.position.set(3.0, 2.05, 0);
    woulfeGroup.add(tubeDown);

    // Gas Jar (gas jar) at the end of the delivery tube 
const gasJarGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 32);
    const gasJar = new THREE.Mesh(gasJarGeo, staticGlassMat);
    gasJar.position.set(3.0, 1.25, 0);
    woulfeGroup.add(gasJar);

    equipmentGroup.add(woulfeGroup);

    // 11.c Electrolysis Apparatus (Water Electrolysis)
    const electrolysisGroup = new THREE.Group();
    electrolysisGroup.position.set(-1.5, -3.0, -4.5);

    // Basin/Trough
    const troughGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 32);
    const trough = new THREE.Mesh(troughGeo, staticGlassMat);
    trough.position.set(0, 0.75, 0);
    electrolysisGroup.add(trough);

    // Water in trough
    const troughWaterGeo = new THREE.CylinderGeometry(1.48, 1.48, 1.3, 32);
    const troughWaterMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.3,
      transmission: 0.9,
      ior: 1.33,
    });
    const troughWater = new THREE.Mesh(troughWaterGeo, troughWaterMat);
    troughWater.position.set(0, 0.65, 0);
    electrolysisGroup.add(troughWater);

    // Battery (Simple Box)
    const batteryGeo = new THREE.BoxGeometry(1.2, 0.8, 0.8);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5 });
    const battery = new THREE.Mesh(batteryGeo, batteryMat);
    battery.position.set(3, 0.4, 0);
    electrolysisGroup.add(battery);
    
    // Battery Terminals (Red = Anode +, Black = Cathode -)
    const termGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    
    const anodeTerm = new THREE.Mesh(termGeo, redMat);
    anodeTerm.position.set(3.3, 0.9, 0);
    electrolysisGroup.add(anodeTerm);
    
    const cathodeTerm = new THREE.Mesh(termGeo, blackMat);
    cathodeTerm.position.set(2.7, 0.9, 0);
    electrolysisGroup.add(cathodeTerm);

    // Electrodes (Carbon Rods)
    const carbonRodGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const carbonRodMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 });
    
    const anodeRod = new THREE.Mesh(carbonRodGeo, carbonRodMat);
    anodeRod.position.set(0.5, 0.4, 0);
    electrolysisGroup.add(anodeRod);
    
    const cathodeRod = new THREE.Mesh(carbonRodGeo, carbonRodMat);
    cathodeRod.position.set(-0.5, 0.4, 0);
    electrolysisGroup.add(cathodeRod);

    // Wires
    const wireGeo = new THREE.TubeGeometry(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(3.3, 0.9, 0),
        new THREE.Vector3(1.9, 1.5, 0),
        new THREE.Vector3(0.5, 0.1, 0)
      ),
      20, 0.02, 8, false
    );
    const redWire = new THREE.Mesh(wireGeo, redMat);
    electrolysisGroup.add(redWire);

    const blackWireGeo = new THREE.TubeGeometry(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(2.7, 0.9, 0),
        new THREE.Vector3(1.1, 1.0, 0),
        new THREE.Vector3(-0.5, 0.1, 0)
      ),
      20, 0.02, 8, false
    );
    const blackWire = new THREE.Mesh(blackWireGeo, blackMat);
    electrolysisGroup.add(blackWire);

    // Inverted Test Tubes
    const testTubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
    const testTubeAnode = new THREE.Mesh(testTubeGeo, staticGlassMat);
    testTubeAnode.position.set(0.5, 1.5, 0);
    electrolysisGroup.add(testTubeAnode);

    const testTubeCathode = new THREE.Mesh(testTubeGeo, staticGlassMat);
    testTubeCathode.position.set(-0.5, 1.5, 0);
    electrolysisGroup.add(testTubeCathode);
    
    // Gas Bubbles Arrays
    const h2Bubbles: THREE.Mesh[] = [];
    const o2Bubbles: THREE.Mesh[] = [];
    const elecBubbleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const elecBubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 0.9, opacity: 1, ior: 1.0, transparent: true
    });

    for(let i = 0; i < 20; i++) {
        const h2 = new THREE.Mesh(elecBubbleGeo, elecBubbleMat);
        h2.position.set(-0.5 + (Math.random()-0.5)*0.3, 0.8 + Math.random()*1.5, (Math.random()-0.5)*0.3);
        electrolysisGroup.add(h2);
        h2Bubbles.push(h2);
        
        if (i % 2 === 0) {
            const o2 = new THREE.Mesh(elecBubbleGeo, elecBubbleMat);
            o2.position.set(0.5 + (Math.random()-0.5)*0.3, 0.8 + Math.random()*1.5, (Math.random()-0.5)*0.3);
            electrolysisGroup.add(o2);
            o2Bubbles.push(o2);
        }
    }
    
    // Store for animation loop
    electrolysisGroup.userData = { h2Bubbles, o2Bubbles };
    equipmentGroup.add(electrolysisGroup);

    scene.add(equipmentGroup);


    // Hide/show props based on experimentId
    if (experimentId === 'exp_electrolysis_water') {
      if (glassGroupRef.current) glassGroupRef.current.visible = false;
      standGroup.visible = false;
      woulfeGroup.visible = false;
      electrolysisGroup.visible = true;
      cameraRef.current.position.set(-1.5, -2, 3);
    } else if (experimentId === 'exp_co2_preparation' || experimentId === 'exp_h2_gas_prep') {
      if (glassGroupRef.current) glassGroupRef.current.visible = false;
      standGroup.visible = false;
      electrolysisGroup.visible = false;
      woulfeGroup.visible = true;
      cameraRef.current.position.set(4, -1, 3);
    } else if (experimentId === 'exp_neutralization') {
      if (glassGroupRef.current) glassGroupRef.current.visible = true;
      standGroup.visible = true;
      electrolysisGroup.visible = false;
      woulfeGroup.visible = false;
      cameraRef.current.position.set(0, -1, 4);
    } else {
      if (glassGroupRef.current) glassGroupRef.current.visible = true;
      standGroup.visible = false;
      woulfeGroup.visible = false;
      electrolysisGroup.visible = false;
      cameraRef.current.position.set(0, 0, 8);
    }

    // 12. Mouse Drag Rotation Listeners
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      rotationAnglesRef.current.theta += deltaX * 0.008;
      rotationAnglesRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2.2, rotationAnglesRef.current.phi + deltaY * 0.008)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      rotationAnglesRef.current.radius = Math.max(
        8,
        Math.min(22, rotationAnglesRef.current.radius + e.deltaY * 0.015)
      );
      updateCameraPosition();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // 12. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();



      // Update Electrolysis Bubbles
      if (isBubbling && electrolysisGroup && electrolysisGroup.userData && electrolysisGroup.userData.h2Bubbles) {

        electrolysisGroup.userData.h2Bubbles.forEach((b) => {
          b.position.y += 0.04;
          if (b.position.y > 2.5) {
            b.position.y = 0.8;
            b.position.x = -0.5 + (Math.random()-0.5)*0.3;
          }
        });
        electrolysisGroup.userData.o2Bubbles.forEach((b) => {
          b.position.y += 0.02; // O2 forms slower and less bubbles
          if (b.position.y > 2.0) {
            b.position.y = 0.8;
            b.position.x = 0.5 + (Math.random()-0.5)*0.3;
          }
        });
      }

      // Auto-rotation when enabled
      if (autoRotate && !isDraggingRef.current) {
        rotationAnglesRef.current.theta += delta * 0.4;
        updateCameraPosition();
      }

      // Smooth Liquid Transition Animation
      if (liquidMeshRef.current) {
        // Height interpolation
        currentLiquidHeightRef.current = THREE.MathUtils.lerp(
          currentLiquidHeightRef.current,
          targetLiquidHeightRef.current,
          delta * 4
        );
        liquidMeshRef.current.scale.set(1, Math.max(0.001, currentLiquidHeightRef.current / 4.2), 1);
        liquidMeshRef.current.position.y = -2.8 + currentLiquidHeightRef.current / 2;
        liquidMeshRef.current.visible = currentLiquidHeightRef.current > 0.05;

        // Color interpolation
        currentLiquidColorRef.current.lerp(targetLiquidColorRef.current, delta * 5);
        (liquidMeshRef.current.material as THREE.MeshPhysicalMaterial).color.copy(currentLiquidColorRef.current);

        // Add subtle liquid surface wave animation when stirring or bubbling
        if (isStirring || isBubbling) {
          liquidMeshRef.current.rotation.x = Math.sin(elapsedTime * 10) * 0.01;
          liquidMeshRef.current.rotation.z = Math.cos(elapsedTime * 12) * 0.01;
        } else {
          liquidMeshRef.current.rotation.x = THREE.MathUtils.lerp(liquidMeshRef.current.rotation.x, 0, delta * 2);
          liquidMeshRef.current.rotation.z = THREE.MathUtils.lerp(liquidMeshRef.current.rotation.z, 0, delta * 2);
        }
      }

      // Smooth Precipitate Transition
      if (precipitateMeshRef.current) {
        currentPrecipitateScaleRef.current = THREE.MathUtils.lerp(
          currentPrecipitateScaleRef.current,
          targetPrecipitateScaleRef.current,
          delta * 3
        );
        precipitateMeshRef.current.scale.set(1, currentPrecipitateScaleRef.current, 1);
        precipitateMeshRef.current.visible = currentPrecipitateScaleRef.current > 0.01;
      }

      // Smooth Pour Stream Animation
      if (pourStreamRef.current) {
        const targetScale = isPouringRef.current ? 1 : 0;
        pourScaleYRef.current = THREE.MathUtils.lerp(pourScaleYRef.current, targetScale, delta * 12);
        
        pourStreamRef.current.scale.set(1, Math.max(0.001, pourScaleYRef.current), 1);
        
        // Calculate position so it scales from the top origin downwards
        // Stream original Y = 2.5, Height = 4.5. Top origin = 2.5 + (4.5/2) = 4.75
        const streamTopY = 4.75;
        pourStreamRef.current.position.y = streamTopY - (4.5 * pourScaleYRef.current) / 2;
        
        // Add subtle wavy wobble to the stream
        if (isPouringRef.current) {
          pourStreamRef.current.position.x = 0.5 + Math.sin(elapsedTime * 30) * 0.02;
        }

        pourStreamRef.current.visible = pourScaleYRef.current > 0.01;
      }

      // Stirrer animation
      if (stirrerRef.current && isStirring) {
        stirrerRef.current.rotation.y += delta * 12;
        stirrerRef.current.position.x = Math.sin(elapsedTime * 10) * 0.2;
        stirrerRef.current.position.z = Math.cos(elapsedTime * 10) * 0.2;
      } else if (stirrerRef.current) {
        // Return to center smoothly
        stirrerRef.current.position.x = THREE.MathUtils.lerp(stirrerRef.current.position.x, 0.5, delta * 5);
        stirrerRef.current.position.z = THREE.MathUtils.lerp(stirrerRef.current.position.z, 0, delta * 5);
      }

      // Bubbles animation
      if (bubblesGroupRef.current && isBubbling) {
        bubblesGroupRef.current.children.forEach((b: THREE.Object3D, index) => {
          b.position.y += delta * (2 + (index % 3));
          b.position.x += Math.sin(elapsedTime * 5 + index) * 0.02;
          if (b.position.y > -2.8 + currentLiquidHeightRef.current) {
            b.position.y = -2.6;
            b.position.x = (Math.random() - 0.5) * 2.0;
            b.position.z = (Math.random() - 0.5) * 2.0;
          }
        });
      }

      // Burner Flame Flicker animation
      if (burnerFlameRef.current && isHeating) {
        const scale = 1 + Math.sin(elapsedTime * 25) * 0.1;
        burnerFlameRef.current.scale.set(scale, scale * (1 + Math.cos(elapsedTime * 20) * 0.15), scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount || !cameraRef.current || !rendererRef.current) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [glassware]);

  // Update Camera presets or angles
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = rotationAnglesRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, -0.5, 0);
  };

  // Adjust camera to presets
  useEffect(() => {
    if (cameraPreset === 'front') {
      rotationAnglesRef.current = { theta: 0, phi: Math.PI / 2.2, radius: 13 };
    } else if (cameraPreset === 'top') {
      rotationAnglesRef.current = { theta: 0, phi: 0.08, radius: 13 };
    } else {
      // Isometric
      rotationAnglesRef.current = { theta: 0.5, phi: 0.45, radius: 13 };
    }
    updateCameraPosition();
  }, [cameraPreset]);

  // Update Dynamic Targets
  useEffect(() => {
    const fillRatio = Math.max(0.01, Math.min(1.0, volume / maxCapacity));
    const maxHeight = 4.2; // Full height of 500mL beaker
    
    // Animate to new values instead of instant jump
    targetLiquidHeightRef.current = maxHeight * fillRatio;
    targetLiquidColorRef.current.set(liquidColorHex);

    if (precipitateInfo) {
      targetPrecipitateScaleRef.current = 1;
      if (precipitateMeshRef.current) {
        (precipitateMeshRef.current.material as THREE.MeshStandardMaterial).color.set(precipitateInfo.colorHex);
      }
    } else {
      targetPrecipitateScaleRef.current = 0;
    }
  }, [volume, liquidColorHex, maxCapacity, precipitateInfo]);

  // Update Pour Stream Animation State
  useEffect(() => {
    isPouringRef.current = isPouring;
    if (isPouring && pourStreamRef.current) {
      (pourStreamRef.current.material as THREE.MeshPhysicalMaterial).color.set(pourColorHex || liquidColorHex);
    }
  }, [isPouring, pourColorHex, liquidColorHex]);

  // Update Burner Flame
  useEffect(() => {
    if (!burnerFlameRef.current) return;
    burnerFlameRef.current.visible = isHeating;
  }, [isHeating]);

  // Update Bubbles
  useEffect(() => {
    if (!bubblesGroupRef.current) return;
    bubblesGroupRef.current.visible = isBubbling;
  }, [isBubbling]);

  // Helper: Build Premium Glassware
  function buildGlassware(scene: THREE.Scene, type: GlasswareType) {
    if (glassGroupRef.current) {
      scene.remove(glassGroupRef.current);
    }

    const group = new THREE.Group();
    glassGroupRef.current = group;

    // Premium Liquid Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2, // Very clear
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.98, // Highly transmissive
      ior: 1.5, // Crown glass
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false, // Fix transparency rendering sorting
    });

    const beakerRadius = type === 'test_tube' ? 0.8 : type === 'conical_flask' ? 2.4 : 1.8;
    const beakerHeight = type === 'test_tube' ? 5.5 : 4.8;

    if (type === 'conical_flask') {
      // Conical Flask body
      const coneGeo = new THREE.ConeGeometry(2.5, 3.5, 64, 1, true);
      const cone = new THREE.Mesh(coneGeo, glassMaterial);
      cone.position.y = -1.2;
      group.add(cone);

      const neckGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.0, 64, 1, true);
      const neck = new THREE.Mesh(neckGeo, glassMaterial);
      neck.position.y = 1.2;
      group.add(neck);

      // Base plate
      const baseGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 64);
      const base = new THREE.Mesh(baseGeo, glassMaterial);
      base.position.y = -2.95;
      group.add(base);
    } else {
      // Cylinder Beaker / Test Tube
      const cylinderGeo = new THREE.CylinderGeometry(
        beakerRadius,
        beakerRadius,
        beakerHeight,
        64,
        1,
        true
      );
      const cylinder = new THREE.Mesh(cylinderGeo, glassMaterial);
      cylinder.position.y = -0.5;
      group.add(cylinder);

      // Glass bottom
      const bottomGeo = new THREE.CylinderGeometry(beakerRadius, beakerRadius, 0.15, 64);
      const bottom = new THREE.Mesh(bottomGeo, glassMaterial);
      bottom.position.y = -0.5 - beakerHeight / 2;
      group.add(bottom);

      // Beaker Rim / Lip
      const torusGeo = new THREE.TorusGeometry(beakerRadius, 0.08, 32, 64);
      const rim = new THREE.Mesh(torusGeo, glassMaterial);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.5 + beakerHeight / 2;
      group.add(rim);

      // Measurement graduation markings
      if (type === 'beaker') {
        const markMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        for (let i = 1; i <= 5; i++) {
          const markGeo = new THREE.BoxGeometry(0.3, 0.03, 0.02);
          const mark = new THREE.Mesh(markGeo, markMat);
          mark.position.set(0, -2.7 + i * 0.75, beakerRadius + 0.01);
          group.add(mark);
        }
      }
    }

    // Advanced Liquid Material
    const liquidGeo = new THREE.CylinderGeometry(beakerRadius * 0.94, beakerRadius * 0.92, 4.2, 64);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(liquidColorHex),
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
      transmission: 0.7,
      ior: 1.33, // Water IOR
      side: THREE.DoubleSide,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = -0.7; // Initial baseline
    
    // Sync initial height
    const fillRatio = Math.max(0.01, Math.min(1.0, volume / maxCapacity));
    currentLiquidHeightRef.current = 4.2 * fillRatio;
    targetLiquidHeightRef.current = 4.2 * fillRatio;
    liquidMesh.scale.set(1, Math.max(0.001, currentLiquidHeightRef.current / 4.2), 1);
    
    // Ensure color targets are synced initially
    targetLiquidColorRef.current.set(liquidColorHex);
    currentLiquidColorRef.current.set(liquidColorHex);
    liquidMat.color.copy(currentLiquidColorRef.current);

    liquidMesh.visible = volume > 0;
    liquidMeshRef.current = liquidMesh;
    group.add(liquidMesh);

    // Precipitate Layer at bottom
    const precipGeo = new THREE.CylinderGeometry(beakerRadius * 0.91, beakerRadius * 0.91, 0.35, 64);
    const precipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
    });
    const precipMesh = new THREE.Mesh(precipGeo, precipMat);
    precipMesh.position.y = -2.65;
    
    if (precipitateInfo) {
      precipMat.color.set(precipitateInfo.colorHex);
      currentPrecipitateScaleRef.current = 1;
      targetPrecipitateScaleRef.current = 1;
      precipMesh.visible = true;
    } else {
      currentPrecipitateScaleRef.current = 0;
      targetPrecipitateScaleRef.current = 0;
      precipMesh.visible = false;
    }
    
    precipitateMeshRef.current = precipMesh;
    group.add(precipMesh);

    scene.add(group);
  }

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Badges inside 3D Viewport */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        {/* Glassware & Volume Badge */}
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-lg flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">
            {glassware === 'beaker'
              ? 'Beaker'
              : glassware === 'test_tube'
              ? 'test tube'
              : 'Conical flask'}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {volume} / {maxCapacity} mL
          </span>
        </div>

        {/* Live Thermal and pH HUD */}
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-xs font-mono flex items-center gap-1.5 text-amber-300">
            <span>🌡️</span>
            <span>{temperature.toFixed(1)}°C</span>
          </div>
          <div
            className={`px-3 py-1 rounded-lg backdrop-blur-md border text-xs font-mono flex items-center gap-1.5 font-bold ${
              ph < 7
                ? 'bg-rose-950/60 border-rose-700/50 text-rose-300'
                : ph > 7
                ? 'bg-blue-950/60 border-blue-700/50 text-blue-300'
                : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
            }`}
          >
            <span>pH</span>
            <span>{ph.toFixed(1)}</span>
          </div>
        </div>

        {/* Gas / Precipitate Live Event Pill */}
        {isBubbling && gasInfo && (
          <div className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/60 text-xs text-indigo-200 flex items-center gap-1.5 animate-bounce">
            <span>💨</span>
            <span>
              Gas Emissions: <strong>{gasInfo.banglaName}</strong> ({gasInfo.formula})
            </span>
          </div>
        )}
        {precipitateInfo && (
          <div className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/60 text-xs text-amber-200 flex items-center gap-1.5">
            <span>⬇️</span>
            <span>
              Bottom: <strong>{precipitateInfo.banglaName}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Drag & Rotation Hint Overlay */}
      <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 bg-slate-900/70 px-2.5 py-1 rounded-md border border-slate-800 pointer-events-none">
        🖱️ Drag: 360° to rotate Scroll: Zoom
      </div>
    </div>
  );
};

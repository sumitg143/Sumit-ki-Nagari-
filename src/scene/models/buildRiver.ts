import * as THREE from 'three';

/**
 * Procedural River & Stone Ghats for Sumit Ki Nagri:
 * - Flowing sparkling blue river channel with animated water ripples
 * - Stone ghat steps (पवित्र स्नान घाट) leading into the holy water
 * - Floating diya lamps and water ripples
 * - Historic stone arched bridge carrying the railway track and avenue over the water
 * - Anchored wooden country boat (देसी नाव) with oars
 */

export interface RiverSystem {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
}

export function buildRiver(): RiverSystem {
  const riverGroup = new THREE.Group();
  riverGroup.name = 'PavitraRiverSystem';

  // 1. Riverbed & Flowing Water Plane
  // River runs along X = 32, extending from Z = -55 to Z = 55 (110 units long, 16 units wide)
  const riverWidth = 14;
  const riverLength = 120;
  const riverX = 34;

  // Riverbed excavation base (deeper ground under water)
  const riverBedGeo = new THREE.PlaneGeometry(riverWidth + 2, riverLength);
  const riverBedMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f, // Deep riverbed silt
    roughness: 0.95,
  });
  const riverBed = new THREE.Mesh(riverBedGeo, riverBedMat);
  riverBed.rotation.x = -Math.PI / 2;
  riverBed.position.set(riverX, -0.25, 0);
  riverGroup.add(riverBed);

  // Sparkling River Water Surface
  // Using custom canvas texture with wave pattern or high transmission PBR material
  const waterGeo = new THREE.PlaneGeometry(riverWidth, riverLength, 32, 64);
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7, // Vibrant turquoise / celestial river blue
    roughness: 0.1,
    metalness: 0.15,
    transmission: 0.6,
    transparent: true,
    opacity: 0.88,
    ior: 1.333, // Water refractive index
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(riverX, 0.05, 0);
  waterMesh.receiveShadow = true;
  riverGroup.add(waterMesh);

  // Store original vertex positions for wave ripple animation
  const posAttr = waterGeo.attributes.position;
  const originalZPositions = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    originalZPositions[i] = posAttr.getZ(i);
  }

  // 2. Stone Riverbanks & Ghat Stairs (मंदिर का सीढ़ीदार घाट)
  const ghatMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Amber sandstone
    roughness: 0.75,
  });

  // Steps descending into river on the West bank (facing the city & Mandir)
  const stepsGroup = new THREE.Group();
  stepsGroup.position.set(riverX - riverWidth / 2, 0, 4); // Near temple at Z = 4

  for (let i = 0; i < 4; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.18, 18),
      ghatMat
    );
    step.position.set(-i * 0.9, -i * 0.1, 0);
    step.castShadow = true;
    step.receiveShadow = true;
    stepsGroup.add(step);
  }
  riverGroup.add(stepsGroup);

  // Ghat Chhatri / Pavilion overlooking river
  const chhatriMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.6,
  });
  const chhatriPillars = new THREE.Group();
  [-1.2, 1.2].forEach((px) => {
    [-1.2, 1.2].forEach((pz) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.8, 8), chhatriMat);
      p.position.set(px, 1.4, pz);
      chhatriPillars.add(p);
    });
  });
  // Chhatri dome roof
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), chhatriMat);
  dome.position.set(0, 2.8, 0);
  chhatriPillars.add(dome);
  chhatriPillars.position.set(riverX - 6.5, 0.4, 4);
  riverGroup.add(chhatriPillars);

  // 3. Floating Diyas with Golden Light on River
  const diyas: { mesh: THREE.Group; initialX: number; initialZ: number; speed: number; bobOffset: number }[] = [];
  const diyaMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.8,
  });
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.5,
  });

  const diyaPositions = [
    { x: riverX - 2, z: 2 },
    { x: riverX + 1, z: 6 },
    { x: riverX - 1, z: 12 },
    { x: riverX + 2, z: -4 },
    { x: riverX, z: -10 },
  ];

  diyaPositions.forEach((dp, idx) => {
    const diya = new THREE.Group();
    // Earthen leaf patra / bowl
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.15, 0.12, 8), diyaMat);
    // Glowing flame
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 6), flameMat);
    flame.position.y = 0.15;
    diya.add(bowl, flame);
    diya.position.set(dp.x, 0.08, dp.z);
    riverGroup.add(diya);

    diyas.push({
      mesh: diya,
      initialX: dp.x,
      initialZ: dp.z,
      speed: 0.3 + idx * 0.08,
      bobOffset: idx * 1.3,
    });
  });

  // 4. Anchored Traditional Wooden Country Boat (देसी लकड़ी की नाव)
  const boat = new THREE.Group();
  boat.position.set(riverX - 4.5, 0.1, 8.0);
  boat.rotation.y = 0.3;

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.85,
  });

  // Boat hull (stretched tapered box)
  const hullBottom = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 4.2), woodMat);
  hullBottom.position.y = 0.1;
  boat.add(hullBottom);

  // Bow & Stern wedges
  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.0, 4), woodMat);
  bow.rotation.x = Math.PI / 2;
  bow.position.set(0, 0.2, 2.4);
  boat.add(bow);

  const stern = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.9, 4), woodMat);
  stern.rotation.x = -Math.PI / 2;
  stern.position.set(0, 0.2, -2.3);
  boat.add(stern);

  // Wooden seats inside boat
  [-0.6, 0.6].forEach((sz) => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.3), woodMat);
    seat.position.set(0, 0.28, sz);
    boat.add(seat);
  });

  // Oar leaning on boat
  const oar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 2.6, 6),
    new THREE.MeshStandardMaterial({ color: 0x451a03 })
  );
  oar.rotation.z = 0.4;
  oar.rotation.x = 0.2;
  oar.position.set(0.7, 0.5, 0);
  boat.add(oar);

  riverGroup.add(boat);

  // 5. Grand Stone Arched Bridges Across the River
  // Bridge 1: Station Railway Track Bridge (at Z = 32)
  const bridgeMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // Weathered grey bridge stone
    roughness: 0.8,
  });

  const createBridge = (bridgeZ: number, width: number, isRailway: boolean) => {
    const bridge = new THREE.Group();
    bridge.position.set(riverX, 0, bridgeZ);

    // Main bridge deck spanning the river
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(riverWidth + 3, 0.5, width),
      bridgeMat
    );
    deck.position.y = 0.35;
    deck.castShadow = true;
    deck.receiveShadow = true;
    bridge.add(deck);

    // Stone Arch Support Pillars underneath
    [-3.5, 3.5].forEach((px) => {
      const pier = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.4, 1.8, 12),
        bridgeMat
      );
      pier.position.set(px, -0.4, 0);
      pier.castShadow = true;
      bridge.add(pier);
    });

    // Decorative Parapet Stone Railings along deck edges
    [-width / 2 + 0.15, width / 2 - 0.15].forEach((rz) => {
      const railing = new THREE.Mesh(
        new THREE.BoxGeometry(riverWidth + 2.8, 0.6, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 })
      );
      railing.position.set(0, 0.85, rz);
      railing.castShadow = true;
      bridge.add(railing);
    });

    // If railway bridge, add extended steel rails across it
    if (isRailway) {
      const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
      [-0.8, 0.8].forEach((ry) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(riverWidth + 3, 0.1, 0.08), railMat);
        rail.position.set(0, 0.65, ry);
        bridge.add(rail);
      });
    }

    return bridge;
  };

  // Train Bridge at Z = 35.8 (aligned with railway line)
  const trainBridge = createBridge(35.8, 4.0, true);
  riverGroup.add(trainBridge);

  // Road Bridge at Z = 8.0 (aligned with Bazaar Cross Road extended)
  const roadBridge = createBridge(8.0, 7.2, false);
  riverGroup.add(roadBridge);

  // Update loop for waves, floating boat, and diyas
  const update = (delta: number, time: number) => {
    // 1. Animate subtle water surface undulation
    const count = posAttr.count;
    for (let i = 0; i < count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getY(i);
      const wave = Math.sin(u * 0.4 + time * 2.0) * 0.05 + Math.cos(v * 0.2 + time * 1.5) * 0.04;
      posAttr.setZ(i, originalZPositions[i] + wave);
    }
    posAttr.needsUpdate = true;

    // 2. Animate boat bobbing on waves
    boat.position.y = 0.1 + Math.sin(time * 2.2) * 0.04;
    boat.rotation.z = Math.sin(time * 1.8) * 0.03;
    boat.rotation.x = Math.cos(time * 1.5) * 0.02;

    // 3. Animate drifting diyas
    diyas.forEach((d) => {
      d.mesh.position.z += delta * d.speed;
      if (d.mesh.position.z > riverLength / 2) {
        d.mesh.position.z = -riverLength / 2;
      }
      d.mesh.position.y = 0.08 + Math.sin(time * 3 + d.bobOffset) * 0.03;
    });
  };

  return { group: riverGroup, update };
}

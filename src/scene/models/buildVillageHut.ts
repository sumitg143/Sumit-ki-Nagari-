import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';
import { Resident } from '../../types/city.ts';

/**
 * Builds traditional Indian Village Hut (Mitti ka Ghar) with thatched roof,
 * clay porch, charpai cot, and village signboard.
 */
export function buildVillageHut(resident: Resident): THREE.Group {
  const hut = new THREE.Group();
  hut.name = `Hut_${resident.name}`;

  const mudWallMat = new THREE.MeshStandardMaterial({
    color: 0x92400e, // Warm clay/mud
    roughness: 0.95,
  });

  const thatchRoofMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04, // Golden dry thatch/straw
    roughness: 0.9,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x58250e,
    roughness: 0.85,
  });

  // 1. Mud Base Platform
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.4, 4.4),
    mudWallMat
  );
  plinth.position.set(0, 0.2, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  hut.add(plinth);

  // 2. Main Mud Wall Body
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 2.2, 3.6),
    mudWallMat
  );
  walls.position.set(0, 1.4, -0.2);
  walls.castShadow = true;
  hut.add(walls);

  // Wooden rustic entrance door
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.7, 0.15), woodMat);
  door.position.set(0, 1.15, 1.62);
  hut.add(door);

  // 3. Thatched Slanted Gable Roof (Pyramid/Wedge straw)
  const roofGeo = new THREE.ConeGeometry(3.6, 1.8, 4);
  const roof = new THREE.Mesh(roofGeo, thatchRoofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(0, 3.2, -0.2);
  roof.castShadow = true;
  hut.add(roof);

  // Overhanging eaves
  const eaves = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.15, 4.4),
    thatchRoofMat
  );
  eaves.position.set(0, 2.45, -0.2);
  hut.add(eaves);

  // 4. Charpai / Khatia (Traditional Indian woven cot on front porch)
  const charpai = new THREE.Group();
  // Frame
  const cFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.1, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x78350f })
  );
  cFrame.position.set(0, 0.35, 0);
  // Woven ropes
  const cMat = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.05, 0.65),
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 })
  );
  cMat.position.set(0, 0.38, 0);
  // 4 wooden legs
  [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.35),
      woodMat
    );
    leg.position.set(lx, 0.18, lz);
    charpai.add(leg);
  });
  charpai.add(cFrame, cMat);
  charpai.position.set(1.4, 0.2, 1.4);
  hut.add(charpai);

  // 5. Village Signboard
  const signGeo = new THREE.PlaneGeometry(2.4, 0.65);
  const signTexture = TextureGenerator.createSignboard(
    resident.hindiName || resident.name,
    resident.customSignboard || 'हरि गाँव • HARI GAON',
    '#166534',
    '#fef08a',
    '#ca8a04'
  );
  const sign = new THREE.Mesh(
    signGeo,
    new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.4 })
  );
  sign.position.set(0, 2.3, 1.63);
  hut.add(sign);

  // 6. Contact Shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  hut.add(shadow);

  hut.userData = {
    isInteractive: true,
    type: 'resident',
    resident: resident,
  };

  return hut;
}

/**
 * Builds the Great Banyan Tree with round brick Chabutra (Panchayat Chaupal)
 */
export function buildBanyanChabutra(): THREE.Group {
  const banyan = new THREE.Group();
  banyan.name = 'BanyanChabutra';

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.85,
  });

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.9,
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Lush Indian banyan green
    roughness: 0.7,
  });

  // 1. Circular Brick Chabutra Platform (Sitting bench around tree)
  const chabutraOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.4, 0.6, 24),
    brickMat
  );
  chabutraOuter.position.set(0, 0.3, 0);
  chabutraOuter.castShadow = true;
  chabutraOuter.receiveShadow = true;
  banyan.add(chabutraOuter);

  // 2. Massive Banyan Trunk with twists
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1.4, 5.0, 16),
    trunkMat
  );
  trunk.position.set(0, 2.8, 0);
  trunk.castShadow = true;
  banyan.add(trunk);

  // Hanging aerial roots (Prop roots)
  const rootGeo = new THREE.CylinderGeometry(0.06, 0.08, 4.2, 8);
  [
    [1.6, 1.4],
    [-1.6, 1.2],
    [1.8, -1.2],
    [-1.5, -1.5],
  ].forEach(([rx, rz]) => {
    const root = new THREE.Mesh(rootGeo, trunkMat);
    root.position.set(rx, 2.5, rz);
    banyan.add(root);
  });

  // 3. Dense Canopy Foliage (Layered lush green spheres)
  const foliageOffsets = [
    [0, 6.2, 0, 3.4],
    [-2.2, 5.6, 0.8, 2.6],
    [2.2, 5.6, -0.8, 2.6],
    [0.8, 5.8, 2.2, 2.4],
    [-0.8, 5.8, -2.2, 2.4],
    [0, 7.4, 0, 2.8],
  ];

  foliageOffsets.forEach(([fx, fy, fz, fr]) => {
    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(fr, 16, 14),
      foliageMat
    );
    canopy.position.set(fx, fy, fz);
    canopy.castShadow = true;
    banyan.add(canopy);
  });

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 9),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  banyan.add(shadow);

  banyan.userData = {
    isInteractive: true,
    type: 'landmark',
    title: 'The Great Banyan Tree (बरगद का चबूतरा)',
    titleHindi: 'विशाल बरगद वृक्ष एवं चबूतरा',
    description: 'Centuries-old banyan tree with deep aerial roots and a round brick chabutra where town meetings happen.',
    descriptionHindi: 'सौ वर्ष पुराना पवित्र बरगद वृक्ष जहाँ शाम को चौपाल जमती है।',
    action: 'chaupal',
  };

  return banyan;
}

import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';
import { Resident } from '../../types/city.ts';

/**
 * Builds Sumit Niwas / Heritage Rajasthani Haveli.
 * Features 3-tier sandstone structure, arches, carved jharokhas,
 * rooftop chhatri pavilion, fluttering flag, and marigold garlands.
 */
export function buildHaveli(resident: Resident): THREE.Group {
  const haveli = new THREE.Group();
  haveli.name = `Haveli_${resident.name}`;

  // Sandstone and heritage materials
  const wallMat = new THREE.MeshStandardMaterial({
    color: resident.isFounder ? 0xd97706 : 0xca8a04,
    roughness: 0.65,
    metalness: 0.05,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.5,
    metalness: 0.15,
  });

  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.45,
    metalness: 0.1,
  });

  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.7,
    metalness: 0.1,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.25,
    metalness: 0.8,
  });

  const jharokhaMat = new THREE.MeshStandardMaterial({
    map: TextureGenerator.createJharokhaTexture(),
    roughness: 0.6,
  });

  // 1. Plinth / Raised Foundation Platform
  const plinthGeo = new THREE.BoxGeometry(6.4, 0.6, 6.4);
  const plinth = new THREE.Mesh(plinthGeo, trimMat);
  plinth.position.set(0, 0.3, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  haveli.add(plinth);

  // Front entrance steps
  const stepsGeo = new THREE.BoxGeometry(2.4, 0.3, 1.2);
  const steps = new THREE.Mesh(stepsGeo, trimMat);
  steps.position.set(0, 0.15, 3.4);
  haveli.add(steps);

  // 2. Ground Floor Main Body
  const groundBodyGeo = new THREE.BoxGeometry(5.6, 3.2, 5.6);
  const groundBody = new THREE.Mesh(groundBodyGeo, wallMat);
  groundBody.position.set(0, 2.2, 0);
  groundBody.castShadow = true;
  groundBody.receiveShadow = true;
  haveli.add(groundBody);

  // Corner Pillars (4 decorative columns)
  const pillarGeo = new THREE.CylinderGeometry(0.22, 0.24, 3.4, 12);
  const pillarOffsets = [
    [-2.7, 2.3, -2.7],
    [2.7, 2.3, -2.7],
    [-2.7, 2.3, 2.7],
    [2.7, 2.3, 2.7],
  ];
  pillarOffsets.forEach(([px, py, pz]) => {
    const col = new THREE.Mesh(pillarGeo, pillarMat);
    col.position.set(px, py, pz);
    col.castShadow = true;
    haveli.add(col);
  });

  // Main Carved Entrance Doorway
  const doorArchGeo = new THREE.BoxGeometry(1.8, 2.4, 0.3);
  const doorArch = new THREE.Mesh(doorArchGeo, doorMat);
  doorArch.position.set(0, 1.8, 2.82);
  haveli.add(doorArch);

  // Marigold Garland (Toran) over entrance
  const toranGeo = new THREE.TorusGeometry(0.9, 0.08, 8, 16, Math.PI);
  const toranMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.9,
  });
  const toran = new THREE.Mesh(toranGeo, toranMat);
  toran.position.set(0, 2.9, 2.92);
  toran.rotation.x = Math.PI;
  haveli.add(toran);

  // 3. Ground Cornice / Molding
  const corniceGeo = new THREE.BoxGeometry(6.0, 0.3, 6.0);
  const cornice = new THREE.Mesh(corniceGeo, trimMat);
  cornice.position.set(0, 3.95, 0);
  cornice.castShadow = true;
  haveli.add(cornice);

  // 4. First Floor (With protruding Jharokhas)
  const firstFloorGeo = new THREE.BoxGeometry(4.8, 2.8, 4.8);
  const firstFloor = new THREE.Mesh(firstFloorGeo, wallMat);
  firstFloor.position.set(0, 5.5, 0);
  firstFloor.castShadow = true;
  haveli.add(firstFloor);

  // Protruding Jharokha (Rajasthani Ornate Balcony Box on front facade)
  const jharokhaGroup = new THREE.Group();
  const jharokhaBox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 0.8), jharokhaMat);
  jharokhaBox.position.set(0, 0, 0);
  const jharokhaRoof = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.7, 4), trimMat);
  jharokhaRoof.position.set(0, 1.15, 0);
  jharokhaRoof.rotation.y = Math.PI / 4;
  jharokhaGroup.add(jharokhaBox, jharokhaRoof);
  jharokhaGroup.position.set(0, 5.5, 2.6);
  haveli.add(jharokhaGroup);

  // Side small jharokhas
  [-2.5, 2.5].forEach((sx) => {
    const sideJharokha = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 1.2), jharokhaMat);
    sideJharokha.position.set(sx, 5.5, 0);
    haveli.add(sideJharokha);
  });

  // 5. Grand Terrace Parapet Railing (Rooftop)
  const parapetGeo = new THREE.BoxGeometry(5.2, 0.6, 5.2);
  const parapet = new THREE.Mesh(parapetGeo, trimMat);
  parapet.position.set(0, 7.2, 0);
  haveli.add(parapet);

  // 6. Rooftop Chhatri (Traditional Rajasthani Cupola Dome Pavilion)
  const chhatriGroup = new THREE.Group();
  // 4 thin pillars
  const chhatriPillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6, 8);
  const cOffsets = [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]];
  cOffsets.forEach(([cx, cz]) => {
    const cp = new THREE.Mesh(chhatriPillarGeo, pillarMat);
    cp.position.set(cx, 0.8, cz);
    chhatriGroup.add(cp);
  });
  // Dome on top
  const domeGeo = new THREE.SphereGeometry(1.1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, wallMat);
  dome.position.set(0, 1.6, 0);
  dome.castShadow = true;
  chhatriGroup.add(dome);

  // Golden Kalash pinnacle finial
  const finialGeo = new THREE.CylinderGeometry(0.04, 0.14, 0.6, 8);
  const finial = new THREE.Mesh(finialGeo, goldAccentMat);
  finial.position.set(0, 2.8, 0);
  chhatriGroup.add(finial);

  chhatriGroup.position.set(0, 7.5, 0);
  haveli.add(chhatriGroup);

  // 7. Flagpole with Saffron / Indian Flag
  const flagpoleGeo = new THREE.CylinderGeometry(0.03, 0.04, 2.4, 8);
  const flagpole = new THREE.Mesh(flagpoleGeo, goldAccentMat);
  flagpole.position.set(1.8, 8.4, 1.8);

  const flagGeo = new THREE.PlaneGeometry(0.9, 0.55);
  const flagMat = new THREE.MeshStandardMaterial({
    color: resident.isFounder ? 0xf97316 : 0xeab308,
    side: THREE.DoubleSide,
    roughness: 0.7,
  });
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(2.25, 9.2, 1.8);
  haveli.add(flagpole, flag);

  // 8. Custom Painted Signboard
  const signWidth = 2.8;
  const signHeight = 0.85;
  const signGeo = new THREE.PlaneGeometry(signWidth, signHeight);
  const signTexture = TextureGenerator.createSignboard(
    resident.hindiName || resident.name,
    resident.customSignboard || `NO. ${resident.houseNumber} • ${resident.name}`,
    resident.isFounder ? '#831843' : '#1e3a8a',
    '#fef08a',
    '#f59e0b'
  );
  const signMat = new THREE.MeshStandardMaterial({
    map: signTexture,
    roughness: 0.35,
  });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(0, 3.4, 2.85);
  haveli.add(signMesh);

  // 9. Hanging Lanterns (Diwali / Night ambiance)
  [-1.6, 1.6].forEach((lx) => {
    const lanternGroup = new THREE.Group();
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.6),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    cord.position.set(0, 0.3, 0);
    const lamp = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      })
    );
    lanternGroup.add(cord, lamp);
    lanternGroup.position.set(lx, 3.3, 2.9);
    haveli.add(lanternGroup);
  });

  // 10. Ground Contact Shadow
  const groundShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.set(0, 0.01, 0);
  haveli.add(groundShadow);

  // Interactive userData
  haveli.userData = {
    isInteractive: true,
    type: 'resident',
    resident: resident,
  };

  return haveli;
}

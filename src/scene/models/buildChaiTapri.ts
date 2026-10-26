import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';
import { Resident } from '../../types/city.ts';

/**
 * Builds the Sharma Ji / Nagri Chai Tapri (Street Chai Stall).
 * Features rustic open shelter, brass samovar kettle on brick stove,
 * cutting chai glass stand, wooden benches, and overhead tin roof.
 */
export function buildChaiTapri(resident: Resident): THREE.Group {
  const tapri = new THREE.Group();
  tapri.name = `ChaiTapri_${resident.name}`;

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.85,
    metalness: 0.05,
  });

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.9,
  });

  const tinRoofMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Indian blue tin sheet
    roughness: 0.45,
    metalness: 0.4,
  });

  const brassKettleMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.85,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
  });

  const stoveFireMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xf97316,
    emissiveIntensity: 1.0,
  });

  // 1. Brick Raised Floor Platform
  const floorGeo = new THREE.BoxGeometry(4.2, 0.3, 3.6);
  const floor = new THREE.Mesh(floorGeo, brickMat);
  floor.position.set(0, 0.15, 0);
  floor.castShadow = true;
  floor.receiveShadow = true;
  tapri.add(floor);

  // 2. Corner Wooden Pillars (4 poles)
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.09, 2.8, 8);
  const poleOffsets = [
    [-1.9, 1.4, -1.6],
    [1.9, 1.4, -1.6],
    [-1.9, 1.3, 1.6],
    [1.9, 1.3, 1.6],
  ];
  poleOffsets.forEach(([px, py, pz]) => {
    const pole = new THREE.Mesh(poleGeo, woodMat);
    pole.position.set(px, py, pz);
    pole.castShadow = true;
    tapri.add(pole);
  });

  // 3. Corrugated Blue Tin Slanted Roof
  const roofGeo = new THREE.BoxGeometry(4.6, 0.1, 4.0);
  const roof = new THREE.Mesh(roofGeo, tinRoofMat);
  roof.rotation.x = 0.15;
  roof.position.set(0, 2.75, 0);
  roof.castShadow = true;
  tapri.add(roof);

  // 4. Back Counter & Wall
  const backWallGeo = new THREE.BoxGeometry(3.8, 1.8, 0.15);
  const backWall = new THREE.Mesh(backWallGeo, woodMat);
  backWall.position.set(0, 1.2, -1.5);
  tapri.add(backWall);

  // 5. Main Wooden Service Counter
  const counterGeo = new THREE.BoxGeometry(2.4, 0.85, 0.8);
  const counter = new THREE.Mesh(counterGeo, woodMat);
  counter.position.set(-0.6, 0.65, 0.2);
  counter.castShadow = true;
  tapri.add(counter);

  // 6. Brick Chai Stove with Boiling Brass Samovar / Kettle
  const stoveGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.5, 12);
  const stove = new THREE.Mesh(stoveGeo, brickMat);
  stove.position.set(-0.7, 1.15, 0.2);
  tapri.add(stove);

  // Stove glowing coal opening
  const fireGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const fire = new THREE.Mesh(fireGeo, stoveFireMat);
  fire.position.set(-0.7, 1.0, 0.45);
  tapri.add(fire);

  // Brass Chai Kettle
  const kettleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.45, 12), brassKettleMat);
  kettleBody.position.set(-0.7, 1.55, 0.2);
  const kettleLid = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.15, 12), brassKettleMat);
  kettleLid.position.set(-0.7, 1.85, 0.2);
  const kettleSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.25, 8), brassKettleMat);
  kettleSpout.rotation.z = -0.5;
  kettleSpout.position.set(-0.48, 1.62, 0.2);
  tapri.add(kettleBody, kettleLid, kettleSpout);

  // 7. Wire Cutting Chai Glass Stand with 4 small glasses
  const standFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.05, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
  );
  standFrame.position.set(0.15, 1.1, 0.2);
  tapri.add(standFrame);

  [-0.08, 0.08].forEach((gx) => {
    [-0.08, 0.08].forEach((gz) => {
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.12, 8), glassMat);
      glass.position.set(0.15 + gx, 1.18, 0.2 + gz);
      tapri.add(glass);
    });
  });

  // 8. Wooden Bench for Customers
  const benchGeo = new THREE.BoxGeometry(1.6, 0.4, 0.5);
  const bench = new THREE.Mesh(benchGeo, woodMat);
  bench.position.set(1.2, 0.4, 0.6);
  bench.castShadow = true;
  tapri.add(bench);

  // 9. Signboard
  const signGeo = new THREE.PlaneGeometry(3.0, 0.7);
  const signTexture = TextureGenerator.createSignboard(
    resident.hindiName || 'शर्मा जी चाय स्टॉल',
    resident.customSignboard || 'SPECIAL KADAK MASALA CHAI',
    '#9a3412',
    '#fef08a',
    '#ea580c'
  );
  const signMat = new THREE.MeshStandardMaterial({
    map: signTexture,
    roughness: 0.4,
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 2.3, 1.62);
  tapri.add(sign);

  // 10. Ground Contact Shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 4.8),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  tapri.add(shadow);

  // Interactive userData
  tapri.userData = {
    isInteractive: true,
    type: 'resident',
    resident: resident,
    action: 'chai',
  };

  return tapri;
}

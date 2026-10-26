import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';
import { Resident } from '../../types/city.ts';

/**
 * Builds contemporary Indian Mohalla House / Villa.
 * Features terracotta/pastel facade, cantilevered balcony with steel/glass railing,
 * warm wooden door, and custom resident nameplate.
 */
export function buildModernVilla(resident: Resident): THREE.Group {
  const villa = new THREE.Group();
  villa.name = `Villa_${resident.name}`;

  const mainColor = new THREE.Color(resident.colorTheme || '#0284c7');
  const wallMat = new THREE.MeshStandardMaterial({
    color: mainColor,
    roughness: 0.5,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.5,
    roughness: 0.1,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.8,
  });

  // 1. Ground Level
  const groundGeo = new THREE.BoxGeometry(4.8, 3.0, 4.6);
  const ground = new THREE.Mesh(groundGeo, wallMat);
  ground.position.set(0, 1.5, 0);
  ground.castShadow = true;
  ground.receiveShadow = true;
  villa.add(ground);

  // Front Entry Door
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.2), woodMat);
  door.position.set(-1.0, 1.1, 2.32);
  villa.add(door);

  // Ground Floor Large Picture Window
  const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 0.1), glassMat);
  windowFrame.position.set(1.0, 1.4, 2.32);
  villa.add(windowFrame);

  // 2. First Floor with Cantilevered Balcony
  const firstFloorGeo = new THREE.BoxGeometry(4.6, 2.6, 4.4);
  const firstFloor = new THREE.Mesh(firstFloorGeo, accentMat);
  firstFloor.position.set(0, 4.3, 0);
  firstFloor.castShadow = true;
  villa.add(firstFloor);

  // Balcony Projection
  const balconySlab = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.2, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
  );
  balconySlab.position.set(0, 3.1, 2.8);
  balconySlab.castShadow = true;
  villa.add(balconySlab);

  // Balcony Glass Railing
  const balconyRailing = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.8, 0.08),
    glassMat
  );
  balconyRailing.position.set(0, 3.6, 3.35);
  villa.add(balconyRailing);

  // Sliding glass door to balcony
  const balconyDoor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 0.1), glassMat);
  balconyDoor.position.set(0, 4.2, 2.22);
  villa.add(balconyDoor);

  // 3. Rooftop Parapet
  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.5, 4.6),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
  );
  parapet.position.set(0, 5.85, 0);
  villa.add(parapet);

  // 4. Custom Resident Signboard / Nameplate
  const signGeo = new THREE.PlaneGeometry(2.2, 0.65);
  const signTexture = TextureGenerator.createSignboard(
    resident.hindiName || resident.name,
    resident.customSignboard || `${resident.name} • NO. ${resident.houseNumber}`,
    '#0f172a',
    '#38bdf8',
    '#f59e0b'
  );
  const signMat = new THREE.MeshStandardMaterial({
    map: signTexture,
    roughness: 0.3,
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(1.1, 2.4, 2.33);
  villa.add(sign);

  // 5. Contact Shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 6.4),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  villa.add(shadow);

  villa.userData = {
    isInteractive: true,
    type: 'resident',
    resident: resident,
  };

  return villa;
}

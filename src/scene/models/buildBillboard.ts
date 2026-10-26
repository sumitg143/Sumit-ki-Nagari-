import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';

/**
 * Builds the Grand Roadside Billboard (Bollywood / Nagri Hoarding).
 * Features steel lattice truss frame, illuminated billboard face,
 * and spotlights on top.
 */
export function buildBillboard(): THREE.Group {
  const billboard = new THREE.Group();
  billboard.name = 'NagriBillboard';

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.8,
    roughness: 0.3,
  });

  const spotlightMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.8,
  });

  // 1. Two Steel Pillars
  [-2.2, 2.2].forEach((px) => {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 5.0, 12),
      steelMat
    );
    pole.position.set(px, 2.5, 0);
    pole.castShadow = true;
    billboard.add(pole);

    // Concrete Footing
    const footing = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
    );
    footing.position.set(px, 0.2, 0);
    billboard.add(footing);
  });

  // Cross truss bracing
  const trussBar = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.1, 0.1), steelMat);
  trussBar.position.set(0, 3.2, 0);
  billboard.add(trussBar);

  // 2. Large Billboard Board
  const boardGeo = new THREE.BoxGeometry(6.4, 3.6, 0.2);
  const boardFrontMat = new THREE.MeshStandardMaterial({
    map: TextureGenerator.createNagriBillboard(),
    roughness: 0.25,
  });
  const boardMesh = new THREE.Mesh(boardGeo, boardFrontMat);
  boardMesh.position.set(0, 5.8, 0);
  boardMesh.castShadow = true;
  billboard.add(boardMesh);

  // 3. Overhead Spotlights (3 lights)
  [-2.0, 0, 2.0].forEach((sx) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), steelMat);
    arm.rotation.x = -0.5;
    arm.position.set(sx, 7.8, 0.3);

    const lamp = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.3, 12), spotlightMat);
    lamp.rotation.x = 2.0;
    lamp.position.set(sx, 7.5, 0.6);

    billboard.add(arm, lamp);
  });

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(7.0, 2.4),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  billboard.add(shadow);

  billboard.userData = {
    isInteractive: true,
    type: 'billboard',
    title: 'Apni Nagri Central Billboard (अपनी नगरी होर्डिंग)',
    titleHindi: 'नगर मुख्य स्वागत होर्डिंग',
    description: 'Welcome to Sumit Ki Nagri! The digital 3D community town where everyone has a home.',
    descriptionHindi: 'सुमित की नगरी में आपका स्वागत है! यहाँ हर आगंतुक का अपना घर है।',
  };

  return billboard;
}

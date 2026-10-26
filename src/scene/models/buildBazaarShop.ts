import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';
import { Resident } from '../../types/city.ts';

/**
 * Builds an authentic Indian Bazaar Shop / Storefront.
 * Features roll-up shutter, striped awning, display counter, crates,
 * overhead painted signboard, and hanging marigold garland.
 */
export function buildBazaarShop(resident: Resident): THREE.Group {
  const shop = new THREE.Group();
  shop.name = `Shop_${resident.name}`;

  // Theme colors
  const mainWallColor = new THREE.Color(resident.colorTheme || '#0284c7');
  const wallMat = new THREE.MeshStandardMaterial({
    color: mainWallColor,
    roughness: 0.6,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
  });

  const shutterMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.35,
    metalness: 0.5,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.8,
  });

  const awningMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.7,
  });

  // 1. Shop Building Body
  const bodyGeo = new THREE.BoxGeometry(4.4, 3.4, 4.4);
  const body = new THREE.Mesh(bodyGeo, wallMat);
  body.position.set(0, 1.7, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  shop.add(body);

  // 2. Roll-up Corrugated Shutter (half open)
  const shutterGeo = new THREE.BoxGeometry(2.8, 1.2, 0.1);
  const shutter = new THREE.Mesh(shutterGeo, shutterMat);
  shutter.position.set(0, 2.5, 2.22);
  shop.add(shutter);

  // Shop Interior Opening / Counter cavity
  const openingGeo = new THREE.BoxGeometry(2.8, 1.6, 0.3);
  const opening = new THREE.Mesh(
    openingGeo,
    new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 })
  );
  opening.position.set(0, 1.0, 2.15);
  shop.add(opening);

  // 3. Wooden Display Counter
  const counterGeo = new THREE.BoxGeometry(2.6, 0.9, 0.7);
  const counter = new THREE.Mesh(counterGeo, woodMat);
  counter.position.set(0, 0.45, 2.45);
  counter.castShadow = true;
  shop.add(counter);

  // Crates / Sweet trays on counter
  [-0.8, 0, 0.8].forEach((cx, idx) => {
    const crateMat = new THREE.MeshStandardMaterial({
      color: idx === 0 ? 0xf59e0b : idx === 1 ? 0xef4444 : 0x10b981,
      roughness: 0.5,
    });
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.5), crateMat);
    crate.position.set(cx, 1.05, 2.45);
    shop.add(crate);
  });

  // 4. Striped Slanted Awning (Chhajja)
  const awningGeo = new THREE.BoxGeometry(3.6, 0.15, 1.4);
  const awning = new THREE.Mesh(awningGeo, awningMat);
  awning.rotation.x = 0.25;
  awning.position.set(0, 2.65, 2.8);
  awning.castShadow = true;
  shop.add(awning);

  // 5. Overhead Painted Signboard
  const signGeo = new THREE.PlaneGeometry(3.4, 0.75);
  const signTexture = TextureGenerator.createSignboard(
    resident.hindiName || resident.name,
    resident.customSignboard || resident.role,
    '#991b1b',
    '#fef08a',
    '#facc15'
  );
  const signMat = new THREE.MeshStandardMaterial({
    map: signTexture,
    roughness: 0.4,
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 3.25, 2.24);
  shop.add(sign);

  // 6. Rooftop Parapet with Decorative Merlons
  const parapetGeo = new THREE.BoxGeometry(4.6, 0.4, 4.6);
  const parapet = new THREE.Mesh(parapetGeo, trimMat);
  parapet.position.set(0, 3.5, 0);
  shop.add(parapet);

  // 7. Hanging Bulb / Lantern
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.7,
    })
  );
  bulb.position.set(0, 2.3, 2.4);
  shop.add(bulb);

  // 8. Ground Contact Shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(5.8, 5.8),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  shop.add(shadow);

  // Interactive userData
  shop.userData = {
    isInteractive: true,
    type: 'resident',
    resident: resident,
  };

  return shop;
}

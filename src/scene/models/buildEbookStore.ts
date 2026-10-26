import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';

/**
 * Builds Somo eBooks Store (सोमो ई-बुक स्टोर & लाइब्रेरी)
 * Dedicated bookstore & reading lounge in Sumit Ki Nagri.
 * Features book display windows, rooftop open-book sculpt,
 * warm interior lantern glow, and grand painted signboard.
 */
export function buildEbookStore(): THREE.Group {
  const store = new THREE.Group();
  store.name = 'SomoEbookStore';

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x831843, // Rich royal burgundy/wine heritage color
    roughness: 0.6,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a, // Warm cream/gold accents
    roughness: 0.35,
    metalness: 0.2,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.8,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
  });

  const bookGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.8,
    roughness: 0.2,
  });

  // 1. Plinth / Foundation
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.4, 5.6),
    trimMat
  );
  plinth.position.set(0, 0.2, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  store.add(plinth);

  // 2. Main Building Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(6.0, 3.8, 5.0),
    wallMat
  );
  body.position.set(0, 2.1, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  store.add(body);

  // 3. Dual Book Display Windows on Front Facade
  [-1.6, 1.6].forEach((wx) => {
    // Window Frame
    const winFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 2.0, 0.2),
      trimMat
    );
    winFrame.position.set(wx, 1.8, 2.52);
    store.add(winFrame);

    // Glass
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.8),
      glassMat
    );
    glass.position.set(wx, 1.8, 2.63);
    store.add(glass);

    // Stacked Books inside display
    [-0.4, 0, 0.4].forEach((bx, idx) => {
      const bookColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];
      const bookMat = new THREE.MeshStandardMaterial({
        color: bookColors[idx % bookColors.length],
        roughness: 0.5,
      });
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.4), bookMat);
      book.position.set(wx + bx, 1.3, 2.3);
      store.add(book);
    });
  });

  // 4. Center Wooden Entrance Door with Arch
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.15), woodMat);
  door.position.set(0, 1.4, 2.52);
  store.add(door);

  // 5. Overhead Grand Signboard
  const signGeo = new THREE.PlaneGeometry(4.8, 0.95);
  const signTexture = TextureGenerator.createSignboard(
    'सोमो ई-बुक स्टोर • SOMO eBOOKS',
    'READ LOVE & ROMANTIC STORIES • BY SUMIT',
    '#581c87', // Deep purple
    '#fef08a',
    '#f43f5e'
  );
  const signMat = new THREE.MeshStandardMaterial({
    map: signTexture,
    roughness: 0.35,
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 3.45, 2.54);
  store.add(sign);

  // 6. Rooftop Parapet and Open-Book Sculpture
  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 0.4, 5.2),
    trimMat
  );
  parapet.position.set(0, 4.2, 0);
  store.add(parapet);

  // Sculpted Golden Open-Book on roof pediment
  const bookPediment = new THREE.Group();
  const basePedestal = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.8), trimMat);
  basePedestal.position.set(0, 0.2, 0);

  // Left page wing
  const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.9), bookGoldMat);
  leftPage.position.set(-0.32, 0.55, 0);
  leftPage.rotation.z = -0.3;

  // Right page wing
  const rightPage = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.9), bookGoldMat);
  rightPage.position.set(0.32, 0.55, 0);
  rightPage.rotation.z = 0.3;

  bookPediment.add(basePedestal, leftPage, rightPage);
  bookPediment.position.set(0, 4.4, 2.1);
  store.add(bookPediment);

  // 7. Warm glowing reader lantern
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.85,
    })
  );
  lamp.position.set(0, 2.8, 2.7);
  store.add(lamp);

  // 8. Contact Shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(8.0, 7.0),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  store.add(shadow);

  // Interactive userData
  store.userData = {
    isInteractive: true,
    type: 'ebook_store',
    title: 'Somo eBooks Store (सोमो ई-बुक स्टोर)',
    titleHindi: 'सोमो ई-बुक स्टोर • पुस्तकें & कहानियाँ',
    description: 'Explore romantic, love, sadness and heartwarming eBooks curated by Sumit Gupta. Read online with audio support!',
    descriptionHindi: 'सुमित गुप्ता द्वारा संकलित रोमांटिक, लव और सैडनेस ई-बुक्स का खज़ाना। ऑनलाइन पढ़ें और सुनें!',
    action: 'open_ebook_store',
  };

  return store;
}

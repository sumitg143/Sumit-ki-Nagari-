import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';

/**
 * Builds Shanti Mandir (Ancient Indian Temple) & Stepwell Ghat.
 * Features carved sandstone shikhar spire, mandapa hall, stepped ghat,
 * kalash pinnacle, saffron fluttering flag, and ringing brass bell.
 */
export function buildTemple(): THREE.Group {
  const temple = new THREE.Group();
  temple.name = 'ShantiMandir';

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Rich sandstone
    roughness: 0.7,
    metalness: 0.05,
  });

  const baseStepMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.8,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.85,
  });

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.75,
  });

  const flagMat = new THREE.MeshStandardMaterial({
    color: 0xf97316, // Saffron flag
    side: THREE.DoubleSide,
    roughness: 0.7,
  });

  // 1. Raised Mandir Plinth (Adhishthana)
  const plinthGeo = new THREE.BoxGeometry(7.2, 0.8, 7.2);
  const plinth = new THREE.Mesh(plinthGeo, baseStepMat);
  plinth.position.set(0, 0.4, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  temple.add(plinth);

  // Rangoli Mandala on entrance platform
  const rangoliPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshStandardMaterial({
      map: TextureGenerator.createRangoliTexture(),
      transparent: true,
      roughness: 0.5,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  );
  rangoliPlane.rotation.x = -Math.PI / 2;
  rangoliPlane.position.set(0, 0.82, 4.2);
  temple.add(rangoliPlane);

  // 2. Sanctum Body (Garbhagriha - Rear Cube)
  const sanctumGeo = new THREE.BoxGeometry(4.2, 3.8, 4.2);
  const sanctum = new THREE.Mesh(sanctumGeo, stoneMat);
  sanctum.position.set(0, 2.7, -1.2);
  sanctum.castShadow = true;
  temple.add(sanctum);

  // 3. Soaring Shikhar (Spire)
  const shikharLevels = [
    { radius: 2.1, height: 1.4, y: 5.3 },
    { radius: 1.7, height: 1.4, y: 6.7 },
    { radius: 1.3, height: 1.4, y: 8.1 },
    { radius: 0.8, height: 1.2, y: 9.4 },
    { radius: 0.4, height: 1.0, y: 10.5 },
  ];

  shikharLevels.forEach((lvl) => {
    const geo = new THREE.CylinderGeometry(lvl.radius * 0.75, lvl.radius, lvl.height, 8);
    const mesh = new THREE.Mesh(geo, stoneMat);
    mesh.position.set(0, lvl.y, -1.2);
    mesh.castShadow = true;
    temple.add(mesh);
  });

  // Kalash Finial (Golden vase and coconut finial on peak)
  const amalaka = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 8, 16), stoneMat);
  amalaka.rotation.x = Math.PI / 2;
  amalaka.position.set(0, 11.2, -1.2);

  const kalash = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), goldMat);
  kalash.position.set(0, 11.7, -1.2);

  const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 8), goldMat);
  pinnacle.position.set(0, 12.2, -1.2);

  temple.add(amalaka, kalash, pinnacle);

  // Fluttering Saffron Flag on Temple Spire
  const flagStaff = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), goldMat);
  flagStaff.position.set(0.35, 12.6, -1.2);

  const flagShape = new THREE.BufferGeometry();
  // Triangular dhwaja (saffron flag)
  const flagVertices = new Float32Array([
    0, 0, 0,
    1.4, 0.4, 0,
    0, 0.8, 0,
  ]);
  flagShape.setAttribute('position', new THREE.BufferAttribute(flagVertices, 3));
  flagShape.computeVertexNormals();
  const flag = new THREE.Mesh(flagShape, flagMat);
  flag.position.set(0.35, 12.4, -1.2);
  temple.add(flagStaff, flag);

  // 4. Front Pillared Mandapa Hall (Open pavilion)
  const pillarOffsets = [
    [-1.6, 2.0, 1.6],
    [1.6, 2.0, 1.6],
    [-1.6, 2.0, 3.2],
    [1.6, 2.0, 3.2],
  ];
  pillarOffsets.forEach(([px, py, pz]) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 2.4, 10), stoneMat);
    col.position.set(px, py, pz);
    col.castShadow = true;
    temple.add(col);
  });

  // Mandapa pyramid roof
  const mandapaRoof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.4, 4), stoneMat);
  mandapaRoof.rotation.y = Math.PI / 4;
  mandapaRoof.position.set(0, 3.8, 2.4);
  mandapaRoof.castShadow = true;
  temple.add(mandapaRoof);

  // Brass Temple Bell hanging under mandapa
  const bellGroup = new THREE.Group();
  const bellChain = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.8),
    new THREE.MeshBasicMaterial({ color: 0x334155 })
  );
  bellChain.position.set(0, 0.4, 0);
  const bellBody = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.35, 12, 1, true), goldMat);
  bellBody.position.set(0, 0, 0);
  const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.06), goldMat);
  clapper.position.set(0, -0.1, 0);
  bellGroup.add(bellChain, bellBody, clapper);
  bellGroup.position.set(0, 2.8, 2.4);
  temple.add(bellGroup);

  // 5. Stepped Water Pond / Baoli Ghat (Side)
  const ghatGroup = new THREE.Group();
  const pondBorder = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.4, 4.4), baseStepMat);
  pondBorder.position.set(4.6, 0.2, 0);
  const waterPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.6), waterMat);
  waterPlane.rotation.x = -Math.PI / 2;
  waterPlane.position.set(4.6, 0.22, 0);
  ghatGroup.add(pondBorder, waterPlane);

  // Floating Diyas on water
  [
    [3.8, -0.6],
    [4.6, 0.8],
    [5.4, -0.4],
  ].forEach(([dx, dz]) => {
    const diya = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.08, 0.06, 8),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 })
    );
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.06),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    flame.position.set(0, 0.06, 0);
    const diyaGroup = new THREE.Group();
    diyaGroup.add(diya, flame);
    diyaGroup.position.set(dx, 0.26, dz);
    ghatGroup.add(diyaGroup);
  });
  // 6. Live Animated Devotees & Pandit Ji Performing Aarti
  const devoteeGroup = new THREE.Group();

  // Pandit Ji (Priest in saffron dhoti waving aarti thali with burning flame)
  const pandit = new THREE.Group();
  const panditBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.75, 8),
    new THREE.MeshStandardMaterial({ color: 0xf97316 }) // Saffron
  );
  panditBody.position.set(0, 0.8, 0);
  const panditHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
  );
  panditHead.position.set(0, 1.35, 0);

  // Aarti Thali with burning flame
  const aartiThaliGroup = new THREE.Group();
  const thali = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.04, 12),
    goldMat
  );
  const aartiFlame = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  aartiFlame.position.set(0, 0.08, 0);
  aartiThaliGroup.add(thali, aartiFlame);
  aartiThaliGroup.position.set(0, 0.9, 0.35);

  pandit.add(panditBody, panditHead, aartiThaliGroup);
  pandit.position.set(0, 0.8, 0.8);
  devoteeGroup.add(pandit);

  // 2 Devotees with folded hands (namaste)
  const devotees: THREE.Group[] = [];
  [-0.9, 0.9].forEach((dx, i) => {
    const devotee = new THREE.Group();
    const dBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.2, 0.72, 8),
      new THREE.MeshStandardMaterial({ color: i === 0 ? 0xef4444 : 0x0284c7 })
    );
    dBody.position.set(0, 0.8, 0);
    const dHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    dHead.position.set(0, 1.3, 0);
    // Folded hands
    const hands = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.16, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    hands.position.set(0, 0.9, 0.2);
    devotee.add(dBody, dHead, hands);
    devotee.position.set(dx, 0.8, 2.6);
    devoteeGroup.add(devotee);
    devotees.push(devotee);
  });

  temple.add(devoteeGroup);

  // Interactive userData & tick loop
  temple.userData = {
    isInteractive: true,
    type: 'temple',
    title: 'Shanti Mandir & Stepwell Ghat (शांति मंदिर)',
    titleHindi: 'शांति मंदिर, आरती एवं पावन बावड़ी घाट',
    description: 'Ancient sandstone temple with soaring shikhar, floating diyas, and sacred ghat. Watch live aarti and ring the temple bell!',
    descriptionHindi: 'प्राचीन नक्काशीदार शांति मंदिर। पंडित जी द्वारा लाइव आरती, पवित्र घंटी बजाने एवं पूजा अर्चना के लिए क्लिक करें!',
    action: 'temple_aarti',
    onTick: (delta: number, elapsed: number) => {
      // Circular waving motion of aarti thali
      aartiThaliGroup.position.x = Math.sin(elapsed * 3) * 0.18;
      aartiThaliGroup.position.y = 0.9 + Math.cos(elapsed * 3) * 0.12;

      // Devotees gently bowing in prayer
      devotees.forEach((d, i) => {
        d.rotation.x = Math.sin(elapsed * 2 + i) * 0.08;
      });
    },
  };

  return temple;
}

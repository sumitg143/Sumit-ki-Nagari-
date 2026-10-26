import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';

/**
 * Procedural 3D Models for Sumit Ki Nagri Civic & Lifestyle Establishments:
 * 1. सुमित मल्टीस्पेशलिटी हॉस्पिटल (Sumit Hospital & Trauma Care)
 * 2. सुमित फिटनेस एवं पावर जिम (Sumit Fitness & Power Gym)
 * 3. सुमित इंटरनेशनल स्कूल (Sumit International School)
 * 4. सुमित ग्रैंड हेरिटेज होटल एवं रिसॉर्ट (Sumit Grand Hotel)
 * 5. सुमित 24x7 मेडिकल स्टोर एवं फार्मेसी (Sumit Medical Store)
 */

// ============================================================================
// 1. SUMIT MULTISPECIALITY HOSPITAL (सुमित मल्टीस्पेशलिटी हॉस्पिटल)
// ============================================================================
export function buildSumitHospital(): THREE.Group {
  const hospital = new THREE.Group();
  hospital.name = 'SumitHospital';
  hospital.userData = {
    isInteractive: true,
    type: 'hospital',
    title: 'Sumit Multispeciality Hospital (सुमित हॉस्पिटल)',
    titleHindi: 'सुमित मल्टीस्पेशलिटी हॉस्पिटल एवं ट्रॉमा सेंटर',
    description: 'Premier 24x7 multi-speciality hospital with emergency trauma center, ICU, ambulance fleet, and expert doctors.',
    descriptionHindi: 'संस्थापक सुमित गुप्ता द्वारा निर्मित 24x7 आधुनिक अस्पताल। आईसीयू, इमरजेंसी वार्ड और निःशुल्क ओपीडी सेवा।',
    action: 'hospital',
  };

  const whiteWallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
  });

  const tealAccentMat = new THREE.MeshStandardMaterial({
    color: 0x0d9488,
    roughness: 0.35,
  });

  const redCrossMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.2,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.3,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
  });

  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.8,
  });

  // Base Plinth & Ambulance Bay
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.4, 8.5), concreteMat);
  plinth.position.set(0, 0.2, 0);
  plinth.receiveShadow = true;
  hospital.add(plinth);

  // Main 3-Story Hospital Tower
  const mainTower = new THREE.Mesh(new THREE.BoxGeometry(9.0, 5.2, 7.0), whiteWallMat);
  mainTower.position.set(0, 2.9, -0.2);
  mainTower.castShadow = true;
  mainTower.receiveShadow = true;
  hospital.add(mainTower);

  // Upper Floor Setback (Operation Theatres / ICU)
  const topWing = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.4, 5.2), tealAccentMat);
  topWing.position.set(0, 6.7, -0.4);
  topWing.castShadow = true;
  topWing.receiveShadow = true;
  hospital.add(topWing);

  // Modern Strip Windows on Main Tower
  [-1.8, 0, 1.8].forEach((wy) => {
    const windowStrip = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.65, 0.1), glassMat);
    windowStrip.position.set(0, 2.9 + wy, 3.32);
    hospital.add(windowStrip);
  });

  // Glass Front Entrance / Emergency Ward
  const entrance = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 1.2), glassMat);
  entrance.position.set(0, 1.3, 3.8);
  entrance.castShadow = true;
  hospital.add(entrance);

  // Red Cross 3D Sculpture on Top Wing Front Facade
  const create3DCross = () => {
    const crossGroup = new THREE.Group();
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.5, 0.2), redCrossMat);
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.2), redCrossMat);
    vBar.castShadow = true;
    hBar.castShadow = true;
    crossGroup.add(vBar, hBar);
    return crossGroup;
  };

  const facadeCross = create3DCross();
  facadeCross.position.set(0, 6.7, 2.3);
  hospital.add(facadeCross);

  // Rooftop Cross with gentle glow beacon
  const roofCross = create3DCross();
  roofCross.position.set(0, 8.4, -0.4);
  roofCross.scale.set(0.8, 0.8, 0.8);
  hospital.add(roofCross);

  // Signboard: "सुमित मल्टीस्पेशलिटी हॉस्पिटल" / "SUMIT HOSPITAL"
  const signTex = TextureGenerator.createSignboard(
    'सुमित हॉस्पिटल',
    'SUMIT MULTISPECIALITY HOSPITAL',
    '#ffffff',
    '#b91c1c',
    '#0d9488'
  );
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.4),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.3 })
  );
  signMesh.position.set(0, 4.8, 3.32);
  hospital.add(signMesh);

  // 3D Ambulance Vehicle parked at Emergency Bay
  const ambulance = new THREE.Group();
  ambulance.position.set(-3.2, 0.4, 4.4);

  const ambBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.3, 3.2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  );
  ambBody.position.y = 0.75;
  ambBody.castShadow = true;
  ambulance.add(ambBody);

  // Red Stripe on Ambulance
  const ambStripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.82, 0.25, 3.22),
    new THREE.MeshStandardMaterial({ color: 0xef4444 })
  );
  ambStripe.position.y = 0.75;
  ambulance.add(ambStripe);

  // Emergency Siren Lights (Red & Blue)
  const sirenRed = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.2, 0.35),
    new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.8 })
  );
  sirenRed.position.set(-0.35, 1.5, 0.5);

  const sirenBlue = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.2, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.8 })
  );
  sirenBlue.position.set(0.35, 1.5, 0.5);
  ambulance.add(sirenRed, sirenBlue);

  // Wheels
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 10);
  [
    [-0.95, 0.3, 0.9],
    [0.95, 0.3, 0.9],
    [-0.95, 0.3, -0.9],
    [0.95, 0.3, -0.9],
  ].forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, wy, wz);
    ambulance.add(wheel);
  });

  hospital.add(ambulance);

  // ============================================================================
  // ANIMATED PEOPLE ENTERING HOSPITAL: Doctor, Nurse & Patient on Stretcher
  // ============================================================================
  const hospitalActorsGroup = new THREE.Group();
  hospitalActorsGroup.name = 'HospitalActors';

  // Actor 1: Dr. Sharma (Doctor in white coat & cyan stethoscope walking in)
  const doctor = new THREE.Group();
  doctor.position.set(0.6, 0.2, 5.8);

  const docTorso = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.7, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }) // White doctor coat
  );
  docTorso.position.y = 0.95;

  const docHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xaf7a48, roughness: 0.8 })
  );
  docHead.position.y = 1.45;

  // Stethoscope around neck
  const steth = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.03, 6, 10, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 })
  );
  steth.rotation.x = Math.PI / 2;
  steth.position.set(0, 1.35, 0.1);

  // Doctor Legs
  const docLeftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.6, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x1e293b })
  );
  docLeftLeg.position.set(-0.14, 0.35, 0);

  const docRightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.6, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x1e293b })
  );
  docRightLeg.position.set(0.14, 0.35, 0);

  doctor.add(docTorso, docHead, steth, docLeftLeg, docRightLeg);
  hospitalActorsGroup.add(doctor);

  // Actor 2: Mobile Wheeled Stretcher with Patient & Nurse Pushing
  const stretcherGroup = new THREE.Group();
  stretcherGroup.position.set(-1.2, 0.2, 6.4);

  // Stretcher Frame & 4 Wheels
  const stretchBed = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.12, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 })
  );
  stretchBed.position.y = 0.65;

  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 0.1, 1.7),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
  );
  mattress.position.y = 0.76;

  // Patient lying down
  const patientBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.2, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8 }) // Hospital light blue patient gown
  );
  patientBody.position.set(0, 0.9, 0.1);

  const patientHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xaf7a48 })
  );
  patientHead.position.set(0, 0.92, -0.6);

  stretcherGroup.add(stretchBed, mattress, patientBody, patientHead);

  // 4 Stretcher legs with rolling wheels
  [
    [-0.38, -0.65],
    [0.38, -0.65],
    [-0.38, 0.65],
    [0.38, 0.65],
  ].forEach(([wx, wz]) => {
    const sLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 })
    );
    sLeg.position.set(wx, 0.35, wz);
    stretcherGroup.add(sLeg);
  });

  // Nurse / Ward Boy in green scrubs pushing the stretcher from behind
  const nurse = new THREE.Group();
  nurse.position.set(0, 0, 1.2);

  const nurseTorso = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.68, 0.28),
    new THREE.MeshStandardMaterial({ color: 0x059669 }) // Green medical scrubs
  );
  nurseTorso.position.y = 0.95;

  const nurseHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xaf7a48 })
  );
  nurseHead.position.y = 1.42;

  const nurseLeftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.6, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x047857 })
  );
  nurseLeftLeg.position.set(-0.13, 0.35, 0);

  const nurseRightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.6, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x047857 })
  );
  nurseRightLeg.position.set(0.13, 0.35, 0);

  // Arms pushing stretcher
  const nurseArms = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.12, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x059669 })
  );
  nurseArms.position.set(0, 0.95, -0.3);

  nurse.add(nurseTorso, nurseHead, nurseLeftLeg, nurseRightLeg, nurseArms);
  stretcherGroup.add(nurse);

  hospitalActorsGroup.add(stretcherGroup);
  hospital.add(hospitalActorsGroup);

  // Animation callback for hospital actors
  let docZ = 6.2;
  let stretchZ = 6.8;
  hospital.userData.onTick = (delta: number, time: number) => {
    // 1. Doctor walking into hospital entrance
    docZ -= delta * 0.9;
    if (docZ < 3.8) {
      docZ = 6.4; // Loop back outside
    }
    doctor.position.z = docZ;
    const docSwing = Math.sin(time * 5) * 0.3;
    docLeftLeg.rotation.x = docSwing;
    docRightLeg.rotation.x = -docSwing;

    // 2. Stretcher & Nurse wheeling into trauma entrance
    stretchZ -= delta * 0.75;
    if (stretchZ < 4.0) {
      stretchZ = 7.0; // Loop back from ambulance
    }
    stretcherGroup.position.z = stretchZ;
    const nurseSwing = Math.sin(time * 4) * 0.25;
    nurseLeftLeg.rotation.x = nurseSwing;
    nurseRightLeg.rotation.x = -nurseSwing;
  };

  return hospital;
}

// ============================================================================
// 2. SUMIT FITNESS & POWER GYM (सुमित फिटनेस एवं पावर जिम)
// ============================================================================
export function buildSumitGym(): THREE.Group {
  const gym = new THREE.Group();
  gym.name = 'SumitGym';
  gym.userData = {
    isInteractive: true,
    type: 'gym',
    title: 'Sumit Fitness & Power Gym (सुमित जिम)',
    titleHindi: 'सुमित फिटनेस एवं पावर जिम • 24/7',
    description: 'Premier bodybuilding and strength training center with Olympic weights, CrossFit turf, cardio deck, and health bar.',
    descriptionHindi: 'संस्थापक सुमित गुप्ता का अत्याधुनिक जिम। कसरत करें, वजन उठाएँ और नगर के सबसे फिट नागरिक बनें!',
    action: 'gym',
  };

  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.4,
  });

  const amberAccentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.6,
  });

  const tintedGlassMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.5,
    roughness: 0.1,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.3,
    metalness: 0.85,
  });

  // Base Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.35, 7.5), darkSteelMat);
  plinth.position.set(0, 0.18, 0);
  gym.add(plinth);

  // Main Gym Hall
  const gymHall = new THREE.Mesh(new THREE.BoxGeometry(7.8, 4.4, 6.8), darkSteelMat);
  gymHall.position.set(0, 2.4, 0);
  gymHall.castShadow = true;
  gymHall.receiveShadow = true;
  gym.add(gymHall);

  // Huge Glass Facade Front
  const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 3.2), tintedGlassMat);
  frontGlass.position.set(0, 2.1, 3.42);
  gym.add(frontGlass);

  // Yellow High-Energy Border Frame around front
  const frameBorder = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 3.5, 0.2),
    amberAccentMat
  );
  frameBorder.position.set(0, 2.1, 3.35);
  gym.add(frameBorder);

  // Giant 3D Barbell / Dumbbell on Gym Rooftop
  const barbellGroup = new THREE.Group();
  barbellGroup.position.set(0, 5.2, 0);

  // Center Bar
  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 5.2, 12),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 })
  );
  bar.rotation.z = Math.PI / 2;
  barbellGroup.add(bar);

  // Weight Plates on both sides
  [-2.2, -1.9, 1.9, 2.2].forEach((px, i) => {
    const radius = i % 2 === 0 ? 0.9 : 0.75;
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.22, 18),
      ironMat
    );
    plate.rotation.z = Math.PI / 2;
    plate.position.set(px, 0, 0);
    plate.castShadow = true;
    barbellGroup.add(plate);
  });

  gym.add(barbellGroup);

  // Neon Signboard: "सुमित फिटनेस & जिम" / "SUMIT POWER GYM 24/7"
  const signTex = TextureGenerator.createSignboard(
    'सुमित जिम & फिटनेस',
    'SUMIT POWER GYM • 24X7',
    '#0f172a',
    '#f59e0b',
    '#ef4444'
  );
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.0, 1.3),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.2 })
  );
  signMesh.position.set(0, 4.0, 3.48);
  gym.add(signMesh);

  // Outdoor Tire Flip & Punching Bag
  const tire = new THREE.Mesh(
    new THREE.TorusGeometry(0.65, 0.3, 10, 16),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.95 })
  );
  tire.rotation.x = Math.PI / 2;
  tire.position.set(2.8, 0.3, 4.4);
  gym.add(tire);

  // ============================================================================
  // ANIMATED GYM ATHLETES: Dumbbell Lifter & Bench Press Athlete
  // ============================================================================
  const gymAthletes = new THREE.Group();
  gymAthletes.name = 'GymAthletes';

  // Athlete 1: Muscular Lifter doing Bicep Curls in front pavilion
  const curler = new THREE.Group();
  curler.position.set(-1.8, 0.2, 4.2);

  // Muscular Torso in bright athletic tank top
  const curlerTorso = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.72, 0.32),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }) // Gold gym tank
  );
  curlerTorso.position.y = 0.96;

  const curlerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xaf7a48 })
  );
  curlerHead.position.y = 1.48;

  // Legs in dark gym shorts
  const curlerLeftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.6, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x0f172a })
  );
  curlerLeftLeg.position.set(-0.16, 0.35, 0);

  const curlerRightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.6, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x0f172a })
  );
  curlerRightLeg.position.set(0.16, 0.35, 0);

  // Left & Right Arms holding heavy dumbbells
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.36, 1.25, 0);
  const leftForearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.55, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xaf7a48 })
  );
  leftForearm.position.y = -0.25;

  // Left Dumbbell
  const leftDb = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8 })
  );
  leftDb.rotation.x = Math.PI / 2;
  leftDb.position.set(0, -0.48, 0.1);
  leftArmGroup.add(leftForearm, leftDb);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.36, 1.25, 0);
  const rightForearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.55, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xaf7a48 })
  );
  rightForearm.position.y = -0.25;

  // Right Dumbbell
  const rightDb = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8 })
  );
  rightDb.rotation.x = Math.PI / 2;
  rightDb.position.set(0, -0.48, 0.1);
  rightArmGroup.add(rightForearm, rightDb);

  curler.add(curlerTorso, curlerHead, curlerLeftLeg, curlerRightLeg, leftArmGroup, rightArmGroup);
  gymAthletes.add(curler);

  // Athlete 2: Bench Press Station with Athlete Pressing Barbell
  const benchStation = new THREE.Group();
  benchStation.position.set(0.8, 0.2, 4.2);

  // Padded Gym Bench
  const benchPad = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.12, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 }) // Red leather bench
  );
  benchPad.position.y = 0.45;

  // Bench support frame & upright barbell racks
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
  const benchLegs = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.4, 1.4), frameMat);
  benchLegs.position.y = 0.2;

  // Upright barbell holders
  [-0.38, 0.38].forEach((ux) => {
    const upright = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.08), frameMat);
    upright.position.set(ux, 0.6, -0.4);
    benchStation.add(upright);
  });
  benchStation.add(benchPad, benchLegs);

  // Lifter lying on bench
  const benchLifter = new THREE.Group();
  const lyingTorso = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.22, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x0284c7 }) // Blue athletic shirt
  );
  lyingTorso.position.set(0, 0.58, 0);

  const lyingHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xaf7a48 })
  );
  lyingHead.position.set(0, 0.62, -0.5);

  benchLifter.add(lyingTorso, lyingHead);
  benchStation.add(benchLifter);

  // Pressing Barbell
  const pressBarbell = new THREE.Group();
  const pressBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
  );
  pressBar.rotation.z = Math.PI / 2;

  // Weight plates
  [-0.6, 0.6].forEach((wx) => {
    const pl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.08, 12),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8 })
    );
    pl.rotation.z = Math.PI / 2;
    pl.position.set(wx, 0, 0);
    pressBarbell.add(pl);
  });
  pressBarbell.add(pressBar);
  pressBarbell.position.set(0, 0.9, -0.15);
  benchStation.add(pressBarbell);

  gymAthletes.add(benchStation);
  gym.add(gymAthletes);

  // Animation callback for gym lifters
  gym.userData.onTick = (delta: number, time: number) => {
    // 1. Dumbbell Curl: alternate or curl both arms up/down
    const curlAngle = 0.4 + Math.sin(time * 3.5) * 0.7; // 0.4 to 1.1 rad
    leftArmGroup.rotation.x = curlAngle;
    rightArmGroup.rotation.x = 0.4 + Math.cos(time * 3.5) * 0.7;

    // 2. Bench Press Barbell: moving up and down in heavy reps
    const pressY = 0.85 + Math.sin(time * 2.5) * 0.35; // 0.5 to 1.2
    pressBarbell.position.y = pressY;
  };

  return gym;
}

// ============================================================================
// 3. SUMIT INTERNATIONAL SCHOOL (सुमित इंटरनेशनल स्कूल)
// ============================================================================
export function buildSumitSchool(): THREE.Group {
  const school = new THREE.Group();
  school.name = 'SumitSchool';
  school.userData = {
    isInteractive: true,
    type: 'school',
    title: 'Sumit International School (सुमित स्कूल)',
    titleHindi: 'सुमित इंटरनेशनल स्कूल • विद्या मंदिर',
    description: 'Premier CBSE academy with smart labs, bell clock tower, playground, and yellow school bus fleet.',
    descriptionHindi: 'संस्थापक सुमित गुप्ता द्वारा स्थापित प्रतिष्ठित विद्यालय। विद्या, संस्कार और राष्ट्र निर्माण की पाठशाला।',
    action: 'school',
  };

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Heritage Terracotta / Red Brick
    roughness: 0.75,
  });

  const whiteTrimMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Navy roof
    roughness: 0.4,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Base Lawn & Foundation
  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(11.0, 0.3, 8.5),
    new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 })
  );
  foundation.position.set(0, 0.15, 0);
  foundation.receiveShadow = true;
  school.add(foundation);

  // Main School Building Wings
  const mainWing = new THREE.Mesh(new THREE.BoxGeometry(9.6, 3.8, 6.0), brickMat);
  mainWing.position.set(0, 2.05, -0.2);
  mainWing.castShadow = true;
  mainWing.receiveShadow = true;
  school.add(mainWing);

  // White Cornice Trim
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.35, 6.4), whiteTrimMat);
  cornice.position.set(0, 4.05, -0.2);
  school.add(cornice);

  // Central Clock & Bell Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 2.4), brickMat);
  tower.position.set(0, 5.65, 0.5);
  tower.castShadow = true;
  school.add(tower);

  // Clock Face
  const clockFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.6, 24),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  clockFace.position.set(0, 5.8, 1.72);
  school.add(clockFace);

  // Tower Pyramidal Roof
  const towerRoof = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 1.6, 4),
    roofMat
  );
  towerRoof.rotation.y = Math.PI / 4;
  towerRoof.position.set(0, 7.85, 0.5);
  towerRoof.castShadow = true;
  school.add(towerRoof);

  // Brass Bell inside tower
  const bell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.45, 0.5, 12),
    goldMat
  );
  bell.position.set(0, 4.7, 1.8);
  school.add(bell);

  // Classroom Windows (Grid on facade)
  [-3.2, -1.8, 1.8, 3.2].forEach((wx) => {
    [1.6, 3.0].forEach((wy) => {
      const win = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.9),
        new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.2 })
      );
      win.position.set(wx, wy, 2.82);
      school.add(win);
    });
  });

  // Fluttering Indian National Tricolor Flag (Tiranga)
  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 4.2, 8),
    new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8 })
  );
  flagPole.position.set(3.8, 2.1, 3.6);
  school.add(flagPole);

  // Tiranga Tricolor Canvas Texture
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 180;
  flagCanvas.height = 120;
  const fctx = flagCanvas.getContext('2d')!;
  fctx.fillStyle = '#ff9933'; // Saffron
  fctx.fillRect(0, 0, 180, 40);
  fctx.fillStyle = '#ffffff'; // White
  fctx.fillRect(0, 40, 180, 40);
  fctx.fillStyle = '#138808'; // Green
  fctx.fillRect(0, 80, 180, 40);
  // Blue Ashoka Chakra
  fctx.strokeStyle = '#000080';
  fctx.lineWidth = 3;
  fctx.beginPath();
  fctx.arc(90, 60, 16, 0, Math.PI * 2);
  fctx.stroke();

  const flagTex = new THREE.CanvasTexture(flagCanvas);
  flagTex.colorSpace = THREE.SRGBColorSpace;
  const flagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.0),
    new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide })
  );
  flagMesh.position.set(4.65, 3.6, 3.6);
  school.add(flagMesh);

  // Yellow Indian School Bus in driveway
  const schoolBus = new THREE.Group();
  schoolBus.position.set(-3.2, 0.3, 4.2);

  const busMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 }); // Indian school bus yellow
  const busBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 3.4), busMat);
  busBody.position.y = 0.7;
  busBody.castShadow = true;
  schoolBus.add(busBody);

  // Bus Windows Strip
  const busWin = new THREE.Mesh(
    new THREE.BoxGeometry(1.64, 0.35, 2.8),
    new THREE.MeshStandardMaterial({ color: 0x0284c7 })
  );
  busWin.position.y = 0.85;
  schoolBus.add(busWin);

  // Bus Wheels
  const bWheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 10);
  const bWheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
  [
    [-0.85, 0.3, 1.0],
    [0.85, 0.3, 1.0],
    [-0.85, 0.3, -1.0],
    [0.85, 0.3, -1.0],
  ].forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(bWheelGeo, bWheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, wy, wz);
    schoolBus.add(wheel);
  });

  school.add(schoolBus);

  // Signboard: "सुमित इंटरनेशनल स्कूल" / "SUMIT INTERNATIONAL SCHOOL"
  const signTex = TextureGenerator.createSignboard(
    'सुमित इंटरनेशनल स्कूल',
    'SUMIT INTERNATIONAL SCHOOL',
    '#1e3a8a',
    '#facc15',
    '#ffffff'
  );
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.3),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.3 })
  );
  signMesh.position.set(0, 3.2, 2.85);
  school.add(signMesh);

  return school;
}

// ============================================================================
// 4. SUMIT GRAND HERITAGE HOTEL & RESORT (सुमित ग्रैंड हेरिटेज होटल)
// ============================================================================
export function buildSumitHotel(): THREE.Group {
  const hotel = new THREE.Group();
  hotel.name = 'SumitHotel';
  hotel.userData = {
    isInteractive: true,
    type: 'hotel',
    title: 'Sumit Grand Heritage Hotel (सुमित हेरिटेज होटल)',
    titleHindi: 'सुमित ग्रैंड हेरिटेज होटल एवं पैलेस रिसॉर्ट',
    description: '5-star royal luxury hotel with Maharaja suites, central marble fountain, royal thali dining, and terrace view.',
    descriptionHindi: 'संस्थापक सुमित गुप्ता का भव्य ५-सितारा राजसी होटल। शाही आतिथ्य, फव्वारा चौक, और विलासिता का अनुभव।',
    action: 'hotel',
  };

  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Warm Jaisalmer yellow sandstone
    roughness: 0.6,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.7,
    roughness: 0.25,
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
  });

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.1,
  });

  // Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.4, 9.0), marbleMat);
  plinth.position.set(0, 0.2, 0);
  plinth.receiveShadow = true;
  hotel.add(plinth);

  // Main 4-Story Palace Body
  const palaceBody = new THREE.Mesh(new THREE.BoxGeometry(10.0, 6.0, 7.0), sandstoneMat);
  palaceBody.position.set(0, 3.4, -0.4);
  palaceBody.castShadow = true;
  palaceBody.receiveShadow = true;
  hotel.add(palaceBody);

  // 4 Corner Jharokhas / Balconies
  [-4.2, 4.2].forEach((jx) => {
    [2.8, 5.0].forEach((jy) => {
      const jharokha = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.6, 1.2, 8, 1, false, 0, Math.PI),
        goldTrimMat
      );
      jharokha.position.set(jx, jy, 3.1);
      hotel.add(jharokha);
    });
  });

  // 3 Golden Rajasthani Palace Domes on Roof
  [-3.2, 0, 3.2].forEach((dx, i) => {
    const scale = i === 1 ? 1.5 : 1.1;
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.9 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      goldTrimMat
    );
    dome.position.set(dx, 6.4 + (i === 1 ? 0.6 : 0), -0.4);
    dome.castShadow = true;
    hotel.add(dome);

    // Golden Kalash Finial
    const finial = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.7, 8),
      goldTrimMat
    );
    finial.position.set(dx, 7.3 + (i === 1 ? 0.9 : 0.2), -0.4);
    hotel.add(finial);
  });

  // Grand Marquee Signboard: "सुमित ग्रैंड हेरिटेज होटल"
  const signTex = TextureGenerator.createSignboard(
    'सुमित ग्रैंड हेरिटेज होटल',
    'SUMIT GRAND HOTEL • 5-STAR PALACE',
    '#7f1d1d',
    '#fde047',
    '#fbbf24'
  );
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 1.4),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.25 })
  );
  signMesh.position.set(0, 4.2, 3.15);
  hotel.add(signMesh);

  // Red Carpet Entrance Runner
  const carpet = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 3.2),
    new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.8 })
  );
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.42, 3.4);
  hotel.add(carpet);

  // Royal Water Fountain in Courtyard
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, 0.4, 4.8);

  const basin = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.5, 0.4, 16),
    marbleMat
  );
  fountainGroup.add(basin);

  const water = new THREE.Mesh(
    new THREE.CircleGeometry(1.3, 16),
    waterMat
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.22;
  fountainGroup.add(water);

  const fountainTier = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.3, 0.9, 12),
    goldTrimMat
  );
  fountainTier.position.y = 0.55;
  fountainGroup.add(fountainTier);

  hotel.add(fountainGroup);

  return hotel;
}

// ============================================================================
// 5. SUMIT 24X7 MEDICAL STORE & PHARMACY (सुमित 24x7 मेडिकल स्टोर)
// ============================================================================
export function buildSumitMedicalStore(): THREE.Group {
  const store = new THREE.Group();
  store.name = 'SumitMedicalStore';
  store.userData = {
    isInteractive: true,
    type: 'medical_store',
    title: 'Sumit Medical Store (सुमित मेडिकल स्टोर)',
    titleHindi: 'सुमित 24x7 मेडिकल स्टोर एवं फार्मेसी',
    description: 'Round-the-clock trusted chemist shop providing all medicines, baby care, surgical supplies, and free home delivery.',
    descriptionHindi: 'संस्थापक सुमित गुप्ता द्वारा संचालित 24x7 मेडिकल स्टोर। सभी प्रकार की जीवनरक्षक औषधियाँ एवं त्वरित सेवा।',
    action: 'medical_store',
  };

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
  });

  const greenMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.3,
  });

  const glowingGreenMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x16a34a,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.55,
    roughness: 0.1,
  });

  // Base Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.3, 4.8), whiteMat);
  plinth.position.set(0, 0.15, 0);
  store.add(plinth);

  // Shop Building Body
  const shopBody = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.4, 4.0), whiteMat);
  shopBody.position.set(0, 1.85, 0);
  shopBody.castShadow = true;
  shopBody.receiveShadow = true;
  store.add(shopBody);

  // Slanted Green & White Awning (Chhappar)
  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.15, 1.4),
    greenMat
  );
  awning.rotation.x = 0.25;
  awning.position.set(0, 2.7, 2.3);
  store.add(awning);

  // Glass Counter / Display Window
  const glassDisplay = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.6), glassMat);
  glassDisplay.position.set(0, 1.3, 2.02);
  store.add(glassDisplay);

  // Glowing Green Pharmacy Cross Sign on Side & Roof
  const createGreenCross = () => {
    const cg = new THREE.Group();
    const vb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.15), glowingGreenMat);
    const hb = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.15), glowingGreenMat);
    cg.add(vb, hb);
    return cg;
  };

  const roofCross = createGreenCross();
  roofCross.position.set(0, 4.0, 0);
  store.add(roofCross);

  const cornerCross = createGreenCross();
  cornerCross.position.set(2.6, 2.4, 1.2);
  cornerCross.rotation.y = Math.PI / 2;
  store.add(cornerCross);

  // Signboard: "सुमित मेडिकल स्टोर" / "SUMIT 24X7 PHARMACY"
  const signTex = TextureGenerator.createSignboard(
    'सुमित मेडिकल स्टोर',
    'SUMIT 24X7 MEDICAL & PHARMACY',
    '#15803d',
    '#ffffff',
    '#facc15'
  );
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 1.1),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.3 })
  );
  signMesh.position.set(0, 3.1, 2.05);
  store.add(signMesh);

  // Delivery Scooter outside
  const scooter = new THREE.Group();
  scooter.position.set(2.2, 0.25, 2.4);

  const scBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.7, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x16a34a })
  );
  scBody.position.y = 0.45;
  scooter.add(scBody);

  const scBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  scBox.position.set(0, 0.9, -0.35);
  scooter.add(scBox);

  // Scooter wheels
  const sWheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 10);
  const sWheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
  [0.45, -0.45].forEach((wz) => {
    const wheel = new THREE.Mesh(sWheelGeo, sWheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0, 0.18, wz);
    scooter.add(wheel);
  });

  store.add(scooter);

  return store;
}

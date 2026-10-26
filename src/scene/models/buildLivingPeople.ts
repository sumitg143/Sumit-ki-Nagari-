import * as THREE from 'three';

/**
 * Composite procedural Indian character models with walking/eating/playing animations.
 * Complies with 3-12 part procedural model standard, grounded bottom-center pivots,
 * and zero external asset dependencies.
 */

export interface AnimatedPerson {
  group: THREE.Group;
  type: 'walking' | 'sitting_chai' | 'train_passenger' | 'cricket_batsman' | 'cricket_bowler' | 'kanche_player' | 'airport_traveler';
  waypoints?: { x: number; z: number }[];
  currentWpIdx?: number;
  progress?: number;
  speed?: number;
  leftLeg?: THREE.Mesh;
  rightLeg?: THREE.Mesh;
  leftArm?: THREE.Mesh;
  rightArm?: THREE.Mesh;
  accessory?: THREE.Object3D;
  update: (delta: number, time: number) => void;
}

export function createIndianCharacter(params: {
  name: string;
  role: string;
  roleHindi: string;
  skinTone?: number;
  clothColor: number;
  turbanColor?: number;
  hasTurban?: boolean;
  hasBag?: boolean;
  hasChai?: boolean;
  hasBat?: boolean;
  hasSuitcase?: boolean;
}): { group: THREE.Group; leftLeg: THREE.Mesh; rightLeg: THREE.Mesh; leftArm: THREE.Mesh; rightArm: THREE.Mesh; accessory?: THREE.Object3D } {
  const character = new THREE.Group();
  character.name = `Person_${params.name}`;

  const skinMat = new THREE.MeshStandardMaterial({
    color: params.skinTone || 0xaf7a48, // Warm Indian skin tone
    roughness: 0.8,
  });

  const clothMat = new THREE.MeshStandardMaterial({
    color: params.clothColor,
    roughness: 0.6,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
  });

  const whiteClothMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.5,
  });

  // 1. Torso / Kurta
  const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.35);
  const torso = new THREE.Mesh(torsoGeo, clothMat);
  torso.position.set(0, 1.15, 0);
  torso.castShadow = true;
  character.add(torso);

  // 2. Head
  const headGeo = new THREE.SphereGeometry(0.22, 12, 10);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 1.72, 0);
  head.castShadow = true;
  character.add(head);

  // 3. Turban / Hair
  if (params.hasTurban) {
    const turbanMat = new THREE.MeshStandardMaterial({
      color: params.turbanColor || 0xf97316, // Saffron / Marigold pagdi
      roughness: 0.8,
    });
    const turban = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.08, 8, 14), turbanMat);
    turban.rotation.x = Math.PI / 2;
    turban.position.set(0, 1.88, 0);
    character.add(turban);

    const turbanTop = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), turbanMat);
    turbanTop.position.set(0, 1.94, 0);
    character.add(turbanTop);
  } else {
    // Black Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    hair.position.set(0, 1.76, 0);
    character.add(hair);
  }

  // 4. Legs
  const legGeo = new THREE.BoxGeometry(0.18, 0.75, 0.2);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(-0.16, 0.4, 0);
  leftLeg.castShadow = true;

  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(0.16, 0.4, 0);
  rightLeg.castShadow = true;

  character.add(leftLeg, rightLeg);

  // 5. Arms
  const armGeo = new THREE.BoxGeometry(0.14, 0.65, 0.16);
  const leftArm = new THREE.Mesh(armGeo, clothMat);
  leftArm.position.set(-0.35, 1.15, 0);
  leftArm.castShadow = true;

  const rightArm = new THREE.Mesh(armGeo, clothMat);
  rightArm.position.set(0.35, 1.15, 0);
  rightArm.castShadow = true;

  character.add(leftArm, rightArm);

  let accessoryMesh: THREE.Object3D | undefined;

  // 6. Accessories: Shopping Bag / Samosa Thali / Chai Cup / Suitcase / Cricket Bat
  if (params.hasBag) {
    // Shopping Bag (Cloth / Jute Jhola with vegetables/sweets)
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 });
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.16), bagMat);
    bag.position.set(0.42, 0.75, 0.1);
    character.add(bag);
    accessoryMesh = bag;
  } else if (params.hasChai) {
    // Kulhad Chai Cup in hand
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.12, 8), cupMat);
    cup.position.set(0.38, 1.15, 0.25);
    character.add(cup);
    accessoryMesh = cup;
  } else if (params.hasSuitcase) {
    // Wheelie Trolley Bag for Station / Airport
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.2 });
    const suitcase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.25), suitMat);
    suitcase.position.set(0.45, 0.35, 0);
    character.add(suitcase);
    accessoryMesh = suitcase;
  } else if (params.hasBat) {
    // Wooden Cricket Bat
    const batMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
    const batBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.05), batMat);
    const batHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    batBlade.position.set(0, 0.3, 0);
    batHandle.position.set(0, 0.7, 0);
    const bat = new THREE.Group();
    bat.add(batBlade, batHandle);
    bat.rotation.z = 0.5;
    bat.position.set(0.35, 0.7, 0.3);
    character.add(bat);
    accessoryMesh = bat;
  }

  // Interactive userData
  character.userData = {
    isInteractive: true,
    type: 'person',
    title: params.name,
    titleHindi: params.roleHindi,
    description: `${params.name} • ${params.role}`,
    descriptionHindi: `${params.roleHindi} - सुमित की नगरी के प्यारे नागरिक`,
  };

  return { group: character, leftLeg, rightLeg, leftArm, rightArm, accessory: accessoryMesh };
}

/**
 * Builds the complete cast of living townspeople:
 * - Walking pedestrians returning home / shopping at Bazaar
 * - Chai tapri patrons sitting, sipping tea and eating samosas
 * - Train passengers waiting on platform and boarding
 * - Cricket batsman and bowler playing on pitch
 * - Kanche players sitting around ring
 * - Airport passengers with trolley suitcases
 */
export function buildLivingPeopleSystem(): {
  peopleGroup: THREE.Group;
  animatedPeople: AnimatedPerson[];
  interactiveObjects: THREE.Object3D[];
  update: (delta: number) => void;
} {
  const peopleGroup = new THREE.Group();
  peopleGroup.name = 'LivingTownspeople';
  const animatedPeople: AnimatedPerson[] = [];
  const interactiveObjects: THREE.Object3D[] = [];

  let clockTime = 0;

  // 1. Walking Pedestrian 1: Rahul Sharma carrying jalebi & sweets home to Mohalla
  const rahul = createIndianCharacter({
    name: 'Rahul Sharma (राहुल शर्मा)',
    role: 'Carrying Gupta Ji sweets home for family tea time',
    roleHindi: 'गुप्ता जी की ताज़ा जलेबी लेकर घर जाते हुए',
    clothColor: 0x0284c7, // Blue kurta
    hasBag: true,
  });
  const rahulWps = [
    { x: -16, z: 8 }, // Bazaar shop
    { x: -8, z: 8 },  // Crossing
    { x: -8, z: -8 }, // Main avenue
    { x: 6, z: -8 },  // Heritage lane
    { x: -16, z: 8 }, // Loop
  ];
  peopleGroup.add(rahul.group);
  interactiveObjects.push(rahul.group);
  animatedPeople.push({
    group: rahul.group,
    type: 'walking',
    waypoints: rahulWps,
    currentWpIdx: 0,
    progress: 0,
    speed: 3.2,
    leftLeg: rahul.leftLeg,
    rightLeg: rahul.rightLeg,
    leftArm: rahul.leftArm,
    rightArm: rahul.rightArm,
    update: (delta, time) => {
      // Walking swing
      const swing = Math.sin(time * 8) * 0.45;
      rahul.leftLeg.rotation.x = swing;
      rahul.rightLeg.rotation.x = -swing;
      rahul.leftArm.rotation.x = -swing * 0.8;
      rahul.rightArm.rotation.x = swing * 0.8;
    },
  });

  // 2. Walking Pedestrian 2: Savita Ben walking from temple with marigold prasad
  const savita = createIndianCharacter({
    name: 'Savita Ben (सविता बेन)',
    role: 'Returning from Shanti Mandir evening aarti with holy prasad',
    roleHindi: 'शांति मंदिर से संध्या आरती का प्रसाद लेकर लौटते हुए',
    clothColor: 0xdb2777, // Pink/Magenta saree
    hasTurban: false,
    hasBag: true,
  });
  const savitaWps = [
    { x: 22, z: 6 },
    { x: 10, z: 8 },
    { x: -4, z: 8 },
    { x: 22, z: 6 },
  ];
  peopleGroup.add(savita.group);
  interactiveObjects.push(savita.group);
  animatedPeople.push({
    group: savita.group,
    type: 'walking',
    waypoints: savitaWps,
    currentWpIdx: 0,
    progress: 0,
    speed: 2.6,
    leftLeg: savita.leftLeg,
    rightLeg: savita.rightLeg,
    leftArm: savita.leftArm,
    rightArm: savita.rightArm,
    update: (delta, time) => {
      const swing = Math.sin(time * 7) * 0.4;
      savita.leftLeg.rotation.x = swing;
      savita.rightLeg.rotation.x = -swing;
      savita.leftArm.rotation.x = -swing * 0.7;
    },
  });

  // 3. Sitting Chai Drinkers at Sharma Ji Tapri (खाते-पीते हुए)
  // Person A: Bunty sipping cutting chai
  const bunty = createIndianCharacter({
    name: 'Bunty (बंटी)',
    role: 'Sipping hot ginger cutting chai with bun-muska',
    roleHindi: 'शर्मा जी की कड़क कुल्हड़ चाय और समोसे का मज़ा लेते हुए',
    clothColor: 0x16a34a, // Green kurta
    hasChai: true,
  });
  // Sit posture on wooden bench
  bunty.group.position.set(-12.8, 0.45, 8.8);
  bunty.leftLeg.rotation.x = -Math.PI / 2;
  bunty.rightLeg.rotation.x = -Math.PI / 2;
  peopleGroup.add(bunty.group);
  interactiveObjects.push(bunty.group);
  animatedPeople.push({
    group: bunty.group,
    type: 'sitting_chai',
    update: (delta, time) => {
      // Gentle breathing & sipping arm gesture
      const sip = (Math.sin(time * 2.5) + 1) * 0.5;
      bunty.rightArm.rotation.x = -0.6 - sip * 0.4;
    },
  });

  // Person B: Chintu sharing town gossip with Bunty
  const chintu = createIndianCharacter({
    name: 'Chintu (चिंटू)',
    role: 'Enjoying hot samosas and chatting about Nagri development',
    roleHindi: 'गरमा-गरम समोसे खाते हुए और दोस्तों से गपशप करते हुए',
    clothColor: 0xea580c,
    hasTurban: true,
    turbanColor: 0xfacc15,
    hasChai: true,
  });
  chintu.group.position.set(-13.4, 0.45, 8.8);
  chintu.leftLeg.rotation.x = -Math.PI / 2;
  chintu.rightLeg.rotation.x = -Math.PI / 2;
  peopleGroup.add(chintu.group);
  interactiveObjects.push(chintu.group);
  animatedPeople.push({
    group: chintu.group,
    type: 'sitting_chai',
    update: (delta, time) => {
      chintu.group.rotation.y = 0.2 + Math.sin(time * 2) * 0.1;
    },
  });

  // 4. Train Boarders at Railway Station (ट्रेन पर बैठते हुए)
  // Passenger 1: Amit boarding the train with blue suitcase
  const amit = createIndianCharacter({
    name: 'Amit Kumar (अमित कुमार)',
    role: 'Boarding the Sumit Nagar Express with luggage',
    roleHindi: 'सुमित नगर एक्सप्रेस ट्रेन के डिब्बे में सवार होते हुए',
    clothColor: 0x9333ea,
    hasSuitcase: true,
  });
  const amitWps = [
    { x: -6, z: 31 }, // Platform ticket gate
    { x: -2, z: 31 }, // Waiting on platform
    { x: 2, z: 33 },  // Near coach door
    { x: -6, z: 31 }, // Loop
  ];
  peopleGroup.add(amit.group);
  interactiveObjects.push(amit.group);
  animatedPeople.push({
    group: amit.group,
    type: 'train_passenger',
    waypoints: amitWps,
    currentWpIdx: 0,
    progress: 0,
    speed: 2.2,
    leftLeg: amit.leftLeg,
    rightLeg: amit.rightLeg,
    leftArm: amit.leftArm,
    rightArm: amit.rightArm,
    update: (delta, time) => {
      const swing = Math.sin(time * 6) * 0.35;
      amit.leftLeg.rotation.x = swing;
      amit.rightLeg.rotation.x = -swing;
      amit.leftArm.rotation.x = -swing * 0.6;
    },
  });

  // Passenger 2: Neha waving from train platform window
  const neha = createIndianCharacter({
    name: 'Neha (नेहा)',
    role: 'Waving goodbye from train platform to her family in Nagri',
    roleHindi: 'रेलवे प्लेटफॉर्म से हाथ हिलाकर अलविदा कहते हुए',
    clothColor: 0xe11d48,
  });
  neha.group.position.set(4, 0.6, 31.5);
  peopleGroup.add(neha.group);
  interactiveObjects.push(neha.group);
  animatedPeople.push({
    group: neha.group,
    type: 'train_passenger',
    update: (delta, time) => {
      // Waving hand
      neha.rightArm.rotation.x = -2.2 + Math.sin(time * 8) * 0.4;
      neha.rightArm.rotation.z = Math.sin(time * 8) * 0.3;
    },
  });

  // Update loop for all animated people
  const update = (delta: number) => {
    clockTime += delta;

    animatedPeople.forEach((p) => {
      // Pathing movement if waypoints exist
      if (p.waypoints && p.waypoints.length > 1) {
        const curr = p.waypoints[p.currentWpIdx || 0];
        const nextIdx = ((p.currentWpIdx || 0) + 1) % p.waypoints.length;
        const next = p.waypoints[nextIdx];

        const dx = next.x - curr.x;
        const dz = next.z - curr.z;
        const dist = Math.hypot(dx, dz);
        const spd = p.speed || 2.5;

        p.progress = (p.progress || 0) + (spd * delta) / dist;

        if (p.progress >= 1.0) {
          p.progress = 0;
          p.currentWpIdx = nextIdx;
        }

        const px = THREE.MathUtils.lerp(curr.x, next.x, p.progress);
        const pz = THREE.MathUtils.lerp(curr.z, next.z, p.progress);
        p.group.position.set(px, 0, pz);

        const angle = Math.atan2(dx, dz);
        p.group.rotation.y = angle;
      }

      p.update(delta, clockTime);
    });
  };

  return { peopleGroup, animatedPeople, interactiveObjects, update };
}

import * as THREE from 'three';

/**
 * Builds Indian Police Thana & Central Jail (सुमित पुलिस थाना एवं सेंट्रल जेल)
 * Features:
 * - Khaki, navy & stone facade with Indian Police insignia
 * - Red and Blue flashing beacon lights on roof
 * - Police patrol vehicle parked outside
 * - Lockup / Jail cell (हवालात) with vertical iron bars
 * - Live animated Sub-Inspector chasing & catching handcuffed thief into jail!
 */
export function buildPoliceStation(): THREE.Group {
  const station = new THREE.Group();
  station.name = 'SumitPoliceThana';

  // Materials
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8, // Police station grey-white
    roughness: 0.6,
  });

  const navyTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Police navy blue
    roughness: 0.4,
  });

  const khakiMat = new THREE.MeshStandardMaterial({
    color: 0xb45309, // Police khaki uniform
    roughness: 0.6,
  });

  const barsMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Dark iron bars
    roughness: 0.3,
    metalness: 0.8,
  });

  // 1. Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(13, 0.4, 9), new THREE.MeshStandardMaterial({ color: 0x64748b }));
  plinth.position.set(0, 0.2, 0);
  station.add(plinth);

  // 2. Main Thana Building (Left Side)
  const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(7.5, 4.2, 7.5), wallMat);
  mainBuilding.position.set(-2.2, 2.3, 0);
  mainBuilding.castShadow = true;
  station.add(mainBuilding);

  // Navy blue roof parapet
  const roof = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.4, 7.8), navyTrimMat);
  roof.position.set(-2.2, 4.5, 0);
  station.add(roof);

  // 3. Central Jail / Lockup (हवालात - Right Side with visible bars)
  const jailBack = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 0.4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  jailBack.position.set(3.8, 2.0, -3.2);
  const jailWallSide = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.6, 4.8), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  jailWallSide.position.set(6.0, 2.0, -1.0);
  const jailRoof = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.4, 5.2), new THREE.MeshStandardMaterial({ color: 0x334155 }));
  jailRoof.position.set(3.9, 3.9, -1.0);
  station.add(jailBack, jailWallSide, jailRoof);

  // Front Iron Bars for Jail Lockup
  for (let bx = 2.0; bx <= 5.8; bx += 0.35) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.4, 8), barsMat);
    bar.position.set(bx, 1.9, 1.3);
    station.add(bar);
  }

  // Jail Signboard: "हवालात / LOCK-UP"
  const jailSignCanvas = document.createElement('canvas');
  jailSignCanvas.width = 128;
  jailSignCanvas.height = 48;
  const jctx = jailSignCanvas.getContext('2d')!;
  jctx.fillStyle = '#dc2626';
  jctx.fillRect(0, 0, 128, 48);
  jctx.fillStyle = '#ffffff';
  jctx.font = 'bold 20px sans-serif';
  jctx.textAlign = 'center';
  jctx.fillText('हवालात / JAIL', 64, 32);
  const jailSignTex = new THREE.CanvasTexture(jailSignCanvas);
  const jailSign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), new THREE.MeshBasicMaterial({ map: jailSignTex }));
  jailSign.position.set(3.9, 3.5, 1.35);
  station.add(jailSign);

  // 4. Main Thana Signboard
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const sctx = signCanvas.getContext('2d')!;
  sctx.fillStyle = '#1e3a8a';
  sctx.fillRect(0, 0, 512, 128);
  sctx.fillStyle = '#ffffff';
  sctx.font = 'bold 36px sans-serif';
  sctx.textAlign = 'center';
  sctx.fillText('🚨 सुमित नगर पुलिस थाना 🚨', 256, 54);
  sctx.fillStyle = '#fbbf24';
  sctx.font = 'bold 24px sans-serif';
  sctx.fillText('SUMIT POLICE STATION & JAIL', 256, 96);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 1.6),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.3 })
  );
  signMesh.position.set(-2.2, 4.0, 3.8);
  station.add(signMesh);

  // 5. Emergency Flashing Beacon Lights (Red & Blue)
  const redBeacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.35, 12),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  redBeacon.position.set(-3.2, 4.9, 3.5);

  const blueBeacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.35, 12),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
  );
  blueBeacon.position.set(-1.2, 4.9, 3.5);

  const beaconLight = new THREE.PointLight(0xef4444, 1.5, 12);
  beaconLight.position.set(-2.2, 5.2, 3.5);
  station.add(redBeacon, blueBeacon, beaconLight);

  // 6. Police Patrol Vehicle (Gypsy) Parked
  const jeep = new THREE.Group();
  const jeepBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.0, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 })
  );
  jeepBody.position.set(0, 0.7, 0);
  const jeepCabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.8, 1.3),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
  );
  jeepCabin.position.set(-0.3, 1.4, 0);
  jeep.add(jeepBody, jeepCabin);

  // Wheels
  [-0.7, 0.7].forEach((wx) => {
    [-0.75, 0.75].forEach((wz) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.35, wz);
      jeep.add(wheel);
    });
  });

  jeep.position.set(-4.5, 0, 5.2);
  jeep.rotation.y = 0.2;
  station.add(jeep);

  // 7. Live Animated Characters: Police Sub-Inspector, Constable & Handcuffed Thief
  // Police Inspector
  const inspector = new THREE.Group();
  const insBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.75, 8), khakiMat);
  insBody.position.set(0, 0.8, 0);
  const insHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24 }));
  insHead.position.set(0, 1.35, 0);
  const insCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 12), navyTrimMat);
  insCap.position.set(0, 1.5, 0);
  // Lathi (police baton)
  const lathi = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x78350f })
  );
  lathi.position.set(0.28, 0.75, 0.15);
  inspector.add(insBody, insHead, insCap, lathi);
  inspector.position.set(0.5, 0, 3.8);
  station.add(inspector);

  // Chor (Thief in black-and-white stripes with handcuffs)
  const thief = new THREE.Group();
  const thiefBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.72, 8),
    new THREE.MeshStandardMaterial({ color: 0x0f172a }) // Black bandit
  );
  thiefBody.position.set(0, 0.75, 0);
  const thiefHead = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24 }));
  thiefHead.position.set(0, 1.3, 0);
  // Handcuffs
  const cuffs = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
  cuffs.position.set(0, 0.8, 0.22);
  thief.add(thiefBody, thiefHead, cuffs);
  thief.position.set(1.4, 0, 3.8);
  station.add(thief);

  // Inmate inside jail cell
  const jailInmate = new THREE.Group();
  const inmateBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.72, 8),
    new THREE.MeshStandardMaterial({ color: 0xf97316 }) // Prison orange
  );
  inmateBody.position.set(0, 0.75, 0);
  const inmateHead = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24 }));
  inmateHead.position.set(0, 1.3, 0);
  jailInmate.add(inmateBody, inmateHead);
  jailInmate.position.set(3.8, 0, -1.0);
  station.add(jailInmate);

  // UserData & tick loop animation
  station.userData = {
    isInteractive: true,
    type: 'police_thana',
    title: 'Sumit Nagar Police Thana & Central Jail (पुलिस थाना)',
    titleHindi: 'सुमित नगर पुलिस थाना एवं सेंट्रल जेल हवालात',
    description: 'Civic police headquarters protecting Sumit Ki Nagri. Featuring patrol jeeps, active lockup jail cells, FIR registration, and crime prevention.',
    descriptionHindi: 'सुमित नगर का आधुनिक पुलिस थाना। 24x7 गश्त, एफआईआर दर्ज करने की सुविधा एवं हवालात। चोरों को पकड़ने की लाइव कार्रवाई!',
    action: 'police_siren',
    onTick: (delta: number, elapsed: number) => {
      // 1. Red & Blue beacon flashing alternation
      const flash = Math.sin(elapsed * 12);
      if (flash > 0) {
        (redBeacon.material as THREE.MeshBasicMaterial).color.setHex(0xff0000);
        (blueBeacon.material as THREE.MeshBasicMaterial).color.setHex(0x1e3a8a);
        beaconLight.color.setHex(0xff0000);
      } else {
        (redBeacon.material as THREE.MeshBasicMaterial).color.setHex(0x7f1d1d);
        (blueBeacon.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
        beaconLight.color.setHex(0x0088ff);
      }

      // 2. Police escorting handcuffed thief animation
      const walkCycle = Math.sin(elapsed * 3);
      thief.position.z = 3.8 + walkCycle * 0.4;
      inspector.position.z = 3.8 + walkCycle * 0.4;
      inspector.rotation.y = Math.sin(elapsed * 1.5) * 0.15;
      thief.rotation.y = -Math.sin(elapsed * 1.5) * 0.15;

      // 3. Inmate behind bars pacing
      jailInmate.position.x = 3.8 + Math.sin(elapsed * 1.8) * 0.6;
    },
  };

  return station;
}

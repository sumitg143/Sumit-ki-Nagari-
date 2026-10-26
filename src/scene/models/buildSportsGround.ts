import * as THREE from 'three';
import { createIndianCharacter } from './buildLivingPeople.ts';

/**
 * 3D Sports Arena (सुमित नगर खेल मैदान)
 * Features:
 * 1. Gully Cricket Pitch with stumps, batsman, bowler in run-up
 * 2. Desi Ludo Table with sitting players & colorful board
 * 3. Kanche (Marbles) Ring on sandy circle with glass marbles & player
 * 4. Field Hockey penalty goal post with goalie and hockey ball
 * 5. Sports arena boundary fence and vibrant banner
 */

export interface SportsGroundSystem {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
  interactiveMeshes: THREE.Object3D[];
}

export function buildSportsGround(): SportsGroundSystem {
  const group = new THREE.Group();
  group.name = 'SportsGround_Arena';
  group.userData = {
    isInteractive: true,
    type: 'sports_ground',
    title: 'Nagri Sports Arena (खेल मैदान)',
    titleHindi: 'सुमित नगर खेल मैदान • क्रिकेट, लूडो, कंचे, हॉकी',
    description: 'The energetic town sports maidan where children and youths gather for cricket, ludo, kanche, and hockey matches!',
    descriptionHindi: 'नगर का विशाल खेल मैदान जहाँ बच्चे और युवा क्रिकेट, लूडो, कंचे और हॉकी के रोमांचक मैच खेलते हैं। क्लिक करके स्वयं खेलें!',
    action: 'open_games',
  };

  const interactiveMeshes: THREE.Object3D[] = [];

  // Ground Grass Patch
  const groundGeo = new THREE.PlaneGeometry(32, 22);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x4d7c0f, // Lively grass green
    roughness: 0.85,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(0, 0.02, 0);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // Boundary low wooden fence
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
  for (let x = -15; x <= 15; x += 3) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8), fenceMat);
    post.position.set(x, 0.45, -10.5);
    post.castShadow = true;
    group.add(post);
  }
  for (let z = -10; z <= 10; z += 3) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8), fenceMat);
    post.position.set(-15.5, 0.45, z);
    post.castShadow = true;
    group.add(post);
  }

  // Grand Arena Welcome Arch / Signboard
  const archGroup = new THREE.Group();
  archGroup.position.set(-4, 0, 10.5);
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.8, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
  const p1 = new THREE.Mesh(poleGeo, poleMat);
  p1.position.set(-3.5, 1.9, 0);
  const p2 = new THREE.Mesh(poleGeo, poleMat);
  p2.position.set(3.5, 1.9, 0);
  archGroup.add(p1, p2);

  // Signboard canvas
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const ctx = signCanvas.getContext('2d')!;
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 सुमित नगर खेल मैदान 🏏', 256, 52);
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('CRICKET • LUDO • KANCHE • HOCKEY', 256, 96);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.5 });
  const signMesh = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.4, 0.15), signMat);
  signMesh.position.set(0, 3.4, 0);
  archGroup.add(signMesh);
  group.add(archGroup);

  // ==========================================
  // 1. CRICKET PITCH & PLAYERS
  // ==========================================
  const pitchGeo = new THREE.PlaneGeometry(4, 14);
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.9 }); // Clay brown pitch
  const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
  pitchMesh.rotation.x = -Math.PI / 2;
  pitchMesh.position.set(-6, 0.03, 0);
  pitchMesh.receiveShadow = true;
  group.add(pitchMesh);

  // Crease white lines
  const creaseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const crease1 = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.1), creaseMat);
  crease1.rotation.x = -Math.PI / 2;
  crease1.position.set(-6, 0.04, -5.2);
  group.add(crease1);

  const crease2 = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.1), creaseMat);
  crease2.rotation.x = -Math.PI / 2;
  crease2.position.set(-6, 0.04, 5.2);
  group.add(crease2);

  // Wooden Stumps at both ends
  const stumpMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });
  const createStumps = (zPos: number) => {
    const stumpsGroup = new THREE.Group();
    stumpsGroup.position.set(-6, 0, zPos);
    for (let i = -1; i <= 1; i++) {
      const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), stumpMat);
      stump.position.set(i * 0.14, 0.4, 0);
      stump.castShadow = true;
      stumpsGroup.add(stump);
    }
    const bails = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.03), stumpMat);
    bails.position.set(0, 0.81, 0);
    stumpsGroup.add(bails);
    return stumpsGroup;
  };
  group.add(createStumps(-5.8));
  group.add(createStumps(5.8));

  // Batsman Player (Ajay)
  const batsman = createIndianCharacter({
    name: 'Ajay Batsman (अजय बल्लेबाज)',
    role: 'Smashing sixes for Sumit Ki Nagri Cricket XI',
    roleHindi: 'धुआंधार बल्लेबाजी करते हुए छक्के जड़ रहे हैं',
    clothColor: 0x1d4ed8, // Blue jersey
    hasBat: true,
  });
  batsman.group.position.set(-6, 0, -5.0);
  batsman.group.rotation.y = 0; // Facing bowler
  group.add(batsman.group);
  interactiveMeshes.push(batsman.group);

  // Bowler Player (Rohit)
  const bowler = createIndianCharacter({
    name: 'Rohit Bowler (रोहित गेंदबाज)',
    role: 'Fast bowling with swing from railway end',
    roleHindi: 'स्विंग गेंदबाजी करते हुए',
    clothColor: 0xb91c1c, // Red jersey
  });
  bowler.group.position.set(-6, 0, 4.8);
  bowler.group.rotation.y = Math.PI; // Facing batsman
  group.add(bowler.group);
  interactiveMeshes.push(bowler.group);

  // Red Cork Leather Ball
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
  const cricketBall = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), ballMat);
  cricketBall.position.set(-6, 0.4, 0);
  cricketBall.castShadow = true;
  group.add(cricketBall);

  // ==========================================
  // 2. DESI LUDO SEATING TABLE & PLAYERS
  // ==========================================
  const ludoZone = new THREE.Group();
  ludoZone.position.set(6, 0, 5);

  // Shady canopy umbrella
  const umbrellaPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), poleMat);
  umbrellaPole.position.set(0, 1.6, 0);
  ludoZone.add(umbrellaPole);

  const umbrellaTop = new THREE.Mesh(
    new THREE.ConeGeometry(2.4, 0.8, 12),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 })
  );
  umbrellaTop.position.set(0, 3.2, 0);
  ludoZone.add(umbrellaTop);

  // Table
  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.1, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
  );
  tableTop.position.set(0, 0.9, 0);
  tableTop.castShadow = true;
  ludoZone.add(tableTop);

  // Realistic Ludo Board Canvas Texture
  const ludoCanvas = document.createElement('canvas');
  ludoCanvas.width = 256;
  ludoCanvas.height = 256;
  const lctx = ludoCanvas.getContext('2d')!;
  lctx.fillStyle = '#ffffff';
  lctx.fillRect(0, 0, 256, 256);
  // Quadrants
  lctx.fillStyle = '#ef4444'; // Red
  lctx.fillRect(0, 0, 102, 102);
  lctx.fillStyle = '#10b981'; // Green
  lctx.fillRect(154, 0, 102, 102);
  lctx.fillStyle = '#f59e0b'; // Yellow
  lctx.fillRect(154, 154, 102, 102);
  lctx.fillStyle = '#3b82f6'; // Blue
  lctx.fillRect(0, 154, 102, 102);
  // Center triangle
  lctx.fillStyle = '#1e293b';
  lctx.fillRect(102, 102, 52, 52);

  const ludoBoardMat = new THREE.MeshStandardMaterial({
    map: new THREE.CanvasTexture(ludoCanvas),
    roughness: 0.4,
  });
  const ludoBoardMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), ludoBoardMat);
  ludoBoardMesh.rotation.x = -Math.PI / 2;
  ludoBoardMesh.position.set(0, 0.96, 0);
  ludoZone.add(ludoBoardMesh);

  // Sitting Ludo Player 1
  const ludoPlayer1 = createIndianCharacter({
    name: 'Karan Ludo Player (करन)',
    role: 'Rolling a 6 in high-stakes Mohalla Ludo',
    roleHindi: 'लूडो में पासा फेंक कर गोटी आगे बढ़ा रहे हैं',
    clothColor: 0x059669,
  });
  ludoPlayer1.group.position.set(-1.1, 0, 0);
  ludoPlayer1.group.rotation.y = Math.PI / 2;
  ludoZone.add(ludoPlayer1.group);
  interactiveMeshes.push(ludoPlayer1.group);

  // Sitting Ludo Player 2
  const ludoPlayer2 = createIndianCharacter({
    name: 'Vikas Ludo Player (विकास)',
    role: 'Chasing opponent red token with yellow pawn',
    roleHindi: 'लाल गोटी का पीछा करते हुए',
    clothColor: 0xd97706,
  });
  ludoPlayer2.group.position.set(1.1, 0, 0);
  ludoPlayer2.group.rotation.y = -Math.PI / 2;
  ludoZone.add(ludoPlayer2.group);
  interactiveMeshes.push(ludoPlayer2.group);

  group.add(ludoZone);

  // ==========================================
  // 3. KANCHE (MARBLES) RING & PLAYERS
  // ==========================================
  const kancheZone = new THREE.Group();
  kancheZone.position.set(7, 0, -5);

  // Sandy circle on ground
  const sandGeo = new THREE.CircleGeometry(2.4, 20);
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.95 });
  const sandMesh = new THREE.Mesh(sandGeo, sandMat);
  sandMesh.rotation.x = -Math.PI / 2;
  sandMesh.position.set(0, 0.03, 0);
  kancheZone.add(sandMesh);

  // White chalk boundary circle
  const chalkGeo = new THREE.RingGeometry(1.6, 1.68, 24);
  const chalkMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const chalkMesh = new THREE.Mesh(chalkGeo, chalkMat);
  chalkMesh.rotation.x = -Math.PI / 2;
  chalkMesh.position.set(0, 0.04, 0);
  kancheZone.add(chalkMesh);

  // Colorful glass marbles inside the ring
  const marbleColors = [0x38bdf8, 0x22c55e, 0xef4444, 0xa855f7, 0xfacc15, 0x06b6d4];
  for (let i = 0; i < 7; i++) {
    const mMat = new THREE.MeshPhysicalMaterial({
      color: marbleColors[i % marbleColors.length],
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.5,
    });
    const marble = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), mMat);
    const ang = (i / 7) * Math.PI * 2;
    const rad = 0.5 + (i % 2) * 0.4;
    marble.position.set(Math.cos(ang) * rad, 0.1, Math.sin(ang) * rad);
    marble.castShadow = true;
    kancheZone.add(marble);
  }

  // Kneeling Kanche Player (Chintu)
  const kanchePlayer = createIndianCharacter({
    name: 'Chintu Kanche Master (चिंटू)',
    role: 'Taking precise thumb aim at the center green marble',
    roleHindi: 'अंगूठे से कंचे का सटीक निशाना साधते हुए',
    clothColor: 0x0284c7,
  });
  kanchePlayer.group.position.set(-1.8, -0.3, 0);
  kanchePlayer.group.rotation.y = Math.PI / 2;
  kancheZone.add(kanchePlayer.group);
  interactiveMeshes.push(kanchePlayer.group);

  group.add(kancheZone);

  // ==========================================
  // 4. FIELD HOCKEY GOAL POST & PLAYERS
  // ==========================================
  const hockeyZone = new THREE.Group();
  hockeyZone.position.set(-2, 0, -8);

  // Goal Post Frame
  const goalFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const gPostLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.0, 8), goalFrameMat);
  gPostLeft.position.set(-1.8, 1.0, 0);
  const gPostRight = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.0, 8), goalFrameMat);
  gPostRight.position.set(1.8, 1.0, 0);
  const gCrossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.66, 8), goalFrameMat);
  gCrossbar.rotation.z = Math.PI / 2;
  gCrossbar.position.set(0, 2.0, 0);
  hockeyZone.add(gPostLeft, gPostRight, gCrossbar);

  // Goal Netting
  const netMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    wireframe: true,
  });
  const netBack = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.0), netMat);
  netBack.position.set(0, 1.0, -1.2);
  hockeyZone.add(netBack);

  // Goalkeeper
  const goalie = createIndianCharacter({
    name: 'Manpreet Goalie (मनप्रीत गोलकीपर)',
    role: 'Guarding the hockey goal with leg pads and helmet',
    roleHindi: 'गोल पोस्ट की चौकसी करते हुए',
    clothColor: 0xca8a04,
  });
  goalie.group.position.set(0, 0, -0.4);
  hockeyZone.add(goalie.group);
  interactiveMeshes.push(goalie.group);

  // White Hockey Ball
  const hockeyBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
  );
  hockeyBall.position.set(0, 0.1, 2.2);
  hockeyBall.castShadow = true;
  hockeyZone.add(hockeyBall);

  group.add(hockeyZone);

  // Make the entire sports ground interactive
  interactiveMeshes.push(group);

  // Dynamic animation loop
  const update = (delta: number, time: number) => {
    // 1. Batsman subtle stance & bat swing preparation
    batsman.rightArm.rotation.x = -1.2 + Math.sin(time * 3) * 0.4;
    batsman.leftArm.rotation.x = -1.0 + Math.sin(time * 3) * 0.3;

    // 2. Bowler arm rotation windup
    bowler.rightArm.rotation.x = time * 4 % (Math.PI * 2);

    // 3. Hockey Goalkeeper sideways anticipation sway
    goalie.group.position.x = Math.sin(time * 2.5) * 0.8;

    // 4. Kanche player thumb aim twitch
    kanchePlayer.rightArm.rotation.x = -0.8 + Math.sin(time * 5) * 0.08;
  };

  return { group, update, interactiveMeshes };
}

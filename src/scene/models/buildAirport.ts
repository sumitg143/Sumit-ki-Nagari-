import * as THREE from 'three';
import { createIndianCharacter } from './buildLivingPeople.ts';

/**
 * 3D Sumit International Airport & Flying Airplane System
 * Features:
 * 1. Modern Glass Terminal Building with "सुमित इंटरनेशनल एयरपोर्ट" sign
 * 2. ATC Control Tower with rotating radar and blinking beacon
 * 3. Runway with threshold markings, centerline dashes, and illuminated edge lights
 * 4. Waiting passengers in the terminal lounge & boarding stairs
 * 5. Flying 3D Passenger Jet with continuous flight loop:
 *    Taxi -> Takeoff roll -> Climb over city -> Scenic cruise in sky -> Descent -> Landing
 * 6. Real-time airplane position tracker for camera follow / passenger view!
 */

export interface FlightStatus {
  flightNumber: string;
  destination: string;
  destinationHindi: string;
  status: string;
  statusHindi: string;
  altitude: number;
  speedKmh: number;
  phase: 'TAXI' | 'TAKEOFF' | 'CRUISE' | 'DESCENT' | 'LANDING';
}

export interface AirportSystem {
  group: THREE.Group;
  airplane: THREE.Group;
  update: (delta: number, time: number) => void;
  getFlightStatus: () => FlightStatus;
  getAirplaneWorldPos: () => THREE.Vector3;
  getAirplaneForward: () => THREE.Vector3;
  interactiveMeshes: THREE.Object3D[];
}

export function buildAirport(): AirportSystem {
  const group = new THREE.Group();
  group.name = 'Sumit_International_Airport';
  group.userData = {
    isInteractive: true,
    type: 'airport',
    title: 'Sumit International Airport (सुमित इंटरनेशनल एयरपोर्ट)',
    titleHindi: 'सुमित इंटरनेशनल एयरपोर्ट • टर्मिनल एवं फ़्लाइट',
    description: 'Ultra-modern international airport with flight departures, ATC tower, and passenger planes flying across the skies of Sumit Ki Nagri.',
    descriptionHindi: 'अत्याधुनिक हवाई अड्डा जहाँ से विमान सुमित की नगरी के ऊपर उड़ान भरते हैं। हवाई जहाज़ में बैठकर पूरा नगर आकाश से देखें!',
    action: 'open_airport',
  };

  const interactiveMeshes: THREE.Object3D[] = [];

  // ==========================================
  // 1. RUNWAY & TARMAC
  // ==========================================
  const runwayGroup = new THREE.Group();
  runwayGroup.position.set(38, 0, 16);

  // Runway Asphalt Strip (Length: 76m, Width: 10m)
  const runwayGeo = new THREE.PlaneGeometry(10, 76);
  const runwayMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark asphalt
    roughness: 0.85,
  });
  const runwayMesh = new THREE.Mesh(runwayGeo, runwayMat);
  runwayMesh.rotation.x = -Math.PI / 2;
  runwayMesh.position.set(0, 0.02, 0);
  runwayMesh.receiveShadow = true;
  runwayGroup.add(runwayMesh);

  // Runway Centerline Dashes
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let z = -32; z <= 32; z += 6) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 3.5), dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.03, z);
    runwayGroup.add(dash);
  }

  // Threshold "Piano Key" Stripes at both ends
  const keyMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  for (let x = -3.6; x <= 3.6; x += 1.2) {
    const keyNorth = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 4.0), keyMat);
    keyNorth.rotation.x = -Math.PI / 2;
    keyNorth.position.set(x, 0.03, -34);
    runwayGroup.add(keyNorth);

    const keySouth = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 4.0), keyMat);
    keySouth.rotation.x = -Math.PI / 2;
    keySouth.position.set(x, 0.03, 34);
    runwayGroup.add(keySouth);
  }

  // Runway Edge Lights (Green at threshold, White along runway, Red at end)
  const edgeLights: THREE.PointLight[] = [];
  for (let z = -34; z <= 34; z += 8.5) {
    [-5.2, 5.2].forEach((x) => {
      const isThreshold = Math.abs(z) > 30;
      const lightCol = isThreshold ? 0x22c55e : 0xf8fafc;
      const lampGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6);
      const lampMesh = new THREE.Mesh(
        lampGeo,
        new THREE.MeshStandardMaterial({ color: lightCol, emissive: lightCol, emissiveIntensity: 0.8 })
      );
      lampMesh.position.set(x, 0.18, z);
      runwayGroup.add(lampMesh);
    });
  }

  group.add(runwayGroup);

  // ==========================================
  // 2. TERMINAL BUILDING
  // ==========================================
  const terminalGroup = new THREE.Group();
  terminalGroup.position.set(22, 0, 16);

  // Terminal Foundation & Main Concourse
  const concourseGeo = new THREE.BoxGeometry(14, 5.5, 24);
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
  const concourse = new THREE.Mesh(concourseGeo, concreteMat);
  concourse.position.set(0, 2.75, 0);
  concourse.castShadow = true;
  concourse.receiveShadow = true;
  terminalGroup.add(concourse);

  // Aerodynamic Curved Roof Canopy
  const roofGeo = new THREE.CylinderGeometry(8, 8, 25, 16, 1, false, 0, Math.PI);
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Sky blue modern terminal roof
    metalness: 0.4,
    roughness: 0.3,
  });
  const roofMesh = new THREE.Mesh(roofGeo, roofMat);
  roofMesh.rotation.z = Math.PI / 2;
  roofMesh.rotation.x = Math.PI / 2;
  roofMesh.position.set(0, 5.5, 0);
  roofMesh.castShadow = true;
  terminalGroup.add(roofMesh);

  // Terminal Glass Facade
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x7dd3fc,
    roughness: 0.1,
    transmission: 0.7,
    thickness: 0.8,
  });
  const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 3.8), glassMat);
  frontGlass.position.set(0, 3.2, 12.05);
  terminalGroup.add(frontGlass);

  // Terminal Signboard Canvas
  const termSignCanvas = document.createElement('canvas');
  termSignCanvas.width = 1024;
  termSignCanvas.height = 160;
  const tctx = termSignCanvas.getContext('2d')!;
  tctx.fillStyle = '#0f172a';
  tctx.fillRect(0, 0, 1024, 160);
  tctx.strokeStyle = '#38bdf8';
  tctx.lineWidth = 6;
  tctx.strokeRect(8, 8, 1008, 144);
  tctx.fillStyle = '#f8fafc';
  tctx.font = 'bold 50px sans-serif';
  tctx.textAlign = 'center';
  tctx.fillText('✈️ सुमित इंटरनेशनल एयरपोर्ट ✈️', 512, 65);
  tctx.fillStyle = '#38bdf8';
  tctx.font = 'bold 36px sans-serif';
  tctx.fillText('SUMIT INTERNATIONAL AIRPORT • TERMINAL 1', 512, 120);

  const termSignTex = new THREE.CanvasTexture(termSignCanvas);
  const termSignMesh = new THREE.Mesh(
    new THREE.BoxGeometry(12, 1.8, 0.2),
    new THREE.MeshStandardMaterial({ map: termSignTex, roughness: 0.3 })
  );
  termSignMesh.position.set(0, 5.8, 12.15);
  terminalGroup.add(termSignMesh);

  // ==========================================
  // 3. ATC RADAR CONTROL TOWER
  // ==========================================
  const towerGroup = new THREE.Group();
  towerGroup.position.set(-6, 0, -10);

  // Tall Tower Shaft
  const towerShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.8, 14, 8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 })
  );
  towerShaft.position.set(0, 7, 0);
  towerShaft.castShadow = true;
  towerGroup.add(towerShaft);

  // 360-degree Glass Control Cab
  const cabGeo = new THREE.CylinderGeometry(2.6, 2.0, 2.5, 12);
  const cabMesh = new THREE.Mesh(cabGeo, glassMat);
  cabMesh.position.set(0, 15, 0);
  towerGroup.add(cabMesh);

  // Tower Roof & Beacon
  const towerRoof = new THREE.Mesh(
    new THREE.ConeGeometry(2.8, 1.2, 12),
    new THREE.MeshStandardMaterial({ color: 0xb91c1c })
  );
  towerRoof.position.set(0, 16.8, 0);
  towerGroup.add(towerRoof);

  // Rotating Radar Dish
  const radarGroup = new THREE.Group();
  radarGroup.position.set(0, 17.8, 0);
  const radarDish = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 0.15, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
  );
  radarDish.rotation.x = Math.PI / 4;
  radarGroup.add(radarDish);
  towerGroup.add(radarGroup);

  // Blinking Red Aviation Beacon
  const beaconLight = new THREE.PointLight(0xef4444, 2, 20);
  beaconLight.position.set(0, 18.2, 0);
  towerGroup.add(beaconLight);

  terminalGroup.add(towerGroup);

  // ==========================================
  // 4. AIRPORT PASSENGERS & STAFF
  // ==========================================
  // Passenger 1: Rahul with rolling suitcase heading for boarding
  const p1 = createIndianCharacter({
    name: 'Rahul Traveler (राहुल यात्री)',
    role: 'Checking in for Sumit Airways Flight SN-777 to Mumbai',
    roleHindi: 'सुमित एयरवेज की उड़ान के लिए चेक-इन करते हुए',
    clothColor: 0x0284c7,
    hasSuitcase: true,
  });
  p1.group.position.set(4, 0, 14);
  terminalGroup.add(p1.group);
  interactiveMeshes.push(p1.group);

  // Passenger 2: Sunita sitting on airport bench with travel bag
  const p2 = createIndianCharacter({
    name: 'Sunita (सुनीता)',
    role: 'Waiting in airport lounge with boarding pass',
    roleHindi: 'लाउंज में बैठकर बोर्डिंग का इंतज़ार करते हुए',
    clothColor: 0xec4899,
    hasBag: true,
  });
  p2.group.position.set(-2, 0, 14);
  terminalGroup.add(p2.group);
  interactiveMeshes.push(p2.group);

  // Airport Marshaller / Ground Staff in High-Vis vest with wands
  const marshaller = createIndianCharacter({
    name: 'Vikram Ground Staff (विक्रम ग्राउंड स्टाफ)',
    role: 'Guiding flight departure with illuminated marshalling wands',
    roleHindi: 'विमान को उड़ान भरने का सिग्नल देते हुए',
    clothColor: 0xeab308, // Neon yellow safety vest
  });
  marshaller.group.position.set(12, 0, 4);
  terminalGroup.add(marshaller.group);
  interactiveMeshes.push(marshaller.group);

  group.add(terminalGroup);

  // ==========================================
  // 5. ANIMATED 3D PASSENGER AIRPLANE
  // ==========================================
  const plane = new THREE.Group();
  plane.name = 'Sumit_Nagri_Airbus';
  plane.userData = {
    isInteractive: true,
    type: 'airplane',
    title: 'Flight SN-777 (सुमित एयरवेज फ़्लाइट)',
    titleHindi: 'सुमित एयरलाइन्स फ़्लाइट SN-777 • आकाश दर्शन',
    description: 'Twin-engine passenger jet cruising smoothly over the skyline of Sumit Ki Nagri. Click to board and fly alongside!',
    descriptionHindi: 'सुमित की नगरी के आकाश में उड़ता हुआ शानदार विमान। इसमें बैठकर पूरे नगर का हवाई दृश्य देखें!',
    action: 'board_flight',
  };

  const liveryMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Crisp airliner white
    roughness: 0.25,
    metalness: 0.15,
  });

  const blueLiveryMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Sumit Airways signature blue
    roughness: 0.3,
  });

  // Fuselage Body (Length: 9.5m, Radius: 0.85m)
  const fuselageGeo = new THREE.CylinderGeometry(0.85, 0.85, 9.5, 16);
  const fuselage = new THREE.Mesh(fuselageGeo, liveryMat);
  fuselage.rotation.x = Math.PI / 2;
  fuselage.position.set(0, 1.8, 0);
  fuselage.castShadow = true;
  plane.add(fuselage);

  // Streamlined Nose Cone
  const noseGeo = new THREE.SphereGeometry(0.85, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, liveryMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.set(0, 1.8, 4.75);
  plane.add(nose);

  // Cockpit Tinted Windshield
  const windshieldMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    transmission: 0.6,
  });
  const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.6), windshieldMat);
  cockpit.position.set(0, 2.25, 4.3);
  plane.add(cockpit);

  // Passenger Cabin Windows Strip
  for (let z = -3.2; z <= 3.2; z += 0.8) {
    const winL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.35), windshieldMat);
    winL.position.set(-0.85, 1.95, z);
    plane.add(winL);

    const winR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.35), windshieldMat);
    winR.position.set(0.85, 1.95, z);
    plane.add(winR);
  }

  // Main Swept Wings
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(6.5, -2.5);
  wingShape.lineTo(6.2, -3.4);
  wingShape.lineTo(0, -1.8);
  wingShape.closePath();

  const wingExtrude = new THREE.ExtrudeGeometry(wingShape, { depth: 0.14, bevelEnabled: false });
  const rightWing = new THREE.Mesh(wingExtrude, liveryMat);
  rightWing.rotation.x = Math.PI / 2;
  rightWing.position.set(0.6, 1.75, 1.2);
  rightWing.castShadow = true;
  plane.add(rightWing);

  const leftWing = rightWing.clone();
  leftWing.scale.x = -1;
  leftWing.position.set(-0.6, 1.75, 1.2);
  plane.add(leftWing);

  // Wingtip Winglets with Navigation Lights
  const redNavLight = new THREE.PointLight(0xef4444, 1.5, 6);
  redNavLight.position.set(-6.8, 2.4, -1.5);
  plane.add(redNavLight);

  const greenNavLight = new THREE.PointLight(0x22c55e, 1.5, 6);
  greenNavLight.position.set(6.8, 2.4, -1.5);
  plane.add(greenNavLight);

  // Twin Jet Engines
  const engineGeo = new THREE.CylinderGeometry(0.42, 0.38, 2.0, 12);
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.3 });
  const engL = new THREE.Mesh(engineGeo, engineMat);
  engL.rotation.x = Math.PI / 2;
  engL.position.set(-2.5, 1.1, 0.4);
  engL.castShadow = true;
  plane.add(engL);

  const engR = engL.clone();
  engR.position.set(2.5, 1.1, 0.4);
  plane.add(engR);

  // Tail Vertical Stabilizer with Indian Colors & Blue Livery
  const tailFinShape = new THREE.Shape();
  tailFinShape.moveTo(0, 0);
  tailFinShape.lineTo(0, 2.6);
  tailFinShape.lineTo(-1.6, 2.6);
  tailFinShape.lineTo(-2.4, 0);
  tailFinShape.closePath();

  const tailFin = new THREE.Mesh(
    new THREE.ExtrudeGeometry(tailFinShape, { depth: 0.15, bevelEnabled: false }),
    blueLiveryMat
  );
  tailFin.rotation.y = Math.PI / 2;
  tailFin.position.set(0.075, 2.4, -2.6);
  plane.add(tailFin);

  // Tail Horizontal Stabilizers
  const horizStabilizer = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 1.2), blueLiveryMat);
  horizStabilizer.position.set(0, 2.5, -4.2);
  plane.add(horizStabilizer);

  // Tricycle Landing Gear
  const gearMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
  const noseWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 8), gearMat);
  noseWheel.rotation.z = Math.PI / 2;
  noseWheel.position.set(0, 0.2, 3.8);
  plane.add(noseWheel);

  const mainWheelL = noseWheel.clone();
  mainWheelL.position.set(-1.2, 0.2, -0.6);
  plane.add(mainWheelL);

  const mainWheelR = noseWheel.clone();
  mainWheelR.position.set(1.2, 0.2, -0.6);
  plane.add(mainWheelR);

  // Seated passengers inside visible through windows (Sumit and friends!)
  const seatedPassenger1 = createIndianCharacter({
    name: 'Sumit Gupta in Flight (सुमित गुप्ता)',
    role: 'Passenger Window Seat 1A enjoying aerial panoramic view',
    roleHindi: 'खिड़की से नगर का सुंदर दृश्य देखते हुए',
    clothColor: 0xd97706,
  });
  seatedPassenger1.group.scale.set(0.45, 0.45, 0.45);
  seatedPassenger1.group.position.set(-0.35, 1.6, 2.0);
  plane.add(seatedPassenger1.group);

  group.add(plane);
  interactiveMeshes.push(plane);
  interactiveMeshes.push(group);

  // ==========================================
  // 6. CONTINUOUS FLIGHT PATH STATE MACHINE
  // ==========================================
  // Loop cycle: Total 60 seconds
  // 0s - 8s: Taxi to runway threshold (x: 38, z: 32)
  // 8s - 16s: Takeoff roll accelerating down runway (z: 32 -> -18)
  // 16s - 26s: Lift-off and climb over city (y: 2 -> 32, banking left)
  // 26s - 48s: High altitude scenic cruise circling the town (altitude 30-38m)
  // 48s - 56s: Descent and final approach to runway
  // 56s - 60s: Touchdown and braking on runway
  let flightTimer = 18; // Start mid-flight for instant exciting visual!

  const currentStatus: FlightStatus = {
    flightNumber: 'SN-777',
    destination: 'Mumbai • Delhi • Global',
    destinationHindi: 'मुंबई • दिल्ली • वैश्विक',
    status: 'AIRBORNE • IN FLIGHT',
    statusHindi: 'हवा में उड़ान भर रहा है',
    altitude: 3200,
    speedKmh: 450,
    phase: 'CRUISE',
  };

  const update = (delta: number, time: number) => {
    flightTimer = (flightTimer + delta) % 64;

    // 1. Radar rotation & beacon pulse
    radarGroup.rotation.y += delta * 2.5;
    beaconLight.intensity = Math.sin(time * 8) > 0.4 ? 2.8 : 0.2;

    // 2. Flight Position calculation
    const runwayX = 38;

    if (flightTimer < 8) {
      // PHASE: TAXI
      const p = flightTimer / 8;
      const x = THREE.MathUtils.lerp(28, runwayX, p);
      const z = THREE.MathUtils.lerp(24, 30, p);
      plane.position.set(x, 0, z);
      plane.rotation.set(0, 0, 0); // Pointing down runway north
      currentStatus.phase = 'TAXI';
      currentStatus.status = 'TAXIING TO RUNWAY 09';
      currentStatus.statusHindi = 'रनवे 09 की ओर टैक्सी कर रहा है';
      currentStatus.altitude = 0;
      currentStatus.speedKmh = 35;
    } else if (flightTimer < 16) {
      // PHASE: TAKEOFF ROLL
      const p = (flightTimer - 8) / 8;
      const z = THREE.MathUtils.lerp(30, -16, p * p); // Accelerate
      plane.position.set(runwayX, 0, z);
      plane.rotation.set(p * 0.12, Math.PI, 0); // Slight pitch up
      currentStatus.phase = 'TAKEOFF';
      currentStatus.status = 'TAKEOFF ROLL • RUNWAY 09';
      currentStatus.statusHindi = 'रनवे पर तीव्र गति से उड़ान भरते हुए';
      currentStatus.altitude = Math.round(p * 300);
      currentStatus.speedKmh = Math.round(120 + p * 180);
    } else if (flightTimer < 26) {
      // PHASE: CLIMB & BANK
      const p = (flightTimer - 16) / 10;
      const altitude = THREE.MathUtils.lerp(0.5, 32, p);
      // Curve out over town
      const ang = Math.PI - p * (Math.PI * 0.5);
      const rad = 38;
      const x = Math.sin(ang) * rad;
      const z = -16 - (1 - Math.cos(ang)) * 24;
      plane.position.set(x, altitude, z);
      plane.rotation.set(0.2, ang - Math.PI / 2, -0.3); // Banking roll
      currentStatus.phase = 'TAKEOFF';
      currentStatus.status = 'CLIMBING OVER SUMIT NAGRI';
      currentStatus.statusHindi = 'सुमित नगर के ऊपर ऊँचाई पर चढ़ते हुए';
      currentStatus.altitude = Math.round(300 + p * 2800);
      currentStatus.speedKmh = 420;
    } else if (flightTimer < 50) {
      // PHASE: HIGH ALTITUDE SCENIC CRUISE OVER CITY SKYLINE
      const p = (flightTimer - 26) / 24; // 0 to 1
      const theta = p * Math.PI * 2; // Full majestic oval circuit
      const radiusX = 42;
      const radiusZ = 38;
      const x = Math.cos(theta) * radiusX;
      const z = Math.sin(theta) * radiusZ;
      const y = 32 + Math.sin(p * Math.PI * 4) * 3; // Gentle cruising swell

      plane.position.set(x, y, z);

      // Facing tangent to flight path with gentle banking roll
      const heading = theta + Math.PI / 2;
      const bankAngle = -0.25;
      plane.rotation.set(0.04, -heading, bankAngle);

      currentStatus.phase = 'CRUISE';
      currentStatus.status = 'CRUISING OVER SUMIT KI NAGRI';
      currentStatus.statusHindi = 'सुमित की नगरी के आकाश में विहंगम चक्कर';
      currentStatus.altitude = 3500;
      currentStatus.speedKmh = 540;
    } else if (flightTimer < 58) {
      // PHASE: APPROACH & DESCENT
      const p = (flightTimer - 50) / 8;
      const x = THREE.MathUtils.lerp(42, runwayX, p);
      const z = THREE.MathUtils.lerp(48, 30, p);
      const y = THREE.MathUtils.lerp(30, 0.2, p);

      plane.position.set(x, y, z);
      plane.rotation.set(-0.08, Math.PI, 0); // Gentle flare

      currentStatus.phase = 'DESCENT';
      currentStatus.status = 'FINAL APPROACH RUNWAY 09';
      currentStatus.statusHindi = 'रनवे 09 पर उतरने की तैयारी';
      currentStatus.altitude = Math.round((1 - p) * 3000);
      currentStatus.speedKmh = Math.round(280 - p * 120);
    } else {
      // PHASE: TOUCHDOWN & TAXI ROLLOUT
      const p = (flightTimer - 58) / 6;
      const z = THREE.MathUtils.lerp(30, 0, p);
      plane.position.set(runwayX, 0, z);
      plane.rotation.set(0, Math.PI, 0);

      currentStatus.phase = 'LANDING';
      currentStatus.status = 'TOUCHDOWN & BRAKING';
      currentStatus.statusHindi = 'सकुशल लैंडिंग • नगर में पुनः स्वागत है';
      currentStatus.altitude = 0;
      currentStatus.speedKmh = Math.round((1 - p) * 120 + 20);
    }
  };

  const getFlightStatus = () => ({ ...currentStatus });

  const getAirplaneWorldPos = () => {
    const worldPos = new THREE.Vector3();
    plane.getWorldPosition(worldPos);
    return worldPos;
  };

  const getAirplaneForward = () => {
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(plane.quaternion);
    return forward;
  };

  return {
    group,
    airplane: plane,
    update,
    getFlightStatus,
    getAirplaneWorldPos,
    getAirplaneForward,
    interactiveMeshes,
  };
}

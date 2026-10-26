import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';

/**
 * Builds an authentic Indian Auto-Rickshaw (Tuk-Tuk) composite model.
 * Complies with 3-12 part procedural model standard with distinct silhouettes,
 * varied roughness/metalness, and bottom-center pivot grounding.
 */
export function buildAutoRickshaw(): THREE.Group {
  const rickshaw = new THREE.Group();
  rickshaw.name = 'AutoRickshaw';

  // Materials with varied roughness & metalness
  const yellowCanopyMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.35,
    metalness: 0.1,
  });

  const greenBodyMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.4,
    metalness: 0.2,
  });

  const blackRubberMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.05,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.9,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    metalness: 0.1,
  });

  const lightGlowMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });

  // 1. Lower Body Chassis (Green)
  const chassisGeo = new THREE.BoxGeometry(1.6, 0.7, 2.4);
  const chassis = new THREE.Mesh(chassisGeo, greenBodyMat);
  chassis.position.set(0, 0.55, 0);
  chassis.castShadow = true;
  rickshaw.add(chassis);

  // 2. Yellow Upper Canopy / Roof
  const roofGeo = new THREE.BoxGeometry(1.58, 0.6, 1.7);
  const roof = new THREE.Mesh(roofGeo, yellowCanopyMat);
  roof.position.set(0, 1.25, -0.2);
  roof.castShadow = true;
  rickshaw.add(roof);

  // Roof curved top edge
  const roofTopGeo = new THREE.CylinderGeometry(0.79, 0.79, 1.7, 16, 1, false, 0, Math.PI);
  const roofTop = new THREE.Mesh(roofTopGeo, yellowCanopyMat);
  roofTop.rotation.z = Math.PI / 2;
  roofTop.rotation.y = Math.PI / 2;
  roofTop.position.set(0, 1.55, -0.2);
  rickshaw.add(roofTop);

  // 3. Windshield Frame & Glass (Tapered front cabin)
  const cabinFrontGeo = new THREE.BoxGeometry(1.4, 0.7, 0.6);
  const cabinFront = new THREE.Mesh(cabinFrontGeo, greenBodyMat);
  cabinFront.position.set(0, 0.75, 0.9);
  rickshaw.add(cabinFront);

  const windshieldGeo = new THREE.PlaneGeometry(1.3, 0.65);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 1.25, 0.75);
  windshield.rotation.x = -0.15;
  rickshaw.add(windshield);

  // 4. Wheels (1 Front centered, 2 Rear sides)
  const tireGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.16, 18);
  const hubcapGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.17, 12);

  // Front Wheel
  const frontWheelGroup = new THREE.Group();
  const frontTire = new THREE.Mesh(tireGeo, blackRubberMat);
  frontTire.rotation.z = Math.PI / 2;
  frontTire.castShadow = true;
  const frontHub = new THREE.Mesh(hubcapGeo, chromeMat);
  frontHub.rotation.z = Math.PI / 2;
  frontWheelGroup.add(frontTire, frontHub);
  frontWheelGroup.position.set(0, 0.3, 1.2);
  rickshaw.add(frontWheelGroup);

  // Rear Left Wheel
  const rearLeftWheel = new THREE.Group();
  const rlTire = new THREE.Mesh(tireGeo, blackRubberMat);
  rlTire.rotation.z = Math.PI / 2;
  rlTire.castShadow = true;
  const rlHub = new THREE.Mesh(hubcapGeo, chromeMat);
  rlHub.rotation.z = Math.PI / 2;
  rearLeftWheel.add(rlTire, rlHub);
  rearLeftWheel.position.set(-0.85, 0.3, -0.6);
  rickshaw.add(rearLeftWheel);

  // Rear Right Wheel
  const rearRightWheel = new THREE.Group();
  const rrTire = new THREE.Mesh(tireGeo, blackRubberMat);
  rrTire.rotation.z = Math.PI / 2;
  rrTire.castShadow = true;
  const rrHub = new THREE.Mesh(hubcapGeo, chromeMat);
  rrHub.rotation.z = Math.PI / 2;
  rearRightWheel.add(rrTire, rrHub);
  rearRightWheel.position.set(0.85, 0.3, -0.6);
  rickshaw.add(rearRightWheel);

  // 5. Front Round Headlight
  const headlightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 16);
  const headlight = new THREE.Mesh(headlightGeo, lightGlowMat);
  headlight.rotation.x = Math.PI / 2;
  headlight.position.set(0, 0.72, 1.22);
  rickshaw.add(headlight);

  // Chrome mudguard over front wheel
  const mudguardGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 12, 1, false, 0, Math.PI);
  const mudguard = new THREE.Mesh(mudguardGeo, chromeMat);
  mudguard.rotation.z = Math.PI / 2;
  mudguard.position.set(0, 0.42, 1.2);
  rickshaw.add(mudguard);

  // 6. Rear "HORN OK PLEASE" Decal Board
  const rearPlateGeo = new THREE.PlaneGeometry(0.9, 0.45);
  const rearPlateMat = new THREE.MeshStandardMaterial({
    map: TextureGenerator.createRickshawPlate(),
    roughness: 0.3,
  });
  const rearPlate = new THREE.Mesh(rearPlateGeo, rearPlateMat);
  rearPlate.position.set(0, 0.55, -1.21);
  rearPlate.rotation.y = Math.PI;
  rickshaw.add(rearPlate);

  // 7. Interior Passenger Seat (Black leather)
  const seatGeo = new THREE.BoxGeometry(1.3, 0.35, 0.6);
  const seat = new THREE.Mesh(seatGeo, blackRubberMat);
  seat.position.set(0, 0.6, -0.5);
  rickshaw.add(seat);

  // Driver Handlebar
  const handlebarGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
  const handlebar = new THREE.Mesh(handlebarGeo, chromeMat);
  handlebar.rotation.z = Math.PI / 2;
  handlebar.position.set(0, 0.85, 0.55);
  rickshaw.add(handlebar);

  // 8. Ground Contact Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.4, 3.2);
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
  grad.addColorStop(0, 'rgba(0,0,0,0.5)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.2)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 128, 128);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, 0.02, 0);
  rickshaw.add(shadowMesh);

  // Interactive userData
  rickshaw.userData = {
    isInteractive: true,
    type: 'rickshaw',
    title: 'Nagri Express Auto (राजेश भाई ऑटो)',
    titleHindi: 'नगरी एक्सप्रेस ऑटो',
    driver: 'Rajesh Bhai',
    description: 'Iconic yellow-green 3-wheeler cruising through Sumit Ki Nagri. Click to honk!',
    descriptionHindi: 'सुमित की नगरी का सबसे भरोसेमंद सवारी ऑटो। हॉर्न बजाने के लिए क्लिक करें!',
    action: 'honk',
  };

  return rickshaw;
}

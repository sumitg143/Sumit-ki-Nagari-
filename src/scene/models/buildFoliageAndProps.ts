import * as THREE from 'three';

/**
 * Builds Indian roadside street props:
 * - Gulmohar blossoming tree
 * - Vintage cast-iron street lamps
 * - Milestone marker ("सुमित नगर 0 KM")
 * - Road network layout
 */

export function buildGulmoharTree(): THREE.Group {
  const tree = new THREE.Group();
  tree.name = 'GulmoharTree';

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x58250e,
    roughness: 0.9,
  });

  const blossomMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48, // Fiery red-orange Gulmohar blossoms
    roughness: 0.7,
  });

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Lush green
    roughness: 0.8,
  });

  // Trunk
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.45, 4.0, 10),
    trunkMat
  );
  trunk.position.set(0, 2.0, 0);
  trunk.castShadow = true;
  tree.add(trunk);

  // Branches & Blossoms
  const foliageClusters = [
    [0, 4.2, 0, 1.8, blossomMat],
    [-1.2, 3.8, 0.8, 1.3, blossomMat],
    [1.2, 3.8, -0.6, 1.3, leafMat],
    [0.6, 4.6, 0.8, 1.4, blossomMat],
    [-0.7, 4.5, -0.8, 1.2, blossomMat],
  ];

  foliageClusters.forEach(([cx, cy, cz, cr, mat]) => {
    const cluster = new THREE.Mesh(
      new THREE.SphereGeometry(cr as number, 12, 10),
      mat as THREE.Material
    );
    cluster.position.set(cx as number, cy as number, cz as number);
    cluster.castShadow = true;
    tree.add(cluster);
  });

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 4.5),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, 0);
  tree.add(shadow);

  return tree;
}

export function buildStreetLamp(): THREE.Group {
  const lamp = new THREE.Group();
  lamp.name = 'StreetLamp';

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.3,
  });

  const glowMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });

  // Post
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 4.5, 8),
    ironMat
  );
  pole.position.set(0, 2.25, 0);
  pole.castShadow = true;
  lamp.add(pole);

  // Lamp Head bracket
  const arm = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.04, 6, 12, Math.PI),
    ironMat
  );
  arm.position.set(0.2, 4.3, 0);
  arm.rotation.z = -Math.PI / 2;
  lamp.add(arm);

  // Glass lantern globe
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    glowMat
  );
  globe.position.set(0.5, 4.2, 0);
  lamp.add(globe);

  return lamp;
}

export function buildMilestone(): THREE.Group {
  const stone = new THREE.Group();
  stone.name = 'Milestone';

  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15, // Yellow state highway top
    roughness: 0.5,
  });

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9, // White lower body
    roughness: 0.6,
  });

  // Lower white cylinder
  const lower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.28, 0.7, 16),
    whiteMat
  );
  lower.position.set(0, 0.35, 0);
  stone.add(lower);

  // Upper yellow dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    yellowMat
  );
  dome.position.set(0, 0.7, 0);
  stone.add(dome);

  return stone;
}

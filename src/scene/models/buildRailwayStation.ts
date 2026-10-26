import * as THREE from 'three';
import { TextureGenerator } from '../textureGenerator.ts';

/**
 * Builds Sumit Nagar Junction (Railway Station & Platform)
 * with vintage clock, yellow station signboard, railway track,
 * and an animated Indian express train!
 */
export function buildRailwayStation(): {
  group: THREE.Group;
  updateTrain: (delta: number) => void;
  getTrainWorldPos: () => THREE.Vector3;
} {
  const station = new THREE.Group();
  station.name = 'SumitNagarJunction';

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Colonial Indian red brick
    roughness: 0.8,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.5,
  });

  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x64748b, // Grey platform stone
    roughness: 0.7,
  });

  const platformYellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.4,
  });

  const steelRailMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2,
  });

  const woodSleeperMat = new THREE.MeshStandardMaterial({
    color: 0x3f200c,
    roughness: 0.9,
  });

  // 1. Station Platform
  const platformGeo = new THREE.BoxGeometry(26, 0.6, 5);
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.set(0, 0.3, 0);
  platform.castShadow = true;
  platform.receiveShadow = true;
  station.add(platform);

  // Yellow Safety Line along edge
  const safetyLine = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.05, 0.3),
    platformYellowMat
  );
  safetyLine.position.set(0, 0.62, 2.2);
  station.add(safetyLine);

  // 2. Station Main Building
  const buildingGeo = new THREE.BoxGeometry(10, 3.6, 3.2);
  const building = new THREE.Mesh(buildingGeo, brickMat);
  building.position.set(-2, 2.1, -1.8);
  building.castShadow = true;
  station.add(building);

  // Building Roof with overhang
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 0.4, 3.8),
    trimMat
  );
  roof.position.set(-2, 4.0, -1.8);
  station.add(roof);

  // Station Clock Tower
  const towerGeo = new THREE.BoxGeometry(2.4, 3.0, 2.4);
  const tower = new THREE.Mesh(towerGeo, brickMat);
  tower.position.set(-2, 5.5, -1.8);
  tower.castShadow = true;
  station.add(tower);

  // Clock face
  const clockGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 24);
  const clockMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
  });
  const clock = new THREE.Mesh(clockGeo, clockMat);
  clock.rotation.x = Math.PI / 2;
  clock.position.set(-2, 5.8, -0.55);
  station.add(clock);

  // Tower pyramid roof
  const towerRoof = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 1.4, 4),
    trimMat
  );
  towerRoof.rotation.y = Math.PI / 4;
  towerRoof.position.set(-2, 7.6, -1.8);
  station.add(towerRoof);

  // 3. Iconic Yellow Indian Railway Signboards (Both ends of platform)
  [-8, 8].forEach((bx) => {
    const boardGroup = new THREE.Group();
    // 2 poles
    [-1.2, 1.2].forEach((px) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      pole.position.set(px, 1.2, 0);
      boardGroup.add(pole);
    });

    // Yellow Board
    const boardPlane = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.0, 0.08),
      new THREE.MeshStandardMaterial({
        map: TextureGenerator.createRailwayStationBoard(),
        roughness: 0.35,
      })
    );
    boardPlane.position.set(0, 1.8, 0);
    boardGroup.add(boardPlane);

    boardGroup.position.set(bx, 0.6, 1.0);
    station.add(boardGroup);
  });

  // 4. Railway Tracks (Rails & Sleepers)
  const trackGroup = new THREE.Group();
  const trackLength = 48;

  // Steel Rails (2 parallel bars)
  [-0.8, 0.8].forEach((rx) => {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(trackLength, 0.12, 0.08),
      steelRailMat
    );
    rail.position.set(0, 0.1, rx);
    trackGroup.add(rail);
  });

  // Wooden / Concrete Sleepers
  for (let z = -trackLength / 2; z <= trackLength / 2; z += 1.2) {
    const sleeper = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.08, 2.2),
      woodSleeperMat
    );
    sleeper.position.set(z, 0.04, 0);
    trackGroup.add(sleeper);
  }

  // Stone ballast gravel bed
  const ballast = new THREE.Mesh(
    new THREE.BoxGeometry(trackLength, 0.05, 2.8),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95 })
  );
  ballast.position.set(0, 0.01, 0);
  trackGroup.add(ballast);

  trackGroup.position.set(0, 0, 3.8);
  station.add(trackGroup);

  // 5. Indian Express Train (Blue & Red WAP-7 Locomotive + 2 Coaches)
  const trainGroup = new THREE.Group();

  const locoMat = new THREE.MeshStandardMaterial({
    color: 0x1e40af, // Indian Railway Royal Blue
    roughness: 0.35,
    metalness: 0.3,
  });

  const locoStripeMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c, // Red express stripe
    roughness: 0.4,
  });

  const coachMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    roughness: 0.4,
  });

  // Locomotive Body
  const loco = new THREE.Group();
  const locoBody = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.6, 1.4), locoMat);
  locoBody.position.set(0, 1.1, 0);
  loco.add(locoBody);

  const locoStripe = new THREE.Mesh(new THREE.BoxGeometry(5.22, 0.25, 1.42), locoStripeMat);
  locoStripe.position.set(0, 1.1, 0);
  loco.add(locoStripe);

  // Locomotive front cab wedge
  const cabWedge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 1.38), locoMat);
  cabWedge.position.set(2.4, 0.9, 0);
  loco.add(cabWedge);

  // Headlight
  const headlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 1.0,
    })
  );
  headlight.position.set(2.8, 1.2, 0);
  loco.add(headlight);

  // Pantograph on roof
  const panto = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.4, 0.8),
    steelRailMat
  );
  panto.position.set(-0.5, 2.1, 0);
  loco.add(panto);

  trainGroup.add(loco);

  // Passenger Coaches (2 coaches behind)
  const passengerHeads: THREE.Mesh[] = [];

  [-5.8, -11.6].forEach((cx, coachIdx) => {
    const coach = new THREE.Group();
    const coachBody = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.5, 1.4), coachMat);
    coachBody.position.set(0, 1.05, 0);
    coach.add(coachBody);

    // Coach cutaway glass windows strip with transparency
    const glassWindow = new THREE.Mesh(
      new THREE.BoxGeometry(5.42, 0.45, 1.42),
      new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
      })
    );
    glassWindow.position.set(0, 1.15, 0);
    coach.add(glassWindow);

    // Visible Seated Passengers inside the Coach looking out windows!
    [-1.6, 0, 1.6].forEach((seatX, seatIdx) => {
      const passenger = new THREE.Group();
      // Body
      const pBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.45, 0.3),
        new THREE.MeshStandardMaterial({
          color: (seatIdx + coachIdx) % 2 === 0 ? 0xf97316 : 0x10b981,
          roughness: 0.6,
        })
      );
      pBody.position.set(0, 0.9, (seatIdx % 2 === 0 ? 0.35 : -0.35));

      // Head
      const pHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xaf7a48, roughness: 0.8 })
      );
      pHead.position.set(0, 1.25, (seatIdx % 2 === 0 ? 0.35 : -0.35));

      passenger.add(pBody, pHead);
      passenger.position.set(seatX, 0, 0);
      coach.add(passenger);
      passengerHeads.push(pHead);
    });

    coach.position.set(cx, 0, 0);
    trainGroup.add(coach);
  });

  trainGroup.position.set(0, 0, 3.8);
  station.add(trainGroup);

  // Train animation state
  let trainX = 24;
  const trainSpeed = 4.8;
  const updateTrain = (delta: number) => {
    trainX -= trainSpeed * delta;
    if (trainX < -32) {
      trainX = 36;
    }
    trainGroup.position.x = trainX;

    // Gentle rhythmic train sway / bounce
    const bounce = Math.sin(trainX * 1.5) * 0.02;
    trainGroup.position.y = bounce;
  };

  const getTrainWorldPos = (): THREE.Vector3 => {
    const pos = new THREE.Vector3();
    trainGroup.getWorldPosition(pos);
    return pos;
  };

  // Interactive userData
  station.userData = {
    isInteractive: true,
    type: 'station',
    title: 'Sumit Nagar Junction (सुमित नगर जंक्शन)',
    titleHindi: 'सुमित नगर जंक्शन • एक्सप्रेस ट्रेन',
    description: 'Heritage railway platform connecting Sumit Ki Nagri. Click to blow train whistle or take a train ride!',
    descriptionHindi: 'सुमित नगर जंक्शन - एक्सप्रेस ट्रेन में बैठें और पूरे शहर की सैर करें!',
    action: 'train',
  };

  return { group: station, updateTrain, getTrainWorldPos };
}

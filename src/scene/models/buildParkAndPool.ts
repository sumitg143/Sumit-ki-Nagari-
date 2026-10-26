import * as THREE from 'three';

/**
 * Builds Sumit Children's Park, Swings (झूला), Swimming Pool & Readers
 * Features:
 * - A-Frame Swings with kids swinging smoothly back and forth
 * - Swimming pool with animated swimmers doing freestyle strokes and splash ripples
 * - Sun loungers, umbrellas, and diving board
 * - Park benches with people sitting reading Somo novels with turning book pages
 */
export function buildParkAndPool(): THREE.Group {
  const park = new THREE.Group();
  park.name = 'SumitParkAndPool';

  // Materials
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80, // Vibrant fresh park grass
    roughness: 0.85,
  });

  const poolBorderMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9, // Clean white coping stone
    roughness: 0.4,
  });

  const poolWaterMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan swimming pool water
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.8,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.7,
  });

  // 1. Lush Green Park Base Plinth
  const baseLawn = new THREE.Mesh(new THREE.BoxGeometry(20, 0.3, 14), grassMat);
  baseLawn.position.set(0, 0.15, 0);
  baseLawn.receiveShadow = true;
  park.add(baseLawn);

  // Stone Walkway dividing park and pool
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
  const walkway = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 14), pathMat);
  walkway.rotation.x = -Math.PI / 2;
  walkway.position.set(0, 0.31, 0);
  park.add(walkway);

  // =========================================================================
  // 2. SWINGS AREA (झूला) - Left Side
  // =========================================================================
  const swingFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6 });
  const swingSet = new THREE.Group();

  // A-Frame Posts
  [-2.2, 2.2].forEach((sx) => {
    // Left leg
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.8, 8), swingFrameMat);
    leg1.position.set(sx, 1.8, -0.6);
    leg1.rotation.x = 0.25;
    // Right leg
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.8, 8), swingFrameMat);
    leg2.position.set(sx, 1.8, 0.6);
    leg2.rotation.x = -0.25;
    swingSet.add(leg1, leg2);
  });

  // Top Bar
  const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.8, 8), swingFrameMat);
  topBar.rotation.z = Math.PI / 2;
  topBar.position.set(0, 3.5, 0);
  swingSet.add(topBar);

  // 2 Hanging Swings with Kids
  const swingRopes: THREE.Group[] = [];

  [-1.1, 1.1].forEach((swX, idx) => {
    const swingArm = new THREE.Group();
    swingArm.position.set(swX, 3.5, 0);

    // Chains
    [-0.3, 0.3].forEach((cx) => {
      const chain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 2.4, 6),
        new THREE.MeshBasicMaterial({ color: 0x475569 })
      );
      chain.position.set(cx, -1.2, 0);
      swingArm.add(chain);
    });

    // Seat plank
    const seatPlank = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.08, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xe11d48 })
    );
    seatPlank.position.set(0, -2.4, 0);
    swingArm.add(seatPlank);

    // Child sitting on swing
    const kid = new THREE.Group();
    const kidBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: idx === 0 ? 0xf59e0b : 0x8b5cf6 })
    );
    kidBody.position.set(0, 0.35, 0);
    const kidHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    kidHead.position.set(0, 0.72, 0);
    kid.add(kidBody, kidHead);
    kid.position.set(0, -2.35, 0);
    swingArm.add(kid);

    swingSet.add(swingArm);
    swingRopes.push(swingArm);
  });

  swingSet.position.set(-5.5, 0, 0);
  park.add(swingSet);

  // Playground Slide next to swings
  const slideMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.3 });
  const slide = new THREE.Group();
  const slideChute = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 3.2), slideMat);
  slideChute.position.set(0, 1.2, 0);
  slideChute.rotation.x = 0.55;
  const slideLadder = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), swingFrameMat);
  slideLadder.position.set(0, 1.1, -1.4);
  slide.add(slideChute, slideLadder);
  slide.position.set(-8.5, 0, 3.2);
  park.add(slide);

  // =========================================================================
  // 3. PARK BENCH & BOOK READERS
  // =========================================================================
  const benchGroup = new THREE.Group();
  const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.6), woodMat);
  benchSeat.position.set(0, 0.6, 0);
  const benchBack = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.08), woodMat);
  benchBack.position.set(0, 0.95, -0.28);
  benchGroup.add(benchSeat, benchBack);

  // Reader Person sitting holding a Somo eBook
  const reader = new THREE.Group();
  const readerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.65, 8),
    new THREE.MeshStandardMaterial({ color: 0x0284c7 })
  );
  readerBody.position.set(0, 0.35, 0);
  const readerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
  );
  readerHead.position.set(0, 0.75, 0);
  readerHead.rotation.x = 0.3; // Looking down at book

  // Open Book with turning page
  const bookCover = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.04, 0.25),
    new THREE.MeshStandardMaterial({ color: 0xe11d48 })
  );
  bookCover.position.set(0, 0.45, 0.32);
  bookCover.rotation.x = -0.3;
  const bookPage = new THREE.Mesh(
    new THREE.PlaneGeometry(0.28, 0.2),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  bookPage.position.set(0, 0.48, 0.32);
  bookPage.rotation.x = -0.3;
  reader.add(readerBody, readerHead, bookCover, bookPage);
  reader.position.set(0, 0.6, 0);
  benchGroup.add(reader);

  benchGroup.position.set(-4.5, 0, -4.5);
  park.add(benchGroup);

  // =========================================================================
  // 4. SWIMMING POOL (Right Side)
  // =========================================================================
  const poolGroup = new THREE.Group();

  // Pool Basin Coping Border
  const coping = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.4, 11), poolBorderMat);
  coping.position.set(5.5, 0.2, 0);
  poolGroup.add(coping);

  // Water Surface
  const water = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 9.8), poolWaterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(5.5, 0.32, 0);
  poolGroup.add(water);

  // Diving Board
  const divingBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.08, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
  );
  divingBoard.position.set(5.5, 1.1, -4.6);
  const divingStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
  );
  divingStand.position.set(5.5, 0.6, -5.2);
  poolGroup.add(divingBoard, divingStand);

  // Sun Loungers with Beach Umbrella
  [-2.2, 0.5, 3.2].forEach((lz) => {
    const lounger = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.2, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    lounger.position.set(8.8, 0.35, lz);
    poolGroup.add(lounger);
  });

  // Parasol / Umbrella
  const umbrella = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b })
  );
  umbrella.position.set(8.8, 1.8, 0.5);
  const umbrellaPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8),
    new THREE.MeshBasicMaterial({ color: 0x334155 })
  );
  umbrellaPole.position.set(8.8, 1.0, 0.5);
  poolGroup.add(umbrella, umbrellaPole);

  // 2 Animated Swimmers in the Pool
  const swimmers: { group: THREE.Group; speed: number; direction: number; baseZ: number }[] = [];

  [-1.4, 1.4].forEach((swX, i) => {
    const swimmer = new THREE.Group();
    // Swimmer body submerged
    const sBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: i === 0 ? 0xef4444 : 0x3b82f6 })
    );
    sBody.rotation.x = Math.PI / 2;
    sBody.position.set(0, 0.04, 0);

    const sHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    sHead.position.set(0, 0.08, 0.45);

    // Water Splash Ripple ring around swimmer
    const splash = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.4, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    );
    splash.rotation.x = -Math.PI / 2;
    splash.position.set(0, 0.02, 0);

    swimmer.add(sBody, sHead, splash);
    swimmer.position.set(5.5 + swX, 0.32, i === 0 ? -2 : 2);
    poolGroup.add(swimmer);

    swimmers.push({
      group: swimmer,
      speed: 1.6 + i * 0.4,
      direction: i === 0 ? 1 : -1,
      baseZ: swimmer.position.z,
    });
  });

  park.add(poolGroup);

  // UserData & tick loop animation
  park.userData = {
    isInteractive: true,
    type: 'park_pool',
    title: 'Sumit Children Park, Swings & Swimming Pool (पार्क एवं स्विमिंग पूल)',
    titleHindi: 'सुमित चिल्ड्रन्स पार्क, झूला एवं स्वीमिंग पूल',
    description: 'Vibrant township leisure center with pendulum swings (झूला), playground slides, turquoise swimming pool with diving boards, and peaceful reading benches.',
    descriptionHindi: 'नगर का प्रिय मनोरंजन केंद्र। बच्चों के लिए झूला, तैराकों के लिए स्विमिंग पूल और छायादार बेंच पर बैठकर सोमो ई-बुक्स पढ़ने की शांति।',
    action: 'park_pool',
    onTick: (delta: number, elapsed: number) => {
      // 1. Swings oscillating back and forth with harmonic motion
      swingRopes.forEach((swing, i) => {
        const angle = Math.sin(elapsed * 2.8 + i * 1.2) * 0.45;
        swing.rotation.x = angle;
      });

      // 2. Swimmers doing swimming laps
      swimmers.forEach((sw) => {
        sw.group.position.z += sw.speed * sw.direction * delta;
        if (sw.group.position.z > 3.8) {
          sw.direction = -1;
          sw.group.rotation.y = Math.PI;
        } else if (sw.group.position.z < -3.8) {
          sw.direction = 1;
          sw.group.rotation.y = 0;
        }
        // Bobbing up and down in water
        sw.group.position.y = 0.32 + Math.sin(elapsed * 5) * 0.04;
      });

      // 3. Gentle book page turning flutter
      bookPage.rotation.y = Math.sin(elapsed * 2) * 0.2;
    },
  };

  return park;
}

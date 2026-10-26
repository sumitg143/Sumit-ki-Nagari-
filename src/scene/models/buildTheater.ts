import * as THREE from 'three';

/**
 * Builds Sumit Talkies (सुमित 3D टॉकीज / Sumit Cinema Multiplex)
 */
export function buildTheater(): THREE.Group {
  const theater = new THREE.Group();
  theater.name = 'SumitTalkies';

  const maroonWallMat = new THREE.MeshStandardMaterial({
    color: 0x881337,
    roughness: 0.45,
    metalness: 0.1,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.75,
  });

  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.5,
  });

  const screenGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
  });

  // 1. Plinth & Auditorium Body
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.5, 10.5), creamMat);
  plinth.position.set(0, 0.25, 0);
  plinth.receiveShadow = true;
  theater.add(plinth);

  const hall = new THREE.Mesh(new THREE.BoxGeometry(12, 6.2, 9), maroonWallMat);
  hall.position.set(0, 3.6, -0.4);
  hall.castShadow = true;
  hall.receiveShadow = true;
  theater.add(hall);

  // Stepped art-deco roof parapets
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.6, 9.4), goldMat);
  p1.position.set(0, 6.9, -0.4);
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.2, 7.5), maroonWallMat);
  p2.position.set(0, 7.6, -0.4);
  const p3 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.8, 5.5), goldMat);
  p3.position.set(0, 8.4, -0.4);
  theater.add(p1, p2, p3);

  // 2. Marquee Canopy
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.6, 3.4), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  canopy.position.set(0, 4.2, 4.2);
  theater.add(canopy);

  // Glowing Marquee Sign
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const sctx = signCanvas.getContext('2d')!;
  sctx.fillStyle = '#0f172a';
  sctx.fillRect(0, 0, 512, 128);
  sctx.strokeStyle = '#f59e0b';
  sctx.lineWidth = 6;
  sctx.strokeRect(6, 6, 500, 116);
  sctx.fillStyle = '#f59e0b';
  sctx.font = 'bold 36px sans-serif';
  sctx.textAlign = 'center';
  sctx.fillText('🎬 SUMIT TALKIES 🎬', 256, 50);
  sctx.fillStyle = '#ef4444';
  sctx.font = 'bold 30px sans-serif';
  sctx.fillText('सुमित टॉकीज • 3D सिनेमा', 256, 96);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const marqueeSign = new THREE.Mesh(
    new THREE.PlaneGeometry(6.8, 1.7),
    new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.3,
      emissive: 0x331100,
      emissiveIntensity: 0.3,
    })
  );
  marqueeSign.position.set(0, 5.4, 4.3);
  theater.add(marqueeSign);

  // Pillars & Red Carpet
  [-3.8, 3.8].forEach((px) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 4.2, 12), goldMat);
    col.position.set(px, 2.1, 4.2);
    theater.add(col);
  });

  const carpet = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 4.2), new THREE.MeshStandardMaterial({ color: 0xb91c1c }));
  carpet.position.set(0, 0.35, 4.2);
  theater.add(carpet);

  // Ticket Booth (खिड़की)
  const booth = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 1.8), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
  booth.position.set(4.8, 1.5, 4.2);
  theater.add(booth);

  // Popcorn Cart
  const cart = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.2), new THREE.MeshStandardMaterial({ color: 0xe11d48 }));
  cart.position.set(-4.8, 0.9, 4.2);
  theater.add(cart);

  // Interior Screen
  const cinemaScreen = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.6), screenGlowMat);
  cinemaScreen.position.set(0, 3.2, 0.5);
  theater.add(cinemaScreen);

  // Moviegoers in queue
  const patrons: THREE.Group[] = [];
  [-0.8, 0.8, 4.8].forEach((px, i) => {
    const guy = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.22, 0.75, 8),
      new THREE.MeshStandardMaterial({ color: i === 1 ? 0xec4899 : 0x3b82f6 })
    );
    body.position.set(0, 0.8, 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24 }));
    head.position.set(0, 1.35, 0);
    guy.add(body, head);
    guy.position.set(px, 0, i === 2 ? 6.2 : 4.9);
    theater.add(guy);
    patrons.push(guy);
  });

  theater.userData = {
    isInteractive: true,
    type: 'theater',
    title: 'Sumit Talkies 3D Cinema (सुमित टॉकीज)',
    titleHindi: 'सुमित टॉकीज • 3D मूवी थिएटर एवं मल्टीप्लेक्स',
    description: 'Premier 3D Movie Theater with VIP Recliner & Balcony seating, Dolby 7.1 Atmos, popcorn counter, and live movie screenings!',
    descriptionHindi: 'सुमित गुप्ता द्वारा निर्मित भव्य 3D सिनेमा थिएटर। वीआईपी टिकट बुक करें, पॉपकॉर्न लें और सब मिलकर मूवी देखें!',
    action: 'theater',
    onTick: (delta: number, elapsed: number) => {
      const flicker = 0.85 + Math.sin(elapsed * 8) * 0.12;
      screenGlowMat.opacity = flicker;
      const hue = (Math.sin(elapsed * 0.8) + 1) * 0.5;
      screenGlowMat.color.setHSL(hue * 0.6 + 0.5, 0.8, 0.6);
      patrons.forEach((p, i) => {
        p.rotation.y = Math.sin(elapsed * 1.5 + i) * 0.15;
      });
    },
  };

  return theater;
}

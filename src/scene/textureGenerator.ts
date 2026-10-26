import * as THREE from 'three';

/**
 * Procedural texture generator using HTML5 Canvas.
 * Generates rich, authentic Indian street visual elements with zero external 404 dependencies.
 * All textures set SRGBColorSpace and anisotropy for razor sharpness.
 */

export class TextureGenerator {
  private static cache = new Map<string, THREE.CanvasTexture>();

  /**
   * Generates a classic handpainted Indian shop/house signboard
   */
  public static createSignboard(
    hindiText: string,
    englishText: string,
    bgColor: string = '#1e3a8a',
    textColor: string = '#fef08a',
    accentColor: string = '#dc2626'
  ): THREE.CanvasTexture {
    const key = `sign_${hindiText}_${englishText}_${bgColor}_${textColor}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Indian ornamental border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

    // Corner flourishes
    const corners = [
      [22, 22],
      [canvas.width - 22, 22],
      [22, canvas.height - 22],
      [canvas.width - 22, canvas.height - 22]
    ];
    ctx.fillStyle = textColor;
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Hindi text
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 36px "Tiro Devanagari Hindi", "Yatra One", sans-serif';
    ctx.fillText(hindiText, canvas.width / 2, 54);

    // English subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.fillText(englishText.toUpperCase(), canvas.width / 2, 108);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Indian Railway Station Board (Iconic Yellow background with black Hindi & English text)
   */
  public static createRailwayStationBoard(
    hindiText: string = 'सुमित नगर जंक्शन',
    englishText: string = 'SUMIT NAGAR JN.',
    altitude: string = 'समुद्र तल से ऊँचाई: 210 मी.'
  ): THREE.CanvasTexture {
    const key = `rail_${hindiText}_${englishText}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 180;
    const ctx = canvas.getContext('2d')!;

    // Authentic Indian Railway Mustard Yellow
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Hindi station name
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 44px "Tiro Devanagari Hindi", serif';
    ctx.fillText(hindiText, canvas.width / 2, 56);

    // English station name
    ctx.font = 'bold 32px "Outfit", sans-serif';
    ctx.fillText(englishText, canvas.width / 2, 110);

    // Elevation info
    ctx.font = '16px "Outfit", sans-serif';
    ctx.fillText(altitude, canvas.width / 2, 150);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Bollywood / Indian Roadside Billboard (Welcome to Sumit Ki Nagri)
   */
  public static createNagriBillboard(): THREE.CanvasTexture {
    const key = 'nagri_billboard_hero';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d')!;

    // Vibrant gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#7c2d12');
    grad.addColorStop(0.5, '#ea580c');
    grad.addColorStop(1, '#9a3412');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Golden frame border
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Decorative inner marigold line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    // Center badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 16);
    ctx.fill();

    // Text: अपनी नगरी
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 42px "Rozha One", "Yatra One", serif';
    ctx.fillText('॥ अपनी नगरी ॥', canvas.width / 2, 95);

    // Text: सुमित की नगरी
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px "Tiro Devanagari Hindi", "Rozha One", serif';
    ctx.fillText('सुमित की नगरी', canvas.width / 2, 165);

    // English Tagline
    ctx.fillStyle = '#fed7aa';
    ctx.font = '600 20px "Outfit", sans-serif';
    ctx.fillText('SUMIT KI NAGRI • THE LIVING 3D INDIAN TOWN', canvas.width / 2, 220);

    // Subtext
    ctx.fillStyle = '#fcd34d';
    ctx.font = '500 18px "Tiro Devanagari Hindi", sans-serif';
    ctx.fillText('बसाओ अपना आशियाना • चाय की चुस्की • अपना मोहल्ला', canvas.width / 2, 265);

    // Founder credit
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px "Outfit", sans-serif';
    ctx.fillText('Founder: Sumit Gupta (Mayor) • Built with Love', canvas.width / 2, 305);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Auto Rickshaw back plate decal ("HORN OK PLEASE" & speed warning)
   */
  public static createRickshawPlate(): THREE.CanvasTexture {
    const key = 'rickshaw_plate_horn';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Bright yellow plate
    ctx.fillStyle = '#fde047';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

    // "HORN" (red) "OK" (blue) "PLEASE" (red)
    ctx.textAlign = 'center';
    ctx.font = 'bold 26px "Outfit", sans-serif';
    ctx.fillStyle = '#b91c1c';
    ctx.fillText('HORN', 55, 48);

    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.fillText('OK', 128, 48);

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 26px "Outfit", sans-serif';
    ctx.fillText('PLEASE', 200, 48);

    // Registration number
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px "Outfit", monospace';
    ctx.fillText('UP 80 SG 2026', 128, 85);

    // Slogan
    ctx.fillStyle = '#475569';
    ctx.font = '13px "Tiro Devanagari Hindi", sans-serif';
    ctx.fillText('सुमित नगर एक्सप्रेस • हँसते रहो', 128, 112);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Road asphalt texture with road markings (dashed yellow centerline and side kerb)
   */
  public static createRoadTexture(): THREE.CanvasTexture {
    const key = 'road_asphalt_strip';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Dark grey asphalt
    ctx.fillStyle = '#262626';
    ctx.fillRect(0, 0, 256, 256);

    // Subtle asphalt grain
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const gray = Math.floor(35 + Math.random() * 30);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Yellow dashed center line
    ctx.fillStyle = '#facc15';
    ctx.fillRect(123, 20, 10, 80);
    ctx.fillRect(123, 140, 10, 80);

    // White side shoulder lines
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 0, 6, 256);
    ctx.fillRect(240, 0, 6, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Traditional carved sandstone lattice / jharokha pattern
   */
  public static createJharokhaTexture(): THREE.CanvasTexture {
    const key = 'sandstone_jharokha';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Sandstone base
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 128, 128);

    // Traditional jali / lattice diamond pattern
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;

    for (let x = 0; x <= 128; x += 16) {
      for (let y = 0; y <= 128; y += 16) {
        ctx.beginPath();
        ctx.moveTo(x + 8, y);
        ctx.lineTo(x + 16, y + 8);
        ctx.lineTo(x + 8, y + 16);
        ctx.lineTo(x, y + 8);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Sacred Rangoli Mandala pattern for temple ghat / courtyards
   */
  public static createRangoliTexture(): THREE.CanvasTexture {
    const key = 'rangoli_mandala';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Transparent base
    ctx.clearRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 128;

    // Concentric petals and rings
    const colors = ['#dc2626', '#f59e0b', '#16a34a', '#9333ea', '#ffffff'];

    colors.forEach((col, idx) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 25 + idx * 18, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Petals
    const numPetals = 8;
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * Math.PI * 2) / numPetals;
      const px = cx + Math.cos(angle) * 75;
      const py = cy + Math.sin(angle) * 75;

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center lotus bindu
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.cache.set(key, texture);
    return texture;
  }
}

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Resident, Landmark, TimeOfDay, FestivalMode, CameraPreset, WeatherType } from '../types/city.ts';
import { buildAutoRickshaw } from './models/buildAutoRickshaw.ts';
import { buildHaveli } from './models/buildHaveli.ts';
import { buildBazaarShop } from './models/buildBazaarShop.ts';
import { buildChaiTapri } from './models/buildChaiTapri.ts';
import { buildTemple } from './models/buildTemple.ts';
import { buildRailwayStation } from './models/buildRailwayStation.ts';
import { buildModernVilla } from './models/buildModernVilla.ts';
import { buildVillageHut, buildBanyanChabutra } from './models/buildVillageHut.ts';
import { buildBillboard } from './models/buildBillboard.ts';
import { buildEbookStore } from './models/buildEbookStore.ts';
import { buildLivingPeopleSystem } from './models/buildLivingPeople.ts';
import { buildSportsGround, SportsGroundSystem } from './models/buildSportsGround.ts';
import { buildAirport, AirportSystem } from './models/buildAirport.ts';
import { buildRiver, RiverSystem } from './models/buildRiver.ts';
import {
  buildSumitHospital,
  buildSumitGym,
  buildSumitSchool,
  buildSumitHotel,
  buildSumitMedicalStore,
} from './models/buildSumitInstitutions.ts';
import { buildTheater } from './models/buildTheater.ts';
import { buildPoliceStation } from './models/buildPoliceStation.ts';
import { buildParkAndPool } from './models/buildParkAndPool.ts';
import { buildGulmoharTree, buildStreetLamp, buildMilestone } from './models/buildFoliageAndProps.ts';
import { TextureGenerator } from './textureGenerator.ts';

// Reusable vectors at module scope to eliminate per-frame GC allocations
const _vec3 = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _rayOrigin = new THREE.Vector2();

export interface ClickEventData {
  type:
    | 'resident'
    | 'landmark'
    | 'rickshaw'
    | 'station'
    | 'temple'
    | 'ebook_store'
    | 'sports_ground'
    | 'airport'
    | 'airplane'
    | 'hospital'
    | 'gym'
    | 'school'
    | 'hotel'
    | 'medical_store'
    | 'theater'
    | 'police_thana'
    | 'park_pool'
    | 'restaurant';
  resident?: Resident;
  landmark?: Landmark;
  title?: string;
  titleHindi?: string;
  description?: string;
  descriptionHindi?: string;
  action?: string;
}

export class CityScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private isSoftwareGl: boolean = false;
  private animFrameId: number = 0;
  private isDestroyed: boolean = false;

  // Lighting rigs
  private dirLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private ambientLight!: THREE.AmbientLight;
  private lanternLights: THREE.PointLight[] = [];

  // Animated elements
  private autoRickshaw!: THREE.Group;
  private rickshawWaypoints: { x: number; z: number }[] = [];
  private rickshawWpIndex: number = 0;
  private rickshawProgress: number = 0;
  private updateTrainFn?: (delta: number) => void;
  private getTrainPosFn?: () => THREE.Vector3;

  // Living Systems: People, Sports Ground, Airport, River & Active Institutions
  private peopleSystem?: ReturnType<typeof buildLivingPeopleSystem>;
  private sportsGroundSystem?: SportsGroundSystem;
  private airportSystem?: AirportSystem;
  private riverSystem?: RiverSystem;
  private activeHospital?: THREE.Group;
  private activeGym?: THREE.Group;
  private theaterBuilding?: THREE.Group;
  private policeStationBuilding?: THREE.Group;
  private parkAndPoolBuilding?: THREE.Group;
  private templeBuilding?: THREE.Group;

  // Weather & Atmosphere System
  private currentWeather: WeatherType = 'sunny';
  private rainParticles?: THREE.Points;
  private rainPositions?: Float32Array;
  private snowParticles?: THREE.Points;
  private snowPositions?: Float32Array;

  // Festival particles
  private festivalParticles?: THREE.Points;
  private festivalParticlePositions?: Float32Array;

  // Interactive tracking
  private raycaster: THREE.Raycaster;
  private interactiveMeshes: THREE.Object3D[] = [];
  private onObjectClick: (data: ClickEventData) => void;
  private onHoverChange: (isHovered: boolean, label?: string) => void;

  // Camera animation state
  private targetCameraPos: THREE.Vector3 = new THREE.Vector3(0, 30, 48);
  private targetLookAt: THREE.Vector3 = new THREE.Vector3(0, 2, 0);
  private currentCameraMode: CameraPreset = 'overview';
  private clock: THREE.Clock;

  constructor(
    container: HTMLElement,
    residents: Resident[],
    onObjectClick: (data: ClickEventData) => void,
    onHoverChange: (isHovered: boolean, label?: string) => void
  ) {
    this.container = container;
    this.onObjectClick = onObjectClick;
    this.onHoverChange = onHoverChange;
    this.clock = new THREE.Clock();

    // 1. Detect Software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfde68a); // Warm Indian daytime haze
    this.scene.fog = new THREE.FogExp2(0xfde68a, 0.012);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    this.camera.position.set(0, 30, 48);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 3. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera under ground
    this.controls.minDistance = 6;
    this.controls.maxDistance = 140;
    this.controls.target.set(0, 2, 0);

    // 4. Procedural Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig
    this.setupLighting();

    // 6. Terrain, Roads & City Layout
    this.buildTerrainAndRoads();

    // 7. Populate Residents & Landmarks
    this.populateCity(residents);

    // 8. Auto Rickshaw Pathing
    this.setupAutoRickshaw();

    // 9. Raycasting Setup
    this.raycaster = new THREE.Raycaster();
    this.setupInteractionListeners();

    // 10. Start Animation Loop
    this.tick = this.tick.bind(this);
    this.tick();

    // 11. Handle Resize
    window.addEventListener('resize', this.onWindowResize);
  }

  private setupLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x78350f, 0.7);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffedd5, 0.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    this.dirLight.position.set(35, 45, 25);
    this.dirLight.castShadow = !this.isSoftwareGl;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 140;
    const d = 45;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);
  }

  private buildTerrainAndRoads() {
    // Ground Terrain (Sandstone and warm earth)
    const groundGeo = new THREE.PlaneGeometry(180, 180);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Green Farming Field patches (Hari Gaon quadrant)
    const fieldMat = new THREE.MeshStandardMaterial({
      color: 0x65a30d, // Mustard yellow-green crop
      roughness: 0.85,
    });
    const field = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), fieldMat);
    field.rotation.x = -Math.PI / 2;
    field.position.set(-28, 0.02, -26);
    field.receiveShadow = true;
    this.scene.add(field);

    // Road Texture
    const roadMat = new THREE.MeshStandardMaterial({
      map: TextureGenerator.createRoadTexture(),
      roughness: 0.8,
    });

    // Main Avenue (North-South Road)
    const mainAvenue = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 70), roadMat);
    mainAvenue.rotation.x = -Math.PI / 2;
    mainAvenue.position.set(-8, 0.03, 0);
    mainAvenue.receiveShadow = true;
    this.scene.add(mainAvenue);

    // Bazaar Cross Road (East-West Road)
    const crossRoad = new THREE.Mesh(new THREE.PlaneGeometry(70, 7.2), roadMat);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.set(0, 0.04, 8);
    crossRoad.receiveShadow = true;
    this.scene.add(crossRoad);

    // Station Loop Road
    const stationRoad = new THREE.Mesh(new THREE.PlaneGeometry(55, 6.5), roadMat);
    stationRoad.rotation.x = -Math.PI / 2;
    stationRoad.position.set(0, 0.04, 24);
    this.scene.add(stationRoad);

    // Milestone on roadside
    const milestone = buildMilestone();
    milestone.position.set(-4, 0, 12);
    this.scene.add(milestone);
  }

  public populateCity(residents: Resident[]) {
    // Clear previously populated interactive objects except static environment
    this.interactiveMeshes.forEach((mesh) => {
      this.scene.remove(mesh);
    });
    this.interactiveMeshes = [];

    // 1. Sumit Niwas & Residents
    residents.forEach((resident) => {
      let model: THREE.Group;

      switch (resident.houseStyle) {
        case 'haveli':
          model = buildHaveli(resident);
          break;
        case 'bazaar_shop':
          model = buildBazaarShop(resident);
          break;
        case 'chai_stall':
          model = buildChaiTapri(resident);
          break;
        case 'modern_villa':
          model = buildModernVilla(resident);
          break;
        case 'village_hut':
          model = buildVillageHut(resident);
          break;
        case 'temple_guest':
          model = buildHaveli(resident);
          break;
        default:
          model = buildModernVilla(resident);
          break;
      }

      model.position.set(resident.position.x, 0, resident.position.z);
      this.scene.add(model);
      this.interactiveMeshes.push(model);
    });

    // 2. Shanti Mandir & Stepwell Ghat
    const temple = buildTemple();
    temple.position.set(26, 0, 4);
    this.scene.add(temple);
    this.interactiveMeshes.push(temple);
    this.templeBuilding = temple;

    // 2b. Flowing Holy River & Stone Ghats (पवित्र नदी, सीढ़ियाँ, पुल एवं देसी नाव)
    this.riverSystem = buildRiver();
    this.scene.add(this.riverSystem.group);

    // 3. Sumit Nagar Junction (Railway Station & Train with Visible Passengers)
    const { group: stationGroup, updateTrain, getTrainWorldPos } = buildRailwayStation();
    stationGroup.position.set(-2, 0, 32);
    this.scene.add(stationGroup);
    this.interactiveMeshes.push(stationGroup);
    this.updateTrainFn = updateTrain;
    this.getTrainPosFn = getTrainWorldPos;

    // 4. Banyan Tree & Panchayat Chabutra
    const banyan = buildBanyanChabutra();
    banyan.position.set(-26, 0, -18);
    this.scene.add(banyan);
    this.interactiveMeshes.push(banyan);

    // 5. Central Grand Billboard
    const billboard = buildBillboard();
    billboard.position.set(14, 0, 18);
    this.scene.add(billboard);
    this.interactiveMeshes.push(billboard);

    // 6. Somo eBooks Store (सोमो ई-बुक स्टोर & लाइब्रेरी)
    const ebookStore = buildEbookStore();
    ebookStore.position.set(10, 0, -2);
    this.scene.add(ebookStore);
    this.interactiveMeshes.push(ebookStore);

    // 7. Living Indian People & Animated Characters
    // (Walking home carrying sweets/groceries, chai tapri visitors eating samosas, train boarding)
    this.peopleSystem = buildLivingPeopleSystem();
    this.scene.add(this.peopleSystem.peopleGroup);
    this.interactiveMeshes.push(...this.peopleSystem.interactiveObjects);

    // 8. 3D Sports Ground (Gully Cricket, Desi Ludo, Kanche, Field Hockey)
    this.sportsGroundSystem = buildSportsGround();
    this.sportsGroundSystem.group.position.set(-20, 0, -4);
    this.scene.add(this.sportsGroundSystem.group);
    this.interactiveMeshes.push(...this.sportsGroundSystem.interactiveMeshes);

    // 9. Sumit International Airport & Animated Flying Airplane
    this.airportSystem = buildAirport();
    this.airportSystem.group.position.set(24, 0, 8);
    this.scene.add(this.airportSystem.group);
    this.interactiveMeshes.push(...this.airportSystem.interactiveMeshes);

    // 10. Sumit City Institutions (सुमित के नाम से नगर संस्थान)
    // 10a. सुमित मल्टीस्पेशलिटी हॉस्पिटल (Sumit Hospital - with animated doctor & stretcher)
    const hospital = buildSumitHospital();
    hospital.position.set(-26, 0, 10);
    this.scene.add(hospital);
    this.interactiveMeshes.push(hospital);
    this.activeHospital = hospital;

    // 10b. सुमित फिटनेस एवं जिम (Sumit Gym - with animated lifters & bench press)
    const gym = buildSumitGym();
    gym.position.set(-10, 0, -16);
    this.scene.add(gym);
    this.interactiveMeshes.push(gym);
    this.activeGym = gym;

    // 10c. सुमित इंटरनेशनल स्कूल (Sumit School)
    const school = buildSumitSchool();
    school.position.set(22, 0, -32);
    this.scene.add(school);
    this.interactiveMeshes.push(school);

    // 10d. सुमित ग्रैंड हेरिटेज होटल (Sumit Hotel)
    const hotel = buildSumitHotel();
    hotel.position.set(-10, 0, -30);
    this.scene.add(hotel);
    this.interactiveMeshes.push(hotel);

    // 10e. सुमित 24x7 मेडिकल स्टोर (Sumit Medical Store)
    const medicalStore = buildSumitMedicalStore();
    medicalStore.position.set(12, 0, 16);
    this.scene.add(medicalStore);
    this.interactiveMeshes.push(medicalStore);

    // 10f. सुमित 3D टॉकीज (Sumit Talkies Cinema Multiplex)
    const theater = buildTheater();
    theater.position.set(-26, 0, -32);
    this.scene.add(theater);
    this.interactiveMeshes.push(theater);
    this.theaterBuilding = theater;

    // 10g. सुमित पुलिस थाना एवं सेंट्रल जेल (Sumit Police Station & Central Jail)
    const police = buildPoliceStation();
    police.position.set(-26, 0, 24);
    this.scene.add(police);
    this.interactiveMeshes.push(police);
    this.policeStationBuilding = police;

    // 10h. सुमित चिल्ड्रन्स पार्क, झूला एवं स्विमिंग पूल (Sumit Park, Swings & Swimming Pool)
    const parkPool = buildParkAndPool();
    parkPool.position.set(26, 0, -18);
    this.scene.add(parkPool);
    this.interactiveMeshes.push(parkPool);
    this.parkAndPoolBuilding = parkPool;

    // 11. Street Foliage (Gulmohar trees along roadsides)
    const treeCoords = [
      [-12, -4],
      [-12, 16],
      [8, -4],
      [8, 16],
      [22, -8],
      [-20, 20],
      [20, 22],
    ];
    treeCoords.forEach(([tx, tz]) => {
      const tree = buildGulmoharTree();
      tree.position.set(tx, 0, tz);
      this.scene.add(tree);
    });

    // 7. Street Lamps along the central Chowk
    const lampCoords = [
      [-5, 5],
      [-5, 11],
      [5, 5],
      [5, 11],
      [-5, 21],
      [11, 21],
    ];
    lampCoords.forEach(([lx, lz]) => {
      const lamp = buildStreetLamp();
      lamp.position.set(lx, 0, lz);
      this.scene.add(lamp);
    });
  }

  private setupAutoRickshaw() {
    this.autoRickshaw = buildAutoRickshaw();
    this.scene.add(this.autoRickshaw);
    this.interactiveMeshes.push(this.autoRickshaw);

    // Closed loop route through Sumit Ki Nagri streets:
    // Station Road -> Main Avenue -> Bazaar Chowk -> Heritage Lane -> Loop
    this.rickshawWaypoints = [
      { x: -8, z: 24 },
      { x: -8, z: 8 },
      { x: 10, z: 8 },
      { x: 10, z: 24 },
      { x: -8, z: 24 },
    ];
    this.autoRickshaw.position.set(this.rickshawWaypoints[0].x, 0, this.rickshawWaypoints[0].z);
  }

  public setTimeOfDay(time: TimeOfDay) {
    switch (time) {
      case 'morning':
        this.scene.background = new THREE.Color(0xfef3c7);
        this.scene.fog = new THREE.FogExp2(0xfef3c7, 0.012);
        this.dirLight.color.setHex(0xfef3c7);
        this.dirLight.intensity = 1.3;
        this.dirLight.position.set(40, 30, 20);
        this.hemiLight.color.setHex(0xfffbeb);
        this.hemiLight.groundColor.setHex(0x78350f);
        this.renderer.toneMappingExposure = 1.2;
        break;
      case 'afternoon':
        this.scene.background = new THREE.Color(0x93c5fd);
        this.scene.fog = new THREE.FogExp2(0xbfdbfe, 0.008);
        this.dirLight.color.setHex(0xffffff);
        this.dirLight.intensity = 1.5;
        this.dirLight.position.set(10, 50, 10);
        this.hemiLight.color.setHex(0xeff6ff);
        this.hemiLight.groundColor.setHex(0x451a03);
        this.renderer.toneMappingExposure = 1.15;
        break;
      case 'sunset':
        // Golden Indian sunset
        this.scene.background = new THREE.Color(0xf97316);
        this.scene.fog = new THREE.FogExp2(0xea580c, 0.014);
        this.dirLight.color.setHex(0xfb923c);
        this.dirLight.intensity = 1.6;
        this.dirLight.position.set(50, 18, 5);
        this.hemiLight.color.setHex(0xfed7aa);
        this.hemiLight.groundColor.setHex(0x431407);
        this.renderer.toneMappingExposure = 1.3;
        break;
      case 'night':
        // Deep indigo night with glowing lanterns
        this.scene.background = new THREE.Color(0x0f172a);
        this.scene.fog = new THREE.FogExp2(0x0f172a, 0.015);
        this.dirLight.color.setHex(0x38bdf8);
        this.dirLight.intensity = 0.4;
        this.dirLight.position.set(-20, 35, -20);
        this.hemiLight.color.setHex(0x1e293b);
        this.hemiLight.groundColor.setHex(0x020617);
        this.renderer.toneMappingExposure = 1.35;
        break;
    }
  }

  public setWeather(weather: WeatherType) {
    this.currentWeather = weather;

    // Dispose previous weather particles
    if (this.rainParticles) {
      this.scene.remove(this.rainParticles);
      this.rainParticles.geometry.dispose();
      (this.rainParticles.material as THREE.Material).dispose();
      this.rainParticles = undefined;
      this.rainPositions = undefined;
    }
    if (this.snowParticles) {
      this.scene.remove(this.snowParticles);
      this.snowParticles.geometry.dispose();
      (this.snowParticles.material as THREE.Material).dispose();
      this.snowParticles = undefined;
      this.snowPositions = undefined;
    }

    if (weather === 'rain') {
      // Monsoon rainstorm: dark moody skies, cool blue fog, and dimmed directional light
      this.scene.background = new THREE.Color(0x334155);
      this.scene.fog = new THREE.FogExp2(0x334155, 0.015);
      this.dirLight.color.setHex(0x94a3b8);
      this.dirLight.intensity = 0.75;
      this.hemiLight.color.setHex(0x64748b);
      this.hemiLight.groundColor.setHex(0x1e293b);
      this.renderer.toneMappingExposure = 0.95;

      const count = 1600;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 130;
        pos[i * 3 + 1] = Math.random() * 42;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 130;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.28,
        transparent: true,
        opacity: 0.75,
      });
      this.rainParticles = new THREE.Points(geo, mat);
      this.rainPositions = pos;
      this.scene.add(this.rainParticles);
    } else if (weather === 'snow') {
      // Winter snow: frosty silver sky, crisp white atmosphere
      this.scene.background = new THREE.Color(0xcfd8dc);
      this.scene.fog = new THREE.FogExp2(0xe2e8f0, 0.012);
      this.dirLight.color.setHex(0xf8fafc);
      this.dirLight.intensity = 1.1;
      this.hemiLight.color.setHex(0xffffff);
      this.hemiLight.groundColor.setHex(0x475569);
      this.renderer.toneMappingExposure = 1.15;

      const count = 1200;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 130;
        pos[i * 3 + 1] = Math.random() * 36;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 130;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.42,
        transparent: true,
        opacity: 0.9,
      });
      this.snowParticles = new THREE.Points(geo, mat);
      this.snowPositions = pos;
      this.scene.add(this.snowParticles);
    } else {
      // Sunny - clear warm day
      this.setTimeOfDay('afternoon');
    }
  }

  public getWeather(): WeatherType {
    return this.currentWeather;
  }

  public setFestivalMode(festival: FestivalMode) {
    if (this.festivalParticles) {
      this.scene.remove(this.festivalParticles);
      this.festivalParticles.geometry.dispose();
      (this.festivalParticles.material as THREE.Material).dispose();
      this.festivalParticles = undefined;
    }

    if (festival === 'none') return;

    // Create festival particle aura
    const particleCount = festival === 'diwali' ? 250 : 200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = 1 + Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      if (festival === 'diwali') {
        // Golden glowing sparklers and floating akashdeep lanterns
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.1;
      } else if (festival === 'holi') {
        // Vibrant gulal colors (Pink, Turmeric, Peacock Blue, Green)
        const palette = [
          [0.96, 0.27, 0.58], // Gulabi pink
          [0.98, 0.79, 0.14], // Turmeric yellow
          [0.12, 0.73, 0.88], // Sky cyan
          [0.13, 0.77, 0.36], // Green
        ];
        const pick = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = pick[0];
        colors[i * 3 + 1] = pick[1];
        colors[i * 3 + 2] = pick[2];
      } else {
        // Colorful kites
        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: festival === 'diwali' ? 0.7 : 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    this.festivalParticles = new THREE.Points(geo, pMat);
    this.festivalParticlePositions = positions;
    this.scene.add(this.festivalParticles);
  }

  public setCameraPreset(preset: CameraPreset) {
    this.currentCameraMode = preset;

    switch (preset) {
      case 'overview':
        this.targetCameraPos.set(0, 32, 50);
        this.targetLookAt.set(0, 2, 0);
        break;
      case 'isometric':
        // Crisp High-Detail 45° Isometric City View (पूरा शहर स्पष्ट दिखे)
        this.targetCameraPos.set(65, 75, 65);
        this.targetLookAt.set(0, 0, 0);
        break;
      case 'train_ride':
        // Camera mounts directly inside the passenger train coach traveling through town!
        break;
      case 'flight_ride':
        // Camera mounts inside the airplane cockpit / passenger window overlooking sky & city!
        break;
      case 'sumit_haveli':
        this.targetCameraPos.set(0, 10, 8);
        this.targetLookAt.set(0, 4, -10);
        break;
      case 'bazaar':
        this.targetCameraPos.set(-14, 6, 20);
        this.targetLookAt.set(-14, 2, 8);
        break;
      case 'station':
        this.targetCameraPos.set(-2, 10, 48);
        this.targetLookAt.set(-2, 2, 32);
        break;
      case 'temple':
        this.targetCameraPos.set(26, 12, 22);
        this.targetLookAt.set(26, 6, 4);
        break;
      case 'gaon':
        this.targetCameraPos.set(-28, 12, -10);
        this.targetLookAt.set(-28, 3, -26);
        break;
      case 'ebook_store':
        this.targetCameraPos.set(10, 8, 10);
        this.targetLookAt.set(10, 2.5, -2);
        break;
      case 'sports_ground':
        this.targetCameraPos.set(-20, 12, 10);
        this.targetLookAt.set(-20, 2, -4);
        break;
      case 'flight':
        // Camera smoothly follows the flying airplane from behind
        break;
      case 'rickshaw':
        // Camera follows the Auto Rickshaw in tick loop
        break;
      case 'hospital':
        this.targetCameraPos.set(-26, 11, 24);
        this.targetLookAt.set(-26, 3, 10);
        break;
      case 'gym':
        this.targetCameraPos.set(-10, 10, -3);
        this.targetLookAt.set(-10, 2.5, -16);
        break;
      case 'school':
        this.targetCameraPos.set(22, 13, -16);
        this.targetLookAt.set(22, 3.5, -32);
        break;
      case 'hotel':
        this.targetCameraPos.set(-10, 14, -14);
        this.targetLookAt.set(-10, 3.5, -30);
        break;
      case 'medical_store':
        this.targetCameraPos.set(12, 9, 27);
        this.targetLookAt.set(12, 2.2, 16);
        break;
      case 'theater':
        this.targetCameraPos.set(-26, 12, -18);
        this.targetLookAt.set(-26, 3.5, -32);
        break;
      case 'police_thana':
        this.targetCameraPos.set(-26, 11, 38);
        this.targetLookAt.set(-26, 2.5, 24);
        break;
      case 'park_pool':
        this.targetCameraPos.set(26, 13, -4);
        this.targetLookAt.set(26, 2.5, -18);
        break;
      case 'restaurant':
        this.targetCameraPos.set(-10, 11, -16);
        this.targetLookAt.set(-10, 3.2, -30);
        break;
    }
  }

  private setupInteractionListeners() {
    let lastPointerMove = 0;
    const onPointerMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastPointerMove < 30) return; // Throttle pointer move
      lastPointerMove = now;

      const rect = this.renderer.domElement.getBoundingClientRect();
      _rayOrigin.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _rayOrigin.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(_rayOrigin, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, true);

      if (intersects.length > 0) {
        let parent = intersects[0].object;
        while (parent && !parent.userData?.isInteractive && parent.parent) {
          parent = parent.parent;
        }

        if (parent?.userData?.isInteractive) {
          const u = parent.userData;
          const label = u.resident?.name || u.title || 'Click to view';
          this.onHoverChange(true, label);
          this.renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }

      this.onHoverChange(false);
      this.renderer.domElement.style.cursor = 'default';
    };

    const onClick = (e: MouseEvent) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      _rayOrigin.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _rayOrigin.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(_rayOrigin, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, true);

      if (intersects.length > 0) {
        let parent = intersects[0].object;
        while (parent && !parent.userData?.isInteractive && parent.parent) {
          parent = parent.parent;
        }

        if (parent?.userData?.isInteractive) {
          const u = parent.userData;
          this.onObjectClick({
            type: u.type,
            resident: u.resident,
            title: u.title,
            titleHindi: u.titleHindi,
            description: u.description,
            descriptionHindi: u.descriptionHindi,
            action: u.action,
          });
        }
      }
    };

    this.renderer.domElement.addEventListener('pointermove', onPointerMove);
    this.renderer.domElement.addEventListener('click', onClick);
  }

  private onWindowResize = () => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private tick() {
    if (this.isDestroyed) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // 1. Animate Auto-Rickshaw along waypoint loop
    if (this.rickshawWaypoints.length > 1 && this.autoRickshaw) {
      const curr = this.rickshawWaypoints[this.rickshawWpIndex];
      const nextIdx = (this.rickshawWpIndex + 1) % this.rickshawWaypoints.length;
      const next = this.rickshawWaypoints[nextIdx];

      const dx = next.x - curr.x;
      const dz = next.z - curr.z;
      const segDist = Math.hypot(dx, dz);
      const speed = 6.0; // Units per second

      this.rickshawProgress += (speed * delta) / segDist;

      if (this.rickshawProgress >= 1.0) {
        this.rickshawProgress = 0;
        this.rickshawWpIndex = nextIdx;
      }

      const rx = THREE.MathUtils.lerp(curr.x, next.x, this.rickshawProgress);
      const rz = THREE.MathUtils.lerp(curr.z, next.z, this.rickshawProgress);
      this.autoRickshaw.position.set(rx, 0, rz);

      // Rotate towards travel direction
      const angle = Math.atan2(dx, dz);
      this.autoRickshaw.rotation.y = angle;

      // Rickshaw follow camera mode
      if (this.currentCameraMode === 'rickshaw') {
        // Mount camera behind rickshaw
        const camDist = 7.5;
        const camHeight = 3.8;
        _camPos.set(
          rx - Math.sin(angle) * camDist,
          camHeight,
          rz - Math.cos(angle) * camDist
        );
        _camTarget.set(rx, 1.2, rz);

        this.camera.position.lerp(_camPos, 0.1);
        this.controls.target.lerp(_camTarget, 0.1);
      }
    }

    // 2. Animate Train
    if (this.updateTrainFn) {
      this.updateTrainFn(delta);
    }

    // Train Passenger Ride-Along Camera Mode (ट्रेन के साथ अंदर बैठ के चलते हुए पूरा शहर क्लियर दिखे)
    if (this.currentCameraMode === 'train_ride' && this.getTrainPosFn) {
      const trainPos = this.getTrainPosFn();
      // Mount camera directly inside the passenger coach looking forward-sideways out the window
      _camPos.set(trainPos.x - 5.8, 1.45, 3.8 + 0.35);
      _camTarget.set(trainPos.x - 18.0, 1.6, 3.8 - 4.5);

      this.camera.position.lerp(_camPos, 0.15);
      this.controls.target.lerp(_camTarget, 0.15);
    }

    // 2b. Animate Flowing Holy River & Ghats
    if (this.riverSystem) {
      this.riverSystem.update(delta, this.clock.getElapsedTime());
    }

    // 2c. Animate Active Institutions (Doctor/patient entering hospital, lifters in gym)
    if (this.activeHospital?.userData?.onTick) {
      this.activeHospital.userData.onTick(delta, this.clock.getElapsedTime());
    }
    if (this.activeGym?.userData?.onTick) {
      this.activeGym.userData.onTick(delta, this.clock.getElapsedTime());
    }
    if (this.theaterBuilding?.userData?.onTick) {
      this.theaterBuilding.userData.onTick(delta, this.clock.getElapsedTime());
    }
    if (this.policeStationBuilding?.userData?.onTick) {
      this.policeStationBuilding.userData.onTick(delta, this.clock.getElapsedTime());
    }
    if (this.parkAndPoolBuilding?.userData?.onTick) {
      this.parkAndPoolBuilding.userData.onTick(delta, this.clock.getElapsedTime());
    }
    if (this.templeBuilding?.userData?.onTick) {
      this.templeBuilding.userData.onTick(delta, this.clock.getElapsedTime());
    }

    // 2d. Animate Living People System (walking home, sipping chai, train platform)
    if (this.peopleSystem) {
      this.peopleSystem.update(delta);
    }

    // 2e. Animate Sports Ground (batsman swing, bowler windup, goalie sway)
    if (this.sportsGroundSystem) {
      this.sportsGroundSystem.update(delta, this.clock.getElapsedTime());
    }

    // 2f. Animate Airport & Flying Airplane
    if (this.airportSystem) {
      this.airportSystem.update(delta, this.clock.getElapsedTime());

      // Airplane Flight Follow Camera Modes
      if (this.currentCameraMode === 'flight') {
        // External chase camera
        const planePos = this.airportSystem.getAirplaneWorldPos();
        const planeFwd = this.airportSystem.getAirplaneForward();
        const camDist = 13.0;
        const camHeight = 4.8;
        _camPos.set(
          planePos.x - planeFwd.x * camDist,
          planePos.y + camHeight,
          planePos.z - planeFwd.z * camDist
        );
        _camTarget.set(planePos.x, planePos.y + 0.8, planePos.z);

        this.camera.position.lerp(_camPos, 0.12);
        this.controls.target.lerp(_camTarget, 0.12);
      } else if (this.currentCameraMode === 'flight_ride') {
        // Onboard Cockpit / Passenger Window Ride Camera Mode
        // (जहाज पर बैठते हुए अंदर का दृश्य, आसमान दिखे और नदियां दिखें)
        const planePos = this.airportSystem.getAirplaneWorldPos();
        const planeFwd = this.airportSystem.getAirplaneForward();
        // Camera positioned right at cockpit windshield / passenger window
        _camPos.set(
          planePos.x + planeFwd.x * 0.9,
          planePos.y + 0.7,
          planePos.z + planeFwd.z * 0.9
        );
        // Looking forward and slightly downward towards the river and city skyline
        _camTarget.set(
          planePos.x + planeFwd.x * 22,
          planePos.y - 4.5,
          planePos.z + planeFwd.z * 22
        );

        this.camera.position.lerp(_camPos, 0.16);
        this.controls.target.lerp(_camTarget, 0.16);
      }
    }

    // 2g. Animate Dynamic Weather Particles (Rain / Snow)
    if (this.rainParticles && this.rainPositions) {
      const pos = this.rainPositions;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= delta * 36; // Fast downward rain stream
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 40 + Math.random() * 4;
        }
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.snowParticles && this.snowPositions) {
      const pos = this.snowPositions;
      const count = pos.length / 3;
      const elapsed = this.clock.getElapsedTime();
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= delta * 3.8; // Soft snowfall descent
        pos[i * 3] += Math.sin(elapsed + i) * delta * 0.9; // Lateral wind sway
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 34 + Math.random() * 4;
        }
      }
      this.snowParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Animate Festival Particles
    if (this.festivalParticles && this.festivalParticlePositions) {
      const pos = this.festivalParticlePositions;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += delta * 1.5; // Float upwards
        if (pos[i * 3 + 1] > 28) {
          pos[i * 3 + 1] = 1;
        }
      }
      this.festivalParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Smooth Camera Preset Damping (When not following rickshaw, flight or train)
    if (
      this.currentCameraMode !== 'rickshaw' &&
      this.currentCameraMode !== 'flight' &&
      this.currentCameraMode !== 'flight_ride' &&
      this.currentCameraMode !== 'train_ride'
    ) {
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.targetCameraPos.x, 3.5, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.targetCameraPos.y, 3.5, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.targetCameraPos.z, 3.5, delta);

      this.controls.target.x = THREE.MathUtils.damp(this.controls.target.x, this.targetLookAt.x, 3.5, delta);
      this.controls.target.y = THREE.MathUtils.damp(this.controls.target.y, this.targetLookAt.y, 3.5, delta);
      this.controls.target.z = THREE.MathUtils.damp(this.controls.target.z, this.targetLookAt.z, 3.5, delta);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      // Pace software loop to prevent starving CPU
      setTimeout(() => {
        if (!this.isDestroyed) {
          this.animFrameId = requestAnimationFrame(this.tick);
        }
      }, 70);
    } else {
      this.animFrameId = requestAnimationFrame(this.tick);
    }
  }

  public getAutoRickshawPosition(): THREE.Vector3 {
    return this.autoRickshaw ? this.autoRickshaw.position : _vec3.set(0, 0, 0);
  }

  public getAirportFlightStatus() {
    return this.airportSystem ? this.airportSystem.getFlightStatus() : undefined;
  }

  public destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.onWindowResize);
    cancelAnimationFrame(this.animFrameId);
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import getStar from '../src/getstar';
import { getFresnel } from '../src/getfresnel';
import * as d3 from 'd3';


document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 500000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
   

    //renderer.setClearColor(0xffffff, 1); // Putih dengan opasitas 100%
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Memberikan efek smooth saat rotasi
    controls.minDistance = 7000;
    controls.maxDistance = 100000;

// === Canvas Ground Track ===
const canvasGT = document.createElement('canvas');
Object.assign(canvasGT.style, {
  position: 'absolute',
  border: 'none',
  zIndex: '30',
  display: 'none',
  boxSizing: 'border-box'
});
document.body.style.cssText = 'margin:0; overflow:hidden; background:black';
document.body.appendChild(canvasGT);

const ctxGT = canvasGT.getContext('2d');
let widthGT = 0, heightGT = 0;

function updateCanvasSize() {
  const aspect = 2.5;
  let w = window.innerWidth;
  let h = w / aspect;

  if (w <= 768 && h > window.innerHeight) {
    h = window.innerHeight;
    w = h * aspect;
  }

  if (w > 2000) w = 2000;
  h = w / aspect;
  if (h > window.innerHeight) {
    h = window.innerHeight;
    w = h * aspect;
  }

  canvasGT.width = w;
  canvasGT.height = h;
  Object.assign(canvasGT.style, {
    width: `${w}px`,
    height: `${h}px`,
    top: `${(window.innerHeight - h) / 2}px`,
    left: `${(window.innerWidth - w) / 2}px`
  });

  widthGT = w;
  heightGT = h;
}

window.addEventListener('resize', updateCanvasSize);
updateCanvasSize();



// === Panel Kontrol ===
const panel = document.createElement('div');
Object.assign(panel.style, {
  position: 'fixed',
  top: '10px',
  left: '10px',
  zIndex: '20',
  background: '#1a1e2e',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  fontFamily: 'sans-serif',
  width: '240px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
});
document.body.appendChild(panel);

// === Tombol Tampilkan Ground Track ===
const displayBtn = document.createElement('button');
displayBtn.textContent = 'Display Ground Track';
Object.assign(displayBtn.style, {
  marginBottom: '12px', // ganti dari marginTop agar ada jarak ke bawah
  width: '100%',
  padding: '6px',
  background: '#ddd',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});
panel.appendChild(displayBtn);

// === Kontrol Speed Factor ===
const speedControls = document.createElement('div');
speedControls.innerHTML = `
  <label style="display:block; margin-bottom:4px; text-align:center;">Speed:</label>
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <button id="decreaseSpeed">−</button>
    <span id="speedValue">0</span>
    <button id="increaseSpeed">+</button>
  </div>
`;
panel.appendChild(speedControls);

// Nilai yang ditampilkan dan digunakan
let displaySpeed = 0;
let speedFactor = 1;
const speedValue = speedControls.querySelector("#speedValue");

// Batas minimum dan maksimum untuk display
const minDisplaySpeed = 0;
const maxDisplaySpeed = 5000;

function updateSpeedValues() {
    speedValue.textContent = displaySpeed;
    speedFactor = displaySpeed === 0 ? 1 : displaySpeed;
}

speedControls.querySelector("#increaseSpeed").addEventListener("click", () => {
    if (displaySpeed + 100 <= maxDisplaySpeed) {
        displaySpeed += 100;
        updateSpeedValues();
    }
});

speedControls.querySelector("#decreaseSpeed").addEventListener("click", () => {
    if (displaySpeed - 100 >= minDisplaySpeed) {
        displaySpeed -= 100;
        updateSpeedValues();
    }
});



// === Fungsi Membuat Canvas Hitam ===
function createBlackBackgroundCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'canvasBackground';
  Object.assign(canvas.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '0',
    pointerEvents: 'none'
  });
  document.body.appendChild(canvas);

  function resizeAndPaint() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  resizeAndPaint();
  window.addEventListener('resize', resizeAndPaint);
}


// === Tombol ✖ (Close Button) ===
const closeBtn = document.createElement('div');
closeBtn.innerHTML = '&#10006;';
Object.assign(closeBtn.style, {
  position: 'fixed',
  top: '20px',
  right: '30px',
  width: '32px',
  height: '32px',
  backgroundColor: 'red',
  color: 'white',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '20px',
  zIndex: '40'
});
document.body.appendChild(closeBtn);


// === Fungsi Tampilkan Ground Track ===
function showGroundTrackCanvas() {
  canvasGT.style.display = 'block';
  closeBtn.style.display = 'flex';

  // Buat background hitam kalau belum ada
  if (!document.getElementById('canvasBackground')) {
    createBlackBackgroundCanvas();
  }
}

// === Fungsi Sembunyikan Ground Track ===
function hideGroundTrackCanvas() {
  canvasGT.style.display = 'none';
  closeBtn.style.display = 'none';

  const canvasBG = document.getElementById('canvasBackground');
  if (canvasBG) canvasBG.remove();
}


// === Event Listener ===
displayBtn.addEventListener('click', showGroundTrackCanvas);
closeBtn.addEventListener('click', hideGroundTrackCanvas);


//Tanggal
const dateDisplay = document.createElement('div');
dateDisplay.style.position = 'sticky';
dateDisplay.style.bottom = '10px';
dateDisplay.style.left = '10px';
dateDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
dateDisplay.style.color = 'white';
dateDisplay.style.padding = '8px 12px';
dateDisplay.style.borderRadius = '6px';
dateDisplay.style.fontFamily = 'monospace';
dateDisplay.style.fontSize = '14px';
dateDisplay.style.zIndex = '100';
document.body.appendChild(dateDisplay);


// Proyeksi peta datar
const projection = d3.geoEquirectangular()
    .scale(widthGT / (2 * Math.PI))
    .translate([widthGT / 2, heightGT / 2]);
const path = d3.geoPath().projection(projection).context(ctxGT);

// Load background peta
const mapImage = new Image();
mapImage.src = 'teksture/bumisiang.jpg'; 
let mapLoaded = false;

mapImage.onload = () => {
    mapLoaded = true;
};


// Membuat bentuk Bumi
    const loader = new THREE.TextureLoader();//Tekstur
    const geometri  = new THREE.SphereGeometry( 6371 ,  100, 100);
    const material = new THREE.MeshPhongMaterial ({ 
        map: loader.load('teksture/bumisiang.jpg'), 
        bumpMap: loader.load('teksture/bump.jpg'),
        specularMap: loader.load('teksture/mask.png'),
    });
    
   
//Axis angle bumi
    const grupbumi = new THREE.Group();
    //grupbumi.rotation.z = -23.4 * Math.PI / 180;
    scene.add(grupbumi);
    const bumi = new THREE.Mesh(geometri, material);
    grupbumi.add(bumi);


//City Light
    const city = new THREE.MeshBasicMaterial({
        map: loader.load('teksture/bumimalam.jpg'),
        blending: THREE.AdditiveBlending,
    });
   
    const citylight= new THREE.Mesh(geometri, city);
    grupbumi.add(citylight);


//Memanggil bintang
    const bintang = getStar({numStars: 3000});
    scene.add(bintang);

//Milkyway
new THREE.TextureLoader().load('teksture/milkyway.jpg', function(texture) {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });

//Memanggil fresnel
    const fresnel = getFresnel();
    const bersinar = new THREE.Mesh(geometri, fresnel);
    bersinar.scale.setScalar(1.01);
    grupbumi.add(bersinar)

//Awan
    const awan = new THREE.MeshStandardMaterial({
        map: loader.load('teksture/berawan.jpg'),
        blending: THREE.AdditiveBlending,
 })

    const awanku= new THREE.Mesh(geometri, awan);
    awanku.scale.setScalar(1.003);
    grupbumi.add(awanku);

// Grup untuk Satelit & Orbit agar mengikuti Bumi
const grupSatelit = new THREE.Group();
grupbumi.add(grupSatelit);

// Satelit
const satGeometry = new THREE.SphereGeometry(100, 16, 16);
const satMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Warna hijau
const satellite = new THREE.Mesh(satGeometry, satMaterial);
grupSatelit.add(satellite);

// Garis dari satelit ke pusat Bumi
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff }); // Cyan
const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0), // Titik awal (pusat Bumi)
    new THREE.Vector3(0, 0, 0), // Titik akhir (satelit) - akan diperbarui
]);
const garisKeBumi = new THREE.Line(lineGeometry, lineMaterial);
scene.add(garisKeBumi);


// === Grup untuk mengorbitkan Matahari mengelilingi Bumi ===
const grupOrbitMatahari = new THREE.Group();
scene.add(grupOrbitMatahari);

// === Matahari ===
const matahariRadius = 30000 ; 
const sunGeometry = new THREE.SphereGeometry(matahariRadius, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: loader.load('teksture/sun.jpg'),
});
const matahari = new THREE.Mesh(sunGeometry, sunMaterial);


// Posisi Matahari sejauh 149.6 juta km dari Bumi, diskalakan (misal: 1:10.000)
const jarakKeMatahari = 250000; // dalam km (diskalakan)
matahari.position.set(-jarakKeMatahari, 0, 0);
grupOrbitMatahari.add(matahari);

//Posisi cahaya matahari
const cahaya = new THREE.DirectionalLight(0xffffff, 3);
cahaya.position.set(-jarakKeMatahari, 0, 0);
grupOrbitMatahari.add(cahaya); // Tambahkan ke grup orbit Matahari


//===Orbit Satelit====//
//Ketetapan
const Km = 1000;
const earthRadius = 6371; // Radius Bumi km
let altitude = 35000; // Untuk GEO
const G = 6.674e-11; // Gravitasi Universal (m^3/kg/s^2)
const M = 5.972e24;  // Massa Bumi (kg)

//Inputan
let orbitType = "LEO"; // LEO, MEO, GEO
let apogee = 5000;      // Untuk LEO dan MEO dalam km
let perigee = 1000;      // Untuk LEO dan MEO dalam km
let deginklination = 0
let inclination = THREE.MathUtils.degToRad(deginklination); //sudut inklinasi satelit
let argPerigeeDeg = 270; // contoh nilai argumen perigee dalam derajat
let argPerigee = THREE.MathUtils.degToRad(argPerigeeDeg);
let RAANDeg = 0; // contoh nilai RAAN dalam derajat
let RAAN = THREE.MathUtils.degToRad(RAANDeg);
let degtrueanomaly = 0; 
let trueanomaly = THREE.MathUtils.degToRad(degtrueanomaly);


// Fungsi membuat orbit dengan inklinasi, argPerigee, RAAN
function createInclinedOrbit(perigeeRadius, apogeeRadius, inclinationAngle, argPerigeeAngle, raanAngle) {
    const points = [];
    const segments = 180;
    const a = (apogeeRadius + perigeeRadius) / 2;
    const e = (apogeeRadius - perigeeRadius) / (apogeeRadius + perigeeRadius);
    for (let i = 0; i <= segments; i++) {
        let sudut = (i / segments) * Math.PI * 2;
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(sudut));
        const x = r * Math.cos(sudut);
        const z = r * Math.sin(sudut);
        points.push(new THREE.Vector3(x, 0, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const orbit = new THREE.LineLoop(geometry, material);

    // Buat matriks rotasi berurutan: RAAN -> argPerigee -> inklinasi
    const rotRAAN = new THREE.Matrix4().makeRotationY(raanAngle); // global Y-axis
    const rotArgPerigee = new THREE.Matrix4().makeRotationY(argPerigeeAngle); // dalam bidang orbit
    const rotInclination = new THREE.Matrix4().makeRotationX(inclinationAngle); // miringkan bidang orbit

    // Gabungkan semua rotasi dalam urutan yang benar
    const transformMatrix = new THREE.Matrix4()
        .multiply(rotRAAN)
        .multiply(rotInclination)
        .multiply(rotArgPerigee);
    orbit.applyMatrix4(transformMatrix);
    return orbit;
}

  let orbit;
  if (orbitType === "GEO") {
      const radius = earthRadius + altitude;
      apogee = altitude;
      perigee = altitude;
      orbit = createInclinedOrbit(radius, radius, 0, 0, 0); // orbit sirkular GEO
  }
  else {
      const r_apogee = earthRadius + apogee;
      const r_perigee = earthRadius + perigee;
      orbit = createInclinedOrbit(r_perigee, r_apogee, inclination, argPerigee, RAAN); // orbit eliptik LEO/MEO
  }
grupSatelit.add(orbit);


// Jika orbit eliptik, orbitRadius bisa pakai rata-rata (semi-major axis)
    function getTrueAnomalyRate(a, e, anomaly, orbitType) {
    // Jika orbit sirkular
    if (e === 0) {
        const r = a; // r tetap karena sirkular
        if (orbitType === "GEO") {
            const T = 24 * 60 * 60; // Periode GEO (detik)
            return (2 * Math.PI) / T; // rad/s
        } else {
            // Untuk sirkular MEO atau LEO, gunakan hukum gravitasi
            return Math.sqrt(G * M / Math.pow(r, 3)); // rad/s
        }
    }
    // Orbit eliptik: LEO/MEO
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(anomaly)); // Jarak dari fokus
    const h = Math.sqrt(G * M * a * (1 - e * e)); // Momentum sudut spesifik
    return h / (r * r); // Kecepatan sudut (rad/s)
}

const r_apogee = earthRadius + apogee;
const r_perigee = earthRadius + perigee;
const a = (r_apogee + r_perigee) / 2; // semi-major axis
const e = (r_apogee - r_perigee) / (r_apogee + r_perigee); // eksentrisitas
const matrixRAAN = new THREE.Matrix4().makeRotationY(RAAN);
const matrixArgPerigee = new THREE.Matrix4().makeRotationY(argPerigee);
const matrixInclination = new THREE.Matrix4().makeRotationX(inclination);

// Kecepatan rotasi Bumi yang sesungguhnya (23 jam 56 menit per putaran)
const earthRotationSpeed = (2 * Math.PI) / (23 * 60 * 60 + 56 * 60); // radian per detik

//===FOOTPRINT===//
// Jejak (trail) satelit di permukaan fresnel
const maxTrailPoints = 3000 ;
const trailPositions = new Float32Array(maxTrailPoints * 3);
const trailGeometry = new THREE.BufferGeometry();
trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, }); 
const trail = new THREE.Line(trailGeometry, trailMaterial);
bersinar.add(trail);
// Array untuk menyimpan titik jejak dalam koordinat lokal terhadap grupbumi
const trailPoints = [];
const groundTrack = [];
const maxGroundTrackPoints = 2000;

//===TIMESTEP===//
// Simulasi waktu orbit dimulai dari sekarang
let now = new Date();
let simulatedTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // UTC+7 (WIB)

camera.position.z = 20000;

    function animate() {
        requestAnimationFrame(animate);

        let deltaTime = 1 / 60; // Asumsikan frame rate 60 FPS
        const rotasiBumi = earthRotationSpeed * speedFactor * deltaTime;

       const angleRate = getTrueAnomalyRate(a * Km, e, trueanomaly, orbitType); // Km agar dalam meter
       trueanomaly -= angleRate * deltaTime * speedFactor;
        bumi.rotation.y += rotasiBumi;
        citylight.rotation.y += rotasiBumi;
        awanku.rotation.y += 0.00005 * speedFactor * deltaTime;
        bersinar.rotation.y += rotasiBumi;
        bintang.rotation.y -= 2 * 10e-6;
    
//===ORBIT==//
let i;
if (e === 0) {
    i = a; // Jika orbit sirkular
} 
else {
    i = (a * (1 - e * e)) / (1 + e * Math.cos(trueanomaly)); // Orbit elips
}
let x = Math.cos(trueanomaly) * i;
let z = Math.sin(trueanomaly) * i;

//===SATELIT===//
let pos = new THREE.Vector3(x, 0, z);
// Terapkan transformasi argPerigee dan inklinasi
const transformMatrix = new THREE.Matrix4()
    .multiply(matrixRAAN)
    .multiply(matrixInclination)
    .multiply(matrixArgPerigee);
pos.applyMatrix4(transformMatrix);

satellite.position.set(pos.x, pos.y, pos.z);


// Perbarui garis dari pusat Bumi ke satelit
const positions = garisKeBumi.geometry.attributes.position.array;
positions[3] = satellite.position.x;
positions[4] = satellite.position.y;
positions[5] = satellite.position.z;
garisKeBumi.geometry.attributes.position.needsUpdate = true;

// Hitung posisi dunia satelit
const worldPos = new THREE.Vector3();
satellite.getWorldPosition(worldPos);

// Proyeksikan ke permukaan fresnel (skala radius 1.01x)
const surfacePos = worldPos.clone().normalize().multiplyScalar(earthRadius * 1.01);

// Konversi ke lokal koordinat dari mesh fresnel
bersinar.worldToLocal(surfacePos);


// Simpan titik ke jejak
trailPoints.unshift(surfacePos.clone());
    if (trailPoints.length > maxTrailPoints) trailPoints.pop();

// Update geometry trail
    for (let i = 0; i < trailPoints.length; i++) {
        trailGeometry.attributes.position.setXYZ(i, trailPoints[i].x, trailPoints[i].y, trailPoints[i].z);
    }
    
    trailGeometry.setDrawRange(0, trailPoints.length);
    trailGeometry.attributes.position.needsUpdate = true;


// Ambil posisi satelit relatif terhadap pusat Bumi
const relPos = worldPos.clone();

// Rotasi balik sesuai rotasi Bumi (karena Bumi berotasi)
const rotasiTotalBumi = bumi.rotation.y;
relPos.applyMatrix4(new THREE.Matrix4().makeRotationY(-rotasiTotalBumi));


// Hitung lat-long dari worldPos satelit
const r = relPos.length();
const lat = THREE.MathUtils.radToDeg(Math.asin(relPos.y / r));
const lon = THREE.MathUtils.radToDeg(Math.atan2(-relPos.z, relPos.x));

const lonNormalized = ((lon + 180) % 360) - 180;

groundTrack.push([lonNormalized, lat]);
if (groundTrack.length > maxGroundTrackPoints) groundTrack.shift();


// Gambar ulang canvas ground track jika peta sudah siap
if (mapLoaded) {
    ctxGT.clearRect(0, 0, widthGT, heightGT);
    ctxGT.drawImage(mapImage, 0, 0, widthGT, heightGT);

    let line = groundTrack.slice();
    let opacity = 1.0;
    const decay = opacity / line.length;
    const lineWidth = 3 + (widthGT / 800);

    while (line.length > 1) {
        const start = line[0];
        const end = line[1];
        const segment = {
            type: 'LineString',
            coordinates: [start, end]
        };

        ctxGT.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
        ctxGT.lineWidth = lineWidth;
        ctxGT.beginPath();
        path(segment);
        ctxGT.stroke();
        opacity -= decay;
        line.shift();
    }
}

// Update waktu simulasi
let deltaMillis = deltaTime * 1000 * speedFactor; // percepatan waktu simulasi
simulatedTime = new Date(simulatedTime.getTime() + deltaMillis);

// Tampilkan waktu
const formatted = simulatedTime.toISOString().replace('T', ' ').substring(0, 19);
dateDisplay.textContent = `Simulated UTC+7: ${formatted}`;


// Putar Matahari mengelilingi Bumi sesuai real-time (1 tahun ≈ 365.25 hari)
const secondsInYear = 365.25 * 24 * 60 * 60 ;
const earthOrbitSpeed = (2 * Math.PI) / secondsInYear; // radian per detik

// Waktu delta
grupOrbitMatahari.rotation.y += earthOrbitSpeed * deltaTime * speedFactor;


    renderer.render(scene, camera);

    }

    animate();


    function handleWindowResize () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener('resize', handleWindowResize, false);

    
});


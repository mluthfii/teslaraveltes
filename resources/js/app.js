import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import getStar from '../src/getstar';
import { getFresnel } from '../src/getfresnel';

document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Memberikan efek smooth saat rotasi

    
    const loader = new THREE.TextureLoader();//Tekstur
    const geometri  = new THREE.IcosahedronGeometry( 1 ,   50);
    const material = new THREE.MeshStandardMaterial ({ 
        map: loader.load('teksture/bumisiang.jpg'), 
        bumpMap: loader.load('teksture/bump.jpg'),
        maskMap: loader.load('teksture/mask.jpg'),
    });
    
   
//Axis angle bumi
    const grupbumi = new THREE.Group();
    grupbumi.rotation.z = -23.4 * Math.PI / 180;
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
   
//Posisi cahaya matahari
    const cahaya = new THREE.DirectionalLight(0xffffff, 2);
    cahaya.position.set(-1.8 ,  0.5,  1.4);           
    scene.add(cahaya);

//Memanggil bintang
    const bintang = getStar({numStars: 2000});
    scene.add(bintang);

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


    // Grup Satelit
    const grupSatelit = new THREE.Group();

    // Badan Satelit (Kubus)
    const bodyGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        map: loader.load('teksture/satelit.jpg'),
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    grupSatelit.add(body);

    // Panel Surya
    const panelGeometry = new THREE.BoxGeometry(0.6, 0.01, 0.3);
    const panelMaterial = new THREE.MeshStandardMaterial({ map: loader.load('teksture/panel1.jpg')
     });

    const panelLeft = new THREE.Mesh(panelGeometry, panelMaterial);
    panelLeft.position.set(-0.45, 0, 0);
    grupSatelit.add(panelLeft);

    const panelRight = new THREE.Mesh(panelGeometry, panelMaterial);
    panelRight.position.set(0.45, 0, 0);
    grupSatelit.add(panelRight);

    // Orbit Satelit
    const orbitRadius = 2.5;
    let kecepatanOrbit = 0; // Sudut awal orbit

    grupbumi.add(grupSatelit); // Satelit mengikuti Bumi


camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        
        bumi.rotation.y += 0.00364;
        citylight.rotation.y += 0.00364;
        awanku.rotation.y += 0.002;
        bersinar.rotation.y += 0.00364;
        bintang.rotation.y += 0.0002;
        kecepatanOrbit += 0.01; // Kecepatan orbit
        grupSatelit.position.x = orbitRadius * Math.cos(kecepatanOrbit);
        grupSatelit.position.z = -orbitRadius * Math.sin(kecepatanOrbit);

        // Satelit selalu menghadap ke Bumi
        grupSatelit.lookAt(bumi.position);

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


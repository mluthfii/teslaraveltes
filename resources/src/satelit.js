// Grup untuk satelit
const grupSatelit = new THREE.Group();

// Membuat badan satelit (kubus)
const bodyGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
grupSatelit.add(body);

// Membuat panel surya (dua persegi panjang di samping)
const panelGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.3);
const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });

const panelLeft = new THREE.Mesh(panelGeometry, panelMaterial);
panelLeft.position.set(-0.45, 0, 0);
grupSatelit.add(panelLeft);

const panelRight = new THREE.Mesh(panelGeometry, panelMaterial);
panelRight.position.set(0.45, 0, 0);
grupSatelit.add(panelRight);

// Menempatkan satelit di orbit Bumi
const orbitRadius = 2.5;
grupSatelit.position.set(orbitRadius, 0, 0);

// Menambahkan grup satelit ke grup Bumi agar ikut berputar
grupbumi.add(grupSatelit);

function animate() {
    requestAnimationFrame(animate);

    // Rotasi Bumi
    bumi.rotation.y += 0.00364;
    citylight.rotation.y += 0.00364;
    awanku.rotation.y += 0.002;
    bersinar.rotation.y += 0.00364;
    bintang.rotation.y += 0.0002;

    // Animasi orbit satelit
    const waktu = Date.now() * 0.001;
    grupSatelit.position.x = orbitRadius * Math.cos(waktu);
    grupSatelit.position.z = orbitRadius * Math.sin(waktu);
    
    grupSatelit.rotation.y += 0.01; // Rotasi satelit

    renderer.render(scene, camera);
}

animate();

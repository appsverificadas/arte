// 1. ESCENA, CÁMARA Y ENTORNO (Calabozo Digital)
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030205, 0.07); // Niebla abisal
scene.background = new THREE.Color(0x030205);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 9);

const canvas = document.getElementById('lienzo3d');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 18;

// 2. ILUMINACIÓN DRAMÁTICA (Dual Rojo/Cian)
const luzRoja = new THREE.PointLight(0xff1a3c, 5, 25);
luzRoja.position.set(6, 4, 4);
scene.add(luzRoja);

const luzCian = new THREE.PointLight(0x00f0ff, 4, 25);
luzCian.position.set(-6, -4, -2);
scene.add(luzCian);

scene.add(new THREE.AmbientLight(0x0a0a14, 1.5));

// 3. GRUPO PRINCIPAL Y MATERIALES
const monstruo = new THREE.Group();
scene.add(monstruo);

// Material de piel de obsidiana/cristal biológico
const matPiel = new THREE.MeshPhysicalMaterial({
    color: 0x0c0a10,
    metalness: 0.8,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9
});

// Material neón brillante para ojos y energía
const matEnergia = new THREE.MeshBasicMaterial({
    color: 0x00ffff
});

// 4. ANATOMÍA: CUERPO CENTRAL (Esfera deformada procedimentalmente)
const geoCuerpo = new THREE.IcosahedronGeometry(2, 35);
const posCuerpo = geoCuerpo.attributes.position;
for (let i = 0; i < posCuerpo.count; i++) {
    let x = posCuerpo.getX(i);
    let y = posCuerpo.getY(i);
    let z = posCuerpo.getZ(i);
    let d = 1 + Math.sin(x * 3) * Math.cos(y * 2) * Math.sin(z * 3) * 0.22;
    posCuerpo.setXYZ(i, x * d, y * d, z * d);
}
geoCuerpo.computeVertexNormals();
const cuerpo = new THREE.Mesh(geoCuerpo, matPiel);
monstruo.add(cuerpo);

// 5. ANATOMÍA: CABEZA ALIENÍGENA
const geoCabeza = new THREE.IcosahedronGeometry(1.2, 25);
const posCabeza = geoCabeza.attributes.position;
for (let i = 0; i < posCabeza.count; i++) {
    let x = posCabeza.getX(i);
    let y = posCabeza.getY(i);
    let z = posCabeza.getZ(i);
    let d = 1 + Math.sin(y * 4 + x * 2) * 0.18;
    posCabeza.setXYZ(i, x * d, y * d * 1.3, z * d * 1.1); // Forma estilizada y alargada
}
geoCabeza.computeVertexNormals();
const cabeza = new THREE.Mesh(geoCabeza, matPiel);
cabeza.position.set(0, 2.2, 0.3);
monstruo.add(cabeza);

// 6. DETALLES: OJOS BRILLANTES Y CORONA DE CUERNOS
const geoOjo = new THREE.SphereGeometry(0.18, 16, 16);
const ojoIzq = new THREE.Mesh(geoOjo, matEnergia);
ojoIzq.position.set(-0.4, 2.4, 1.1);
monstruo.add(ojoIzq);

const ojoDer = new THREE.Mesh(geoOjo, matEnergia);
ojoDer.position.set(0.4, 2.4, 1.1);
monstruo.add(ojoDer);

// Luz propia emitiendo desde los ojos
const luzOjos = new THREE.PointLight(0x00ffff, 2, 4);
luzOjos.position.set(0, 2.4, 1.2);
monstruo.add(luzOjos);

// Corona de espinas
const geoCuerno = new THREE.ConeGeometry(0.15, 1.8, 5);
for (let i = 0; i < 7; i++) {
    const cuerno = new THREE.Mesh(geoCuerno, matPiel);
    const angulo = (i - 3) * 0.35;
    cuerno.position.set(Math.sin(angulo) * 1.2, 2.8 + Math.cos(angulo) * 0.2, Math.cos(angulo) * -0.5);
    cuerno.rotation.z = -angulo * 1.2;
    cuerno.rotation.x = -0.4;
    monstruo.add(cuerno);
}

// 7. ZARCILLOS / TENTÁCULOS INFERIORES
for (let i = 0; i < 8; i++) {
    const puntos = [];
    const ang = (i / 8) * Math.PI * 2;
    for (let j = 0; j < 5; j++) {
        puntos.push(new THREE.Vector3(
            Math.cos(ang) * (1 + j * 0.4) + (Math.random() - 0.5) * 0.2,
            -1 - j * 0.7,
            Math.sin(ang) * (1 + j * 0.4) + (Math.random() - 0.5) * 0.2
        ));
    }
    const curva = new THREE.CatmullRomCurve3(puntos);
    const geoTuberia = new THREE.TubeGeometry(curva, 20, 0.08, 8, false);
    const zarcillo = new THREE.Mesh(geoTuberia, matPiel);
    monstruo.add(zarcillo);
}

// 8. ENJAMBRE DE CRISTALES EN ÓRBITA
const enjambre = new THREE.Group();
const geoCristal = new THREE.OctahedronGeometry(0.12, 0);
for (let i = 0; i < 60; i++) {
    const cristal = new THREE.Mesh(
        geoCristal, 
        Math.random() > 0.35 ? matPiel : matEnergia
    );
    const r = 3 + Math.random() * 2.5;
    const t1 = Math.random() * Math.PI * 2;
    const t2 = Math.random() * Math.PI * 2;
    cristal.position.set(
        r * Math.sin(t1) * Math.cos(t2),
        r * Math.sin(t1) * Math.sin(t2),
        r * Math.cos(t1)
    );
    enjambre.add(cristal);
}
scene.add(enjambre);

// 9. BUCLE DE ANIMACIÓN Y FÍSICA
let tiempo = 0;

function animar() {
    requestAnimationFrame(animar);
    tiempo += 0.015;

    // Latido y respiración biológica
    const latido = 1 + Math.sin(tiempo * 2) * 0.03;
    cuerpo.scale.set(latido, latido, latido);

    // Flotación sutil del cuerpo
    monstruo.rotation.y = Math.sin(tiempo * 0.4) * 0.15;
    monstruo.position.y = Math.sin(tiempo * 1.2) * 0.15;

    // Rotación del campo de energía orbital
    enjambre.rotation.y -= 0.004;
    enjambre.rotation.x += 0.002;

    // Pulsación de la luz de los ojos
    luzOjos.intensity = 2 + Math.sin(tiempo * 4) * 0.8;

    controls.update();
    renderer.render(scene, camera);
}

// 10. REAJUSTE DE PANTALLA
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animar();

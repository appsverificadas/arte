// 1. ESCENA Y CÁMARA (El calabozo digital)
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050101, 0.08); // Niebla oscura para dar profundidad
scene.background = new THREE.Color(0x050101);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;

const canvas = document.getElementById('lienzo3d');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 4;
controls.maxDistance = 20;

// 2. ILUMINACIÓN DE TERROR (Rojo sangre y Azul abisal)
const luzRoja = new THREE.PointLight(0x8a0303, 5, 20);
luzRoja.position.set(5, 5, 2);
scene.add(luzRoja);

const luzAzul = new THREE.PointLight(0x0a2f5c, 3, 20);
luzAzul.position.set(-5, -5, 2);
scene.add(luzAzul);

scene.add(new THREE.AmbientLight(0x111111));

// 3. EL ALIENÍGENA: NÚCLEO ORGÁNICO
// Un TorusKnot (nudo) con altísimo detalle para simular tripas o un cerebro alienígena
const geometryNucleo = new THREE.TorusKnotGeometry(2, 0.8, 300, 40, 3, 5);
const posicionesNucleo = geometryNucleo.attributes.position;

// Deformamos el núcleo para que sea asimétrico y grotesco
for (let i = 0; i < posicionesNucleo.count; i++) {
    let x = posicionesNucleo.getX(i);
    let y = posicionesNucleo.getY(i);
    let z = posicionesNucleo.getZ(i);
    
    // Distorsión biológica
    let ruido = 1 + (Math.sin(x * 3) * Math.cos(y * 2) * Math.sin(z * 4)) * 0.1;
    posicionesNucleo.setXYZ(i, x * ruido, y * ruido, z * ruido);
}
geometryNucleo.computeVertexNormals();

// Material húmedo y orgánico (como la piel de un xenomorfo)
const materialNucleo = new THREE.MeshPhysicalMaterial({
    color: 0x1a0000,       // Rojo casi negro
    metalness: 0.3,
    roughness: 0.1,        // Muy liso para simular humedad
    clearcoat: 1.0,        // Brillo baboso
    clearcoatRoughness: 0.2
});

const nucleo = new THREE.Mesh(geometryNucleo, materialNucleo);
scene.add(nucleo);

// 4. EL ENJAMBRE: ESQUIRLAS Y ESPINAS PROTECTORAS
// Creamos múltiples objetos satélite para darle complejidad a la obra
const esquirlas = new THREE.Group();
const geoEsquirla = new THREE.ConeGeometry(0.1, 1.5, 4); // Espinas afiladas
const matEsquirla = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: 0.9,
    roughness: 0.3,
    transmission: 0.5 // Ligeramente translúcidas
});

for (let i = 0; i < 80; i++) {
    const esquirla = new THREE.Mesh(geoEsquirla, matEsquirla);
    
    // Posición caótica alrededor del núcleo
    const radio = 4 + Math.random() * 3;
    const angulo1 = Math.random() * Math.PI * 2;
    const angulo2 = Math.random() * Math.PI * 2;
    
    esquirla.position.x = radio * Math.cos(angulo1) * Math.sin(angulo2);
    esquirla.position.y = radio * Math.sin(angulo1) * Math.sin(angulo2);
    esquirla.position.z = radio * Math.cos(angulo2);
    
    // Apuntan en direcciones aleatorias
    esquirla.rotation.x = Math.random() * Math.PI;
    esquirla.rotation.y = Math.random() * Math.PI;
    
    esquirlas.add(esquirla);
}
scene.add(esquirlas);

// 5. MOTOR DE VIDA (Respiración y movimiento)
let tiempo = 0;

function animar() {
    requestAnimationFrame(animar);
    tiempo += 0.01;
    
    // El núcleo respira (se expande y contrae sutilmente)
    let latido = 1 + Math.sin(tiempo * 2) * 0.05;
    nucleo.scale.set(latido, latido, latido);
    
    // El núcleo rota como si estuviera vivo
    nucleo.rotation.x += 0.002;
    nucleo.rotation.y += 0.003;
    
    // El enjambre de esquirlas orbita lentamente de forma amenazante
    esquirlas.rotation.y -= 0.001;
    esquirlas.rotation.z += 0.0005;
    
    controls.update(); 
    renderer.render(scene, camera);
}

// 6. RESPONSIVE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animar();

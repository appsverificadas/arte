// 1. ESCENA Y CÁMARA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

const canvas = document.getElementById('lienzo3d');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Nitidez extrema para pantallas 4K

// 2. CONTROLES DE ZOOM Y ROTACIÓN
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Movimiento suave y premium
controls.dampingFactor = 0.05;
controls.minDistance = 3; // Límite de zoom hacia adentro
controls.maxDistance = 15; // Límite de zoom hacia afuera

// 3. LUCES DE ESTUDIO (Imprescindibles para el detalle)
const luzPrincipal = new THREE.DirectionalLight(0xffffff, 2);
luzPrincipal.position.set(5, 5, 5);
scene.add(luzPrincipal);

const luzRelleno = new THREE.DirectionalLight(0xd4af37, 1); // Tono dorado
luzRelleno.position.set(-5, -5, -5);
scene.add(luzRelleno);

scene.add(new THREE.AmbientLight(0x222222));

// 4. ESCULTURA DE ALTA RESOLUCIÓN
// Icosaedro con detalle 40 = miles de polígonos sólidos
const geometry = new THREE.IcosahedronGeometry(2.5, 40); 
const posiciones = geometry.attributes.position;

// Deformación física para que parezca una piedra tallada o fracturada
for (let i = 0; i < posiciones.count; i++) {
    let x = posiciones.getX(i);
    let y = posiciones.getY(i);
    let z = posiciones.getZ(i);
    
    // Distorsión caótica pero continua
    let ruido = 1 + (Math.sin(x * 4) * Math.cos(y * 4) * Math.sin(z * 4)) * 0.15;
    posiciones.setXYZ(i, x * ruido, y * ruido, z * ruido);
}
geometry.computeVertexNormals(); // Recalcula cómo rebota la luz en los nuevos ángulos

// 5. MATERIAL PREMIUM (Físicamente realista)
const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111,       // Casi negro
    metalness: 0.8,        // Apariencia metálica
    roughness: 0.2,        // Ligeramente pulido
    clearcoat: 1.0,        // Capa de barniz/cristal por encima
    clearcoatRoughness: 0.1
});

const escultura = new THREE.Mesh(geometry, material);
scene.add(escultura);

// 6. MOTOR DE ANIMACIÓN
function animar() {
    requestAnimationFrame(animar);
    
    // Rotación base (muy lenta)
    escultura.rotation.y += 0.001;
    
    // Actualiza los controles del usuario
    controls.update(); 
    
    renderer.render(scene, camera);
}

// 7. RESPONSIVE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animar();

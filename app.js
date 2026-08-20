// 1. ESCENA Y CÁMARA (El espacio vacío y el ojo del espectador)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505); // Un negro con una levísima textura

// La cámara imita la visión humana
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Alejamos la cámara para ver la obra

// 2. RENDERIZADOR (El pintor que dibuja en la pantalla)
const canvas = document.getElementById('lienzo3d');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Nitidez extrema

// 3. LA ESCULTURA BASE (La materia cruda)
// Usamos una geometría compleja con mucho detalle
const geometry = new THREE.IcosahedronGeometry(2, 2);

// Le damos un material de "alambre" fino y frágil para empezar
const material = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, // Blanco puro
    wireframe: true, // Modo alambre (líneas)
    transparent: true,
    opacity: 0.3 // Semi-invisible para dar sensación de fragilidad
});

const escultura = new THREE.Mesh(geometry, material);
scene.add(escultura);

// 4. EL TIEMPO Y LA ANIMACIÓN (El motor de la vida)
function animar() {
    requestAnimationFrame(animar);

    // Hacemos que la escultura rote lentamente sobre su propio eje
    escultura.rotation.x += 0.002;
    escultura.rotation.y += 0.003;

    // Le pedimos al renderizador que tome una "foto" y la muestre
    renderer.render(scene, camera);
}

// 5. RESPUESTA AL TAMAÑO DE PANTALLA
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciamos la obra
animar();

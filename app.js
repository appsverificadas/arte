// 1. ESCENA Y CÁMARA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030303); // Negro abismal de galería

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

const canvas = document.getElementById('lienzo3d');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. EL ADN DE LA OBRA (Lo que la hace 1/1)
// Esta es la semilla que en el futuro cambiará con cada venta
const semillaComprador = "0x8f4c2b9a1e"; 

// 3. LA MATERIA (Nube de partículas fracturadas)
const geometry = new THREE.BufferGeometry();
const cantParticulas = 20000;
const posiciones = new Float32Array(cantParticulas * 3);
const colores = new Float32Array(cantParticulas * 3);

for (let i = 0; i < cantParticulas * 3; i += 3) {
    // Generamos una esfera densa pero caótica
    const r = 3 + (Math.random() * 1.2); 
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    
    posiciones[i] = r * Math.sin(phi) * Math.cos(theta);     // X
    posiciones[i+1] = r * Math.sin(phi) * Math.sin(theta);   // Y
    posiciones[i+2] = r * Math.cos(phi);                     // Z

    // Inyectamos el oro (Kintsugi): 93% negro/gris, 7% oro puro
    if (Math.random() > 0.93) {
        colores[i] = 1.0;   // Rojo al máximo
        colores[i+1] = 0.7; // Verde
        colores[i+2] = 0.1; // Azul
    } else {
        // Material oscuro y frágil
        const tonoGris = 0.1 + (Math.random() * 0.2);
        colores[i] = tonoGris;
        colores[i+1] = tonoGris;
        colores[i+2] = tonoGris;
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colores, 3));

// 4. EL MATERIAL PREMIUM
const material = new THREE.PointsMaterial({
    size: 0.03, // Puntos microscópicos
    vertexColors: true,
    transparent: true,
    opacity: 0.9
});

const escultura = new THREE.Points(geometry, material);
scene.add(escultura);

// 5. INTERACTIVIDAD (La tensión con el usuario)
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    // Convertimos la posición del mouse en coordenadas 3D
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 6. EL MOTOR DE VIDA
function animar() {
    requestAnimationFrame(animar);
    
    // Rotación natural de la obra
    escultura.rotation.y += 0.0015;
    escultura.rotation.x += 0.0005;
    
    // La obra reacciona (se tensa) cuando el coleccionista mueve el mouse
    escultura.rotation.y += mouseX * 0.01;
    escultura.rotation.x -= mouseY * 0.01;

    renderer.render(scene, camera);
}

// 7. RESPONSIVE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animar();

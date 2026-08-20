// 3. LA ESCULTURA BASE (La materia fracturada)
// Subimos el nivel de detalle (de 2 a 8) para tener miles de puntos para romper
const geometry = new THREE.IcosahedronGeometry(2, 8);
const positionAttribute = geometry.attributes.position;

// Acá ocurre la magia: recorremos cada vértice y lo "quebramos"
for (let i = 0; i < positionAttribute.count; i++) {
    let x = positionAttribute.getX(i);
    let y = positionAttribute.getY(i);
    let z = positionAttribute.getZ(i);

    // Creamos una distorsión para simular tensión (como cristal a punto de romperse)
    // Más adelante, este Math.random() será reemplazado por la semilla criptográfica del comprador
    let deformacion = 1 + (Math.random() - 0.5) * 0.3; 
    
    positionAttribute.setXYZ(i, x * deformacion, y * deformacion, z * deformacion);
}

// Le pedimos al motor que recalcule la forma después del impacto
geometry.computeVertexNormals();

const material = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, // Blanco puro
    wireframe: true, // Sigue en modo red para ver el caos interno
    transparent: true,
    opacity: 0.4
});

const escultura = new THREE.Mesh(geometry, material);
scene.add(escultura);

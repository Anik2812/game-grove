// Three.js setup
let scene, camera, renderer;
let gameBoard, cafeEnvironment;
let players = ['', ''];
let currentPlayer = 0;
let scores = [0, 0];
let gameActive = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    createCafeEnvironment();
    createGameBoard();
    setupLighting();
    setupEventListeners();

    animate();
}

function createCafeEnvironment() {
    cafeEnvironment = new THREE.Group();

    // Add floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    cafeEnvironment.add(floor);

    // Add walls
    const wallGeometry = new THREE.PlaneGeometry(20, 10);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D });
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.z = -10;
    backWall.position.y = 5;
    cafeEnvironment.add(backWall);

    // Add simple furniture (tables and chairs)
    // This is a simplified representation. You can add more detailed models later.
    const tableGeometry = new THREE.BoxGeometry(2, 1, 2);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(-5, 0.5, -5);
    cafeEnvironment.add(table);

    const chairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const chair = new THREE.Mesh(chairGeometry, chairMaterial);
    chair.position.set(-5, 0.5, -3.5);
    cafeEnvironment.add(chair);

    scene.add(cafeEnvironment);
}

function createGameBoard() {
    gameBoard = new THREE.Group();
    const cellSize = 1;
    const spacing = 0.1;

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                const cellGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                const cellMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.5 });
                const cell = new THREE.Mesh(cellGeometry, cellMaterial);
                cell.position.set(
                    (x - 1) * (cellSize + spacing),
                    (y - 1) * (cellSize + spacing),
                    (z - 1) * (cellSize + spacing)
                );
                cell.userData = { x, y, z, occupied: false };
                gameBoard.add(cell);
            }
        }
    }

    scene.add(gameBoard);
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onCellClick);
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('reset-game').addEventListener('click', resetGame);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startGame() {
    players[0] = document.getElementById('player1').value || 'Player 1';
    players[1] = document.getElementById('player2').value || 'Player 2';
    document.getElementById('player1-name').textContent = players[0];
    document.getElementById('player2-name').textContent = players[1];
    document.getElementById('current-turn').textContent = players[currentPlayer];
    document.getElementById('player-setup').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
    document.getElementById('reset-game').style.display = 'block';
    gameActive = true;
}

function resetGame() {
    gameBoard.children.forEach(cell => {
        cell.material.color.setHex(0xFFFFFF);
        cell.userData.occupied = false;
    });
    currentPlayer = 0;
    document.getElementById('current-turn').textContent = players[currentPlayer];
    document.getElementById('winner-announcement').style.display = 'none';
    gameActive = true;
}

function onCellClick(event) {
    if (!gameActive) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(gameBoard.children);

    if (intersects.length > 0) {
        const cell = intersects[0].object;
        if (!cell.userData.occupied) {
            cell.userData.occupied = true;
            cell.material.color.setHex(currentPlayer === 0 ? 0xFF0000 : 0x0000FF);
            if (checkWin()) {
                announceWinner();
            } else {
                currentPlayer = 1 - currentPlayer;
                document.getElementById('current-turn').textContent = players[currentPlayer];
            }
        }
    }
}

function checkWin() {
    // Implement win condition checking logic here
    // This is a simplified version. You'll need to implement all win conditions for 3D Tic-Tac-Toe
    return false;
}

function announceWinner() {
    gameActive = false;
    scores[currentPlayer]++;
    document.getElementById(`player${currentPlayer + 1}-score`).textContent = scores[currentPlayer];
    document.getElementById('winner-announcement').textContent = `${players[currentPlayer]} wins!`;
    document.getElementById('winner-announcement').style.display = 'block';
    createSparkleEffect();
}

function createSparkleEffect() {
    // Implement sparkle effect using Three.js particle system
    // This is a placeholder for the actual implementation
    console.log("Sparkle effect!");
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();






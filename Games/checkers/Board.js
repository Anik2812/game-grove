const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const board = [];
const pieces = [];
let selectedPiece = null;
let currentTurn = 'white';
let gameMode = null; // 'solo' or 'multiplayer'
const turnIndicator = document.getElementById('turn-indicator');
const gameModeSelector = document.getElementById('game-mode-selector');
const gameUI = document.getElementById('game-ui');
const winnerDisplay = document.getElementById('winner-display');

// Set up lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Set up camera and controls
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Set background color
scene.background = new THREE.Color(0x2c3e50);

// Create floating checkerboard
const boardTexture = textureLoader.load('board.jpg');
const boardGeometry = new THREE.BoxGeometry(8, 0.2, 8);
const boardMaterial = new THREE.MeshPhongMaterial({ map: boardTexture });
const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
scene.add(boardMesh);

// Create checkers pieces
function createPiece(color, x, z) {
    const geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const material = new THREE.MeshPhongMaterial({ color: color === 'white' ? 0xFFFFFF : 0x333333 });
    const piece = new THREE.Mesh(geometry, material);
    piece.position.set(x - 3.5, 0.1, z - 3.5);
    piece.userData = { color, isKing: false };
    scene.add(piece);
    pieces.push(piece);
    return piece;
}

// Initial piece setup for checkers
function setupBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                if (row < 3) {
                    createPiece('black', col, row);
                } else if (row > 4) {
                    createPiece('white', col, row);
                }
            }
        }
    }
}

// Raycaster for piece selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick() {
    if (gameMode === 'solo' && currentTurn === 'black') return; // Prevent clicking during computer's turn

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pieces);

    if (intersects.length > 0) {
        const clickedPiece = intersects[0].object;
        if (clickedPiece.userData.color === currentTurn) {
            if (selectedPiece) {
                selectedPiece.material.emissive.setHex(0x000000);
            }
            selectedPiece = clickedPiece;
            selectedPiece.material.emissive.setHex(0x00ff00);
        } else if (selectedPiece) {
            movePiece(selectedPiece, clickedPiece.position);
        }
    } else if (selectedPiece) {
        const boardIntersects = raycaster.intersectObject(boardMesh);
        if (boardIntersects.length > 0) {
            movePiece(selectedPiece, boardIntersects[0].point);
        }
    }
}

function movePiece(piece, targetPosition) {
    const fromX = Math.round(piece.position.x + 3.5);
    const fromZ = Math.round(piece.position.z + 3.5);
    const toX = Math.round(targetPosition.x + 3.5);
    const toZ = Math.round(targetPosition.z + 3.5);

    if (isValidMove(piece.userData.color, fromX, fromZ, toX, toZ)) {
        const capturedPiece = getCapturedPiece(fromX, fromZ, toX, toZ);

        if (capturedPiece) {
            capturePiece(capturedPiece);
        }

        gsap.to(piece.position, {
            x: toX - 3.5,
            z: toZ - 3.5,
            y: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(piece.position, {
                    y: 0.1,
                    duration: 0.2,
                    ease: "bounce.out",
                    onComplete: () => {
                        piece.material.emissive.setHex(0x000000);
                        selectedPiece = null;
                        if (shouldBecomeKing(piece)) {
                            makeKing(piece);
                        }
                        if (!canJumpAgain(piece)) {
                            switchTurn();
                            if (gameMode === 'solo' && currentTurn === 'black') {
                                setTimeout(computerMove, 1000);
                            }
                        }
                        checkForWinner();
                    }
                });
            }
        });
    }
}

function isValidMove(pieceColor, fromX, fromZ, toX, toZ) {
    const dx = toX - fromX;
    const dz = toZ - fromZ;
    const direction = pieceColor === 'white' ? -1 : 1;

    // Regular move
    if (Math.abs(dx) === 1 && dz === direction) {
        return !getPieceAt(toX, toZ);
    }

    // Capture move
    if (Math.abs(dx) === 2 && dz === 2 * direction) {
        const capturedPiece = getCapturedPiece(fromX, fromZ, toX, toZ);
        return capturedPiece && capturedPiece.userData.color !== pieceColor && !getPieceAt(toX, toZ);
    }

    return false;
}

function getCapturedPiece(fromX, fromZ, toX, toZ) {
    const midX = (fromX + toX) / 2;
    const midZ = (fromZ + toZ) / 2;
    return getPieceAt(midX, midZ);
}

function getPieceAt(x, z) {
    return pieces.find(p => Math.round(p.position.x + 3.5) === x && Math.round(p.position.z + 3.5) === z);
}

function capturePiece(piece) {
    gsap.to(piece.position, {
        y: 2,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            scene.remove(piece);
            pieces.splice(pieces.indexOf(piece), 1);
        }
    });
}

function shouldBecomeKing(piece) {
    const z = Math.round(piece.position.z + 3.5);
    return (piece.userData.color === 'white' && z === 0) || (piece.userData.color === 'black' && z === 7);
}

function makeKing(piece) {
    piece.userData.isKing = true;
    const crown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32),
        new THREE.MeshPhongMaterial({ color: 0xFFD700 })
    );
    crown.position.y = 0.15;
    piece.add(crown);
}

function canJumpAgain(piece) {
    const x = Math.round(piece.position.x + 3.5);
    const z = Math.round(piece.position.z + 3.5);
    const directions = piece.userData.isKing ? [-1, 1] : [piece.userData.color === 'white' ? -1 : 1];

    for (const dz of directions) {
        for (const dx of [-1, 1]) {
            if (isValidMove(piece.userData.color, x, z, x + 2 * dx, z + 2 * dz)) {
                return true;
            }
        }
    }
    return false;
}

function switchTurn() {
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    turnIndicator.textContent = `${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}'s Turn`;
}

function checkForWinner() {
    const whitePieces = pieces.filter(p => p.userData.color === 'white');
    const blackPieces = pieces.filter(p => p.userData.color === 'black');

    if (whitePieces.length === 0 || blackPieces.length === 0) {
        const winner = whitePieces.length === 0 ? 'Black' : 'White';
        winnerDisplay.textContent = `${winner} wins!`;
        winnerDisplay.style.display = 'block';
        celebrateWin(winner);
    }
}

function celebrateWin(winner) {
    // Create and animate confetti
    for (let i = 0; i < 100; i++) {
        const confetti = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
        );
        confetti.position.set(
            Math.random() * 8 - 4,
            10,
            Math.random() * 8 - 4
        );
        scene.add(confetti);

        gsap.to(confetti.position, {
            y: -5,
            duration: 2 + Math.random() * 2,
            ease: "power1.out",
            onComplete: () => scene.remove(confetti)
        });
    }

    // Zoom and rotate camera
    gsap.to(camera.position, {
        x: 5,
        y: 15,
        z: 5,
        duration: 2,
        ease: "power2.inOut"
    });
    gsap.to(camera.rotation, {
        x: -Math.PI / 4,
        y: Math.PI / 4,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
    });
}

function computerMove() {
    const blackPieces = pieces.filter(p => p.userData.color === 'black');
    let bestMove = null;
    let bestScore = -Infinity;

    for (const piece of blackPieces) {
        const x = Math.round(piece.position.x + 3.5);
        const z = Math.round(piece.position.z + 3.5);

        for (const dz of [-1, 1]) {
            for (const dx of [-1, 1]) {
                if (isValidMove('black', x, z, x + dx, z + dz)) {
                    const score = evaluateMove(x, z, x + dx, z + dz);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { piece, toX: x + dx, toZ: z + dz };
                    }
                }
                if (isValidMove('black', x, z, x + 2 * dx, z + 2 * dz)) {
                    const score = evaluateMove(x, z, x + 2 * dx, z + 2 * dz);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { piece, toX: x + 2 * dx, toZ: z + 2 * dz };
                    }
                }
            }
        }
    }

    if (bestMove) {
        movePiece(bestMove.piece, new THREE.Vector3(bestMove.toX - 3.5, 0.1, bestMove.toZ - 3.5));
    }
}

function evaluateMove(fromX, fromZ, toX, toZ) {
    let score = 0;

    // Prefer captures
    if (Math.abs(toX - fromX) === 2) {
        score += 10;
    }

    // Prefer advancing
    score += toZ;

    // Prefer center control
    score += 5 - Math.abs(toX - 3.5);

    return score;
}

function resetGame() {
    pieces.forEach(piece => scene.remove(piece));
    pieces.length = 0;
    setupBoard();
    currentTurn = 'white';
    turnIndicator.textContent = "White's Turn";
    winnerDisplay.style.display = 'none';

    // Reset camera position
    gsap.to(camera.position, {
        x: 0,
        y: 10,
        z: 10,
        duration: 1,
        ease: "power2.inOut"
    });
    gsap.to(camera.rotation, {
        x: -Math.PI / 4,
        y: 0,
        z: 0,
        duration: 1,
        ease: "power2.inOut"
    });
}

function startGame(mode) {
    gameMode = mode;
    gameModeSelector.style.display = 'none';
    gameUI.style.display = 'block';
    setupBoard();
}

document.getElementById('solo-btn').addEventListener('click', () => startGame('solo'));
document.getElementById('multiplayer-btn').addEventListener('click', () => startGame('multiplayer'));
document.getElementById('reset-game').addEventListener('click', resetGame);

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseClick);

// Add floating animation to the board
function animateBoard() {
    const time = performance.now() * 0.001;
    boardMesh.position.y = Math.sin(time) * 0.1;
    requestAnimationFrame(animateBoard);
}

animateBoard();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
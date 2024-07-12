const words = [
    { word: "PIZZAZZ", clue: "Exciting energy or flair", difficulty: "hard" },
    { word: "QUOKKA", clue: "The happiest animal on Earth", difficulty: "medium" },
    { word: "FLAMINGO", clue: "Pink bird that stands on one leg", difficulty: "easy" },
    { word: "UNICORN", clue: "Mythical horse with a horn", difficulty: "easy" },
    { word: "ZUCCHINI", clue: "Green veggie that's secretly a fruit", difficulty: "medium" },
    { word: "KARAOKE", clue: "Singing your heart out, badly", difficulty: "easy" },
    { word: "SQUID", clue: "Ocean creature with ink and arms", difficulty: "easy" },
    { word: "XYLOPHONE", clue: "Musical instrument you hit with sticks", difficulty: "hard" },
    { word: "WOMBAT", clue: "Cute Australian animal with cube-shaped poop", difficulty: "medium" },
    { word: "JAZZ", clue: "Music genre that goes doo-bop-doo-wop", difficulty: "easy" },
    { word: "KANGAROO", clue: "Bouncy Australian with a built-in pocket", difficulty: "easy" },
    { word: "QUICHE", clue: "Fancy egg pie", difficulty: "medium" },
    { word: "VORTEX", clue: "Swirly thing that might eat your socks", difficulty: "hard" },
    { word: "YODEL", clue: "Alpine singing technique", difficulty: "medium" },
    { word: "ZAMBONI", clue: "Ice rink's smoothing machine", difficulty: "hard" }
];

const randomQuestions = [
    "What's your favorite ice cream flavor?",
    "If you could be any animal, what would you be?",
    "What's the last book you read?",
    "If you could have any superpower, what would it be?",
    "What's your go-to karaoke song?",
    "If you could travel anywhere right now, where would you go?",
    "What's the weirdest food you've ever eaten?",
    "If you could meet any historical figure, who would it be?",
    "What's your favorite childhood memory?",
    "If you could instantly become an expert in one thing, what would it be?"
];

let currentWord;
let gameMode;
let score = 0;
let timeLeft = 60;
let timerInterval;
let difficulty = "easy";

function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    score = 0;
    updateScore();
    setDifficulty();
    newWord();
    startTimer();
    showRandomQuestion();
}

function setDifficulty() {
    difficulty = document.getElementById('difficulty').value;
    timeLeft = difficulty === "easy" ? 60 : difficulty === "medium" ? 45 : 30;
    updateTimer();
}

function newWord() {
    const filteredWords = words.filter(w => w.difficulty === difficulty);
    currentWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < currentWord.word.length; i++) {
        const cell = document.createElement('input');
        cell.className = 'cell';
        cell.maxLength = 1;
        cell.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            if (this.value && this.nextElementSibling) {
                this.nextElementSibling.focus();
            }
        });
        cell.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && this.previousElementSibling) {
                this.previousElementSibling.focus();
            }
        });
        grid.appendChild(cell);
    }
    document.getElementById('clue').textContent = `Clue: ${currentWord.clue}`;
    document.getElementById('computer-guess').textContent = '';
}

function checkAnswer() {
    const cells = document.querySelectorAll('.cell');
    let userAnswer = '';
    cells.forEach(cell => userAnswer += cell.value);
    if (userAnswer === currentWord.word) {
        score += difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
        updateScore();
        showCorrectAnimation();
        newWord();
        showRandomQuestion();
    } else {
        showIncorrectAnimation();
        if (gameMode === 'solo') {
            computerPlay();
        }
    }
}

function computerPlay() {
    const chance = Math.random();
    if (chance > 0.7) {
        setTimeout(() => {
            document.getElementById('computer-guess').textContent = `Computer guessed: ${currentWord.word}`;
            newWord();
            showRandomQuestion();
        }, 1000);
    } else {
        const wrongGuess = words[Math.floor(Math.random() * words.length)].word;
        document.getElementById('computer-guess').textContent = `Computer guessed: ${wrongGuess}`;
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('time').textContent = timeLeft;
}

function endGame() {
    alert(`Game Over! Your score: ${score}`);
    const name = prompt("Enter your name for the leaderboard:");
    if (name) {
        updateLeaderboard(name, score);
    }
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
}

function showCorrectAnimation() {
    const grid = document.getElementById('grid');
    grid.classList.add('pulse');
    setTimeout(() => grid.classList.remove('pulse'), 500);
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.value = currentWord.word[index];
            cell.classList.add('filled');
        }, index * 100);
    });
}

function showIncorrectAnimation() {
    const grid = document.getElementById('grid');
    grid.classList.add('shake');
    setTimeout(() => grid.classList.remove('shake'), 500);
}

function updateLeaderboard(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = leaderboardBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = entry.name;
        row.insertCell(2).textContent = entry.score;
    });
}

function hideLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
}

function showRandomQuestion() {
    const questionElement = document.getElementById('random-question');
    const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
    questionElement.textContent = `Random Question: ${randomQuestion}`;
}
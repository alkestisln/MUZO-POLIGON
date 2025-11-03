// Language Management
let currentLanguage = 'tr';

const translations = {
    tr: {
        gameOver: 'Oyun Bitti!',
        perfectShot: '🏆 Mükemmel Atış!',
        greatPerformance: '🎯 Harika Performans!',
        goodJob: '👍 İyi İş!',
        tryAgain: '💪 Tekrar Dene!'
    },
    en: {
        gameOver: 'Game Over!',
        perfectShot: '🏆 Perfect Shot!',
        greatPerformance: '🎯 Great Performance!',
        goodJob: '👍 Good Job!',
        tryAgain: '💪 Try Again!'
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    
    // Update all language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-tr]').forEach(element => {
        const key = lang === 'tr' ? 'tr' : 'en';
        if (element.dataset[key]) {
            element.textContent = element.dataset[key];
        }
    });
}

// Initialize language buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Start Game
document.getElementById('start-game').addEventListener('click', () => {
    showPage('game-page');
    resetGame();
});

// Back to Menu
document.getElementById('back-to-menu').addEventListener('click', () => {
    showPage('landing-page');
});

document.getElementById('back-to-menu-modal').addEventListener('click', () => {
    document.getElementById('game-over-modal').classList.remove('active');
    showPage('landing-page');
});

// Game State
let bullets = 15;
let totalScore = 0;
let shots = [];
let gameOver = false;

// Game Elements
const gameCanvas = document.getElementById('game-canvas');
const crosshair = document.getElementById('crosshair');
const shotsContainer = document.getElementById('shots-container');
const bulletsCount = document.getElementById('bullets-count');
const totalScoreEl = document.getElementById('total-score');
const shotCountEl = document.getElementById('shot-count');
const gameStatus = document.getElementById('game-status');
const gameOverModal = document.getElementById('game-over-modal');

// Crosshair Movement
function updateCrosshair(x, y) {
    crosshair.style.left = x + 'px';
    crosshair.style.top = y + 'px';
}

gameCanvas.addEventListener('mousemove', (e) => {
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateCrosshair(x, y);
});

gameCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = gameCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    updateCrosshair(x, y);
}, { passive: false });

// Calculate Score based on distance from center
function calculateScore(x, y) {
    const rect = gameCanvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = 150;
    
    if (distance > maxDistance) return 0;
    if (distance < 20) return 10;
    if (distance < 50) return 8;
    if (distance < 80) return 6;
    if (distance < 110) return 4;
    if (distance < 140) return 2;
    return 1;
}

// Play Shoot Sound
function playShootSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Shoot Function
function shoot(x, y) {
    if (bullets <= 0 || gameOver) return;
    
    const score = calculateScore(x, y);
    
    // Create shot mark
    const shotMark = document.createElement('div');
    shotMark.className = 'shot-mark';
    shotMark.style.left = x + 'px';
    shotMark.style.top = y + 'px';
    
    const shotScore = document.createElement('div');
    shotScore.className = 'shot-score';
    shotScore.textContent = '+' + score;
    shotMark.appendChild(shotScore);
    
    shotsContainer.appendChild(shotMark);
    
    // Update game state
    shots.push({ x, y, score });
    bullets--;
    totalScore += score;
    
    // Update UI
    bulletsCount.textContent = bullets;
    totalScoreEl.textContent = totalScore;
    shotCountEl.textContent = shots.length;
    
    // Play sound
    playShootSound();
    
    // Check game over
    if (bullets === 0) {
        endGame();
    }
}

// Mouse Shoot (Right Click)
gameCanvas.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // Right click
        e.preventDefault();
        const rect = gameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        shoot(x, y);
    }
});

// Touch Shoot
gameCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = gameCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    shoot(x, y);
}, { passive: false });

// Prevent context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// End Game
function endGame() {
    gameOver = true;
    crosshair.style.display = 'none';
    
    // Update game status
    gameStatus.textContent = translations[currentLanguage].gameOver;
    
    // Show modal
    document.getElementById('final-score').textContent = totalScore;
    document.getElementById('final-shots').textContent = shots.length;
    
    const average = shots.length > 0 ? (totalScore / shots.length).toFixed(1) : 0;
    document.getElementById('final-average').textContent = average;
    
    // Performance message
    let message;
    if (totalScore >= 120) {
        message = translations[currentLanguage].perfectShot;
    } else if (totalScore >= 90) {
        message = translations[currentLanguage].greatPerformance;
    } else if (totalScore >= 60) {
        message = translations[currentLanguage].goodJob;
    } else {
        message = translations[currentLanguage].tryAgain;
    }
    document.getElementById('performance-message').textContent = message;
    
    gameOverModal.classList.add('active');
}

// Reset Game
function resetGame() {
    bullets = 15;
    totalScore = 0;
    shots = [];
    gameOver = false;
    
    // Clear shots
    shotsContainer.innerHTML = '';
    
    // Update UI
    bulletsCount.textContent = bullets;
    totalScoreEl.textContent = totalScore;
    shotCountEl.textContent = shots.length;
    
    // Reset game status
    const statusKey = currentLanguage === 'tr' ? 'tr' : 'en';
    gameStatus.textContent = gameStatus.dataset[statusKey];
    
    // Show crosshair
    crosshair.style.display = 'block';
    
    // Hide modal
    gameOverModal.classList.remove('active');
}

// Reset Button
document.getElementById('reset-game').addEventListener('click', resetGame);

// Play Again Button
document.getElementById('play-again').addEventListener('click', () => {
    gameOverModal.classList.remove('active');
    resetGame();
});

// Initialize
setLanguage('tr');

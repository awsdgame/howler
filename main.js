const wordDisplay = document.getElementById('word-display');
const input = document.getElementById('input');
const bossHealth = document.getElementById('boss-health');
const bossHpText = document.getElementById('boss-hp-text');
const feedback = document.getElementById('feedback');
const scoreElem = document.getElementById('score');

let currentWord = '';
let bossHP = 100;
let score = 0;

const words = [
  "strike", "defend", "mystic", "flame", "echo", "blast",
  "voltage", "tornado", "fury", "frostbite", "quake", "venom"
];

function pickWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordDisplay.textContent = currentWord;
  input.value = '';
  input.focus();
}

function damageBoss() {
  bossHP -= 10;
  if (bossHP < 0) bossHP = 0;
  bossHealth.style.width = bossHP + '%';
  bossHpText.textContent = bossHP;
  
  score += 10;
  scoreElem.textContent = score;
  
  if (bossHP === 0) {
    feedback.textContent = "🔥 Boss Defeated!";
    input.disabled = true;
    wordDisplay.textContent = '';
  } else {
    pickWord();
  }
}

input.addEventListener('input', () => {
  if (input.value.trim() === currentWord) {
    feedback.textContent = "✅ Hit!";
    damageBoss();
  }
});

// Start
pickWord();

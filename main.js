  // DOM elements
    const wordDisplay = document.getElementById('word-display');
    const input = document.getElementById('input');
    const bossHealth = document.getElementById('boss-health');
    const bossHpText = document.getElementById('boss-hp-text');
    const feedback = document.getElementById('feedback');
    const scoreElem = document.getElementById('score');
    const comboCount = document.getElementById('combo-count');
    const comboElem = document.getElementById('combo');
    const typingIndicator = document.getElementById('typing-indicator');
    const bossAvatar = document.getElementById('boss-avatar');
    const bossName = document.getElementById('boss-name');
    const nextBossBtn = document.getElementById('next-boss');
    
    // Game state
    let currentWord = '';
    let bossHP = 100;
    let maxBossHP = 100;
    let score = 0;
    let combo = 0;
    let currentBossIndex = 0;
    let typingStartTime = 0;
    
    // Boss data
    const bosses = [
      { name: "Goblin Typelord", hp: 100, avatar: "👹", words: ["strike", "defend", "mystic", "flame", "echo"] },
      { name: "Dragon Coder", hp: 150, avatar: "🐲", words: ["voltage", "tornado", "fury", "frostbite", "quake"] },
      { name: "Syntax Sorcerer", hp: 200, avatar: "🧙", words: ["algorithm", "function", "variable", "iterator", "recursion"] },
      { name: "Bug Colossus", hp: 300, avatar: "🐛", words: ["debugging", "exception", "stacktrace", "breakpoint", "refactor"] }
    ];
    
    // Initialize game
    initGame();
    
    function initGame() {
      loadBoss(currentBossIndex);
      setupEventListeners();
    }
    
    function loadBoss(index) {
      const boss = bosses[index];
      bossHP = boss.hp;
      maxBossHP = boss.hp;
      bossName.textContent = boss.name;
      bossAvatar.textContent = boss.avatar;
      bossHpText.textContent = bossHP;
      bossHealth.style.width = '100%';
      
      // Start with first word
      pickWord(boss.words);
    }
    
    function setupEventListeners() {
      input.addEventListener('input', handleInput);
      input.addEventListener('keydown', () => {
        if (!typingStartTime) {
          typingStartTime = Date.now();
        }
        updateTypingIndicator();
      });
      
      nextBossBtn.addEventListener('click', () => {
        currentBossIndex = (currentBossIndex + 1) % bosses.length;
        loadBoss(currentBossIndex);
        nextBossBtn.style.display = 'none';
        input.disabled = false;
        feedback.textContent = '';
      });
    }
    
    function pickWord(wordList) {
      currentWord = wordList[Math.floor(Math.random() * wordList.length)];
      wordDisplay.textContent = currentWord;
      input.value = '';
      input.className = '';
      input.focus();
      typingStartTime = 0;
      updateTypingIndicator();
    }
    
    function handleInput() {
      const typedText = input.value;
      
      // Update typing indicator
      updateTypingIndicator();
      
      // Check if word is complete
      if (typedText === currentWord) {
        handleCorrectWord();
      } 
      // Check if current input matches word start
      else if (currentWord.startsWith(typedText)) {
        input.className = '';
      } 
      // Wrong input
      else {
        input.className = 'wrong';
      }
    }
    
    function handleCorrectWord() {
      // Calculate typing speed bonus (words per minute)
      const typingEndTime = Date.now();
      const timeTaken = (typingEndTime - typingStartTime) / 1000; // in seconds
      const wpm = Math.round((currentWord.length / 5) / (timeTaken / 60));
      const speedBonus = Math.min(Math.floor(wpm / 10), 5); // Max 5 bonus points
      
      // Apply damage
      const damage = 10 + speedBonus + Math.floor(combo / 3);
      bossHP = Math.max(0, bossHP - damage);
      bossHealth.style.width = (bossHP / maxBossHP * 100) + '%';
      bossHpText.textContent = bossHP;
      
      // Update score
      score += 10 + speedBonus;
      scoreElem.textContent = score;
      
      // Update combo
      combo++;
      comboCount.textContent = combo;
      
      // Show combo if > 1
      if (combo > 1) {
        comboElem.textContent = `Combo x${combo}`;
        comboElem.classList.add('show');
        setTimeout(() => comboElem.classList.remove('show'), 1000);
      }
      
      // Visual feedback
      input.className = 'correct';
      feedback.textContent = `✅ Hit! (${damage} damage${speedBonus > 0 ? ` +${speedBonus} speed` : ''})`;
      feedback.className = 'correct-feedback';
      bossAvatar.classList.add('pulse');
      
      setTimeout(() => {
        bossAvatar.classList.remove('pulse');
      }, 300);
      
      // Check if boss is defeated
      if (bossHP === 0) {
        feedback.textContent = `🔥 ${bossName.textContent} Defeated! +50 bonus!`;
        score += 50;
        scoreElem.textContent = score;
        input.disabled = true;
        wordDisplay.textContent = '';
        nextBossBtn.style.display = 'block';
        combo = 0;
        comboCount.textContent = combo;
      } else {
        // Get next word after short delay
        setTimeout(() => {
          feedback.textContent = '';
          pickWord(bosses[currentBossIndex].words);
        }, 500);
      }
    }
    
    function updateTypingIndicator() {
      const typedLength = input.value.length;
      const wordLength = currentWord.length;
      const progress = (typedLength / wordLength) * 100;
      typingIndicator.style.width = `${progress}%`;
      
      // Change color based on correctness
      if (currentWord.startsWith(input.value)) {
        typingIndicator.style.backgroundColor = 'var(--correct-color)';
      } else {
        typingIndicator.style.backgroundColor = 'var(--wrong-color)';
      }
    }
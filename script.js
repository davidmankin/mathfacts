class MathFacts {
  // Helper function to find greatest common divisor
  static gcd(a, b) {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Format a division result as a fraction or mixed number
  static formatFraction(dividend, divisor) {
    // Handle whole numbers
    if (dividend % divisor === 0) {
      return dividend / divisor;
    }

    // Calculate whole part and remainder
    const wholePart = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    // Simplify the fraction
    const gcd = MathFacts.gcd(remainder, divisor);
    const simplifiedNumerator = remainder / gcd;
    const simplifiedDenominator = divisor / gcd;

    // Return as proper fraction or mixed number
    if (wholePart === 0) {
      return `${simplifiedNumerator}/${simplifiedDenominator}`;
    } else {
      return `${wholePart} ${simplifiedNumerator}/${simplifiedDenominator}`;
    }
  }

  constructor() {
    this.showingAnswer = false;
    this.currentQuestion = null;
    this.currentAnswer = null;
    this.mathDisplay = document.getElementById('mathDisplay');
    this.instruction = document.getElementById('instruction');
    this.progressCounter = document.getElementById('progressCounter');
    this.historyDisplay = document.getElementById('historyDisplay');
    this.controls = document.getElementById('controls');
    this.welcomeControls = document.getElementById('welcomeControls');
    this.questionControls = document.getElementById('questionControls');
    this.quitButton = document.getElementById('quitButton');
    this.soundToggle = document.getElementById('soundToggle');
    this.clearStateButton = document.getElementById('clearStateButton');
    this.checkmarkAnimation = document.getElementById('checkmarkAnimation');
    this.debugPanel = document.getElementById('debugPanel');
    this.questionHistory = [];
    this.currentSet = null;
    this.questionSets = {
      squares: {
        name: 'Square Numbers',
        description: 'Practice multiplication and roots of square numbers',
        slowTimeLimit: 4000, // 4 seconds,
        generate: () => {
          const num1 = Math.floor(Math.random() * 13) + 1;

          if (Math.random() > 0.6) { // square
            return {
              question: `${num1} × ${num1}`,
              answer: num1 * num1
            }
          } else {
            return {
              question: `&radic; ${num1 * num1}`,
              answer: num1
            }

          }
        }
      },
      multiplication: {
        name: 'Multiplication Facts',
        description: 'Practice multiplication up to 13×13',
        slowTimeLimit: 5000, // 5 seconds
        generate: () => {
          const num1 = Math.floor(Math.random() * 13) + 1;
          const num2 = Math.floor(Math.random() * 13) + 1;
          return {
            question: `${num1} × ${num2}`,
            answer: num1 * num2
          };
        }
      },
      addition: {
        name: 'Addition Facts',
        description: 'Practice addition with addends up to 20',
        slowTimeLimit: 3000, // 3 seconds
        generate: () => {
          const num1 = Math.floor(Math.random() * 20) + 1;
          const num2 = Math.floor(Math.random() * 20) + 1;
          return {
            question: `${num1} + ${num2}`,
            answer: num1 + num2
          };
        }
      },
      subtraction: {
        name: 'Subtraction Facts',
        description: 'Practice subtraction (0-20, no negative results)',
        slowTimeLimit: 4000, // 4 seconds
        generate: () => {
          const num1 = Math.floor(Math.random() * 20) + 1;
          const num2 = Math.floor(Math.random() * num1) + 0; // Ensures non-negative result
          return {
            question: `${num1} - ${num2}`,
            answer: num1 - num2
          };
        }
      },
      subtractionNegative: {
        name: 'Subtraction with Negatives',
        description: 'Practice subtraction (0-20, including negative results)',
        slowTimeLimit: 6000, // 6 seconds
        generate: () => {
          const num1 = Math.floor(Math.random() * 21); // 0-20
          const num2 = Math.floor(Math.random() * 21); // 0-20
          return {
            question: `${num1} - ${num2}`,
            answer: num1 - num2
          };
        }
      },
      division: {
        name: 'Division Facts',
        description: 'Practice division (up to 144, whole number results only)',
        slowTimeLimit: 6000, // 6 seconds
        generate: () => {
          // Create division problems with whole number results
          // First generate the quotient and divisor, then calculate dividend
          const quotient = Math.floor(Math.random() * 12) + 1; // 1-12
          const divisor = Math.floor(Math.random() * 12) + 1;   // 1-12
          const dividend = quotient * divisor; // This ensures whole number result

          return {
            question: `${dividend} ÷ ${divisor}`,
            answer: quotient
          };
        }
      },
      divisionFractions: {
        name: 'Division with Fractions',
        description: 'Practice division with fraction and mixed number results',
        slowTimeLimit: 8000, // 8 seconds
        generate: () => {
          // Generate division problems that result in fractions or mixed numbers
          const dividend = Math.floor(Math.random() * 20) + 1; // 1-20
          const divisor = Math.floor(Math.random() * 20) + 1;   // 1-20

          const answer = MathFacts.formatFraction(dividend, divisor);

          return {
            question: `${dividend} ÷ ${divisor}`,
            answer: answer
          };
        }
      }
    };

    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.totalQuestions = 0;
    this.maxQuestions = 15;
    this.questionStartTime = null;
    this.totalThinkingTime = 0;
    this.gameComplete = false;
    this.gameStarted = false;
    this.setSelected = false;
    this.soundEnabled = true;

    this.initializeCorrectSounds();
    this.initializeLocalStorage();
    this.setupSoundToggle();
    this.setupClearState();
    this.showSetSelection();
    this.setupEventListeners();
  }

  // Initialize correct answer sounds with volume settings
  initializeCorrectSounds() {
    this.correctSounds = [

      { file: 'sounds/4-bing-things-82661.mp3', volume: 1.0 },
      { file: 'sounds/alert-sound-87478.mp3', volume: 1.0 },
      { file: 'sounds/belch-155023.mp3', volume: 0.5 },
      { file: 'sounds/bing-298405.mp3', volume: 1.0 },
      { file: 'sounds/cow_bells_01-98236.mp3', volume: 0.8 },
      { file: 'sounds/din-ding-89718.mp3', volume: 0.7 },
      { file: 'sounds/elevator_ping_02-40404.mp3', volume: 1.0 },
      { file: 'sounds/mission-success-41211.mp3', volume: 0.9 },
      { file: 'sounds/notification-sound-269266.mp3', volume: 0.9 },
      { file: 'sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3', volume: 1.0 },
      { file: 'sounds/success-221935.mp3', volume: 0.7 },
      { file: 'sounds/win-176035.mp3', volume: 1.0 },
    ];
  }

  // Initialize local storage for tracking problematic questions
  initializeLocalStorage() {
    this.storageKey = 'mathFactsProblematicQuestions';

    // Load existing data or create new structure
    const stored = localStorage.getItem(this.storageKey);
    this.problematicQuestions = stored ? JSON.parse(stored) : {};

    // Ensure all game types have entries
    Object.keys(this.questionSets).forEach(gameType => {
      if (!this.problematicQuestions[gameType]) {
        this.problematicQuestions[gameType] = {
          wrong: {},
          slow: {}
        };
      }
    });

    this.saveProblematicQuestions();
  }

  // Save problematic questions to local storage
  saveProblematicQuestions() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.problematicQuestions));
  }

  // Add a question to the problematic list
  addProblematicQuestion(gameType, question, type, thinkingTime = null) {
    const questionKey = question.replace(/\s/g, ''); // Remove spaces for consistent keys

    if (!this.problematicQuestions[gameType]) {
      this.problematicQuestions[gameType] = { wrong: {}, slow: {} };
    }

    if (!this.problematicQuestions[gameType][type][questionKey]) {
      this.problematicQuestions[gameType][type][questionKey] = {
        question: question,
        count: 0,
        lastSeen: null,
        times: []
      };
    }

    const entry = this.problematicQuestions[gameType][type][questionKey];
    entry.count++;
    entry.lastSeen = new Date().toISOString();

    if (thinkingTime !== null) {
      entry.times.push(thinkingTime);
      // Keep only the last 10 times to prevent unlimited growth
      if (entry.times.length > 10) {
        entry.times = entry.times.slice(-10);
      }
    }

    this.saveProblematicQuestions();
  }

  // Get problematic questions for a specific game
  getProblematicQuestions(gameType, type = null) {
    if (!this.problematicQuestions[gameType]) {
      return {};
    }

    if (type) {
      return this.problematicQuestions[gameType][type] || {};
    }

    return this.problematicQuestions[gameType];
  }

  // Clear problematic questions for a game type
  clearProblematicQuestions(gameType) {
    if (this.problematicQuestions[gameType]) {
      this.problematicQuestions[gameType] = { wrong: {}, slow: {} };
      this.saveProblematicQuestions();
    }
  }

  // Debug method to view all stored data
  viewStoredData() {
    console.log('Stored problematic questions:', this.problematicQuestions);
    return this.problematicQuestions;
  }

  // Setup sound toggle functionality
  setupSoundToggle() {
    this.soundToggle.addEventListener('click', () => {
      this.toggleSound();
    });
    this.updateSoundToggleDisplay();
  }

  // Toggle sound on/off
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.updateSoundToggleDisplay();
    console.log(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
  }

  // Update sound toggle button appearance
  updateSoundToggleDisplay() {
    if (this.soundEnabled) {
      this.soundToggle.textContent = '🔊';
      this.soundToggle.classList.remove('muted');
    } else {
      this.soundToggle.textContent = '🔇';
      this.soundToggle.classList.add('muted');
    }
  }

  // Setup clear state functionality
  setupClearState() {
    let clickCount = 0;
    let clickTimer = null;

    this.clearStateButton.addEventListener('click', () => {
      clickCount++;

      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 500); // Reset if second click doesn't come within 500ms
      } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        this.clearAllState();
      }
    });
  }

  // Clear all local storage state
  clearAllState() {
    console.log('Clearing all local storage state...');
    localStorage.removeItem(this.storageKey);
    this.problematicQuestions = {};
    this.initializeLocalStorage();

    // Show animated checkmark
    this.showCheckmarkAnimation();
    console.log('Local storage state cleared successfully');
  }

  // Show animated checkmark
  showCheckmarkAnimation() {
    this.checkmarkAnimation.classList.add('show');
    setTimeout(() => {
      this.checkmarkAnimation.classList.remove('show');
    }, 1000);
  }

  // Get sorted struggle questions for current game
  getStruggleQuestions() {
    if (!this.currentSet || !this.problematicQuestions[this.currentSet]) {
      return [];
    }

    const wrongQuestions = this.problematicQuestions[this.currentSet].wrong || {};
    const slowQuestions = this.problematicQuestions[this.currentSet].slow || {};

    // Combine wrong and slow questions, prioritizing wrong ones
    const allStruggles = [];

    // Add wrong questions with higher priority
    Object.values(wrongQuestions).forEach(q => {
      allStruggles.push({ ...q, type: 'wrong', priority: q.count * 2 });
    });

    // Add slow questions with lower priority
    Object.values(slowQuestions).forEach(q => {
      allStruggles.push({ ...q, type: 'slow', priority: q.count });
    });

    // Sort by priority (highest first), then by count
    return allStruggles.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return b.count - a.count;
    });
  }

  // Select a question using weighted struggle-based algorithm
  selectQuestionByStruggle() {
    const struggleQuestions = this.getStruggleQuestions();

    if (struggleQuestions.length === 0) {
      return null; // No struggle questions, use random
    }

    // Shuffle the array to add randomness while maintaining priority
    const shuffled = [...struggleQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Apply weighted selection: 50%, 25%, 12.5%, etc.
    let probability = 0.5;
    for (let i = 0; i < shuffled.length; i++) {
      if (Math.random() < probability) {
        console.log(`Selected struggle question: ${shuffled[i].question} (${shuffled[i].type}, count: ${shuffled[i].count})`);
        return shuffled[i];
      }
      probability *= 0.5; // Halve probability for next question
    }

    // If we get here, select the last question
    const selected = shuffled[shuffled.length - 1];
    console.log(`Selected last struggle question: ${selected.question} (${selected.type}, count: ${selected.count})`);
    return selected;
  }

  // Remove question from struggle list if mastered
  removeFromStruggleList(question, isCorrect, isSlow) {
    if (!isCorrect || isSlow) {
      return; // Only remove if correct and fast
    }

    const questionKey = question.replace(/\s/g, '');

    // Remove from wrong questions
    if (this.problematicQuestions[this.currentSet]?.wrong?.[questionKey]) {
      delete this.problematicQuestions[this.currentSet].wrong[questionKey];
      console.log(`Removed ${question} from wrong struggle list (mastered)`);
    }

    // Remove from slow questions
    if (this.problematicQuestions[this.currentSet]?.slow?.[questionKey]) {
      delete this.problematicQuestions[this.currentSet].slow[questionKey];
      console.log(`Removed ${question} from slow struggle list (mastered)`);
    }

    this.saveProblematicQuestions();
    this.updateDebugPanel();
  }

  // Update debug panel display
  updateDebugPanel() {
    if (!this.gameStarted || !this.currentSet) {
      this.debugPanel.classList.add('hidden');
      return;
    }

    this.debugPanel.classList.remove('hidden');
    const struggleQuestions = this.getStruggleQuestions();

    let html = '<h4>Struggle Questions</h4>';

    if (struggleQuestions.length === 0) {
      html += '<div>No struggles yet!</div>';
    } else {
      struggleQuestions.slice(0, 10).forEach((q, index) => {
        const typeIndicator = q.type === 'wrong' ? '❌' : '⏳';
        html += `<div class="struggle-item">
          ${typeIndicator} ${q.question}
          <span class="struggle-count">(${q.count})</span>
        </div>`;
      });

      if (struggleQuestions.length > 10) {
        html += `<div style="margin-top: 0.5rem; font-style: italic;">...and ${struggleQuestions.length - 10} more</div>`;
      }
    }

    this.debugPanel.innerHTML = html;
  }

  showSetSelection() {
    this.mathDisplay.innerHTML = `
      <div class="set-selection">
        <div class="set-title">Math Facts Practice</div>
        <div style="margin-bottom: 1rem; font-size: 1.2rem; color: #ecf0f1;">Choose your practice set:</div>
        <div class="button-grid">
          <button class="set-button" onclick="mathFacts.selectSet('multiplication')">
            🔢 Multiplication Facts
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${this.questionSets.multiplication.description}</div>
          </button>
          <button class="set-button" onclick="mathFacts.selectSet('addition')">
            ➕ Addition Facts
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${this.questionSets.addition.description}</div>
          </button>
          <button class="set-button" onclick="mathFacts.selectSet('subtraction')">
            ➖ Subtraction Facts
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${this.questionSets.subtraction.description}</div>
          </button>
          <button class="set-button" onclick="mathFacts.selectSet('subtractionNegative')">
            ➖ Subtraction with Negatives
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${this.questionSets.subtractionNegative.description}</div>
          </button>
          <button class="set-button" onclick="mathFacts.selectSet('division')">
            ➗ Division Facts
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${this.questionSets.division.description}</div>
          </button>
          <button class="set-button" onclick="mathFacts.selectSet('divisionFractions')">
            ➗ Division with Fractions
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${this.questionSets.divisionFractions.description}</div>
          </button>
          <button class="set-button" onclick="mathFacts.selectSet('squares')">
            ⊞ Squares
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${this.questionSets.squares.description}</div>
          </button>
        </div>
      </div>
    `;
    this.instruction.textContent = "Select a practice set to begin";
    this.hideAllControls();
  }

  selectSet(setName) {
    this.currentSet = setName;
    this.setSelected = true;
    this.showWelcome();
  }

  showWelcome() {
    const setInfo = this.questionSets[this.currentSet];
    this.mathDisplay.innerHTML = `
      <div class="welcome-screen">
        <div class="welcome-title">${setInfo.name}</div>
        <div class="welcome-instructions">${setInfo.description}</div>
        <div class="welcome-instructions">• Press SPACE to show the answer</div>
        <div class="welcome-instructions">• Press Y if you got it right, N if wrong</div>
        <div class="welcome-instructions">• Press Q to quit early</div>
        <div class="welcome-instructions">• ${this.maxQuestions} questions total</div>
      </div>
    `;
    this.updateInstructions();
  }

  startGame() {
    this.gameStarted = true;
    this.updateDebugPanel();
    this.generateNewQuestion();
  }

  generateNewQuestion() {
    if (this.totalQuestions >= this.maxQuestions) {
      this.showResults();
      return;
    }

    // Try to select a struggle question first
    const struggleQuestion = this.selectQuestionByStruggle();

    if (struggleQuestion) {
      // Use struggle question
      this.currentQuestion = struggleQuestion.question;
      // Parse the answer from the stored question
      this.currentAnswer = this.parseAnswerFromQuestion(struggleQuestion.question);
      console.log(`Using struggle question: ${this.currentQuestion} = ${this.currentAnswer}`);
    } else {
      // Generate random question
      const questionData = this.questionSets[this.currentSet].generate();
      this.currentQuestion = questionData.question;
      this.currentAnswer = questionData.answer;
      console.log(`Using random question: ${this.currentQuestion} = ${this.currentAnswer}`);
    }

    this.showQuestion();
  }

  // Parse answer from stored question string
  parseAnswerFromQuestion(questionStr) {
    // For struggle questions, we need to recalculate the answer
    // since we only store the question text
    const parts = questionStr.split(/[\s\u00d7\u00f7\+\-√&radic;]+/).filter(Boolean);

    if (questionStr.includes('×')) {
      return parseInt(parts[0]) * parseInt(parts[1]);
    } else if (questionStr.includes('+')) {
      return parseInt(parts[0]) + parseInt(parts[1]);
    } else if (questionStr.includes('-')) {
      return parseInt(parts[0]) - parseInt(parts[1]);
    } else if (questionStr.includes('÷')) {
      const dividend = parseInt(parts[0]);
      const divisor = parseInt(parts[1]);

      // Check if this is a fraction division problem
      if (this.currentSet === 'divisionFractions') {
        return MathFacts.formatFraction(dividend, divisor);
      } else {
        return dividend / divisor;
      }
    } else if (questionStr.includes('√') || questionStr.includes('&radic;')) {
      const num = parseInt(parts[0]);
      return Math.sqrt(num);
    }

    return 0; // Fallback
  }

  showQuestion() {
    this.mathDisplay.innerHTML = this.currentQuestion;
    this.mathDisplay.className = 'math-display question';
    this.showingAnswer = false;
    this.questionStartTime = Date.now();
    this.updateProgressCounter();
    this.updateInstructions();
  }

  showAnswer() {
    this.mathDisplay.innerHTML = `
      <div class="question" style="font-size: 6rem; margin-bottom: 1rem;">${this.currentQuestion}</div>
      <div class="answer" style="font-size: 8rem;">${this.currentAnswer}</div>
    `;
    this.showingAnswer = true;
    this.updateInstructions();
  }

  updateProgressCounter() {
    const remaining = this.maxQuestions - this.totalQuestions;
    const correctClass = this.correctAnswers > 0 ? 'progress-correct' : '';
    const incorrectClass = this.incorrectAnswers > 0 ? 'progress-incorrect' : '';

    this.progressCounter.innerHTML = `
      <span class="${correctClass}">✓ ${this.correctAnswers}</span> |
      <span class="${incorrectClass}">✗ ${this.incorrectAnswers}</span> |
      Remaining: ${remaining}
    `;
  }

  updateHistory(question, isCorrect, thinkingTime) {
    const emoji = isCorrect ? '😊' : '😞';
    const slowTimeLimit = this.questionSets[this.currentSet].slowTimeLimit;
    const isSlow = thinkingTime > slowTimeLimit;
    const hourglassEmoji = isSlow ? ' ⏳' : '';
    const historyItem = {
      text: `${question} ${emoji}${hourglassEmoji}`,
      correct: isCorrect,
      slow: isSlow
    };
    this.questionHistory.push(historyItem);

    this.historyDisplay.innerHTML = this.questionHistory
      .map(item => {
        let className = 'history-item';
        if (item.correct && item.slow) {
          className += ' history-correct-slow';
        } else if (item.correct) {
          className += ' history-correct';
        } else {
          className += ' history-incorrect';
        }
        return `<span class="${className}">${item.text}</span>`;
      })
      .join('');
  }

  recordAnswer(isCorrect) {
    let thinkingTime = 0;
    if (this.questionStartTime) {
      thinkingTime = Date.now() - this.questionStartTime;
      this.totalThinkingTime += thinkingTime;
    }

    const slowTimeLimit = this.questionSets[this.currentSet].slowTimeLimit;
    const isSlow = thinkingTime > slowTimeLimit;

    if (isCorrect) {
      this.correctAnswers++;
      this.playCorrectSound();

      // Remove from struggle list if mastered (correct and fast)
      this.removeFromStruggleList(this.currentQuestion, isCorrect, isSlow);

      // Track slow but correct answers
      if (isSlow) {
        this.addProblematicQuestion(this.currentSet, this.currentQuestion, 'slow', thinkingTime);
      }
    } else {
      this.incorrectAnswers++;
      this.playSound('sounds/wrong.mp3', 0.3);
      // Track wrong answers
      this.addProblematicQuestion(this.currentSet, this.currentQuestion, 'wrong', thinkingTime);
    }

    this.updateHistory(this.currentQuestion, isCorrect, thinkingTime);
    this.updateDebugPanel();
    this.totalQuestions++;
    this.generateNewQuestion();
  }

  playSound(soundFile, volume = 1.0) {
    if (!this.soundEnabled) {
      return;
    }
    const audio = new Audio(soundFile);
    audio.volume = volume;
    audio.play().catch(e => console.log('Could not play sound:', e));
  }

  // Play a random correct answer sound
  playCorrectSound() {
    if (!this.soundEnabled || this.correctSounds.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.correctSounds.length);
    const soundConfig = this.correctSounds[randomIndex];
    console.log( `Playing ${soundConfig.file} at ${soundConfig.volume * 100.0}%`);
    this.playSound(soundConfig.file, soundConfig.volume);
  }

  showResults() {
    this.gameComplete = true;
    const totalTimeSeconds = (this.totalThinkingTime / 1000).toFixed(1);
    const percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
    const isExcellent = percentage >= 90;

    let resultsHTML = `
      <div class="results">
        <div class="results-title">Results</div>
        <div class="results-stats correct-stat">Correct: ${this.correctAnswers}</div>
        <div class="results-stats incorrect-stat">Incorrect: ${this.incorrectAnswers}</div>
        <div class="results-stats time-stat">Total thinking time: ${totalTimeSeconds}s</div>
        <div class="results-stats">Score: ${percentage}%</div>`;

    if (isExcellent) {
      resultsHTML += `<div class="celebration">🎉 Excellent! 🎉</div>`;
      this.playSound('sounds/celebration.mp3', 1.0);
    }

    resultsHTML += `</div>`;

    this.mathDisplay.innerHTML = resultsHTML;
    this.progressCounter.style.display = 'none';
    this.hideAllControls();
    this.instruction.innerHTML = "Press <span class='keycap' onclick='mathFacts.restart()'>R</span> to restart";
  }

  hideAllControls() {
    this.welcomeControls.style.display = 'none';
    this.controls.style.display = 'none';
    this.questionControls.style.display = 'none';
    this.quitButton.style.display = 'none';
  }

  updateInstructions() {
    if (!this.setSelected) {
      this.instruction.textContent = "Select a practice set to begin";
      this.hideAllControls();
    } else if (!this.gameStarted) {
      this.instruction.textContent = "Ready to start?";
      this.welcomeControls.innerHTML = `
        <span class="keycap keycap-large" onclick="mathFacts.startGame()">SPACE</span>
      `;
      this.welcomeControls.style.display = 'flex';
      this.controls.style.display = 'none';
      this.questionControls.style.display = 'none';
      this.quitButton.style.display = 'none';
    } else if (this.showingAnswer) {
      this.instruction.textContent = "Was your answer correct?";
      this.controls.innerHTML = `
        <span class="keycap keycap-large" onclick="mathFacts.recordAnswer(true)">Y</span>
        <span style="margin: 0 1rem; font-size: 1.2rem;">or</span>
        <span class="keycap keycap-large" onclick="mathFacts.recordAnswer(false)">N</span>
      `;
      this.welcomeControls.style.display = 'none';
      this.controls.style.display = 'flex';
      this.questionControls.style.display = 'none';
      this.quitButton.style.display = 'block';
    } else {
      this.instruction.textContent = "Press SPACE to show answer";
      this.questionControls.innerHTML = `
        <span class="keycap keycap-large" onclick="mathFacts.showAnswer()">SPACE</span>
      `;
      this.welcomeControls.style.display = 'none';
      this.controls.style.display = 'none';
      this.questionControls.style.display = 'flex';
      this.quitButton.style.display = 'block';
    }
  }

  restart() {
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.totalQuestions = 0;
    this.totalThinkingTime = 0;
    this.gameComplete = false;
    this.gameStarted = false;
    this.setSelected = false;
    this.currentSet = null;
    this.questionHistory = [];
    this.historyDisplay.innerHTML = '';
    this.progressCounter.innerHTML = '';
    this.progressCounter.style.display = 'block';
    this.hideAllControls();
    this.showSetSelection();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (this.gameComplete) {
        if (event.code === 'KeyR') {
          event.preventDefault();
          this.restart();
        }
        return;
      }

      if (!this.setSelected) {
        return;
      }

      if (!this.gameStarted) {
        if (event.code === 'Space') {
          event.preventDefault();
          this.startGame();
        }
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();

        if (!this.showingAnswer) {
          this.showAnswer();
        }
      } else if (event.code === 'KeyY') {
        event.preventDefault();

        if (this.showingAnswer) {
          this.recordAnswer(true);
        }
      } else if (event.code === 'KeyN') {
        event.preventDefault();

        if (this.showingAnswer) {
          this.recordAnswer(false);
        }
      } else if (event.code === 'KeyQ') {
        event.preventDefault();
        this.showResults();
      } else if (event.code === 'KeyM') {
        event.preventDefault();
        this.toggleSound();
      } else if (event.code === 'KeyR' && event.shiftKey) {
        event.preventDefault();
        this.clearAllState();
      }
    });

    // Add click handler for quit button
    this.quitButton.addEventListener('click', () => {
      this.showResults();
    });
  }
}

const mathFacts = new MathFacts();
window.mathFacts = mathFacts;

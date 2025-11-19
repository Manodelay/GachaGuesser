import { characters } from './characters.js';

export class Game {
    constructor() {
        this.score = 0;
        this.currentRound = 1;
        this.totalRounds = 10;
        this.currentCharacter = null;
        this.isRoundOver = false;
        this.roundCharacters = [];

        // DOM Elements
        this.scoreEl = document.getElementById('score');
        this.roundEl = document.getElementById('round');
        this.characterDisplay = document.getElementById('character-display');
        this.guessInput = document.getElementById('guess-input');
        this.autocompleteList = document.getElementById('autocomplete-list');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.nextBtn = document.getElementById('next-btn');
        this.gameContainer = document.getElementById('game-container');
        this.gameOverEl = document.getElementById('game-over');
        this.finalScoreEl = document.getElementById('final-score');
        this.restartBtn = document.getElementById('restart-btn');
    }

    init() {
        this.restartBtn.addEventListener('click', () => this.resetGame());
        this.nextBtn.addEventListener('click', () => this.nextRound());
        this.submitBtn.addEventListener('click', () => this.submitGuess());

        this.guessInput.addEventListener('input', (e) => this.handleInput(e.target.value));

        // Close autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== this.guessInput && e.target !== this.autocompleteList) {
                this.autocompleteList.classList.add('hidden');
            }
        });

        this.startGame();
    }

    startGame() {
        this.score = 0;
        this.currentRound = 1;
        this.isRoundOver = false;
        // Create a shuffled copy of characters for the game session to ensure no repeats
        this.roundCharacters = [...characters].sort(() => Math.random() - 0.5);

        this.updateScoreBoard();
        this.gameContainer.classList.remove('hidden');
        this.gameOverEl.classList.add('hidden');
        this.loadRound();
    }

    resetGame() {
        this.startGame();
    }

    updateScoreBoard() {
        this.scoreEl.textContent = `Score: ${this.score}`;
        this.roundEl.textContent = `Round: ${this.currentRound}/${this.totalRounds}`;
    }

    loadRound() {
        this.isRoundOver = false;
        this.nextBtn.classList.add('hidden');
        this.feedbackEl.textContent = '';
        this.feedbackEl.className = '';
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.submitBtn.disabled = false;
        this.autocompleteList.classList.add('hidden');
        this.guessInput.focus();

        // Select unique character for this round
        this.currentCharacter = this.roundCharacters[this.currentRound - 1];

        this.renderUI();
    }

    renderUI() {
        this.characterDisplay.innerHTML = `<img src="${this.currentCharacter.imageUrl}" alt="Guess the character" />`;
    }

    handleInput(value) {
        if (this.isRoundOver) return;

        if (value.length < 2) {
            this.autocompleteList.classList.add('hidden');
            return;
        }

        const matches = characters.filter(char =>
            char.name.toLowerCase().includes(value.toLowerCase())
        );

        this.renderAutocomplete(matches);
    }

    renderAutocomplete(matches) {
        this.autocompleteList.innerHTML = '';
        if (matches.length === 0) {
            this.autocompleteList.classList.add('hidden');
            return;
        }

        matches.forEach(char => {
            const li = document.createElement('li');
            li.textContent = char.name;
            li.addEventListener('click', () => {
                this.guessInput.value = char.name;
                this.autocompleteList.classList.add('hidden');
                this.guessInput.focus();
            });
            this.autocompleteList.appendChild(li);
        });

        this.autocompleteList.classList.remove('hidden');
    }

    submitGuess() {
        if (this.isRoundOver) return;

        const guess = this.guessInput.value.trim();
        if (!guess) return;

        this.isRoundOver = true;
        this.guessInput.disabled = true;
        this.submitBtn.disabled = true;
        this.autocompleteList.classList.add('hidden');

        const isCorrect = guess.toLowerCase() === this.currentCharacter.name.toLowerCase();

        if (isCorrect) {
            this.score++;
            this.feedbackEl.textContent = 'Correct!';
            this.feedbackEl.classList.add('correct');
        } else {
            this.feedbackEl.textContent = `Wrong! It was ${this.currentCharacter.name}`;
            this.feedbackEl.classList.add('wrong');
        }

        this.updateScoreBoard();

        if (this.currentRound < this.totalRounds) {
            this.nextBtn.classList.remove('hidden');
        } else {
            setTimeout(() => this.endGame(), 1500);
        }
    }

    nextRound() {
        this.currentRound++;
        this.updateScoreBoard();
        this.loadRound();
    }

    endGame() {
        this.gameContainer.classList.add('hidden');
        this.gameOverEl.classList.remove('hidden');
        this.finalScoreEl.textContent = this.score;
    }
}

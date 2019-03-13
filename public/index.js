class DotGame {
  constructor() {
    // DOM ELEMENTS
    this.slider = document.getElementById('range-slider');
    this.sliderSpan = document.getElementById('speed-span');
    this.startPauseBtn = document.getElementById('btn-start-pause')
    this.scoreElement = document.getElementById('points');
    this.directionBtn = document.getElementById('btn-change-direction');
    this.endBtn = document.getElementById('btn-end');
    this.pausedOverlay = document.getElementById('game-paused');
    this.resultContainer = document.getElementById('result-container');
    this.newGameBtn = document.getElementById('btn-new-game');
    this.cancelBtn = document.getElementById('btn-cancel');
    
    this.gameStarted = false;
    this.gb = new GameBoard(this.startPauseBtn, this.scoreElement);
  }

  gameSetup() {
    
    // add event listeners and bind methods
    this.startPauseBtn.addEventListener('click', this.toggleGame.bind(this), false);
    this.slider.addEventListener('change', this.sliderChanged.bind(this), false);
    this.endBtn.addEventListener('click', this.endGame.bind(this), false);
    this.newGameBtn.addEventListener('click', this.newGame.bind(this), false);
    this.cancelBtn.addEventListener('click', this.cancel.bind(this), false);
    
    window.addEventListener('resize', () => {
      this.gb.windowResized();
    });
    
    this.directionBtn.addEventListener('click', () => {
      this.gb.changeDirection();
    });
  }

  toggleGame() {
    if(!this.gameStarted) {
      this.gameStarted = true;
      this.gb.startGame();
    } else {
      this.gameStarted = false;
      this.gb.pauseGame();
    }
  }

  sliderChanged() {
    this.sliderValue = parseInt(this.slider.value);
    this.sliderSpan.innerHTML = this.sliderValue;
    this.gb.updateSliderValue(this.sliderValue);
  }
  
  endGame() {
    // clear canvas, intervals and animations
    this.gb.clearIntervalAndAnimation();

    this.gameStarted = false;
    
    this.pausedOverlay.classList.remove('paused');
    this.resultContainer.classList.add('ended');
    
    const finalScore = document.getElementById('final-score');
    finalScore.innerHTML = this.gb.score;
  }
  
  newGame() {
    this.hideResultContainer();
   
    // Delete current SVG before creating a new one 
    const currentSVG = document.getElementById("svg");
    currentSVG.parentNode.removeChild(currentSVG);
    
    // Create new game board
    this.gb = new GameBoard(this.startPauseBtn, this.scoreElement);
    
    // Reset Score
    this.scoreElement.innerHTML = 0;
    
    this.toggleGame();
  }
  
  cancel() {
    this.hideResultContainer();
    this.toggleGame();
  }
  
  hideResultContainer() {
    this.resultContainer.classList.remove('ended');
  }
}

window.addEventListener('load', () => {
  const Game = new DotGame();
  Game.gameSetup();
});
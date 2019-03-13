class GameBoard {
  constructor(startPause, scoreElement, svg) {
    this.gameContainer = document.getElementById('game-container');
    this.pausedOverlay = document.getElementById('game-paused');
    this.sliderValue = document.getElementById('range-slider').value;
    this.startPauseBtn = startPause;
    this.scoreElement = scoreElement;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.headerHeight = document.getElementById('header').offsetHeight;
    this.dots = [];
    this.interval = null;
    this.animInterval = null;
    this.idCounter = 0;
    this.score = 0;
    this.currentDirection = 'topToBottom'; // Initially move the dots downwards along the y axis
  }

  begin() {
    // Set the size of the svg
    this.svg.setAttribute("width", window.innerWidth);
    this.svg.setAttribute("height", (window.innerHeight - this.headerHeight));
    this.svg.setAttribute("id", "svg");
    this.gameContainer.appendChild(this.svg);
    
    this.interval = setInterval(() => {
      this.addDot();
    }, 1000);
  }

  addDot() {
    // Create a circle element
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    this.setDotAttributes(dot);
    
    this.dots.push(dot);
    this.svg.appendChild(dot);
    
    dot.addEventListener("click", () => {
      this.dotClick(dot.id);
    });
  }
  
  setDotAttributes(dot) {
    const randomNum = (min, max) => Math.round(Math.random() * (max - min) + min),
          randomRad = randomNum(5, 50),
          randomX = randomNum(randomRad, window.innerWidth - randomRad),
          colors = ["red", "blue", "green", "orange", "purple"];
    
    const dotColor = colors[Math.floor(Math.random() * colors.length)];
    
    dot.setAttribute("cx", randomX);

    // Check direction to decide if dot is created at bottom or top
    if(this.currentDirection === "topToBottom") {
      dot.setAttribute("cy", -randomRad);
    } else if(this.currentDirection === "bottomToTop") {
      dot.setAttribute("cy", this.svg.height.animVal.value + randomRad);
    }

    dot.setAttribute("r", randomRad);
    dot.setAttribute("fill", dotColor);
    dot.setAttribute("id", this.idCounter++);
  }
  
  animateDot() {
    for (let i = 0; i < this.dots.length; i++) {
      
      let dotY = this.dots[i].cy.animVal.value;
      
      if(this.currentDirection === "topToBottom") {
        this.dots[i].setAttribute('cy', dotY += this.sliderValue / 100);
      } else {
        this.dots[i].setAttribute('cy', dotY -= this.sliderValue / 100);
      }
      
      // Remove dot if it goes off the page
      const dotR = this.dots[i].r.animVal.value,
            svgHeight = this.svg.height.animVal.value;
      
      if (dotY - dotR > svgHeight || dotY - dotR < (svgHeight - svgHeight - dotR * 2)) {
        this.svg.removeChild(this.dots[i]);
        this.dots.splice(i, 1);
      }
    }
  }

  dotClick(id) {
    if(!this.gamePaused) { 
      for (let i = 0; i < this.dots.length; i++) {
        if(this.dots[i].id === id) {
          this.calculatePoints(this.dots[i].r.animVal.value);
          this.svg.removeChild(this.dots[i]);
          this.dots.splice(i, 1);
        }
      }
    }
  }

  pauseGame() {
    this.clearIntervalAndAnimation();
    
    // Add paused overlay
    this.pausedOverlay.classList.add("paused");
    
    this.startPauseBtn.innerHTML = "Continue";
    this.startPauseBtn.classList.remove("btn-pause");
  }

  startGame() {
    this.begin();
    this.animInterval = setInterval(() => {
      this.animateDot();
    }, 10);
    
    this.pausedOverlay.classList.remove("paused");
    
    this.startPauseBtn.innerHTML = "Pause";
    this.startPauseBtn.classList.add("btn-pause");
  }

  clearIntervalAndAnimation() {
    clearInterval(this.interval);
    clearInterval(this.animInterval);
  }

  calculatePoints(r) {
    this.score += Math.floor(11 - (r / 10));
    this.scoreElement.innerHTML = this.score;
  }

  updateSliderValue(sv) {
    this.sliderValue = sv;
  }

  changeDirection() {
    if(this.currentDirection === "topToBottom") {
      this.currentDirection = "bottomToTop";
    } else {
      this.currentDirection = "topToBottom";
    }
  }
  
  windowResized() {
    // Resize the svg
    this.svg.setAttribute("width", window.innerWidth);
    this.svg.setAttribute("height", window.innerHeight - this.headerHeight);
  }
}
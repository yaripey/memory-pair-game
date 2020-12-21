const Game = function () {
  this.currentOpened = null
  // When you open a pair, you get score.
  this.score = 0;

  // When you open different cards, your fail counter will rise.
  this.failedTries = 0;

  // Amount of pairs of cards;
  this.amountOfPairs = 16 / 2;

  this.currentScene = -1;

  this.mainContainer = document.querySelector('.container')

  this.musicMuted = false;
}

Game.prototype.initiateElements = function () {
  // Creating cards
  const preShuffleElements = [];
  for (let i = 0; i < this.amountOfPairs; i++) {
    const currentElement = getElementName()
    const newElem = new Element(currentElement, i)
    const anotherNewElem = new Element(currentElement, i + this.amountOfPairs)
    preShuffleElements.push(newElem)
    preShuffleElements.push(anotherNewElem)
  }
  this.elements = shuffleArray(preShuffleElements)

}

Game.prototype.startGame = function (scenesArray) {
  this.initiateElements()

  mainGame = new Scene()

  mainGame.mainBlock = document.createElement('div')
  mainGame.mainBlock.setAttribute('class', 'game-block')
  this.elements.forEach(elem => {
    mainGame.mainBlock.appendChild(elem.makeElement())
  })
  mainGame.container.appendChild(mainGame.mainBlock)

  this.mainContainer.addEventListener('click', ({ target }) => {
    if (!(target.classList.contains('game') || target.classList.contains('game-block'))) {
      target = selectProperTarget(target)
      if (target) {
        const clickedElement = this.elements.find(elem => {
          return elem.id === parseInt(target.id)
        })
        if (clickedElement.present) {
          if (this.currentOpened === null) {
            this.currentOpened = clickedElement
            clickedElement.peek()
          } else {
            if (clickedElement.id !== this.currentOpened.id) {
              clickedElement.peek()
              const previouslyOpened = this.currentOpened
              this.currentOpened = null;
              if (clickedElement.name === previouslyOpened.name) {
                previouslyOpened.dissapear()
                clickedElement.dissapear()
              } else {
                clickedElement.peek()
                previouslyOpened.peek()
              }
            }
          }
        }
      }
      this.checkWin()
    }
  })

  this.scenes = scenesArray;
  this.scenes.push(mainGame)
  this.scenes.push(congratulations)
  this.nextScene()
}

Game.prototype.startMusic = function () {
  this.music = document.createElement('audio')
  this.music.setAttribute('src', '../src/music.mp3')
  this.music.setAttribute('loop', '')
  this.music.volume = 0.05
  document.querySelector('body').appendChild(this.music)
  this.music.play()

  this.muteButton = document.createElement('button')
  this.muteButton.classList.add('mute')
  this.muteButton.addEventListener('click', () => {
    this.muteButton.classList.toggle('muted')
    if (this.musicMuted) {
      this.unmuteMusic()
    } else {
      this.muteMusic()
    }
  })

  document.querySelector('body').appendChild(this.muteButton)
}

Game.prototype.muteMusic = function () {
  this.music.volume = 0;
  this.musicMuted = true;
}

Game.prototype.unmuteMusic = function () {
  this.music.volume = 0.05;
  this.musicMuted = false;
}

Game.prototype.nextScene = function () {
  if (this.currentScene !== -1) {
    this.scenes[this.currentScene].container.classList.toggle('prepared')
  }
  this.currentScene++;

  setTimeout(() => {
    this.scenes[this.currentScene].initiate()
    setTimeout(() => {
      this.scenes[this.currentScene].container.classList.toggle('prepared')
    }, 200)
  }, 200)

  console.log('Current scene is:', this.currentScene)
}

Game.prototype.checkWin = function () {
  if (!this.elements.some(elem => elem.present)) {
    this.nextScene()
  }
}

const Scene = function () {
  this.anchorElement = document.querySelector('.container');
  this.container = document.createElement('div')
  this.container.setAttribute('class', 'game prepared')
  this.active = false;
}

Scene.prototype.initiate = function () {
  const currentContainer = document.querySelector('.game')
  this.anchorElement.replaceChild(this.container, currentContainer)
}

Scene.prototype.close = function () {
  this.container.classList.add('closed')
}

import { Card, getCardName } from './cards.js'
import { shuffleArray, selectProperTarget } from './utility.js'
import { congratulations } from './scenes.js'

const amountOfCards = 16

const game = {
  currentOpened: null,
  amountOfPairs: amountOfCards / 2,
  currentScene: -1,
  mainContainer: document.querySelector('.container'),
  gameStop: false,
  musicMuted: false,

  initiateCards: function () {
    const preShuffleCards = [];
    for (let i = 0; i < this.amountOfPairs; i++) {
      const currentCard = getCardName()
      const newCard = new Card(currentCard, i)
      const anotherNewCard = new Card(currentCard, i + this.amountOfPairs)
      preShuffleCards.push(newCard)
      preShuffleCards.push(anotherNewCard)
    }
    this.cards = shuffleArray(preShuffleCards)
  },

  startGame: function (scenesArray) {
    this.initiateCards()

    const mainGame = new Scene()

    mainGame.mainBlock = document.createElement('div')
    mainGame.mainBlock.setAttribute('class', 'game-block')
    this.cards.forEach(card => {
      mainGame.mainBlock.appendChild(card.makeCard())
    })
    mainGame.container.appendChild(mainGame.mainBlock)

    this.mainContainer.addEventListener('click', ({ target }) => {
      if (this.gameStop) { return }
      if (!(target.classList.contains('game') || target.classList.contains('game-block'))) {
        target = selectProperTarget(target)
        if (target) {
          const clickedCard = this.cards.find(card => card.id === parseInt(target.id))
          if (clickedCard.present) {
            if (this.currentOpened === null) {
              this.currentOpened = clickedCard
              clickedCard.peek()
            } else {
              if (clickedCard.id !== this.currentOpened.id) {
                clickedCard.peek()
                const previouslyOpened = this.currentOpened
                this.currentOpened = null;
                if (clickedCard.name === previouslyOpened.name) {
                  previouslyOpened.disappear()
                  clickedCard.disappear()
                } else {
                  clickedCard.peek()
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
  },

  startMusic: function () {
    this.music = document.createElement('audio')
    this.music.setAttribute('src', 'src/music.mp3')
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
  },

  muteMusic: function () {
    this.music.volume = 0
    this.musicMuted = true
  },

  unmuteMusic: function () {
    this.music.volume = 0.05
    this.musicMuted = false
  },

  nextScene: function () {
    if (this.currentScene !== -1) {
      this.scenes[this.currentScene].container.classList.toggle('prepared')
    }
    this.currentScene++;

    setTimeout(() => {
      this.scenes[this.currentScene].initiate()
      setTimeout(() => {
        this.scenes[this.currentScene].container.classList.toggle('prepared')
      })
    })
  },

  checkWin: function () {
    if (!this.cards.some(card => card.present)) {
      this.nextScene()
      this.gameStop = true
    }
  }
}


const Scene = function () {
  this.rootElement = document.querySelector('.container');
  this.container = document.createElement('div')
  this.container.setAttribute('class', 'game prepared')
  this.active = false;
}

Scene.prototype.initiate = function () {
  const currentContainer = document.querySelector('.game')
  this.rootElement.replaceChild(this.container, currentContainer)
}

Scene.prototype.close = function () {
  this.container.classList.add('closed')
}

export { Scene, game }

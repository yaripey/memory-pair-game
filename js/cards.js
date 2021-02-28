const Card = function (name, id) {
  this.name = name;
  this.id = id;

  this.opened = false;
  this.present = true;
}

Card.prototype.makeCard = function () {
  const newCard = document.createElement('div')
  newCard.setAttribute('class', `${this.name} element flip-container`)
  newCard.setAttribute('ontouchstart', 'this.classList.toggle(\'hover\')');
  newCard.setAttribute('id', this.id)

  const flipper = document.createElement('div')
  flipper.setAttribute('class', 'flipper')

  const front = document.createElement('div')
  front.setAttribute('class', 'front')

  const back = document.createElement('back')
  back.setAttribute('class', 'back')

  const newImage = document.createElement('img')
  newImage.setAttribute('src', `images/${this.name}.png`)

  back.appendChild(newImage)

  flipper.appendChild(front)
  flipper.appendChild(back)

  newCard.appendChild(flipper)

  this.html = newCard;

  return newCard;
}

Card.prototype.peek = function () {
  if (this.opened === false) {
    this.opened = true;
    this.html.classList.add('opened')
  } else {
    this.opened = false;
    setTimeout(() => {
      this.html.classList.remove('opened')
    }, 500)
  }
}

Card.prototype.disappear = function () {
  this.present = false;
  setTimeout(() => {
    this.html.classList.add('disappeared')
  }, 500)
}

// This function returns a random element name.
// Used for creating an array of cards.
const getCardName = function () {
  const cardNames = ['anemo', 'cryo', 'dendro', 'electro', 'geo', 'hydro', 'pyro']
  const num = Math.floor(Math.random() * (cardNames.length))
  return cardNames[num]
}

export { Card, getCardName }

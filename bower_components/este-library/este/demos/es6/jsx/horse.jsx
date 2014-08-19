goog.provide('este.demos.es6.jsx.Horse')

goog.require('este.demos.es6.jsx.Animal')

este.demos.es6.jsx.Horse = class extends este.demos.es6.jsx.Animal {
  move() {
    alert('Galloping...')
    super.move(45)
  }
}
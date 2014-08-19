goog.provide('este.demos.es6.jsx.Snake')

goog.require('este.demos.es6.jsx.Animal')

este.demos.es6.jsx.Snake = class extends este.demos.es6.jsx.Animal {
  move() {
    alert('Slithering...')
    super.move(5)
  }
}
goog.provide('este.demos.es6.jsx.Animal')

este.demos.es6.jsx.Animal = class {
  constructor(name) {
    this.name = name
  }
  move(meters) {
    alert(`${this.name} moved ${meters}m.`)
  }
}
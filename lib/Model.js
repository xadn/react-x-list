import { binarySearch } from './Utils';

class Model {
  constructor(keys) {
    this.length     = keys.length;
    this.keyToIndex = {};
    this.heightAt   = new Uint32Array(this.length);
    this.topAt      = new Uint32Array(this.length);
    this.viewport   = [0, 100];
    this.lastScrolledKey = keys[0];

    for (let i = 0; i < this.length; i++) {
      this.heightAt[i] = 50;
      this.keyToIndex[keys[i]] = i;
    }
    this._recalculateTops(0);
  }

  totalHeight() {
    return this.heightAt[this.length - 1] + this.topAt[this.length - 1];
  }

  visibleIndexes() {
    const visibleStart = binarySearch(this.topAt, this.viewport[0]);
    const visibleEnd = binarySearch(this.topAt, this.viewport[1] + 1);
    const lastScrolledIndex = this._getLastScrolledIndex();
    const indexes = [];

    if (lastScrolledIndex < visibleStart) {
      indexes.push(lastScrolledIndex);
    }

    for (let i = visibleStart; i <= visibleEnd; i++) {
      indexes.push(i);
    }

    if (lastScrolledIndex > visibleEnd) {
      indexes.push(lastScrolledIndex);
    }

    return indexes;
  }

  updateHeights(heights) {
    let minChangedIndex = this.length;

    for (let key in heights) {
      let newHeight = heights[key];
      let index     = this.keyToIndex[key];
      let oldHeight = this.heightAt[index];

      if (newHeight !== oldHeight) {
        this.heightAt[index] = newHeight;
        minChangedIndex = Math.min(minChangedIndex, index);
      }
    }

    if (minChangedIndex < this.length) {
      this._recalculateTops(minChangedIndex);
      return true;
    }
    return false;
  }

  updateViewport(viewport) {
    this.viewport = viewport;
  }

  updateLastScrolled(key) {
    // console.log('updateLastScrolled', key)
    this.lastScrolledKey = key;
  }

  _getLastScrolledIndex() {
    return this.keyToIndex[this.lastScrolledKey];
  }

  _recalculateTops(startingAt) {
    for (let i = startingAt + 1; i < this.length; i++) {
      this.topAt[i] = this.topAt[i - 1] + this.heightAt[i - 1];
    }
  }
}

export default Model;
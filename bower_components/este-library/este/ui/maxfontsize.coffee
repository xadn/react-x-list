goog.provide 'este.ui.maxFontSize'

###*
  Maximize fontSize until scrollbar appear.
  @param {Element} el
###
este.ui.maxFontSize = (el) ->
  style = el.style
  visibility = style.visibility
  fontSize = 6
  style.visibility = 'hidden'
  while fontSize != 100
    style.fontSize = fontSize + 'px'
    if el.scrollHeight > el.offsetHeight || el.scrollWidth > el.offsetWidth
      style.fontSize = (fontSize - 1) + 'px'
      break
    fontSize++
  style.visibility = visibility
  return

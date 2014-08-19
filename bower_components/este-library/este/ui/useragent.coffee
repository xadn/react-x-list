###*
  @fileoverview Propagate various user agent characteristics on HTML element.
###
goog.provide 'este.ui.userAgent'

goog.require 'goog.dom.classlist'
goog.require 'goog.labs.userAgent.browser'
goog.require 'goog.labs.userAgent.device'
goog.require 'goog.labs.userAgent.engine'
goog.require 'goog.labs.userAgent.platform'

###*
  @type {Object.<string, boolean>}
###
este.ui.userAgent.features =
  'e-ua-browser-android': goog.labs.userAgent.browser.isAndroidBrowser()
  'e-ua-browser-chrome': goog.labs.userAgent.browser.isChrome()
  'e-ua-browser-firefox': goog.labs.userAgent.browser.isFirefox()
  'e-ua-browser-ie': goog.labs.userAgent.browser.isIE()
  'e-ua-browser-opera': goog.labs.userAgent.browser.isOpera()
  'e-ua-browser-safari': goog.labs.userAgent.browser.isSafari()

  'e-ua-device-desktop': goog.labs.userAgent.device.isDesktop()
  'e-ua-device-mobile': goog.labs.userAgent.device.isMobile()
  'e-ua-device-tablet': goog.labs.userAgent.device.isTablet()

  'e-ua-engine-gecko': goog.labs.userAgent.engine.isGecko()
  'e-ua-engine-presto': goog.labs.userAgent.engine.isPresto()
  'e-ua-engine-trident': goog.labs.userAgent.engine.isTrident()
  'e-ua-engine-webkit': goog.labs.userAgent.engine.isWebKit()

  'e-ua-platform-android': goog.labs.userAgent.platform.isAndroid()
  'e-ua-platform-chromeos': goog.labs.userAgent.platform.isChromeOS()
  'e-ua-platform-ios': goog.labs.userAgent.platform.isIos()
  'e-ua-platform-ipad': goog.labs.userAgent.platform.isIpad()
  'e-ua-platform-iphone': goog.labs.userAgent.platform.isIphone()
  'e-ua-platform-ipod': goog.labs.userAgent.platform.isIpod()
  'e-ua-platform-linux': goog.labs.userAgent.platform.isLinux()
  'e-ua-platform-mac': goog.labs.userAgent.platform.isMacintosh()
  'e-ua-platform-windows': goog.labs.userAgent.platform.isWindows()

do ->
  for feature, enabled of este.ui.userAgent.features
    continue if not enabled
    goog.dom.classlist.add document.documentElement, feature
  return
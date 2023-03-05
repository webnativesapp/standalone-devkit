// ---   DEVICE HELPER -----------------------------------------------------------------------------------------------
GLOBAL.device = {
  screen: {}
};
var dpr = devicePixelRatio;
var doc = window.document;
var width = (window.innerWidth || (doc.clientWidth || doc.clientWidth));
var height = (window.innerHeight || (doc.clientHeight || doc.clientHeight));
if (width != device.width || height != device.height || !device.screen.orientation) {
  device.width = width;
  device.height = height;
  device.screen.width = width;
  device.screen.height = height;

  if (width > height) {
    device.screen.isPortrait = false;
    device.screen.isLandscape = true;
    device.screen.orientation = 'landscape';
  } else {
    device.screen.isPortrait = true;
    device.screen.isLandscape = false;
    device.screen.orientation = 'portrait';
  }
}
device.screen.pixelRatio = dpr;
device.screen.devicePixelRatio = dpr;

var ua = navigator.userAgent;
device.isSafari = /Safari/.test(ua);
if (/(iPod|iPhone|iPad)/i.test(ua)) {
  device.name = 'browser';
  device.isMobileBrowser = true;
  device.isIOS = true;
  device.isIpad = /iPad/i.test(ua);
  device.isStandalone = !!window.navigator.standalone; // full-screen

  var match = ua.match(/iPhone OS ([0-9]+)/);
  device.iosVersion = match && parseInt(match[1]);
  device.isUIWebView = !device.isSafari;

  device.screen.defaultOrientation = 'portrait';
  device.screen.browserChrome = {
    portrait: {
      top: 20 * devicePixelRatio,
      bottom: 44 * devicePixelRatio
    },
    landscape: {
      top: 20 * devicePixelRatio,
      bottom: 32 * devicePixelRatio
    }
  };

} else if (/Mobile Safari/.test(ua) || /Android/.test(ua) || /BlackBerry/.test(ua)) {
  device.name = 'browser';
  device.isMobileBrowser = true;
  device.isAndroid = true;
  device.isSafari = false;
  device.screen.defaultOrientation = 'portrait';
  device.screen.browserChrome = {
    portrait: {
      top: 0,
      bottom: 0
    },
    landscape: {
      top: 0,
      bottom: 0
    }
  };
} else {
  // All other browsers
  device.name = 'browser';
  device.canResize = false;
}
// -----------------------------------------------------------------------------------------------------------------
jsio('import src.ui.App as App');
// -- APP ----------------------------------------------------------------------------------------------------------
var app = new App();
var startApp = function() {
  app.start();
};
// -- HIDE SPLASH----------------------------------------------------------------------------------------------------
var hideSplash = function(cb) {
  const bgColor = '#fff';
  document.documentElement.style.setProperty('background-color', bgColor);
  document.body.style.setProperty('background-color', bgColor);

  var called = false;
  var splash = document.getElementById('_GCSplash');
  if (splash) {
    setTimeout(function() {
      splash.style.opacity = 0;
      splash.style.pointerEvents = 'none';
      setTimeout(function() {
        splash.parentNode.removeChild(splash);
        !called && cb && cb();
        called = true;
      }, Math.max(CONFIG.modules.wait4It || 500));
    }, 500);


  } else {
    cb && cb();
    called = true;
  }
};
// --- PRELOAD CSS --------------------------------------------------------------------------------------------------
GLOBAL.loadCssFile = function(url, cb) {
  GLOBAL.stylesLoaded = GLOBAL.stylesLoaded || [];
  if (GLOBAL.stylesLoaded.indexOf(url) > -1) {
    cb && cb();
    return;
  }
  GLOBAL.stylesLoaded.push(url);

  var file = url;

  var link = document.createElement("link");
  link.href = file;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";

  document.getElementsByTagName("head")[0].appendChild(link);
};
var cascadingStyleSheets = (!!CONFIG.modules.styles && CONFIG.modules.styles) || [];
cascadingStyleSheets.map((path) => {
  loadCssFile(path);
})

// --  PRELOAD SCRIPTS ----------------------------------------------------------------------------------------------
GLOBAL.loadScript = function(url, cb) {
  GLOBAL.scriptsLoaded = GLOBAL.scriptsLoaded || [];
  if (GLOBAL.scriptsLoaded.indexOf(url) > -1) {
    cb && cb();
    return;
  }

  GLOBAL.scriptsLoaded.push(url);

  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.onload = bind(this, function() {
    cb && cb();
  });
  script.onerror = function() {
    console.info('Error on loading  script...');
  };
  document.body.appendChild(script);
};
var scripts = (!!CONFIG.modules.scripts && CONFIG.modules.scripts) || [];
if (scripts && scripts.length > 0) {
  var onLoadedScript = bind(this, function() {
    if (scripts.length > 0) {
      loadScript(scripts.splice(0, 1)[0], onLoadedScript);
    } else {
      hideSplash(startApp);
    }
  });
  loadScript(scripts.splice(0, 1)[0], onLoadedScript);
} else {
  hideSplash(startApp);
}
// -----------------------------------------------------------------------------------------------------------------
exports = {};
// ---------------------------------------------------------------------------------------------------------------EOF

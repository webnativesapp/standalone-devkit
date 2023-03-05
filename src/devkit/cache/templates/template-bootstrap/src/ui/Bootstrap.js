// GLOBAL LIVE EDITOR ----------------------------------------------------------------------------------
if (!!CONFIG.modules.liveEditor) {
  jsio('import oneflag.LiveEdit as LiveEdit');
  LiveEdit.connect();
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
cascadingStyleSheets.map((path)=>{
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
 
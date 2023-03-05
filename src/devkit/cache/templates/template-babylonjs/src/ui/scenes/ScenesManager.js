jsio('import src.ui.Babylon as Babylon');
//---------------------------------------------------------------------------------------------------------------------------
var namespace = 'ScenesManager';
//---------------------------------------------------------------------------------------------------------------------------
exports = Class(Babylon, function() {
  this.ready = function() {
    /* 
     * Live edit 
     * In order to use live editor always load your dependencies under the initial call,
     * for Babylon template load it here.
    */
    jsio('import src.ui.scenes.LoaderScene as LoaderScene');
    jsio('import src.ui.scenes.MainScene as Scene');
    
    /**
     * Scenes Manager allows you to simplify managing scenes transitions 
     **/
    this.activeScenes = [];
    
    var loaderScene = new LoaderScene(this);
    loaderScene.on('ready', bind(this, function() {
      setTimeout(bind(this, function() {
         
        this.activeScenes.pop();
        loaderScene.remove();  
        this.activeScenes.push(new Scene(this));
      }), Math.max(150, CONFIG.modules.wait4It || 100)); 
    }));
    this.activeScenes.push(loaderScene);
  };
  this.tick = function() {
    for (var i in this.activeScenes) { 
      if (this.activeScenes[i].update) {
        this.activeScenes[i].update();
      }
    }
  };
});
//------------------------------------------------------------------------------------------------------------------------EOF
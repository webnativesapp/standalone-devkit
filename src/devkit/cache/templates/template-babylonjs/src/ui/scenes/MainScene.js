var namespace = 'MainScene';
//---------------------------------------------------------------------------------------------------------------------------
jsio('import src.ui.AbstractScene as SceneBase');
//---------------------------------------------------------------------------------------------------------------------------
jsio('import src.ui.AssetLoader as Loader');
//---------------------------------------------------------------------------------------------------------------------------
var Scene = Class(SceneBase, function(_super) {
  this.init = function(opts) {
    _super(this, 'init', [opts, {
      noPreset: true
    }]);
    
    //const [preloadModels, host, port] = Object.values(CONFIG.modules.extended);
    /* 
     * Live edit
     * In order to use live editor always load your dependencies under the initial call,
     * for jsio class load it here.
     */
    // jsio('import src.<folder>....<file> as <ALIAS>')
  };
  //-- @overrides -------------------------------------------------------------------------------------------------------------
  this.update = function() {
    // call super
    _super(this, 'update');

    // YOUR SCENE UPDATES HERE

  };
  //---------------------------------------------------------------------------------------------------------------------------
  this.registerEventListener = function(scene) {
    // YOUR SCENE EVENTS LISTENERS HERE
  };
  //---------------------------------------------------------------------------------------------------------------------------
  this.action = function() {
    // YOUR SCENE ACTION HERE
    var scene = this.scene;
    var canvas = this.canvas;

    scene.clearColor = this.manager.colorStringToColor4('#fff');

    // https://playground.babylonjs.com/#6XIT28
    const camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 4, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    const box = BABYLON.MeshBuilder.CreateBox("box", {
      height: 1,
      width: 1,
      depth: 1
    });

    this.manager.showAxis(6, this.scene);
  };
});
exports = Scene;
//------------------------------------------------------------------------------------------------------------------------EOF
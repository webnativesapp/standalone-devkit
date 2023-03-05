jsio('import oneflag.UIView as UIView');

var namespace = 'Bootstrap';
exports = class Bootstrap extends UIView {
  constructor(opts) {
    super(opts);
  }

  onBeforeBuild() {
    console.info('[' + namespace + '] Before build...');
    
    this.schema = 'Blank'
  }

  onAfterBuild() {
    console.info('[' + namespace + '] After build...( build took: ' + ((Date.now() - this.started) / 1000) + ' seconds)');

    this.$label.updateOpts({ 
      color: '#fff'
    });
    
  }
  
  onColorUpdate(params, ev){
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    params.target.updateOpts({
      color: `#${randomColor}`
    });
  }
};
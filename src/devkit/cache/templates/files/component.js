jsio('import oneflag.UIView as Base');
//----------------------------------------------------------------------------------------------------------------------
var namespace = '<component_name>';
exports = class extends UIView {
    constructor(opts) {
        super(opts);
    }

    onBeforeBuild() {
        console.info('[' + namespace + '] Before build...');
    }

    onAfterBuild() {
        console.info('[' + namespace + '] After build...( build took: ' + ((Date.now() - this.started) / 1000) + ' seconds)');

    }
};
//--------------------------------------------------------------------------------------------------------------------EOF

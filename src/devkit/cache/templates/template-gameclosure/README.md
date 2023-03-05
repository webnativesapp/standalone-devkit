
# Template > GameClosure *Timestep*

*This template is the OG of WebNatives.app*.
Simple yet super powerful template to create 2D games or apps that run on any device with high performance and quality. Uses WebGL and Canvas API's for web rendering.

#### External dependencies
- No style sheets or script dependencies
- Just an HTML page setup ready to use


#### Folder structure
- 📁/root
    - 📁/logic *all your app logic should be here*
    - 📁/ui *all your user interface logic should be here*
        - 📁/schemas *auto generated JSON schemas from the [WYSIWYG Editor](#wysiwyg)*
        - 🗎 Bootstrap.js *__entry file__*
        - 🗎 Loader.js * __advanced__: auto loaded by the template, you can customize it to your requirements*
    - 📁/workers *__advanced__: place and register your service workers here*

> To start just modify the Bootstrap.js file.

### Editing Bootstrap.js on Timestep Engine
Timestep is the rendering engine behind the [Game Closure Devkit](https://github.com/play-co/devkit) and this template uses this engine to render 2D into canvas using WebGL API by default ( it also supports Canvas API). Using this template you can achieve highly performant 2D games or interactive apps even in mobile browsers with low spec devices. It is battle tested ( check [Everwing](https://www.playeverwing.com/)) and still can outperform a lot of the most popular engines today.

Timestep uses a simple yet powerful approach to game development and this template extends that to be even powerful yet super easy to use and scale.

Every UI component renders as a ```UIView class``` which is in itself an extended class of a Timestep Engine  [```ui.View```](https://github.com/lmigueldf/doc/blob/master/api/ui/view.md), allowing rendering options using the JSON schemas from the [WYSIWYG Editor](#wysiwyg) and simplifying the GUI creation process.

The flow to create a component is:
- Create your schema
- Setup your schema to be loaded by the component
- Manipulate your component directly via code accessing the components via ID property.

All components follow a parent <1-*> children relationship allowing the creation of simple components up to highly complex ones.

#### Schema < Blank >
This template comes with a preset Blank schema with a simple root element ( $$) and a label.
![Blank Schema](https://i.ibb.co/k8W1hr3/Blank-template.png =100%x100%)

#### Bootstrap.js < entry file>
```
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
```
#### Find the live demo [here](https://webnatives.app/templates).

This template runs a simple component generation, but this is just the tip of the iceberg. Timestep provides a lot of features from the integrated game loop, object pooling, particle engine to animations. Please find more about the [Timestep API  here](https://github.com/lmigueldf/doc/tree/master/api).

Follow us on YouTube for tutorials on how to use this amazing template and make sure to try some games created with this in the [Explorer](https://explorer.webnatives.app) galleria.

---------------------------
© 2023 WebNatives

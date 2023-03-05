# Template > Playcanvas Engine<img src="https://webnatives.oneflagstudio.com/assets/images/logo.png" width="42" align="right"/>
Playcanvas Engine is the core of [Playcanvas](https://playcanvas.com). This template helps you jump start a engine only development environement on the cloud in no time. Great to test and learn this amazing engine.
#### External dependencies.
- Scripts
> https://code.playcanvas.com/playcanvas-stable.min.js

#### Folder structure
- 📁/root
    - 📁/logic *all your app logic should be here*
    - 📁/ui *all your user interface logic should be here*
        - 📁/schemas *auto generated JSON schemas from the [WYSIWYG Editor](/docs/guides_wysiwyg)*
        - 🗎 Bootstrap.js
        - 🗎 App.js *__entry file__*
    - 📁/workers *__advanced__: place and register your service workers here*

### To start just modify the src/ui/App.js file.
This sets up the [Playcanvas#usage](https://github.com/playcanvas/engine#usage) found in the official repo of  the Playcanvas Engine.
```
// https://github.com/playcanvas/engine#usage
class App {

  constructor() {
    document.body.style.setProperty('overflow', 'hidden');
    document.body.innerHTML = `<canvas id='application'></canvas>`;
    // create a PlayCanvas application
        const canvas = document.getElementById('application');
        const app = new pc.Application(canvas);

        // fill the available space at full resolution
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);

        // ensure canvas is resized when window changes size
        window.addEventListener('resize', () => app.resizeCanvas());

        // create box entity
        const box = new pc.Entity('cube');
        box.addComponent('model', {
            type: 'box'
        });
        app.root.addChild(box);

        // create camera entity
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 0, 5);

        // create directional light entity
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(90, 0, 0);

        // rotate the box according to the delta time since the last frame
        app.on('update', dt => box.rotate(50.0 * dt, 20.0 * dt, 0.0 * dt));

        app.start();
  }
```

---------------------------
© 2023 WebNatives

# Template > PixiJS<img src="https://webnatives.oneflagstudio.com/assets/images/logo.png" width="42" align="right"/>

Getting started with [PixiJS](https://pixijs.io/guides/basics/getting-started.html) ready template.

#### External dependencies.
- Scripts
> https://pixijs.download/release/pixi.min.js

#### Folder structure
- 📁/root
    - 📁/logic *all your app logic should be here*
    - 📁/ui *all your user interface logic should be here*
        - 📁/schemas *auto generated JSON schemas from the [WYSIWYG Editor](/docs/guides_wysiwyg)*
        - 🗎 Bootstrap.js
        - 🗎 App.js *__entry file__*
    - 📁/workers *__advanced__: place and register your service workers here*

### To start just modify the src/ui/App.js file.
```
class App {

  constructor() {
    document.body.style.setProperty('overflow', 'hidden');
    document.body.innerHTML = '';
    // Create the application helper and add its render target to the page
    let app = new PIXI.Application({
      width: device.screen.width,
      height: device.screen.height
    });
    document.body.appendChild(app.view);

    // Create the sprite and add it to the stage
    let sprite = PIXI.Sprite.from('resources/images/pixi.png');
    sprite.width  = 128;
    sprite.height = 128;
    
    sprite.y = (device.screen.height * 0.5) - (128/2);
    app.stage.addChild(sprite);

    // Add a ticker callback to move the sprite back and forth
    let elapsed = 0.0;
    app.ticker.add((delta) => {
      elapsed += delta;
      sprite.x = Math.min(Math.max(0, (128) + Math.cos(elapsed / 50.0) * (device.screen.width - 128)), (device.screen.width - 128));
    });
  }

}
```

---------------------------
© 2023 WebNatives

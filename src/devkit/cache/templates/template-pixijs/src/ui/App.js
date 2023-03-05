var namespace = 'App';
//----------------------------------------------------------------------------------------------------------------------
// https://pixijs.io/guides/basics/getting-started.html
//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
exports = App;
//--------------------------------------------------------------------------------------------------------------------EOF
# Template > Phaser V3<img src="https://webnatives.oneflagstudio.com/assets/images/logo.png" width="42" align="right"/>

Includes official [Phaser - Hello World! ](https://phaser.io/tutorials/getting-started-phaser3/part5) guide setup.

#### External dependencies.
- Scripts
> //cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js

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

  constructor() {}

  start() {
    document.body.style.setProperty('overflow', 'hidden');
    var canvasList = document.querySelectorAll('canvas')[0];
    canvasList && document.body.removeChild(canvasList);  
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: device.screen.width,
      height: device.screen.height,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            y: 200
          }
        }
      },
      scene: {
        preload: this.preload,
        create: this.create
      }
    });
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  create() {
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
      speed: 100,
      scale: {
        start: 1,
        end: 0
      },
      blendMode: 'ADD'
    });

    var logo = this.physics.add.image(-1,-1, 'logo');
    logo.setScale(0.5);

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
  }
  
  update(){
    
  }
}
```
---------------------------
© 2023 WebNatives

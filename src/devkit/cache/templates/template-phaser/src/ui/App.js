var namespace = 'App';
//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
exports = App;
//--------------------------------------------------------------------------------------------------------------------EOF
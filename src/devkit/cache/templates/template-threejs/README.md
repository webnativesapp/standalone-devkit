# Template > ThreeJs<img src="https://webnatives.oneflagstudio.com/assets/images/logo.png" width="42" align="right"/>
Ready to go [ThreeJS](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene) project.
#### External dependencies.
- Scripts
> https://unpkg.com/three@0.139.2/build/three.min.js

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
    this.canvasId = 'daudhakmdaiuw23h12nj3ekdn';
    document.body.innerHTML = `<canvas id="${this.canvasId}" style="width: 100%; height: 100%"></canvas>`;
  }

  start() {
    const canvas = document.getElementById(this.canvasId);

    const axes = new THREE.AxesHelper();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#adadad'); // Gray background
    scene.add(axes);
    const camera = new THREE.PerspectiveCamera(
      125,
      canvas.offsetWidth / canvas.offsetHeight
    );
    camera.position.set(1, 1, 1);
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
    });
    renderer.setClearColor('#000000', 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);


    // Add a Cube
    var material = new THREE.MeshStandardMaterial({
      color: '#0000ff'
    });
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    // Directional Light
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.25);
    directionalLight.position.x = 0;
    directionalLight.position.y = 5;
    directionalLight.position.z = 5;
    scene.add(directionalLight);
    //renderer.render(scene, camera);
    renderer.setAnimationLoop(() => {
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    });
  }
}
```
---------------------------
© 2023 WebNatives

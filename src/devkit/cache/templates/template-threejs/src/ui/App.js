var namespace = 'App';
//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
exports = App;
//--------------------------------------------------------------------------------------------------------------------EOF
//alert('Hey');

window.addEventListener('DOMContentLoaded', init);
document.addEventListener("gesturestart", (e) => {
  e.preventDefault();
});
//init();

function init() {
  //alert('Hello!');
  
  const height = window.innerHeight;
  const width = window.innerWidth;

  //動き
  let left_tf = false;
  let right_tf = false;
  let camera_rotation = {x:0,y:0,z:0};
  //タッチ開始時
  let x0 = null;
  let y0 = null;
  //タッチがmoveしている時の座標
  let x = null;
  let y = null;
  let y_reverse = 1;
  let x_reverse = 1;
  //ジャンプしているか
  let jump_tf = false;
  let theta_y = 0;
  let v = 0;
  let v_how = 100;
  let theta = 0;
  let camera_theta = 0;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
  camera.position.set(0, 16, 1000);
  //camera.useQuaternion = true;

  // 箱を作成
  const geometry = new THREE.BoxGeometry(500, 500, 500);
  const material = new THREE.MeshStandardMaterial({color: 0x0000FF});
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);
  
  const geometry_floor = new THREE.BoxGeometry( 100, 100, 100 );
  const material_floor = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
  const cube = new THREE.Mesh( geometry_floor, material_floor );
  scene.add( cube );
  
  const geometry_camerawork = new THREE.BoxGeometry(1,1,1);
  const material_camerawork = new THREE.MeshBasicMaterial({color: 0xFF00FF});
  const camerawork = new THREE.Mesh(geometry_camerawork,material_camerawork);
  scene.add(camerawork);

  const loader = new THREE.GLTFLoader();
  // GLTFファイルのパスを指定
  const gltf = await loader.loadAsync('./Test01.glb');
  // 読み込み後に3D空間に追加
  const mycar = gltf.scene;
  scene.add(mycar);
  
  cube.position.z = 1000;
  cube.position.y = -50;

  // 平行光源
  /*const light = new THREE.DirectionalLight(0xFFFFFF);
  light.intensity = 2; // 光の強さを倍に
  light.position.set(1, 1, 1); // ライトの方向
  // シーンに追加
  scene.add(light);*/
  const light = new THREE.HemisphereLight(0x888888, 0x0000FF, 3.0);

  scene.add(light);
  
  var axes = new THREE.AxesHelper(500);
  scene.add(axes);


  //camera.rotation.y = -Math.PI/2;
  // レンダリング
  //camera.rotation.set(-1.5,-Math.PI/2,-1.5);
  //camerawork.position.set(camera.position.x-10 ,camera.position.y-10,camera.position.z-10);
  camerawork.position.set(camera.position.x,camera.position.y,camera.position.z-10);
  renderer.render(scene, camera);
  
  //var camera_quaternion = camera.quaternion;

  
  function animetion(){
    requestAnimationFrame(animetion);
    //alert('hey');
    if (x0 != null && y != null){
      if (x0 > width/2){
        const move_x = camera.position.x - camerawork.position.x;
        const move_y = camera.position.y - camerawork.position.y;
        const move_z = camera.position.z - camerawork.position.z;
        camera.position.x += v*Math.cos(theta - theta_y);
        camera.position.z += v*Math.sin(theta - theta_y);
        mycar.position.set(camera.position.x,camera.position.y-h,camera.position.z);
        camerawork.position.set(camera.position.x-move_x,camera.position.y-move_y,camera.position.z-move_z);
      } else {
        if(-20<x-x0<20 && -20<y-y0<20){
          theta_y -= (y_reverse*(x-x0)/30000)%(2*Math.PI);
          //const work_x = 10*Math.cos(Math.acos((camera.position.x-camerawork.position.x)/10)-(x-x0)/30000)
          const work_x = 10*Math.sin(theta_y);
          //const work_y = 0*camerawork.position.y;
          const work_y = 10*Math.sin(Math.asin((camera.position.y-camerawork.position.y)/10)+x_reverse*(y-y0)/30000);
          const work_z = 10*Math.cos(theta_y);
          camerawork.position.set(camera.position.x-work_x,camera.position.y-work_y,camera.position.z-work_z);
          
          camera.lookAt(new THREE.Vector3(camerawork.position.x,camerawork.position.y,camerawork.position.z));
          //camera.rotation.x += 1;
          renderer.render(scene,camera);
         
        }
      }
      //alert('Hey');
      document.getElementById('info').innerHTML = String(180*((theta-theta_y)%(2*Math.PI))/Math.PI);
    }
    //box.position.x = 100*Math.sin(Date.now()/1000);
    //scene.add(box);
    //redraw();
    renderer.render(scene,camera);
    
  }
  animetion();
  
  /*let n = 0;
  function touchevent(e){
    n += 1;
    if (e.touches && e.touches[0]) {

      x = e.touches[0].clientX;
      y = e.touches[0].clientY;

    }
    else if (e.clientX && e.clientY) {

      x = e.clientX;
      y = e.clientY;

    }
    //box.position.x = 100*Math.sin(n/100);
    //scene.add(box);
    //renderer.render(scene,camera);
  };*/
  function touch_start(e){
    if (e.touches && e.touches[0]) {

      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;

    }
    else if (e.clientX && e.clientY) {

      x0 = e.clientX;
      y0 = e.clientY;

    }
  }
  function touch_move(e){
    if (e.touches && e.touches[0]) {

      x = e.touches[0].clientX;
      y = e.touches[0].clientY;

    }
    else if (e.clientX && e.clientY) {

      x = e.clientX;
      y = e.clientY;

    }
    v = Math.sqrt((x-x0)**2+(y-y0)**2)/v_how;
    theta = Math.atan2(y-y0,x-x0);
  }
  function touch_end(e){
    if (x0 != null && y0 != null & x == null && y == null){
      jump_tf = true;
    }
    x0 = null;
    y0 = null;
    x = null;
    y = null;
  }
  
  window.addEventListener('touchstart', touch_start);
  window.addEventListener('touchmove', touch_move);
  window.addEventListener('touchend', touch_end);
  
}

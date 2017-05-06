

/*global THREE*/
var camera, camera1, camera2, camera3, camera4, writecamera, scene, otherscene,writescene, renderer;
var background;
var X = 1000, Y = 700, AspRat = X/Y;
var clock;
var objects = [];
var shipLives = [];
var numLives = 3;
var ship;
var numAliens;
var texturePause, textureWinner, textureLoser;
var pause = false;
var endGame = false;
var checkWireframe = false;
var horFieldLim = 500;
var verFieldLim = 300;
var hasShoted = false;
var checkPhong = true;
var checkBasic = false;
var dirLight, light1, light2, light3, light4, light5, light6, spotLight,spotLightTarget;

function render(){
	'use strict';
	renderer.autoClear = false;
	renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
	renderer.render(scene,camera);
	renderer.render(writescene,writecamera);
	renderer.setViewport(0,0,150,300);
	renderer.render(otherscene,camera4);
	

}

function createCamera(){
	'use strict';
	camera1 = new THREE.OrthographicCamera(X/-2,X/2,Y/2,Y/-2,1,1000);
	camera1.position.set(0,100,0);
	camera1.lookAt(scene.position);
	camera2 = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);
	camera2.position.set(0,250,450);
	camera2.lookAt(scene.position);
	camera = camera1;
	camera4 = new THREE.OrthographicCamera(-150,150,300,-300,1,1000);
	camera4.position.set(0,100,0);
	camera4.lookAt(otherscene.position);
	writecamera = new THREE.OrthographicCamera(X/-2,X/2,Y/2,Y/-2,1,1000);
	writecamera.position.set(0,200,0);
	writecamera.lookAt(writescene.position);
	onResize();

}


function createScene(){    
	'use strict';
	scene = new THREE.Scene();
	otherscene = new THREE.Scene();
	writescene = new THREE.Scene();
	addObjects();
}

function addObjects(){
	numAliens = 16;
	numLives = 3;
	shipLives =  [];
	createField(0,0,0);
	createBackground(0,0,0);
	paused(0,100,50);
	winner(0,100,50);
	loser(0,100,50);
	ship = new PrismShip(0,0,250,objects,scene,300,100);
	ship.mainShip();
	var alien = new Alien(35,0,-80,objects,scene);
	var alien1 = new Alien(105,0,-80,objects,scene);
	var alien2 = new Alien(175,0,-80,objects,scene);
	var alien3 = new Alien(-35,0,-80,objects,scene);
	var alien4 = new Alien(-105,0,-80,objects,scene);
	var alien5 = new Alien(-175,0,-80,objects,scene);
	var alien6 = new Alien(35,0,-170,objects,scene);
	var alien7 = new Alien(105,0,-170,objects,scene);
	var alien8 = new Alien(175,0,-170,objects,scene);
	var alien9 = new Alien(-35,0,-170,objects,scene);
	var alien10 = new Alien(-105,0,-170,objects,scene);
	var alien11 = new Alien(-175,0,-170,objects,scene);
	var alien12 = new Alien(245,0,-170,objects,scene);
	var alien13 = new Alien(-245,0,-170,objects,scene);
	var alien14 = new Alien(245,0,-80,objects,scene);
	var alien15 = new Alien(-245,0,-80,objects,scene);
	var ship1 = new PrismShip(0,0,0,shipLives,otherscene,0,0);
	var ship2 = new PrismShip(0,0,100,shipLives,otherscene,0,0);
	var ship3 = new PrismShip(0,0,200,shipLives,otherscene,0,0);
}

//Textures
function createBackground(x,y,z){
	var loader = new THREE.TextureLoader(); 
	var texture = loader.load('12.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(6,6);

	background = new THREE.Object3D();
	var geometry = new THREE.PlaneGeometry(3000,3000,0); //4000
	var material = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:texture, side: THREE.DoubleSide});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(x,y,z);
	background.add(mesh);
	scene.add(background);
	background.position.x = 0;
	background.position.y = -500;
	background.position.z = 200;
	background.rotation.x = -Math.PI/4;
} 

function changeBackgroundCats() {
	var loader = new THREE.TextureLoader(); 
	var texture = loader.load('1.gif');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(6,6);

	background.children[0].material.map = texture;

}

function changeBackgroundNebula() {
	var loader = new THREE.TextureLoader(); 
	var texture = loader.load('12.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(6,6);

	background.children[0].material.map = texture;

}

function paused(x,y,z){
	var loader = new THREE.TextureLoader(); 
	var texture = loader.load('pause.png');

	texturePause = new THREE.Object3D();
	var geometry = new THREE.PlaneGeometry(600,300,0);
	var material = new THREE.MeshBasicMaterial({map:texture, transparent: true, opacity: 1, color: 0xFFFFFF});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(x,y,z);
	texturePause.add(mesh);
	writescene.add(texturePause);
	texturePause.position.x = x;
	texturePause.position.y = y;
	texturePause.position.z = z;
	texturePause.visible = false;
	texturePause.rotation.x = -Math.PI/2;
}

function winner(x,y,z){
	var loader = new THREE.TextureLoader(); 
	var texture = loader.load('winner.png');

	textureWinner = new THREE.Object3D();
	var geometry = new THREE.PlaneGeometry(600,300,0);
	var material = new THREE.MeshBasicMaterial({map:texture, transparent: true, opacity: 1, color: 0xFFFFFF});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(x,y,z);
	textureWinner.add(mesh);
	writescene.add(textureWinner);
	textureWinner.position.x = x;
	textureWinner.position.y = y;
	textureWinner.position.z = z;
	textureWinner.visible = false;
	textureWinner.rotation.x = -Math.PI/2;
}

function loser(x,y,z){
	var loader = new THREE.TextureLoader(); 
	var texture = loader.load('loser.png');

	textureLoser = new THREE.Object3D();
	var geometry = new THREE.PlaneGeometry(600,300,0);
	var material = new THREE.MeshBasicMaterial({map:texture, transparent: true, opacity: 1, color: 0xFFFFFF});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(x,y,z);
	textureLoser.add(mesh);
	writescene.add(textureLoser);
	textureLoser.position.x = x;
	textureLoser.position.y = y;
	textureLoser.position.z = z;
	textureLoser.visible = false;
	textureLoser.rotation.x = -Math.PI/2;
}

//FIELD
function createField(x,y,z){
	'use strict';
	var field = new THREE.Object3D();

	addFieldSquare1(field,0,0,-verFieldLim);
	addFieldSquare1(field,0,0,verFieldLim);
	addFieldSquare2(field,-horFieldLim,0,0);
	addFieldSquare2(field,horFieldLim,0,0);

	scene.add(field);

	field.position.x = x;
	field.position.y = y;
	field.position.z = z;
}

function addFieldSquare1(obj,x,y,z){
	'use strict';
	var geometry = new THREE.CubeGeometry(horFieldLim*2,8,1);
	var material = new THREE.MeshNormalMaterial({wireframe: false});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(x,y,z);

	obj.add(mesh);
}

function addFieldSquare2(obj,x,y,z){
	'use strict';
	var geometry = new THREE.CubeGeometry(1,8,verFieldLim*2);
	var material = new THREE.MeshNormalMaterial({wireframe: false});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(x,y,z);

	obj.add(mesh);
}

function onResize(){
	'use strict'
	renderer.setSize(window.innerWidth,window.innerHeight);

	var aspectratio = window.innerWidth/window.innerHeight;

	if (camera == camera1){
		if (aspectratio > AspRat) {
			camera.bottom = -Y/2;
			camera.top = Y/2;
			camera.left = Y*aspectratio/-2;
			camera.right= Y*aspectratio/2;
		}

		else {
			camera.left = X/-2;
			camera.right = X/2;
			camera.top = (X/aspectratio)/2;
			camera.bottom = (X/aspectratio)/-2;
		}
	}
	else {
		camera.aspect = aspectratio;
	}

	camera.updateProjectionMatrix();
}

function clearGame() {
	while (objects.length > 0) {
		scene.remove(objects[0]);
		objects.splice(0,1);					
	}
	while (shipLives.length > 0) {
		otherscene.remove(shipLives[0]);
		shipLives.splice(0,1);
	}
}


function update(){
	'use strict'
	var delta = clock.getDelta();
	if (!pause && !endGame) {
		for (var i = 0; i < objects.length; i++) {
			objects[i].move(delta);
			for (var j = 0; j < i; j++) {
				if(objects[i].collidesWith(objects[j]) && objects[i].isAlive && objects[j].isAlive) {
					objects[i].action(objects[j]);
				}
			}
		}
		for (var i = 0; i < objects.length; i++) {
			if (!objects[i].isAlive) {
				scene.remove(objects[i]);
				objects.splice(i,1);
				
			}
		}
	}
	/*else if (endGame) {
		clearGame();
	}*/
	//camera3.position.x = ship.position.x;
}

function lights(){
	//var sphere = new THREE.SphereGeometry( 2, 16, 8);
	
	var light = new THREE.AmbientLight( 0xFFFFFF, 0.1); // soft white light
	otherscene.add(light);

	dirLight = new THREE.DirectionalLight(0xFFFFFF,1);
	dirLight.position.set(-10,50,0); 
	otherscene.add(dirLight);


	dirLight = new THREE.DirectionalLight(0xFFFFFF,1);
	dirLight.position.set(-250,500,100); 
	scene.add(dirLight);

	light1= new THREE.PointLight(0xFF0000,1,400); //light1 = light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	light2= new THREE.PointLight(0xFF0000,1,400); //light2 = light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	light3= new THREE.PointLight(0xFF0000,1,400); //light3 = light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	light4= new THREE.PointLight(0xFF0000,1,400); //light4 = light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	light5= new THREE.PointLight(0xFF0000,1,400); //light5 = light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	light6= new THREE.PointLight(0xFF0000,1,400); //light6 = light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	
	light1.position.set(-300, 30, 175); 
	light2.position.set(300, 30, 150);
	light3.position.set(0, 30, 40);
	light4.position.set(225, 30, -45);
	light5.position.set(10, 30, -175);
	light6.position.set(-265, 30, -130);
	scene.add( light1 );
	scene.add( light2 );
	scene.add( light3 );
	scene.add( light4 );
	scene.add( light5 );
	scene.add( light6 );

}

function onKeyDown(e){
	'use strict';
	switch(e.keyCode){
		case 39: //right
			ship.moveRight = true;
			break;
		case 37: //left
			ship.moveLeft = true;
			break;
		case 40: //down
			ship.stop();
			break;

		case 49: //1
			camera = camera1;
			onResize();
			break;
		case 50: //2
			camera = camera2;
			onResize();
			break;
		case 51: //3
			camera = camera3;
			onResize();
			break;

		case 65: //a
			checkWireframe = !checkWireframe;
			scene.traverse(function (node){
				if(node instanceof THREE.Mesh){
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
		case 66: //b
			if(!hasShoted && !pause && !endGame) {
				var shot = new Shot(ship.position.x,0,ship.position.z-41,objects,scene);
				hasShoted = true;
			}
			break;
		case 67: //c
			light1.visible = !light1.visible;
			light2.visible = !light2.visible;
			light3.visible = !light3.visible;
			light4.visible = !light4.visible;
			light5.visible = !light5.visible;
			light6.visible = !light6.visible;
			break;

		case 71: //g
			for (var i = 0; i < objects.length; i++) {
				if (checkPhong) {
					objects[i].switchMaterial("Lambert");
				}
				else {
					objects[i].switchMaterial("Phong");
				}
			}
			checkPhong = !checkPhong;
			checkBasic = false;
			break;
		case 72: //h
			spotLight.visible = !spotLight.visible;
			break;

		case 74: //j
			changeBackgroundNebula();
			break;
		case 75: //k
			changeBackgroundCats();
			break;
		case 76: //l
			dirLight.visible = false;
			light1.visible = false;
			light2.visible = false;
			light3.visible = false;
			light4.visible = false;
			light5.visible = false;
			light6.visible = false;
			spotLight.visible = false;
			for (var i = 0; i < objects.length; i++) {
				if (!checkBasic) {
					objects[i].switchMaterial("Basic");
				}
				else {
					if (checkPhong) {
						objects[i].switchMaterial("Phong");
					}
					else {
						objects[i].switchMaterial("Lambert");
					}
				}
			}
			checkBasic = !checkBasic;
			break;

		case 78: //n
			dirLight.visible = !dirLight.visible;
			break;

		case 82: //r
			if (endGame) {
				textureWinner.visible = false;
				textureLoser.visible = false;
				clearGame();
				addObjects();
				if (camera != camera1 && camera != camera2) {
					camera = camera3;
				}
			}
			endGame = false;
			break;
		case 83: //s
			pause = !pause;
			texturePause.visible = !texturePause.visible;
			break;

		/*case 86: //v
			if(!hasShoted){
			var shot1 = new Shot(ship.position.x-26,0,ship.position.z-41,objects,scene);
			var shot2 = new Shot(ship.position.x+26,0,ship.position.z-41,objects,scene);
			hasShoted = true;
			}
			break;*/

	}
}

function onKeyUp(e){
	'use script';
	switch(e.keyCode){
		case 37: //left
			ship.moveLeft = false;
			break;
		case 39: //right
			ship.moveRight = false;
			break;
		case 66: //b
			hasShoted = false;
			break;
		case 86: //v
			hasShoted = false;
			break;

	}
}

function animate(){
	'use strict';
	update();
	renderer.clear();
	render();	
	requestAnimationFrame(animate);
}

function init(){
	'use strict';
	renderer = new THREE.WebGLRenderer();

	clock = new THREE.Clock();
	clock.startTime;

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createCamera();
	lights();
	onResize();

	renderer.clear();
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}


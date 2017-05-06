'use strict'

class GameObject extends THREE.Object3D {
	constructor(x, y, z, dir, vel, objects,scene){
		super();
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
		this.dx = Math.cos(dir);
		this.dy = Math.sin(dir);
		this.vel = vel;
		this.isAlive = true;
		this.materials = [];
		
		objects = objects.push(this);
		scene = scene.add(this);
	}
	move(delta){
		this.previousX = this.position.x;
		this.previousZ = this.position.z;
		this.position.x += this.vel * delta * this.dx;
		this.position.z += this.vel * delta * this.dy;
	}
	collidesWith(object) {
		var aminX = this.position.x - this.horLimit;
		var amaxX = this.position.x + this.horLimit;
		var aminZ = this.position.z - this.verLimit;
		var amaxZ = this.position.z + this.verLimit;
		var bminX = object.position.x - object.horLimit;
		var bmaxX = object.position.x + object.horLimit;
		var bminZ = object.position.z - object.verLimit;
		var bmaxZ = object.position.z + object.verLimit;

		return (aminX <= bmaxX && amaxX >= bminX) && (aminZ <= bmaxZ && amaxZ >= bminZ);
	}
	checkWalls () {
		if (this.position.x <= -horFieldLim+this.horLimit) {
			this.bumpWall('left');
		}
		else if (this.position.x >= horFieldLim-this.horLimit) {
			this.bumpWall('right');
		}
		if (this.position.z <= -verFieldLim+this.verLimit) {
			this.bumpWall('bottom');
		}
		else if (this.position.z >= verFieldLim-this.verLimit) {
			this.bumpWall('top');
		}
	}
	action (object) {}
	switchMaterial (type) {
		var mats = this.materials;
		this.traverse(function (node){
				if(node instanceof THREE.Mesh){
					for (var i = 0; i < mats.length; i++) {
						if (mats[i].indexOf(node.material) != -1) {
							if (type == "Basic") {
								node.material = mats[i][0];
							}
							else if (type == "Phong") {
								node.material = mats[i][1];
							}
							else if (type == "Lambert") {
								node.material = mats[i][2];
							}
						}
					}
				}
		});
	}
}

class Ship extends GameObject {
	constructor (x, y, z, objects, scene, acc, fri) {
		super(x, y, z, 0, 0, objects, scene);
		this.acc = acc;
		this.fri = fri;
		this.moveLeft = false;
		this.moveRight = false;
	}
	move (delta) {
		if(this.moveLeft){
			if (this.vel > 0) {
				this.vel -= this.acc * delta;
			}
			else {
				this.vel -= (this.acc - this.fri) * delta;
			}
		}
		else if(this.moveRight){
			if (this.vel < 0) {
				this.vel += this.acc * delta;
			}
			else {
				this.vel += (this.acc - this.fri) * delta;
			}
		}
		else {
			if (this.vel < 0) {
				this.vel += this.fri*2 * delta;
				if (this.vel > 0) {
					this.vel = 0;
				}
			}
			else if (this.vel > 0) {
				this.vel -= this.fri*2 * delta;
				if (this.vel < 0) {
					this.vel = 0;
				}
			}
		}
		super.move(delta);
		this.checkWalls();
	}
	stop(){
		this.moveRight = false;
		this.moveLeft = false;
		this.vel = 0;
	}
	bumpWall(wall) {
		if (wall == 'left') {
			this.vel = 0;
			this.position.x = -horFieldLim+this.horLimit;			
		}
		else if (wall == 'right') {
			this.vel = 0;
			this.position.x = horFieldLim-this.horLimit;}
	}
	mainShip(){
		camera3 = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);
		camera3.position.set(0,50,75); 
		camera3.lookAt(scene.position);
		this.add(camera3);
		spotLight = new THREE.SpotLight( 0x660033, 2 , 1000, Math.PI/3, 0.8, 2);
		spotLight.position.set(0,0,1);
		spotLight.target.position.set(0,0,-700);
		this.add(spotLight);
		this.add(spotLight.target);}
}

class XWing extends Ship {
	constructor (x, y, z, objects, scene, acc, fri) {
		super(x, y, z, objects, scene, acc, fri);
		this.horLimit = 31;
		this.verLimit = 48;

		
		var material1Phong = new THREE.MeshPhongMaterial( { color: 0x787781, shading: THREE.SmoothShading, shininess: 20, specular: 0x787781/*, diffuse: 0x787781*/} );
		var material2Phong = new THREE.MeshPhongMaterial( { color: 0x8A0808, shading: THREE.SmoothShading, shininess: 20, specular: 0x8A0808/*, diffuse: 0x8A0808*/} );
		
		var material1Lambert =  new THREE.MeshLambertMaterial({color: 0x787781, shading: THREE.SmoothShading});
		var material2Lambert =  new THREE.MeshLambertMaterial({color: 0x8A0808, shading: THREE.SmoothShading});	
		
		var material1Basic = new THREE.MeshBasicMaterial({color:0x787781, wireframe: false}); //branco
		var material2Basic = new THREE.MeshBasicMaterial({color:0x8A0808, wireframe: false}); //vermelho

		var material1 = [material1Basic,material1Phong,material1Lambert];
		var material2 = [material2Basic,material2Phong,material2Lambert];

		this.materials.push(material1,material2);

		var geometryBody = new THREE.CubeGeometry(8,8,52); //mat1
		var geometryCockpit = new THREE.CubeGeometry(4,4,16); //mat2
		var geometryTurbine = new THREE.CubeGeometry(4,4,20); //mat1
		var geometryWing1 = new THREE.CubeGeometry(4,4,16); //mat1
		var geometryWing2 = new THREE.CubeGeometry(4,4,12); //mat2
		var geometryWing3 = new THREE.CubeGeometry(4,4,8); //mat1
		var geometryCannon = new THREE.CubeGeometry(4,4,32); //mat1
		var geometryWeapon = new THREE.CubeGeometry(8,4,4); //mat2
		var geometryPoint = new THREE.CubeGeometry(4,4,4); //mat2
		var mesh;

		mesh = new THREE.Mesh(geometryBody,material1[1]); mesh.position.set(0,0,-20); this.add(mesh);
		mesh = new THREE.Mesh(geometryCockpit,material2[1]); mesh.position.set(0,6,-4); this.add(mesh);
		mesh = new THREE.Mesh(geometryCockpit,material2[1]); mesh.position.set(0,6,-4); this.add(mesh);
		mesh = new THREE.Mesh(geometryTurbine,material1[1]); mesh.position.set(6,0,2);	this.add(mesh);
		mesh = new THREE.Mesh(geometryTurbine,material1[1]); mesh.position.set(-6,0,2); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing1,material1[1]); mesh.position.set(10,2,0); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing1,material1[1]);	mesh.position.set(-10,2,0);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing1,material1[1]);	mesh.position.set(10,-2,0);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing1,material1[1]);	mesh.position.set(-10,-2,0); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]);	mesh.position.set(14,4,2); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]);	mesh.position.set(14,-4,2);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]);	mesh.position.set(-14,4,2);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]);	mesh.position.set(-14,-4,2); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]); mesh.position.set(18,6,2); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]);	mesh.position.set(18,-6,2);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]);	mesh.position.set(-18,6,2);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing2,material2[1]);	mesh.position.set(-18,-6,2); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing3,material1[1]);	mesh.position.set(22,8,4); this.add(mesh);
		mesh = new THREE.Mesh(geometryWing3,material1[1]);	mesh.position.set(22,-8,4);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing3,material1[1]);	mesh.position.set(-22,8,4);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWing3,material1[1]);	mesh.position.set(-22,-8,4); this.add(mesh);
		mesh = new THREE.Mesh(geometryCannon,material1[1]); mesh.position.set(26,12,-8); this.add(mesh);
		mesh = new THREE.Mesh(geometryCannon,material1[1]); mesh.position.set(26,-12,-8); this.add(mesh);
		mesh = new THREE.Mesh(geometryCannon,material1[1]); mesh.position.set(-26,12,-8); this.add(mesh);
		mesh = new THREE.Mesh(geometryCannon,material1[1]); mesh.position.set(-26,-12,-8);	this.add(mesh);
		mesh = new THREE.Mesh(geometryWeapon,material2[1]); mesh.position.set(26,12,-26); this.add(mesh);
		mesh = new THREE.Mesh(geometryWeapon,material2[1]); mesh.position.set(26,-12,-26); this.add(mesh);
		mesh = new THREE.Mesh(geometryWeapon,material2[1]); mesh.position.set(-26,12,-26); this.add(mesh);
		mesh = new THREE.Mesh(geometryWeapon,material2[1]); mesh.position.set(-26,-12,-26); this.add(mesh);
		mesh = new THREE.Mesh(geometryPoint,material2[1]);	mesh.position.set(26,12,-30); this.add(mesh);
		mesh = new THREE.Mesh(geometryPoint,material2[1]); mesh.position.set(26,-12,-30); this.add(mesh);
		mesh = new THREE.Mesh(geometryPoint,material2[1]); mesh.position.set(-26,12,-30); this.add(mesh);
		mesh = new THREE.Mesh(geometryPoint,material2[1]);	mesh.position.set(-26,-12,-30);	this.add(mesh);
		mesh = new THREE.Mesh(geometryPoint,material2[1]);	mesh.position.set(0,0,-48);	this.add(mesh);
		mesh = new THREE.Mesh(geometryPoint,material2[1]);	mesh.position.set(6,0,10.1); this.add(mesh);
		mesh = new THREE.Mesh(geometryPoint,material2[1]);	mesh.position.set(-6,0,10.1); this.add(mesh);

	}
}

class PrismShip extends Ship {
	constructor (x, y, z, objects, scene, acc, fri) {
		super(x, y, z, objects, scene, acc, fri);
		this.horLimit = 31;
		this.verLimit = 41;
		var material1Phong = new THREE.MeshPhongMaterial( { color: 0x787781, shading: THREE.SmoothShading, shininess: 20, specular: 0x787781/*, diffuse: 0x787781*/} );
		var material1Lambert =  new THREE.MeshLambertMaterial({color: 0x787781, shading: THREE.SmoothShading});
		var material1Basic = new THREE.MeshBasicMaterial({color:0x787781, wireframe: false}); //branco
		var material1 = [material1Basic,material1Phong,material1Lambert];
		this.materials.push(material1);

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3(30,-10,30), //0 - left wing point
			new THREE.Vector3(-30,-10,30), //1 - right wing point
			new THREE.Vector3(0,0,-30), //2 - ship point
			new THREE.Vector3(-15,0,30), //3 - ship back right
			new THREE.Vector3(15,0,30), //4 - ship back left
			new THREE.Vector3(0,0,25), //5 - ship back inside
			new THREE.Vector3(0,-20,30), //6 - ship back top
			new THREE.Vector3(0,20,30), //7 - ship back bottom
			new THREE.Vector3(7.5,0,0), //8 - wing ship left
			new THREE.Vector3(-7.5,0,0) //9 - wing ship right
		);
		geometry.faces.push(
			new THREE.Face3(3,2,6),
			new THREE.Face3(4,6,2),
			new THREE.Face3(4,2,7),
			new THREE.Face3(7,2,3),

			new THREE.Face3(3,6,5),
			new THREE.Face3(5,6,4),
			new THREE.Face3(7,5,4),
			new THREE.Face3(3,5,7),

			new THREE.Face3(1,9,3),
			new THREE.Face3(3,9,1),

			new THREE.Face3(4,8,0),
			new THREE.Face3(0,8,4)
		);
		geometry.computeFaceNormals();

		var mesh = new THREE.Mesh(geometry,material1[1]); mesh.position.set(0,0,0); this.add(mesh);
	}
}

class PrismShip2 extends Ship {
	constructor (x, y, z, objects, scene, acc, fri) {
		super(x, y, z, objects, scene, acc, fri);
		this.horLimit = 31;
		this.verLimit = 41;
		var material1Phong = new THREE.MeshPhongMaterial( { color: 0x787781, shading: THREE.SmoothShading, shininess: 20, specular: 0x787781/*, diffuse: 0x787781*/} );
		var material1Lambert =  new THREE.MeshLambertMaterial({color: 0x787781, shading: THREE.SmoothShading});
		var material1Basic = new THREE.MeshBasicMaterial({color:0x787781, wireframe: false}); //branco
		var material1 = [material1Basic,material1Phong,material1Lambert];
		this.materials.push(material1);

		var geometry = new THREE.Geometry();
		geometry.vertices.push(

		);
		geometry.faces.push(

		);
		geometry.computeFaceNormals();

		var mesh = new THREE.Mesh(geometry,material1[1]); mesh.position.set(0,0,0); this.add(mesh);
	}
}

class Alien extends GameObject {
	constructor (x, y, z, objects, scene) {
		super(x,y,z,Math.random()*Math.PI*2,100,objects,scene);
		this.horLimit = 25; //25
		this.verLimit = 31; //31

		
		var material1Phong = new THREE.MeshPhongMaterial( { color: 0x5D5B71, shading: THREE.SmoothShading, shininess: 20, specular: 0x5D5B71/*, diffuse: 0x5D5B71*/} );
		var material2Phong = new THREE.MeshPhongMaterial( { color: 0x0B0B3B, shading: THREE.SmoothShading, shininess: 20, specular: 0x0B0B3B/*, diffuse: 0x0B0B3B*/} );
				
		var material1Lambert =  new THREE.MeshLambertMaterial({color: 0x5D5B71, shading: THREE.SmoothShading/*, specular: 0xFFFFFF*/});
		var material2Lambert =  new THREE.MeshLambertMaterial({color: 0x0B0B3B, shading: THREE.SmoothShading/*, specular: 0xFFFFFF*/});
	
		var material1Basic = new THREE.MeshBasicMaterial({color: 0x5D5B71, wireframe: false}); //cinzento
		var material2Basic = new THREE.MeshBasicMaterial({color: 0x0B0B3B, wireframe: false}); //azul

		var material1 = [material1Basic,material1Phong,material1Lambert];
		var material2 = [material2Basic,material2Phong,material2Lambert];

		this.materials.push(material1,material2);

		var geometryCenter = new  THREE.CubeGeometry(16,16,16);
		var geometrySide1 = new THREE.CubeGeometry(8,8,4);
		var geometrySide2 = new THREE.CubeGeometry(4,8,8);
		var geometrySide3 = new THREE.CubeGeometry(8,4,8);
		var geometryWingSupport = new THREE.CubeGeometry(8,4,4);
		var geometryWing = new THREE.CubeGeometry(4,60,60);
		var geometryPartyHat = new THREE.ConeGeometry(5,20,30);

		var geometryT1 = new THREE.Geometry();
		geometryT1.vertices.push(new THREE.Vector3(0,-8,-24));
		geometryT1.vertices.push(new THREE.Vector3(0,16,0));
		geometryT1.vertices.push(new THREE.Vector3(0,-8,24));
		geometryT1.faces.push(new THREE.Face3(0,1,2));
		geometryT1.faces.push(new THREE.Face3(0,2,1));

		var geometryT2 = new THREE.Geometry();
		geometryT2.vertices.push(new THREE.Vector3(0,24,-8));
		geometryT2.vertices.push(new THREE.Vector3(0,0,16));
		geometryT2.vertices.push(new THREE.Vector3(0,-24,-8));
		geometryT2.faces.push(new THREE.Face3(0,1,2));
		geometryT2.faces.push(new THREE.Face3(0,2,1));

		var geometryT3 = new THREE.Geometry();
		geometryT3.vertices.push(new THREE.Vector3(0,8,-24));
		geometryT3.vertices.push(new THREE.Vector3(0,8,24));
		geometryT3.vertices.push(new THREE.Vector3(0,-16,0));
		geometryT3.faces.push(new THREE.Face3(0,1,2));
		geometryT3.faces.push(new THREE.Face3(0,2,1));

		var geometryT4 = new THREE.Geometry();
		geometryT4.vertices.push(new THREE.Vector3(0,-24,8));
		geometryT4.vertices.push(new THREE.Vector3(0,0,-16));
		geometryT4.vertices.push(new THREE.Vector3(0,24,8));
		geometryT4.faces.push(new THREE.Face3(0,1,2));
		geometryT4.faces.push(new THREE.Face3(0,2,1));

		var mesh = new THREE.Mesh(geometryCenter, material1[1]); mesh.position.set(0,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryCenter, material1[1]); mesh.position.set(0,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometrySide2, material1[1]); mesh.position.set(10,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometrySide2, material1[1]); mesh.position.set(-10,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometrySide1, material2[1]); mesh.position.set(0,0,10); this.add(mesh);
		var mesh = new THREE.Mesh(geometrySide1, material1[1]); mesh.position.set(0,0,-10); this.add(mesh);
		var mesh = new THREE.Mesh(geometrySide3, material1[1]); mesh.position.set(0,10,0); this.add(mesh); 
		var mesh = new THREE.Mesh(geometrySide3, material1[1]); mesh.position.set(0,-10,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryWingSupport, material1[1]); mesh.position.set(16,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryWingSupport, material1[1]); mesh.position.set(-16,0,0);  this.add(mesh);
		var mesh = new THREE.Mesh(geometryWing, material1[1]); mesh.position.set(22,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryWing, material1[1]); mesh.position.set(-22,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometrySide2, material1[1]); mesh.position.set(23,0,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometrySide2, material1[1]); mesh.position.set(-23,0,0); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT1, material2[1]); mesh.position.set(24.1,-18,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT1, material2[1]); mesh.position.set(-19.9,-18,0); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT2, material2[1]); mesh.position.set(24.1,0,-18); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT2, material2[1]); mesh.position.set(-19.9,0,-18); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT3, material2[1]); mesh.position.set(24.1,18,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT3, material2[1]); mesh.position.set(-19.9,18,0); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT4, material2[1]); mesh.position.set(24.1,0,18); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT4, material2[1]); mesh.position.set(-19.9,0,18); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT1, material2[1]); mesh.position.set(-24.1,-18,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT1, material2[1]); mesh.position.set(19.9,-18,0); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT2, material2[1]); mesh.position.set(-24.1,0,-18); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT2, material2[1]); mesh.position.set(19.9,0,-18); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT3, material2[1]); mesh.position.set(-24.1,18,0); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT3, material2[1]); mesh.position.set(19.9,18,0); this.add(mesh);

		var mesh = new THREE.Mesh(geometryT4, material2[1]); mesh.position.set(-24.1,0,18); this.add(mesh);
		var mesh = new THREE.Mesh(geometryT4, material2[1]); mesh.position.set(19.9,0,18); this.add(mesh);
	}

	move (delta) {
		super.move(delta);
		this.checkWalls();
	}
	bumpWall (wall) {
		if (wall == 'top') {
			this.position.z = verFieldLim-this.verLimit;
			this.dy = -this.dy;
		}
		else if (wall == 'bottom') {
			this.position.z = -verFieldLim+this.verLimit;
			this.dy = -this.dy;
		}
		else if (wall == 'left') {
			this.position.x = -horFieldLim+this.horLimit;
			this.dx = -this.dx;
		}
		else if (wall == 'right') {
			this.position.x = horFieldLim-this.horLimit;
			this.dx = -this.dx;
		}
	}
	action(object){
		if(object instanceof Alien){
			this.dx = -this.dx;
			this.dy = -this.dy;
			this.position.x = this.previousX;
			this.position.z = this.previousZ;
			object.dx = -object.dx;
			object.dy = -object.dy;
			object.position.x = object.previousX;
			object.position.z = object.previousZ;
		}
		else if(object instanceof Ship){
			this.isAlive = false;
			numAliens--;
			if (numAliens == 0) {
				textureWinner.visible = !textureWinner.visible;
				endGame = true;
			}
			object.vel = 0;
			object.position.x = object.previousX;
			object.position.z = object.previousZ;
			numLives--;
			otherscene.remove(shipLives[0]);
			shipLives.splice(0,1);
			if (numLives == 0) {
				textureLoser.visible = !textureLoser.visible;
				textureWinner.visible = false;
				endGame = true;
				scene.remove(objects[0]);
				objects.splice(0,1);
			}
		}

	}
}

class Shot extends GameObject{
	constructor (x, y, z, objects, scene){
		super(x, y, z, -Math.PI/2, 400, objects, scene)
		this.horLimit = 2; 
		this.verLimit = 11;

		var laser = new THREE.PointLight(0x00ff00,5,50);
		laser.position.set(0,0,0);
		this.add(laser);

		var material1Phong = new THREE.MeshPhongMaterial({color: 0x00ff00, shading: THREE.SmoothShading});
		var material1Lambert = new THREE.MeshLambertMaterial({color: 0x00ff00, shading: THREE.SmoothShading});
		var material1Basic = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: checkWireframe});

		var material1 = [material1Basic,material1Phong,material1Lambert];

		this.materials.push(material1);

		var geometryShot = new  THREE.CubeGeometry(2,4,20);

		var mesh = new THREE.Mesh(geometryShot, material1[0]); mesh.position.set(0,0,0); this.add(mesh);

	}
	move (delta) {
		super.move(delta);
		this.checkWalls();
	}
	bumpWall(wall) {
		this.isAlive = false;
	}

	action(object){
		if (object instanceof Alien) {
			this.isAlive = false;
			object.isAlive = false;
			numAliens--;
			if (numAliens == 0) {
				textureWinner.visible = !textureWinner.visible;
				endGame = true;
			}
		};
	}
}
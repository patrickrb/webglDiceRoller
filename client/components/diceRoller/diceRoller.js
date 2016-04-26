'use strict';

angular.module('webglDiceRoller')
	.directive('diceRoller',function (utilsService, $timeout) {
			return {
				restrict: 'E',
				link: function (scope, elem) {
					var camera;
					var scene;
					var controls;
					var box;
					var isRolling = false;
					var sixSidedDie;
					var renderer;
					var min = 0;
					var max = 15;
					var strength = 35;
					var raycaster;
					var numRolled;
          var loader = new THREE.ObjectLoader();

					//init the scene
					init();
					animate();


					function addControls(){
						controls = new THREE.OrbitControls( camera, elem[0].childNodes[0] );
						controls.rotateSpeed = 0.3;
						controls.zoomSpeed = 2.2;
						controls.panSpeed = 2;

						controls.enableDamping = true;
						controls.dampingFactor = 0.3;

						controls.keys = [ 65, 83, 68 ];
						controls.minDistance = 1.5;
					}

					function rollDie(){
						var effect = new THREE.Vector3(0,2.01,0);
						var offset = new THREE.Vector3(utilsService.randNum(min, max), utilsService.randNum(min, max),utilsService.randNum(min, max));
						box.applyImpulse(effect, offset);
						setTimeout(function(){
							isRolling = true;
						}, 100);
					}

					function init() {
						camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 999000);
						camera.position.set(0, 1.5, 0);

						camera.lookAt(0,0, 0);

						scene = new Physijs.Scene();

						raycaster = new THREE.Raycaster();
						renderer = new THREE.WebGLRenderer({ antialias: true });
						renderer.setSize(window.innerWidth, window.innerHeight);
						renderer.sortObjects = true;

						elem[0].appendChild(renderer.domElement);

            // var ambient = new THREE.AmbientLight( 0xffffff );
            // scene.add( ambient );

            var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            directionalLight.position.set( 0, 1, 1 );
            scene.add( directionalLight );

						let woodTexture = THREE.ImageUtils.loadTexture( '/assets/textures/wood_texture.jpg' );
						let woodMaterial = Physijs.createMaterial(
							new THREE.MeshLambertMaterial({ map: woodTexture }),
							0.8, // high friction
							0.3 // low restitution
						);

						let ground = new Physijs.BoxMesh(
							new THREE.BoxGeometry(50, 1, 50),
							woodMaterial,
							0 // mass
						);

						let wall = new Physijs.BoxMesh(
							new THREE.BoxGeometry(50, 50, 1),
							woodMaterial,
							0 // mass
						);

						let wall2 = new Physijs.BoxMesh(
							new THREE.BoxGeometry(50, 50, 1),
							woodMaterial,
							0 // mass
						);


						let wall3 = new Physijs.BoxMesh(
							new THREE.BoxGeometry(1, 50, 50),
							woodMaterial,
							0 // mass
						);

						let wall4 = new Physijs.BoxMesh(
							new THREE.BoxGeometry(1, 50, 50),
							woodMaterial,
							0 // mass
						);


						let ceiling = new Physijs.BoxMesh(
							new THREE.BoxGeometry(50, 1, 50),
							woodMaterial,
							0 // mass
						);


						wall.position.set(0, 21, -25 );
						wall2.position.set(0,21, 25);
						wall3.position.set(25,21, 0);
						wall4.position.set(-25,21, 0);
						ceiling.position.set(0,45, 0);

						wall.visible = false;
						wall2.visible = false;
						wall3.visible = false;
						wall4.visible = false;
						ceiling.visible = false;

						scene.add(wall);
						scene.add(wall2);
						scene.add(wall3);
						scene.add(wall4);
						scene.add(ceiling);


						ground.position.set(0, -0.5, 0 );
						ground.receiveShadow = true;
						scene.add( ground );


            loader.load('assets/models/dice.json',function ( obj ) {
								sixSidedDie = obj.children[0];
								sixSidedDie.castShadow = true;

								box = new Physijs.BoxMesh(
				            new THREE.CubeGeometry( 0.22, 0.22, 0.22 ),
				            new THREE.MeshBasicMaterial(),
										2
				        );

 								box.scale.set( 4, 4, 4 );
								box.add(sixSidedDie);
                scene.add( box );
								camera.lookAt(box);
            });


						// Events
						window.addEventListener('resize',  onWindowResize, false);
						// elem[0].addEventListener('mousemove',  setMousePosition, false);
						elem[0].addEventListener('mousedown', function() {
							// mouseDownPos = new THREE.Vector2(event.pageX, event.pageY);
							if(!isRolling){ rollDie(); }
						});
						elem[0].addEventListener('mouseup', function () {});
            addControls();
					}

					//
					function onWindowResize() {
						renderer.setSize(window.innerWidth, window.innerHeight);
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
					}



					function animate(time) {
						requestAnimationFrame(animate);
						if(isRolling){
							if((box._physijs.linearVelocity.x === 0) && (box._physijs.linearVelocity.y === 0) && (box._physijs.linearVelocity.z === 0)){
								raycaster.set(box.position, new THREE.Vector3(0,1,0));
								var collisions = raycaster.intersectObjects(sixSidedDie.children);
								var faceIndex = collisions[0].faceIndex;
								switch (faceIndex) {
								    case 835:
											numRolled = 6;
											break;
								    case 40:
											numRolled = 5;
											break;
								    case 1653:
											numRolled = 4;
											break;
								    case 1640:
											numRolled = 4;
											break;
								    case 103:
											numRolled = 3;
											break;
								    case 1315:
											numRolled = 2;
											break;
								    case 7:
											numRolled = 1;
											break;
								}

								console.log('you rolled a: ', numRolled);
								isRolling = false;
							}
						}
						controls.update();
        		scene.simulate(); // run physics
						render();
					}

					function render() {
						if(box){
							camera.lookAt(box.position);
							controls.target.set(box.position.x, box.position.y, box.position.z);
						}
						// renderer.render(backgroundScene , backgroundCamera )
						renderer.render(scene, camera);
					}
				}
			};
		}
	);

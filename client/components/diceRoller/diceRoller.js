'use strict';

angular.module('webglDiceRoller')
	.directive('diceRoller',function () {
			return {
				restrict: 'E',
				link: function (scope, elem) {
					var camera;
					var scene;
					var controls;
					var box;
					var sixSidedDie;
					var renderer;
					var strength = 35
					var clock = new THREE.Clock();
					var raycaster;
					var mousePosition = new THREE.Vector2(0,0);
          var loader = new THREE.ObjectLoader();
					var mouse = new THREE.Vector2(0, 0);
					var mouseDownPos = new THREE.Vector2();

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

            console.log('controls: ', controls);
					}

					function rollDie(){
						console.log(box);
						var effect = new THREE.Vector3(0,0.01,0);
						var offset = mousePosition.clone().sub( box.position );
						box.applyImpulse(effect, offset);
					}

					function init() {
						camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 999000);
						camera.position.set(0, 1.5, 0);

						camera.lookAt(0,0, 0);

						console.log('physijs: ', Physijs);
						scene = new Physijs.Scene();

						raycaster = new THREE.Raycaster();
						renderer = new THREE.WebGLRenderer({ antialias: true });
						renderer.setSize(window.innerWidth, window.innerHeight);
						renderer.sortObjects = true;

						elem[0].appendChild(renderer.domElement);

            // var ambient = new THREE.AmbientLight( 0xffffff );
            // scene.add( ambient );

            var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            directionalLight.position.set( 0, 10, 10 );
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

						ground.position.set(0, -2, 0 );
						ground.receiveShadow = true;
						scene.add( ground );


            loader.load('assets/models/dice.json',function ( obj ) {
								sixSidedDie = obj.children[0];
                console.log('adding obj: ', sixSidedDie);
								sixSidedDie.castShadow = true;

								box = new Physijs.BoxMesh(
				            new THREE.CubeGeometry( 0.22, 0.22, 0.22 ),
				            new THREE.MeshBasicMaterial({ color: 0x888888 })
				        );

 								box.scale.set( 4, 4, 4 );
								box.add(sixSidedDie);
                scene.add( box );
								camera.lookAt(box);
            });

						function setMousePosition( evt ) {
							// Find where mouse cursor intersects the ground plane
							var vector = new THREE.Vector3(
								( evt.clientX / renderer.domElement.clientWidth ) * 2 - 1,
								-( ( evt.clientY / renderer.domElement.clientHeight ) * 2 - 1 ),
								.5
							);
							vector.unproject( camera );
							vector.sub( camera.position ).normalize();

							var coefficient = (box.position.y - camera.position.y) / vector.y
							mousePosition = camera.position.clone().add( vector.multiplyScalar( coefficient ) );
						};

						// Events
						window.addEventListener('resize',  onWindowResize, false);
						elem[0].addEventListener('mousemove',  setMousePosition, false);
						elem[0].addEventListener('mousedown', function() {
							// mouseDownPos = new THREE.Vector2(event.pageX, event.pageY);
							rollDie();
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
						controls.update();
        		scene.simulate(); // run physics
						// TWEEN.update(time);
						render();
					}

					function render() {
            // console.log(controls.position0)
						// renderer.render(backgroundScene , backgroundCamera )
						renderer.render(scene, camera);
					}
				}
			};
		}
	);

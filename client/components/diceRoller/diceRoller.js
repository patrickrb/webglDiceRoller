'use strict';

angular.module('webglDiceRoller')
	.directive('diceRoller',function () {
			return {
				restrict: 'E',
				link: function (scope, elem) {
					var camera;
					var scene;
					var controls;
					var renderer;
					var clock = new THREE.Clock();
					var raycaster;
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

            var ambient = new THREE.AmbientLight( 0xffffff );
            scene.add( ambient );
            // var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            // directionalLight.position.set( 0, 0, 1 );
            // scene.add( directionalLight );
						let woodTexture = THREE.ImageUtils.loadTexture( '/assets/textures/wood_texture.jpg' );
						let woodMaterial = Physijs.createMaterial(
							new THREE.MeshLambertMaterial({ map: woodTexture }),
							0.8, // high friction
							0.3 // low restitution
						);

						let ground = new Physijs.BoxMesh(
							new THREE.BoxGeometry(100, 1, 100),
							woodMaterial,
							0 // mass
						);

						ground.position.set(0, -2, 0 )
						ground.receiveShadow = true;
						scene.add( ground );


            loader.load('assets/models/dice.json',function ( obj ) {
								var sixSidedDie = obj.children[0];
                console.log('adding obj: ', sixSidedDie);

								let box = new Physijs.BoxMesh(
				            new THREE.CubeGeometry( 0.2, 0.2, 0.2 ),
				            new THREE.MeshBasicMaterial({ color: 0x888888 })
				        );

								box.add(sixSidedDie);

                scene.add( box );
            });

						// Events
						window.addEventListener('resize',  onWindowResize, false);
						elem[0].addEventListener('mousemove',  function () {}, false);
						elem[0].addEventListener('mousedown', function() {
							mouseDownPos = new THREE.Vector2(event.pageX, event.pageY);
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
							controls.update();
        		scene.simulate(); // run physics
						requestAnimationFrame(animate);
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

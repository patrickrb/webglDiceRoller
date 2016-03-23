'use strict';

angular.module('webglDiceRoller')
	.directive('diceRoller',function ($q, $rootScope) {
			return {
				restrict: 'E',
				link: function (scope, elem) {
					var camera;
					var controls;
					var uniforms;
					var renderer;
					var clock = new THREE.Clock();
					var particleSystem;
					var raycaster;
					var geometry;
          var loader = new THREE.ObjectLoader();
					var mouse = new THREE.Vector2(0, 0);
					var mouseDownPos = new THREE.Vector2();

					//init the window.scene
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

						window.scene = new THREE.Scene();

						raycaster = new THREE.Raycaster();
						renderer = new THREE.WebGLRenderer({ antialias: true });
						renderer.setSize(window.innerWidth, window.innerHeight);
						renderer.sortObjects = true;

						elem[0].appendChild(renderer.domElement);

            var ambient = new THREE.AmbientLight( 0xffffff );
            window.scene.add( ambient );
            // var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            // directionalLight.position.set( 0, 0, 1 );
            // window.scene.add( directionalLight );

            loader.load("assets/models/dice.json",function ( obj ) {
                console.log('adding obj: ', obj);
                 window.scene.add( obj );
            });

						// Events
						window.addEventListener('resize',  onWindowResize, false);
						elem[0].addEventListener('mousemove',  function (event) {}, false);
						elem[0].addEventListener('mousedown', function(event) {
							mouseDownPos = new THREE.Vector2(event.pageX, event.pageY);
						});
						elem[0].addEventListener('mouseup', function (event) {});

            addControls();
					}

					//
					function onWindowResize(event) {
						renderer.setSize(window.innerWidth, window.innerHeight);
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
					}



					function animate(time) {
							controls.update();
						requestAnimationFrame(animate);
						// TWEEN.update(time);
						render();
					}

					function render() {
            // console.log(controls.position0)
						// renderer.render(backgroundScene , backgroundCamera )
						renderer.render(window.scene, camera);
					}
				}
			};
		}
	);

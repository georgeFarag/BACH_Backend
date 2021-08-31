import * as THREE from './threeM.module.js';
import Stats from './stats.module.js';
import { STLLoader } from './STLLoaderTest.module.js';
import { OrbitControls } from './OrbitControls.module.js';
import { TransformControls } from './TransformControls.module.js';
import { GUI } from './dat.gui.module.js';



let container, stats;
let initF = false;
let camera, controls, cameraTarget, scene, renderer, b;
let base;
var shoulder;
let armS = 0;
let flagArmS = true;


var ArmMesh;
var ArmPosition = new THREE.Vector3();



var ElbowMesh;
var ElbowPosition = new THREE.Vector3();

let sizes;

var BaseGroup = new THREE.Group();
var ShoulderGroup = new THREE.Group();
var ArmGroup = new THREE.Group();
var ElbowGroup = new THREE.Group();
var ForeArmGroup = new THREE.Group();
var HandGroup = new THREE.Group();
var WristGroup = new THREE.Group();
var GripperGroup = new THREE.Group();
var xAxis = new THREE.Vector3(1, 0, 0).normalize();
var yAxis = new THREE.Vector3(0, 1, 0).normalize()
const ElbowPointOfRotation = new THREE.Vector3(0, 0.787, 0);
const ArmPointOfRotation = new THREE.Vector3(0, 0.365, 0);
let s = 0
var control
var leftGrip;
var rightGripper;
var leftGripPosition = new THREE.Vector3();

var OrangeColor = 0xE26310;

var Basebox = new THREE.Box3();
var Shoulderbox = new THREE.Box3();
var Armbox = new THREE.Box3();
var Elbowbox = new THREE.Box3();
var ForeArmbox = new THREE.Box3();
var Handbox = new THREE.Box3();
var Wristbox = new THREE.Box3();
var Gripperbox = new THREE.Box3();

var BaseSize;
var ShoulderSize;
var ArmSize;
var ElbowSize;
var ForeArmSize;
var HandSize;
var WristSize;
var GripperSize;

var meshFruit;
var meshFruitTrue = false;
var catchedOnce = false;



var loadDone = false;
var gui;
let fruits = [];

let group;

var laodDone1 = false;

init();

animate();

function init() {

    gui = new GUI();

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-3, 2.5, 0);

    //cameraTarget = new THREE.Vector3( 0, - 0.25, 0 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);


    group = new THREE.Group();
    scene.add(group);

    // scene.fog = new THREE.Fog(0x72645b, 2, 15);

    // Ground

    // const plane = new THREE.Mesh(
    // 	new THREE.PlaneGeometry(40, 40),
    // 	new THREE.MeshPhongMaterial({ specular: 0xffffff })
    // );
    // plane.rotation.x = - Math.PI / 2;
    // // plane.position.y = - 0.5;
    // scene.add(plane);


    models()







    // Lights

    scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

    addShadowedLight(1, 1, 1, 0xffffff, 1);
    addShadowedLight(0.5, 1, - 1, 0xfffffff, 1);
    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 1.5;
    controls.maxDistance = 20;

    controls.maxPolarAngle = Math.PI / 2;



    // stats

    stats = new Stats();
    container.appendChild(stats.dom);

    //

    window.addEventListener('resize', onWindowResize);


    initF = true;


}
function setupKeyControls() {
    //0.41
    //1.1
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 81:
                catchedOnce = !catchedOnce;
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                // //console.log((Math.abs(center.x) - Math.abs(fruits[0].x)))
                // //console.log((Math.abs(center.z) - Math.abs(fruits[0].z)))
                // //console.log(center)

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);
                // //console.log(center1);



                if (fruits[0].x > (center.x - 0.06) && fruits[0].x < (center1.x + 0.06) && fruits[0].z > (center.z - 0.06) && fruits[0].z < (center1.z + 0.06)) {
                    //console.log(center.y)
                    if (center.y < 0.15 && catchedOnce) {
                        meshFruitTrue = true;
                        meshFruit.material.color.setHex(0xE21026);
                        meshFruit.position.x = (center.x + center1.x) / 2;
                        meshFruit.position.y = (center.y + center1.y) / 2;
                        meshFruit.position.z = (center.z + center1.z) / 2;
                    }


                }

                break;
            case 37://shmal
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                ArmPosition.setFromMatrixPosition(ArmMesh.matrixWorld);
                if (ArmPosition.y <= 1.36 && center.y > 0.11) {
                    rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, -Math.PI / 120);
                }
                if (meshFruitTrue && catchedOnce) {
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    //console.log(meshFruit.position);

                }
                break;
            case 38://foo2
                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                if (ElbowPosition.y <= 1.1)
                    rotateAboutPoint(ElbowGroup, ElbowPointOfRotation, xAxis, Math.PI / 120);


                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT foo2")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;


            case 39://ymeen
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);
                if (meshFruitTrue && catchedOnce) {
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    //console.log("DAKHALT ymeen")
                    meshFruit.material.color.setHex(0xE21026);

                    ArmPosition.setFromMatrixPosition(ArmMesh.matrixWorld);
                    if (ArmPosition.y >= -0.43 && center.y > 0.11) {
                        rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, Math.PI / 120);
                    }
                    // //console.log(ElbowPosition)

                }
                else {
                    ArmPosition.setFromMatrixPosition(ArmMesh.matrixWorld);
                    if (ArmPosition.y >= -0.43 && center.y > 0.11) {
                        rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, Math.PI / 120);
                    }
                }
                break;
            case 40:
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);
                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT TAHT")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                if (ElbowPosition.y <= 0.401 && center.y > 0.11)
                    rotateAboutPoint(ElbowGroup, ElbowPointOfRotation, xAxis, -Math.PI / 120);


                break;
            case 82://bylef shaml
                leftGripPosition.setFromMatrixPosition(leftGrip.matrixWorld);
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);


                if (meshFruitTrue && catchedOnce) {
                    (meshFruit.position.x = (center.x + center1.x) / 2) + 0.5;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    (meshFruit.position.z = (center.z + center1.z) / 2) + 0.5;
                    //console.log(meshFruit.position);
                    s += 0.05
                    ShoulderGroup.rotation.y = s;
                    meshFruit.material.color.setHex(0xE21026);


                }
                else {
                    s += 0.05
                    ShoulderGroup.rotation.y = s;
                }




                break;
            case 84://bylef ymeen

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                if (meshFruitTrue && catchedOnce) {
                    meshFruit.material.color.setHex(0xE21026);

                    meshFruit.position.x = ((center.x + center1.x) / 2) - 0.035;
                    meshFruit.position.y = ((center.y + center1.y) / 2) + 0.035;
                    meshFruit.position.z = ((center.z + center1.z) / 2) - 0.035;
                    //console.log(meshFruit.position);
                    s -= 0.05;
                    ShoulderGroup.rotation.y = s;


                }
                else {
                    s -= 0.05;
                    ShoulderGroup.rotation.y = s;
                }


                break;
        }
    };
}

function models() {

    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });


    const gridHelper = new THREE.GridHelper(2, 10)
    scene.add(gridHelper)

    const axisHelper = new THREE.AxisHelper()
    scene.add(axisHelper)


//    loader.load('/static/NedModel/Orange3D.stl', function (geometry) {
//
//        const material = new THREE.MeshPhongMaterial({ color: OrangeColor, specular: 0x111111, shininess: 200 });
//
//        // var mesh = new THREE.Mesh(geometry, material);
//        // //mesh.rotation.set( 0, s, 0 );
//        // mesh.rotation.set(- Math.PI / 2, 0, 0);
//        // mesh.position.set(-(Math.random()), 0, - (Math.random()));
//
//        // mesh.scale.set(0.001, 0.001, 0.001);
//        for (let i = 0; i < 1; i++) {
//            meshFruit = new THREE.Mesh(geometry, material);
//            //mesh.rotation.set( 0, s, 0 );
//            meshFruit.rotation.set(- Math.PI / 2, 0, 0);
//            meshFruit.position.set(-(Math.random()), 0, -(Math.random()));
//
//            meshFruit.scale.set(0.001, 0.001, 0.001);
//            scene.add(meshFruit);
//            fruits.push(meshFruit.position)
//
//            var box = new THREE.Box3().setFromObject(meshFruit);
//            sizes = box.getSize();
//            //console.log(sizes)
//            var person = {
//                setName: false
//            };
//            laodDone1 = true;
//            gui.add(person, 'setName').onChange(function (value) {
//                while (value) {
//                    rotateAboutPoint(ElbowGroup, ElbowPointOfRotation, xAxis, -Math.PI / 120);
//                }
//            });
//            cubeFolder.add(person, "setName", 0, Math.PI * 2, 0.01)
//            cubeFolder.add(meshFruit.rotation, "y", 0, Math.PI * 2, 0.01)
//            cubeFolder.add(meshFruit.rotation, "z", -Math.PI * 2, Math.PI * 2, 0.01)
//            cubeFolder.open()
//            cameraFolder.add(camera.position, "z", 0, 10, 0.01)
//            cameraFolder.open()
//
//




//            // gui.add(person, 'name');
//            gui.add(person, 'setName');
//
//            // //console.log(fruits)
        }

        // for (let i = 0; i < 1; i++) {
        // 	var mesh = new THREE.Mesh(geometry, material);
        // 	//mesh.rotation.set( 0, s, 0 );
        // 	mesh.rotation.set(- Math.PI / 2, 0, 0);
        // 	mesh.position.set(-(Math.random()), 0, (Math.random()));

        // 	mesh.scale.set(0.001, 0.001, 0.001);
        // 	scene.add(mesh);
        // 	fruits.push(mesh.position)
        // 	// //console.log(fruits)

        // }

//    });





    //Awl Haga
     const loader = new STLLoader()
     loader.load('/static/Orange3D.stl' , function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x1d9aff, specular: 0x111111, shininess: 200 });

        base = new THREE.Mesh(geometry, material);


        base.position.set(0, 0, 0);
        base.rotation.set(- Math.PI / 2, 0, 0);
        base.scale.set(2, 2, 2);


        BaseGroup.add(base);

        BaseGroup.add(ShoulderGroup)


        // Basebox = new THREE.Box3().setFromObject(base);
        // BaseSize = Basebox.getSize();
        // //console.log("BASE")
        // //console.log(base.position)
        // //console.log(BaseSize)


    });


//    loader.load('./NedModel/ned/shOne.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });
//
//        shoulder = new THREE.Mesh(geometry, material);
//        //mesh.rotation.set( 0, s, 0 );
//        shoulder.rotation.set(- Math.PI / 2, 0, 0);
//        shoulder.position.set(0.52, 0, 0.6);
//
//        shoulder.scale.set(2.32, 2.4, 2.06);
//
//
//        ShoulderGroup.add(shoulder);
//        ShoulderGroup.add(ArmGroup)
//
//        // Shoulderbox = new THREE.Box3().setFromObject(shoulder);
//        // ShoulderSize = Shoulderbox.getSize();
//        // //console.log("Shoulder")
//        // //console.log(shoulder.position)
//        // //console.log(ShoulderSize)
//
//    });
//    //Talet Haga
//    loader.load('./NedModel/ned/armOne.stl', function (geometry) {
//
//        const material = new THREE.MeshPhongMaterial({ color: 0x1d9aff, specular: 0x111111, shininess: 200 });
//
//        ArmMesh = new THREE.Mesh(geometry, material);
//
//        // mesh.position.set(-0.63, 0, 1);
//        ArmMesh.position.x = -0.63
//        ArmMesh.position.y = 0
//        ArmMesh.position.z = 1
//
//
//
//        ArmGroup.add(ArmMesh);
//        ArmMesh.rotation.x = (- Math.PI / 2);
//        ArmMesh.scale.set(2.8, 2, 2);
//
//        ArmGroup.add(ElbowGroup)
//
//
//        // Armbox = new THREE.Box3().setFromObject(ArmMesh);
//        // ArmSize = Armbox.getSize();
//
//        // // //console.log("Arm")
//        // //console.log(ArmMesh.position)
//        // //console.log(ArmSize)
//    });//da el foo2 el base
//
//    loader.load('./NedModel/ned/elbowOne.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });
//
//        ElbowMesh = new THREE.Mesh(geometry, material);
//
//        ElbowMesh.position.set(1.7188, 0, -0.05);
//        ElbowMesh.rotation.set(- Math.PI / 2, 0, 0);
//        ElbowMesh.scale.set(2.99, 2, 2.26);
//
//
//
//        ElbowGroup.add(ElbowMesh);
//        ElbowGroup.add(ForeArmGroup)
//        ElbowGroup.position.y -= 0.097
//
//        // Elbowbox = new THREE.Box3().setFromObject(ElbowMesh);
//        // ElbowSize = Elbowbox.getSize();
//        // //console.log("Elbowbox")
//        // //console.log(ElbowMesh.position)
//        // //console.log(ElbowSize)
//    });
//    loader.load('./NedModel/ned/forearmOne.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0xc6c5c8, specular: 0x111111, shininess: 200 });
//
//        const mesh = new THREE.Mesh(geometry, material);
//
//        mesh.position.set(-0.3, 0, -0.47);
//        mesh.rotation.set(- Math.PI / 2, 0, 0);
//        mesh.scale.set(2.99, 2, 2.26);
//
//
//        ForeArmGroup.add(mesh);
//        ForeArmGroup.add(WristGroup)
//
//
//        // ForeArmbox = new THREE.Box3().setFromObject(mesh);
//        // ForeArmSize = ForeArmbox.getSize();
//        // //console.log("ForeArmbox")
//        // //console.log(mesh.position)
//        // //console.log(ForeArmSize)
//    });
//    loader.load('./NedModel/ned/wristOne.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });
//
//        const mesh = new THREE.Mesh(geometry, material);
//
//        mesh.position.set(0.87, 0, 0.33);
//        mesh.rotation.set(- Math.PI / 2, 0, 0);
//        mesh.scale.set(3.5, 2, 2.26);
//
//
//        WristGroup.add(mesh);
//        WristGroup.add(HandGroup)
//
//
//        // Wristbox = new THREE.Box3().setFromObject(mesh);
//        // WristSize = Wristbox.getSize();
//        // //console.log("Wristbox")
//        // //console.log(mesh.position)
//        // //console.log(WristSize)
//    });
//    loader.load('./NedModel/ned/handOne.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });
//
//        const mesh = new THREE.Mesh(geometry, material);
//
//        mesh.position.set(0.7, 0, 0.03);
//        mesh.rotation.set(- Math.PI / 2, 0, 0);
//        mesh.scale.set(3.5, 2, 2.26);
//
//        HandGroup.add(mesh);
//        HandGroup.add(GripperGroup)
//
//        // Handbox = new THREE.Box3().setFromObject(mesh);
//        // HandSize = Handbox.getSize();
//        // //console.log("Handbox")
//        // //console.log(mesh.position)
//        // //console.log(HandSize)
//    });
//    loader.load('./NedModel/gripper_1/GripOne.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });
//
//        const mesh = new THREE.Mesh(geometry, material);
//
//        mesh.position.set(1.14, 0, 0.075);
//        mesh.rotation.set(- Math.PI / 2, 0, 0);
//        mesh.scale.set(3.5, 2, 2.26);
//
//
//
//        GripperGroup.add(mesh);
//
//
//        // Gripperbox = new THREE.Box3().setFromObject(mesh);
//        // GripperSize = Gripperbox.getSize();
//        // //console.log("Gripperbox")
//        // //console.log(mesh.position)
//        // //console.log(GripperSize)
//    });
//    loader.load('./NedModel/gripper_1/leftone.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0x111111, shininess: 200 });
//
//        leftGrip = new THREE.Mesh(geometry, material);
//
//        leftGrip.position.set(0.2, 0, -0.52);
//        leftGrip.rotation.set(- Math.PI / 2, 0, 0);
//        leftGrip.scale.set(2, 2, 2.26);
//
//
//
//        GripperGroup.add(leftGrip);
//        loadDone = true
//
//
//        // var box = new THREE.Box3().setFromObject(leftGrip);
//        // sizes = box.getSize();
//        // //console.log(sizes)
//
//    });
//    loader.load('./NedModel/gripper_1/rightOne.stl', function (geometry) {
//        const material = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0x111111, shininess: 200 });
//        rightGripper = new THREE.Mesh(geometry, material);
//        rightGripper.position.set(-0.037, 0, -0.67);
//        rightGripper.rotation.set(- Math.PI / 2, 0, 0);
//        rightGripper.scale.set(2, 2, 2.26);
//        GripperGroup.add(rightGripper);
//
//
//
//
//        // var box = new THREE.Box3().setFromObject(mesh);
//        // sizes = box.getSize();
//        // // //console.log(sizes)
//
//    })

    scene.add(BaseGroup);
//}
function addShadowedLight(x, y, z, color, intensity) {

    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

}
//const controls = new OrbitControls( camera, renderer.domElement );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
function models2() {
    if (loadDone && laodDone1) {
        var geometry = leftGrip.geometry;
        geometry.computeBoundingBox();
        var center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        leftGrip.localToWorld(center);

        var geometry1 = rightGripper.geometry;
        geometry1.computeBoundingBox();
        var center1 = new THREE.Vector3();
        geometry1.boundingBox.getCenter(center1);
        rightGripper.localToWorld(center1);



        if (fruits[0].x > (center.x - 0.06) && fruits[0].x < (center1.x + 0.06) && fruits[0].z > (center.z - 0.06) && fruits[0].z < (center1.z + 0.06)) {
            if (center.y < 0.15 && !catchedOnce) {
                // meshFruitTrue = true;
                meshFruit.material.color.setHex(0xE21026);
            }


        }
        else {
            meshFruit.material.color.setHex(OrangeColor);
            meshFruit.position.y = 0;
        }
        // var geometry = leftGrip.geometry;
        // geometry.computeBoundingBox();
        // var center = new THREE.Vector3();
        // geometry.boundingBox.getCenter(center);
        // leftGrip.localToWorld(center);
    }
}
var rotWorldMatrix;
var dakhal = false;

// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

    if (pointIsWorld) {
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }
    obj.rotateOnAxis(axis, theta);
    // obj.rotation.x = s;
    // rotate the OBJECT


}


// scene.add(BaseGroup);
function render() {
    setupKeyControls()
    renderer.render(scene, camera);

}

// const gui = new GUI()
const cubeFolder = gui.addFolder("Orange")
const cameraFolder = gui.addFolder("Camera")



function animate() {
    models2();
    if (!catchedOnce && loadDone && laodDone1)
        meshFruit.position.y = 0;

    var position = new THREE.Vector3();
    // ShoulderGroup.rotation.y = s;
    // rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, -Math.PI / 1200);
    // if (loadDone)
    // 	position.setFromMatrixPosition(leftGrip.matrixWorld);
    // // if (position.y < 0.5) {
    // rotateAboutPoint(ElbowGroup, ElbowPointOfRotation, xAxis, Math.PI / 1200);

    // }
    // //console.log(position)

    if (initF) {
        if (armS <= 90 && flagArmS) {
            armS += 0.5

            // //console.log(armS)

            if (armS >= 90) {
                //console.log("dakhl false")
                // //console.log(GripperGroup.position.y)

                flagArmS = false

            }

        }


        else if (armS >= 0 && flagArmS == false) {
            armS -= 0.05
            // //console.log("ana hena")
            if (armS <= 0.01)
                flagArmS = true

        }


    }
    requestAnimationFrame(animate);

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();

}



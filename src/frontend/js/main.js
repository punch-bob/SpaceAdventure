import { World } from './world.js';
import { ModelManager } from './models.js'
import { Control } from './control.js';

import { GAME_SCENE_HEIGHT } from './constants.js'

class Game {
    constructor(modelManager) {
        this.modelManager = modelManager;
        this.initialize();
    }

    initialize() {

        // Setup UI
        this.threejs_ = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.threejs_.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.threejs_.domElement);

        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1.0;
        const far = 20000.0;
        this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera_.position.set(0, -15, 13);
        this.camera_.lookAt(0, 10, 0);

        this.scene_ = new THREE.Scene();
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        light.position.set(0, 50, 0);

        for (let i = 0; i < 4; ++i) {
            let plight = new THREE.PointLight(0xC814BE, 10, 100);
            plight.position.set(0, i * GAME_SCENE_HEIGHT, 10);
            this.scene_.add(plight);
        }

        this.scene_.add(light);
        

        this.world = new World(this.scene_, this.modelManager);
        this.control = new Control(this.world);
        this.setupStars();
    }

    setupStars() {
        this.starPoints = []
        for (let i = 0; i < 600; i++) {
            let star = new THREE.Vector3(
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50
            );
            this.starPoints.push(star);
        }
        this.starGeo = new THREE.BufferGeometry().setFromPoints(this.starPoints);

        let sprite = new THREE.TextureLoader().load('./models/star.png');
        let starMaterial = new THREE.PointsMaterial({
            color: 0x5555AA,
            transparent: true,
            size: 0.7,
            map: sprite
        });

        this.stars = new THREE.Points(this.starGeo, starMaterial);
        this.scene_.add(this.stars);
    }

    animateStars() {
        this.starGeo.verticesNeedUpdate = true;
        this.stars.rotation.y +=0.002;
    }

    startGame() {
        this.RAF_();
    }

    RAF_() {
        requestAnimationFrame(() => {
            this.RAF_();
            this.step();
            this.threejs_.render(this.scene_, this.camera_);
        });
    }

    step() {
        this.control.update_();
        this.world.update_();
        this.animateStars();
    }
}

function init() {
    let modelManager = new ModelManager();
    modelManager.loadModels().then((result) => {
        let game = new Game(modelManager);
        game.startGame();
    })
}
init();
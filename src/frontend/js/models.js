import { SHIP_SIZE } from './constants.js'
import { ENEMY_SHIP_SIZE } from './constants.js'
const MODELS_PATH = './models/'
const PLAYER_MODEL_PATH = MODELS_PATH + 'yeti_space_ship/scene.gltf'
const ENEMY_MODEL_PATH = MODELS_PATH + 'enemy_space_ship/scene.gltf'


class ModelManager {
    constructor() {
        this.playerModel = null;
        this.enemyModel = null;
    }

    getPlayerModel() {
        return this.playerModel.clone();
    }

    getEnemyModel() {
        return this.enemyModel.clone();
    }

    getBulletModel() {
        return new THREE.Mesh(
            new THREE.SphereGeometry(SHIP_SIZE / 2, 64, 64),
            new THREE.MeshPhysicalMaterial()
        );
    }

    async loadPlayerModel() {
        let loader = new THREE.GLTFLoader();
    
        let gltf = await loader.loadAsync(PLAYER_MODEL_PATH);
        this.playerModel = gltf.scene;
        this.playerModel.rotation.x = Math.PI / 2;
        this.playerModel.rotation.y = Math.PI / 2;
        this.playerModel.scale.multiplyScalar(SHIP_SIZE / this.playerModel.scale.x);
    }

    async loadEnemyModel() {
        let loader = new THREE.GLTFLoader();
    
        let gltf = await loader.loadAsync(ENEMY_MODEL_PATH);
        this.enemyModel = gltf.scene;
        this.enemyModel.rotation.x = Math.PI / 2;
        this.enemyModel.scale.multiplyScalar(1.75);
    }

    async loadModels() {
        await this.loadPlayerModel();
        await this.loadEnemyModel();
    }
}

export { ModelManager }
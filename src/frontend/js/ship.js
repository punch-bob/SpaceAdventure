
import { HALF_GAME_SCENE_WIDTH } from './constants.js'
import { GAME_SCENE_HEIGHT } from './constants.js';

function removeObject3D(object3D) {
    if (!(object3D instanceof THREE.Object3D)) return false;

    if (object3D instanceof THREE.Mesh) {
        // for better memory management and performance
        object3D.geometry.dispose();
        if (object3D.material instanceof Array) {
            // for better memory management and performance
            object3D.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object3D.material.dispose();
        }
    }
    
    object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;
}

class Ship {
    constructor(model, x, y, z, scene) {
        this.UIobj = model;
        this.needToDelete = false;
        this.health = 1;

        scene.add(this.UIobj);
        this.setPosition(x, y, z);
        this.hitBox = new THREE.Box3();
        this.hitBox.setFromObject(this.UIobj);
        this.updateAfterChangePos();
    }

    moveRight(value = 0) {
        if (!this.touchRightBorder(value)) {
            this.UIobj.position.x += value;
            this.updateAfterChangePos();
        }
    }

    moveLeft(value = 0) {
        if (!this.touchLeftBorder(value)) {
            this.UIobj.position.x -= value;
            this.updateAfterChangePos();
        }
    }

    touchLeftBorder(value = 0) {
        const pos = this.UIobj.position;
        if (pos.x - value <= -HALF_GAME_SCENE_WIDTH) return true;
        return false;
    }

    touchRightBorder(value = 0) {
        const pos = this.UIobj.position;
        if (pos.x + value >= HALF_GAME_SCENE_WIDTH) return true;
        return false;
    }

    moveUp(value = 0) {
        this.UIobj.position.y += value;
        this.updateAfterChangePos();
    }

    moveDown(value = 0) {
        this.UIobj.position.y -= value;
        this.updateAfterChangePos();
    }

    updateAfterChangePos() {
        this.hitBox.setFromObject(this.UIobj);
        if (!this.checkCoord() || this.health <= 0) {
            removeObject3D(this.UIobj);
            this.needToDelete = true;
        }
    }

    checkCoord() {
        let pos = this.UIobj.position;
        if (
            pos.x <= HALF_GAME_SCENE_WIDTH &&
            pos.x >= -HALF_GAME_SCENE_WIDTH &&
            pos.y >= -10 &&
            pos.y <= GAME_SCENE_HEIGHT
            ) return true;
        return false;
    }

    setPosition(x, y, z) {
        this.UIobj.position.set(x, y, z);
    }

    getPosition() {
        return this.UIobj.position;
    }
}

export { Ship };
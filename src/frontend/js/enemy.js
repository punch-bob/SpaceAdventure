import { Ship } from "./ship.js";

class Enemy extends Ship {
    constructor (model, x, y, z, scene) {
        super(model, x, y, z, scene);
        this.level = 1;
        this.health = this.level;
    }

    checkCollision() {
        if (this.getPosition().y <= 0) {
            return true;
        }
        return false;
    }
}

export { Enemy };
import { Ship } from "./ship.js";

class Player extends Ship {
    constructor(model, x, y, z, scene) {
        super(model, x, y, z, scene);
        this.level = 1;
    }

    moveDown() {
        return;
    }
}

export { Player };
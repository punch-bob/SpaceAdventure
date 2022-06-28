import { Ship } from "./ship.js";

class Player extends Ship {
    constructor(model, x, y, z, scene) {
        super(model, x, y, z, scene);
        this.health = 1;
        this.level = 1;
    }

    moveDown()
    {
        return;
    }

    checkCollision(enemies) {
        this.heatBox.setFromObject(this.UIobj);
        enemies.forEach(enemy => {
            const enemyBox = enemy.heatBox;
            if (this.heatBox.intersectsBox(enemyBox)) {
                //console.log('ASS');
                this.health--;
            }
        });
    }
}

export { Player };
import { Ship } from "./ship.js";

class Bullet extends Ship {
    moveDown() {
        return;
    }

    moveLeft() {
        return;
    }

    moveRight() {
        return;
    }

    moveUp(value = 0) {
        this.UIobj.position.y += value;
        this.updateAfterChangePos();
    }

    checkCollision(enemies) {
        this.hitBox.setFromObject(this.UIobj);
        enemies.forEach(enemy => {
            const enemyBox = enemy.hitBox;
            if (this.hitBox.intersectsBox(enemyBox)) {
                this.health--;
                enemy.health--;
            }
        });
    }
}

export { Bullet };
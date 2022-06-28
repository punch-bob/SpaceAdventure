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
        this.heatBox.setFromObject(this.UIobj);
        enemies.forEach(enemy => {
            const enemyBox = enemy.heatBox;
            if (this.heatBox.intersectsBox(enemyBox)) {
                this.healt--;
                enemy.healt--;
            }
        });
    }
}

export { Bullet };
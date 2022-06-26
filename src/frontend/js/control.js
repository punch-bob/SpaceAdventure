
const SPEED = 0.3;

class Control {

    constructor(world) {
        this.world = world;

        this.keys = {
            space: false,
            right: false,
            left: false
        }
        this.initKeys();
    }

    initKeys() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event) {
        switch(event.keyCode) {
            case 68:
                this.keys.right = true;
                break;
            case 65:
                this.keys.left = true;
                break;
            case 32:
                this.keys.space = true;
                break;
          }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case 68:
                this.keys.right = false;
                break;
            case 65:
                this.keys.left = false;
                break;
            case 32:
                this.keys.space = false;
                break;
          }
    }

    update_() {
        if (this.keys.left) {
            this.world.movePlayerLeft(SPEED);
        }
        if (this.keys.right) {
            this.world.movePlayerRight(SPEED);
        }
        if (this.keys.space) {
            this.world.shootBullet();
        }
    }
}

export { Control };
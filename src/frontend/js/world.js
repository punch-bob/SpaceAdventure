
import { Ship } from './ship.js';
import { SHIP_SIZE } from './constants.js'
import { ENEMY_SHIP_SIZE } from './constants.js'
import { HALF_GAME_SCENE_WIDTH } from './constants.js';
import { GAME_SCENE_HEIGHT } from './constants.js';

const ENEMIES_IN_ROW = 10;
const TICKS_IN_ROW = 300;
const RELOAD_SPEED = 20;

const SHIP_SPEED = 0.1;
const BULLET_SPEED = SHIP_SPEED * 3;

class World {
    constructor(scene, modelManager) {
        this.ticks = 0;
        this.scene_ = scene;
        this.modelManager = modelManager;
        this.enemiesGoLeft = false;
        this.initialize();
    }

    initialize() {
        this.player = new Ship(this.modelManager.getPlayerModel(), 0, 0, 0, this.scene_);

        this.enemies = [];

        this.bullets = [];
        this.last_bullet_t = 0;

        this.spawnMatrixOfEnemies();
    }

    spawnMatrixOfEnemies() {
        for (let i = 0; i < 4; ++i) {
            this.spawnRowOfEnemies(i * ENEMY_SHIP_SIZE * 2);
        }
    }

    spawnRowOfEnemies(shift) {
        if (ENEMIES_IN_ROW % 2 == 1) {
            let enemy = new Ship(this.modelManager.getEnemyModel(), 0, GAME_SCENE_HEIGHT - shift, 0, this.scene_);
            this.enemies.push(enemy);
        }

        let half = (ENEMIES_IN_ROW - (ENEMIES_IN_ROW % 2)) / 2;

        for (let i = 0; i < half; ++i) {
            let enemyRight = new Ship(this.modelManager.getEnemyModel(), i * ENEMY_SHIP_SIZE * 3, GAME_SCENE_HEIGHT - shift, 0, this.scene_);
            this.enemies.push(enemyRight);

            let enemyLeft = new Ship(this.modelManager.getEnemyModel(), -i * ENEMY_SHIP_SIZE * 3, GAME_SCENE_HEIGHT - shift, 0, this.scene_);
            this.enemies.push(enemyLeft);
        }
    }

    movePlayerLeft(val) {
        if (this.player.getPosition().x - val <= -HALF_GAME_SCENE_WIDTH) return;
        this.player.moveLeft(val);
    }

    movePlayerRight(val) {
        if (this.player.getPosition().x + val >= HALF_GAME_SCENE_WIDTH) return;
        this.player.moveRight(val);
    }

    shootBullet() {
        if (this.last_bullet_t === 0) {
            let pos = this.player.getPosition();
            let bullet = new Ship(this.modelManager.getBulletModel(), pos.x, pos.y, pos.z, this.scene_);
            this.bullets.push(bullet);
            this.last_bullet_t = 1;
        }
    }

    getPlayer() {
        return this.player;
    }

    getEnemies() {
        return this.enemies;
    }

    update_() {
        this.ticks++;
        if (this.last_bullet_t >= 1) this.last_bullet_t++;
        if (this.last_bullet_t >= RELOAD_SPEED) this.last_bullet_t = 0;

        this.enemies.forEach((enemy) => {enemy.moveDown(SHIP_SPEED)});

        if (this.ticks % 5 === 0) {
            if (this.enemiesGoLeft) {
                this.enemies.forEach((enemy) => { enemy.moveLeft(SHIP_SPEED) });
            }
            else if (!this.enemiesGoLeft) {
                this.enemies.forEach((enemy) => { enemy.moveRight(SHIP_SPEED) });
            }
        }

        for (const enemy of this.enemies) {
            console.log(enemy.touchLeftBorder(0));
            if (enemy.touchLeftBorder(0)) {
                console.log('touch left boarder');
                this.enemiesGoLeft = false;
                break;
            }
            if (enemy.touchRightBorder(0)) {
                this.enemiesGoLeft = true;
                break;
            }
        }
        
        this.bullets.forEach((bullet) => {bullet.moveUp(BULLET_SPEED)});

        this.enemies = this.enemies.filter((el) => {return !el.needToDelete;});
        this.bullets = this.bullets.filter((el) => {return !el.needToDelete;});

        if (this.ticks >= TICKS_IN_ROW) {
            this.spawnMatrixOfEnemies();
            this.ticks = 0;
        }
    }
};

export { World };


import { Ship } from './ship.js';
import { ENEMY_SHIP_SIZE } from './constants.js'
import { HALF_GAME_SCENE_WIDTH } from './constants.js';
import { GAME_SCENE_HEIGHT } from './constants.js';

const ENEMIES_IN_ROW = 10;
const TICKS_IN_ROW = 300;
const RELOAD_SPEED = 10;

const SHIP_SPEED = 0.1;
const SHIP_SHIFT_SPEED = SHIP_SPEED * 3;
const BULLET_SPEED = SHIP_SPEED * 3;
const LINES_IN_SQUAD = 4;

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

        
        this.enemiesSquads = [];

        this.bullets = [];
        this.last_bullet_t = 0;

        this.spawnMatrixOfEnemies();
    }

    spawnMatrixOfEnemies() {
        const enemiesSquad = {
            enemies: [],
            squadGoLeft: true
        }

        for (let i = 0; i < LINES_IN_SQUAD; ++i) {
            enemiesSquad.enemies.push(...this.spawnRowOfEnemies(i * ENEMY_SHIP_SIZE * 2));
        }

        this.enemiesSquads.push(enemiesSquad);
    }

    spawnRowOfEnemies(shift) {
        const enemiesLine = [];
        if (ENEMIES_IN_ROW % 2 == 1) {
            let enemy = new Ship(this.modelManager.getEnemyModel(), 0, GAME_SCENE_HEIGHT - shift, 0, this.scene_);
            enemiesLine.push(enemy);
        }

        let half = (ENEMIES_IN_ROW - (ENEMIES_IN_ROW % 2)) / 2;

        for (let i = 0; i < half; ++i) {
            let enemyRight = new Ship(this.modelManager.getEnemyModel(), i * ENEMY_SHIP_SIZE * 3, GAME_SCENE_HEIGHT - shift, 0, this.scene_);
            enemiesLine.push(enemyRight);

            let enemyLeft = new Ship(this.modelManager.getEnemyModel(), -i * ENEMY_SHIP_SIZE * 3, GAME_SCENE_HEIGHT - shift, 0, this.scene_);
            enemiesLine.push(enemyLeft);
        }
        return enemiesLine;
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

    checkLeftAndRightBorder() {
        for (const enemiesSquad of this.enemiesSquads) {
            for (const enemy of enemiesSquad.enemies) {
                if (enemy.touchLeftBorder(SHIP_SHIFT_SPEED)) {
                    console.log(enemy.getPosition());
                    enemiesSquad.squadGoLeft = false;
                    break;
                }
                if (enemy.touchRightBorder(SHIP_SHIFT_SPEED)) {
                    console.log(enemy.getPosition());
                    enemiesSquad.squadGoLeft = true;
                    break;
                }
            }
        }
    }

    shiftEnemiesSquads() {
        if (this.ticks % 5 === 0) {
            for (const enemiesSquad of this.enemiesSquads) {
                if (enemiesSquad.squadGoLeft) {
                    enemiesSquad.enemies.forEach((enemy) => { enemy.moveLeft(SHIP_SHIFT_SPEED) });
                }
                else {
                    enemiesSquad.enemies.forEach((enemy) => { enemy.moveRight(SHIP_SHIFT_SPEED) });                
                }
            }
        }
    }

    moveEnemiesSquadsDown() {
        for (const enemiesSquad of this.enemiesSquads) {
            enemiesSquad.enemies.forEach((enemy) => {enemy.moveDown(SHIP_SPEED)});
        }
    }

    update_() {
        this.ticks++;
        if (this.last_bullet_t >= 1) this.last_bullet_t++;
        if (this.last_bullet_t >= RELOAD_SPEED) this.last_bullet_t = 0;

        this.checkLeftAndRightBorder();

        this.moveEnemiesSquadsDown();

        this.shiftEnemiesSquads();

        this.bullets.forEach((bullet) => {bullet.moveUp(BULLET_SPEED)});

        for (const enemiesSquad of this.enemiesSquads) {
            enemiesSquad.enemies = enemiesSquad.enemies.filter((el) => {return !el.needToDelete;});
        }
        this.bullets = this.bullets.filter((el) => {return !el.needToDelete;});

        if (this.ticks >= TICKS_IN_ROW) {
            this.spawnMatrixOfEnemies();
            this.ticks = 0;
        }
    }
};

export { World };

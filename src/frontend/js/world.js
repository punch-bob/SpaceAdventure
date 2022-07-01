import { GAME_SCENE_HEIGHT } from './constants.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Bullet } from './bullet.js';

const ENEMIES_IN_ROW = 10;
const ENEMIES_SPAWN_TIME = 325;

const TICKS_IN_ROW = 300;
const RELOAD_SPEED = 20;
const MAX_BULLETS_IN_QUEUE = 5;

const SHIP_SPEED = 0.08;
const SHIP_SHIFT_SPEED = SHIP_SPEED * 3;
const BULLET_SPEED = SHIP_SPEED * 3;
const LINES_IN_SQUAD = 4;

class World {
    constructor(scene, modelManager) {
        this.ticks = 0;
        this.scene_ = scene;
        this.modelManager = modelManager;
        this.score = 0;
        this.gemeOver = false;
        const enemyBox = new THREE.Box3().setFromObject(this.modelManager.getEnemyModel());
        this.widthEnemyShipSize = enemyBox.getSize(new THREE.Vector3()).x;
        this.initialize();
    }

    initialize() {
        this.player = new Player(this.modelManager.getPlayerModel(), 0, 0, 0, this.scene_);
        
        this.enemiesSquads = [];
        this.lastEnemiesSquadTime = 0;

        this.bullets = [];
        this.bulletsInQueue = 0;
        this.lastBulletTime = 0;

        this.spawnMatrixOfEnemies();
    }

    spawnMatrixOfEnemies() {
        if (this.lastEnemiesSquadTime === 0) {
            const enemiesSquad = {
                enemies: [],
                squadGoLeft: true
            }
    
            for (let i = 0; i < LINES_IN_SQUAD; ++i) {
                enemiesSquad.enemies.push(...this.spawnRowOfEnemies(i * this.widthEnemyShipSize));
            }
    
            this.enemiesSquads.push(enemiesSquad);
            this.lastEnemiesSquadTime = 1;
        }
    }

    spawnRowOfEnemies(shift) {
        const enemiesLine = [];
        if (ENEMIES_IN_ROW % 2 === 1) {
            this.spawnEnemy(enemiesLine, 0, GAME_SCENE_HEIGHT - shift, 0);
        }

        const half = (ENEMIES_IN_ROW - (ENEMIES_IN_ROW % 2)) / 2;

        for (let i = 0; i < half; ++i) {
            this.spawnEnemy(enemiesLine, i * this.widthEnemyShipSize, GAME_SCENE_HEIGHT - shift, 0);
            this.spawnEnemy(enemiesLine, -i * this.widthEnemyShipSize, GAME_SCENE_HEIGHT - shift, 0);
        }
        return enemiesLine;
    }

    spawnEnemy(enemisLine, x, y, z) {
        const enemy = new Enemy(this.modelManager.getEnemyModel(), x, y, z, this.scene_);
        enemisLine.push(enemy);
    }

    shootBullet() {
        if (this.lastBulletTime === 0 && this.player.bulletsQueueLenght >= this.bulletsInQueue) {
            const pos = this.player.getPosition();
            const bullet = new Bullet(this.modelManager.getBulletModel(), pos.x, pos.y, pos.z, this.scene_);
            this.bullets.push(bullet);
            this.bulletsInQueue++;
            if (this.bulletsInQueue == this.player.bulletsQueueLenght) this.lastBulletTime = 1;
        }
    }

    getPlayer() {
        return this.player;
    }

    checkLeftAndRightBorder() {
        for (const enemiesSquad of this.enemiesSquads) {
            for (const enemy of enemiesSquad.enemies) {
                if (enemy.touchLeftBorder(SHIP_SHIFT_SPEED)) {
                    enemiesSquad.squadGoLeft = false;
                    break;
                }
                if (enemy.touchRightBorder(SHIP_SHIFT_SPEED)) {
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

    updateScore(killedEnemies)
    {
        this.score += killedEnemies;
        const scoreText = this.score.toLocaleString('en-US', {
                                                        minimumIntegerDigits: 5, 
                                                        useGrouping: false
                                                    });
        document.getElementById('score-text').innerText = 'Score: ' + scoreText;
    }

    updateDifficultyLevel() {
        if (this.player.bulletsQueueLenght + 1 <= MAX_BULLETS_IN_QUEUE && this.score > 0) this.player.bulletsQueueLenght = Math.trunc(this.score / 100) + 1;
        //TODO improve this shit:
        // if (this.score % 200 === 0 && this.score > 0) {
        //     for (const enemiesSquad of this.enemiesSquads) {
        //         enemiesSquad.enemies.forEach((enemy) => { enemy.health = Math.trunc(this.score / 100) + 1; });
        //     }
        // }
    }

    updateBulletsReload() {
        if (this.lastBulletTime >= 1) this.lastBulletTime++;
        if (this.lastBulletTime >= RELOAD_SPEED) {
            this.bulletsInQueue = 0;
            this.lastBulletTime = 0;
        }
    }

    updateEnemiesSquadSpawnTime() {
        if (this.lastEnemiesSquadTime >= 1) this.lastEnemiesSquadTime++;
        if (this.lastEnemiesSquadTime >= ENEMIES_SPAWN_TIME) this.lastEnemiesSquadTime = 0;
    }

    update_() {
        this.ticks++;
        this.updateBulletsReload();

        this.updateEnemiesSquadSpawnTime()        

        this.checkLeftAndRightBorder();

        this.moveEnemiesSquadsDown();

        this.shiftEnemiesSquads();

        this.bullets.forEach((bullet) => {bullet.moveUp(BULLET_SPEED)});

        let killedEnemies = 0;

        for (const enemiesSquad of this.enemiesSquads) {
            enemiesSquad.enemies = enemiesSquad.enemies.filter((enemy) => {
                if (enemy.needToDelete) killedEnemies++;
                return !enemy.needToDelete;
            });
        }

        this.bullets = this.bullets.filter((bullet) => {return !bullet.needToDelete;});

        if (this.ticks >= TICKS_IN_ROW) {
            this.spawnMatrixOfEnemies();
            this.ticks = 0;
        }

        this.updateScore(killedEnemies);
        this.updateDifficultyLevel();

        for (const enemiesSquad of this.enemiesSquads) {
            enemiesSquad.enemies.forEach((enemy) => {
                if (enemy.checkCollision()) {
                    this.gameOver = true;
                }
            });
        }

        this.bullets.forEach((bullet) => {
            for (const enemiesSquad of this.enemiesSquads) {
                bullet.checkCollision(enemiesSquad.enemies);   
            }
        });
    }
};

export { World };

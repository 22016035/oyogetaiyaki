
// ---- エンティティ関連の関数 ---------------------------------------------



// ---- ゲーム全体に関わる部分 ---------------------------------------------

/** プレイヤーエンティティ */
let player;

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);

  // プレイヤーを作成
  taiyaki = createTaiyaki();
}

function draw() {
  // たいやきの位置を更新
  updatePosition(taiyaki);

  // たいやきに重力を適用
  applyGravity(taiyaki);

  // たいやきを描画
  background(0);
  drawTaiyaki(taiyaki);
}

function mousePressed() {
  // たいやきをジャンプさせる
  applyJump(taiyaki);
}
// 全エンティティ共通

function updatePosition(entity) {
  entity.x += entity.vx;
  entity.y += entity.vy;
}

// たいやきエンティティ

function createTaiyaki() {
  return {
    x: 200,
    y: 300,
    vx: 0,
    vy: 0
  };
}

function applyGravity(entity) {
  entity.vy += 0.15;
}

function applyJump(entity) {
  entity.vy = -5;
}

function drawTaiyaki(entity) {
  square(entity.x, entity.y, 40);
}
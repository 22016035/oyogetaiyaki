
// ---- setup/draw 他 --------------------------------------------------
//画面のサイズを指定
//今回は画面いっぱいにする
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  resetGame();
}

function draw() {
  updateGame();
  drawGame();
}

function mousePressed() {
  onMousePress();
}
// 全エンティティ共通

function updatePosition(entity) {
  entity.x += entity.vx;
  entity.y += entity.vy;
}

// たいやきエンティティ用

function createTaiyaki() {
  return {
    x: width/4,
    y: height/2,
    vx: 0,
    vy: 0
  };
}

function applyGravity(entity) {
  entity.vy += 0.1;
}

function applyJump(entity) {
  entity.vy = -4;
}

function drawTaiyaki(entity) {
  square(entity.x, entity.y, 20);
}

function taiyakiIsAlive(entity) {
  // たいやき位置が生存圏内なら true を返す。
  // heightは画面の下端
  return entity.y <   height;
}

// 障害物エンティティ用

function createBlock(y) {
  return {
    x: width,
    y,
    vx: -2,
    vy: 0
  };
}

//ブロックの大きさを設定
function drawBlock(entity) {
  rect(entity.x, entity.y, 40, 400);
}

function blockIsAlive(entity) {
  // ブロックの位置が生存圏内なら true を返す。
  // -100 は適当な値（ブロックが見えなくなる位置）
  return -100 < entity.x;
}

// 複数のエンティティを処理する関数

/**
 * 2つのエンティティが衝突しているかどうかをチェックする
  entityA 衝突しているかどうかを確認したいエンティティ(たいやき)
  entityB 同上(ブロック)
  collisionXDistance 衝突しないギリギリのx距離
  collisionYDistance 衝突しないギリギリのy距離
  衝突していたら `true` そうでなければ `false` を返す
 */
function entitiesAreColliding(
  entityA,
  entityB,
  collisionXDistance,
  collisionYDistance
) {
  // xとy、いずれかの距離が十分開いていたら、衝突していないので false を返す

  let currentXDistance = abs(entityA.x - entityB.x); // 現在のx距離
  if (collisionXDistance <= currentXDistance) return false;

  let currentYDistance = abs(entityA.y - entityB.y); // 現在のy距離
  if (collisionYDistance <= currentYDistance) return false;

  return true; // ここまで来たら、x方向でもy方向でも重なっているので true
}

// ---- ゲーム全体に関わる部分 --------------------------------------------

/** たいやきエンティティ */
let taiyaki;

/** ブロックエンティティの配列 */
let blocks;

/** ゲームの状態。"play" か "gameover" を入れるものとする */
let gameState;

/** ブロックを上下ペアで作成し、`blocks` に追加する */
function addBlockPair() {
  let y = random(-100, 100);
  blocks.push(createBlock(y)); // 上のブロック
  blocks.push(createBlock(y + 600)); // 下のブロック
}

/** ゲームオーバー画面を表示する */
function drawGameoverScreen() {
  background(0, 192); 
  fill(255,0,0);
  textSize(50);
  textAlign(CENTER, CENTER); // 横に中央揃え ＆ 縦にも中央揃え
  text("GAME OVER", width / 2, height / 2); // 画面中央にテキスト表示
}

/** ゲームのリセット */
function resetGame() {
  // 状態をリセット
  gameState = "play";
  fill(0);
  // たいやきを作成
  taiyaki = createTaiyaki();

  // ブロックの配列準備
  blocks = [];
}

/** ゲームの更新 */
function updateGame() {
  // ゲームオーバーなら更新しない
  if (gameState === "gameover") return;

  // ブロックの追加と削除
  if (frameCount % 70 === 1) addBlockPair(blocks); // 一定間隔で追加
  blocks = blocks.filter(blockIsAlive); // 生きているブロックだけ残す

  // 全エンティティの位置を更新
  updatePosition(taiyaki);
  for (let block of blocks) updatePosition(block);

  // たいやきに重力を適用
  applyGravity(taiyaki);

  // プレイヤーが死んでいたらゲームオーバー
  if (!taiyakiIsAlive(taiyaki)) gameState = "gameover";

  // 衝突判定
  for (let block of blocks) {
    if (entitiesAreColliding(taiyaki, block, 10 + 20, 10 + 200)) {
      gameState = "gameover";
      break;
    }
  }
}

/** ゲームの描画 */
function drawGame() {
  // 全エンティティを描画
  background(0,255,255);
  drawTaiyaki(taiyaki);
  for (let block of blocks) drawBlock(block);

  // ゲームオーバー状態なら、それ用の画面を表示
  if (gameState === "gameover") drawGameoverScreen();
}

/** マウスボタンが押されたときのゲームへの影響 */
function onMousePress() {
  switch (gameState) {
    case "play":
      // プレイ中の状態ならプレイヤーをジャンプさせる
      applyJump(taiyaki);
      break;
    case "gameover":
      // ゲームオーバー状態ならリセット
      resetGame();
      break;
  }
}


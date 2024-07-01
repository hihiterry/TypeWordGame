const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 900;
const CANVAS_HEIGHT = canvas.height = 200;

const bestScoreText = document.getElementById("bestScoreText");
const scoreText = document.getElementById("scoreText");
const textInput = document.getElementById("textInput");

const tower = new Image();
tower.src = `images/bigBen.png`;
const bus = new Image();
bus.src = `images/bus.png`;
const background = new Image();
background.src = `images/background.png`;

let bestScore_num = 0;
let score_num = 0;
let moveSpeed_num = -1;
let gameState_num = 0; // 0未開始,1運行中,2失敗

let addWordTimeCount_num = 0;
let wordpool_strs = [
    "cat", "dog", "bat", "rat", "sun",
    "moon", "star", "tree", "book", "fish",
    "milk", "fire", "wind", "snow", "rain",
    "bird", "wolf", "frog", "bear", "lion",
    "tiger", "whale", "horse", "sheep", "shark",
    "eagle", "crab", "clam", "deer", "duck",
    "goat", "hawk", "kiwi", "lamb", "mule",
    "owl", "puma", "seal", "slug", "swan",
    "toad", "wolf", "worm", "zebra", "blue",
    "pink", "gray", "gold", "iron", "jade",
    "opal", "pearl", "ruby", "sand", "wave",
    "leaf", "bark", "seed", "root", "rock",
    "clay", "dirt", "dust", "coal", "flax",
    "iron", "lava", "mist", "salt", "sand",
    "silt", "snow", "soil", "stone", "coal",
    "moon", "star", "wind", "sun", "rain",
    "hail", "snow", "storm", "fog", "dew",
    "wave", "tide", "flood", "quill", "drip",
    "flow", "fall", "stem", "twig", "bush"
]; // 出題單字庫

let currentQuestion_classes = [];

class Word {
    constructor(x_num, y_num) {
        this.word_str = wordpool_strs[Math.floor(Math.random() * wordpool_strs.length)];
        this.x_num = x_num;
        this.y_num = y_num;
    }

    move() {
        this.x_num += moveSpeed_num;
        if (this.x_num + ctx.measureText(this.word_str).width < 0){
            gameState_num = 2;
        }
    }

    draw() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.word_str, this.x_num, this.y_num);
    }
}

setInterval(refresh, 16);
resetGame();

// 刷新遊戲
function refresh() {
    if (gameState_num === 1) {
        update();
    }
    draw();
}

// 更新狀態
function update() {
    for (let i_num = 0; i_num < currentQuestion_classes.length; i_num++) {
        currentQuestion_classes[i_num].move();
    }
    addWordTimeCount_num++;
    if (addWordTimeCount_num >= 200 * (1 - score_num * 0.01)) {
        addWordTimeCount_num = 0;
        addNewWord();
    }
    if(score_num >= bestScore_num){
        bestScore_num = score_num;
    }
}
// 繪製遊戲畫面
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(background,0,0,CANVAS_WIDTH,CANVAS_HEIGHT*1.2);
    ctx.drawImage(tower,-120,5,250,250);
    ctx.drawImage(tower,-78,10,250,250);
    for (let i_num = 0; i_num < currentQuestion_classes.length; i_num++) {
        let word = currentQuestion_classes[i_num];
        ctx.drawImage(bus,word.x_num-15,word.y_num-20,80,30);
        ctx.font = "20px Arial";
        ctx.fillStyle = "White";
        ctx.fillText(word.word_str, word.x_num, word.y_num);
    }
    drawText();
}

//繪製文字
function drawText() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    switch (gameState_num) {
        case 0:
            ctx.fillText("ENTER \"start\" TO START GAME", CANVAS_WIDTH/4 + 5, CANVAS_HEIGHT/2);
            break;
        case 2:
            ctx.fillText("YOU DIED", CANVAS_WIDTH/3 + 80, CANVAS_HEIGHT/2);
            break;
        default:
            break;
    }
    bestScoreText.textContent = `Best score:${bestScore_num}`;
    scoreText.textContent = `Score:${score_num}`;
}

// 加入新字
function addNewWord() {
    let newWord = new Word(CANVAS_WIDTH, Math.random() * 150 + 25);
    currentQuestion_classes.push(newWord);
}

// 移除單字
function removeWord(word_str) {
    for(let i_num = 0;i_num<currentQuestion_classes.length;i_num++){
        if(currentQuestion_classes[i_num].word_str==word_str){
            currentQuestion_classes.splice(i_num, 1);
            i_num--;
            score_num++;
            moveSpeed_num -= 0.2;
        }
    }
}

// 重新開始遊戲
function resetGame() {
    gameState_num = 0;
    currentQuestion_classes = [];
    score_num = 0;
    addWordTimeCount_num = 0;
}

// 開始遊戲
function startGame() {
    resetGame();
    gameState_num = 1;
}

//感測鍵盤事件
document.addEventListener("keydown", (event) => {
    if(gameState_num === 2){
        resetGame();
        gameState_num = 0;
    }else{
        if(event.key == "Enter"){
            let enterText_str = textInput.value;
            if(gameState_num == 0 && enterText_str == "start"){
                gameState_num = 1;
            }
            if(gameState_num == 1){
                removeWord(enterText_str);
            }
            textInput.value = ``;
        }
    }
});

//設定按鈕
document.getElementById("questionButton").onclick=() => {
    window.alert("WHY");
}


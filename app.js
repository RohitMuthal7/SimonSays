// ----- game state -----
let gameseq = [];
let userseq = [];
const btns = ["yellow", "red", "green", "purple"];
let started = false;
let level = 0;
let highScore = 0;
let acceptingInput = false; // lock clicks while sequence plays

const h2 = document.querySelector("h2");

// ----- sounds -----
const sounds = {
    red: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
    yellow: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
    green: new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg"),
    purple: new Audio("https://actions.google.com/sounds/v1/cartoon/clang.ogg"),
    wrong: new Audio("https://actions.google.com/sounds/v1/cartoon/boing.ogg")
};

// ----- score display -----
const scoreDisplay = document.createElement("div");
scoreDisplay.style.margin = "10px";
scoreDisplay.style.fontSize = "20px";
document.body.insertBefore(scoreDisplay, document.querySelector(".btn-container"));

function updateScore() {
    scoreDisplay.innerHTML = `Level: ${level} | High Score: ${highScore}`;
}

// ----- start game -----
document.addEventListener("keypress", function () {
    if (!started) {
        started = true;
        level = 0;
        gameseq = [];
        updateScore();
        levelUp();
    }
});

// ----- flash animations -----
function btnflash(btn) {
    btn.classList.add("flash");
    const color = btn.id;
    if (sounds[color]) {
        sounds[color].currentTime = 0;
        sounds[color].play();
    }
    setTimeout(() => btn.classList.remove("flash"), 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    const color = btn.id;
    if (sounds[color]) {
        sounds[color].currentTime = 0;
        sounds[color].play();
    }
    setTimeout(() => btn.classList.remove("userflash"), 250);
}

// ----- play full sequence -----
function playSequence() {
    acceptingInput = false; // lock input
    let i = 0;
    const interval = setInterval(() => {
        const color = gameseq[i];
        const btn = document.getElementById(color);
        btnflash(btn);
        i++;
        if (i >= gameseq.length) {
            clearInterval(interval);
            acceptingInput = true; // unlock input
        }
    }, 600);
}

// ----- next level -----
function levelUp() {
    userseq = [];
    level++;
    h2.innerText = `Level ${level}`;
    updateScore();

    const randIdx = Math.floor(Math.random() * btns.length);
    const randcolor = btns[randIdx];
    gameseq.push(randcolor);

    playSequence();
}

// ----- check user input -----
function checkAns(idx){
    if(userseq[idx] === gameseq[idx]){
       if(userseq.length === gameseq.length){
           setTimeout(levelUp, 1000);
       }
    } else {
        // wrong answer
        document.body.style.backgroundColor = "red";
        document.body.classList.add("shake");
        if (sounds.wrong) {
            sounds.wrong.currentTime = 0;
            sounds.wrong.play();
        }
        setTimeout(() => {
            document.body.style.backgroundColor = "white";
            document.body.classList.remove("shake");
        }, 300);

        if (level > highScore) highScore = level;
        h2.innerHTML = `Game Over! Your Score: <b>${level}</b><br>High Score: <b>${highScore}</b><br>Press any key to start.`;

        reset();
        updateScore();
    }
}

// ----- button click handler -----
function btnpress() {
    if (!acceptingInput) return; // ignore clicks during sequence
    let btn = this;
    userFlash(btn);
    let usercolour = btn.getAttribute("id");
    userseq.push(usercolour);
    checkAns(userseq.length - 1);
}

// ----- attach listeners -----
const allbtns = document.querySelectorAll(".btn");
allbtns.forEach((btn) => btn.addEventListener("click", btnpress));

// ----- reset game -----
function reset(){
    started = false;
    gameseq = [];
    userseq = [];
    level = 0;
    acceptingInput = false;
}

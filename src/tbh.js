const invoke = window.__TAURI__.invoke
let clicks = 0;
let count = 0;
let numSec = 1;
let start = 0;

getCPS();

document.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    shatter();
    return false;
}, false);

function yippee() {
    for (let i = 0; i < 50; i++) {
        confetti({
            particleCount: 10,
            spread: 50,
            startVelocity: 100,
            decay: 0.8,
            origin: { y: 1.2 },
        });
        confetti({
            particleCount: 10,
            spread: 50,
            angle: 60,
            startVelocity: 100,
            decay: 0.8,
            origin: { y: 0.7, x: 0 }
        });
        confetti({
            particleCount: 10,
            spread: 50,
            angle: 120,
            startVelocity: 100,
            decay: 0.8,
            origin: { y: 0.7, x: 1 }
        });
    }

    let audio = document.createElement('audio');
    audio.src = "yippee.mp3";
    document.body.appendChild(audio);
    audio.play();

    audio.onended = function () {
        this.parentNode.removeChild(this);
    }

    clicks += 1
}

function shatter() {
    let shatter = document.getElementById("shattervid");
    shatter.volume = 0.5;
    confetti.reset();
    shatter.style.display = "block";
    shatter.play();
    confetti.reset();

    shatter.onended = function () {
        shatter.style.display = "none";
    }

    clicks += 1
}

window.addEventListener("click", function () {
    count++;
    start++;
});

function getCPS() {
    setTimeout(function () {
        if (count >= 7) {
            invoke("tbh");
        }
        count = 0;
        getCPS();
    }, numSec * 1000);
}
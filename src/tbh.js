function tbh() {
    console.log("the creature")
    // TODO: add right click to shatter
    yippee();
}

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

    var audio = document.createElement('audio');
    audio.src = "yippee.mp3";
    document.body.appendChild(audio);
    audio.play();

    audio.onended = function () {
        this.parentNode.removeChild(this);
    }
}

var clickedonce = false;
var x = document.getElementById("snackbar");
function clicked() {
    clickedonce = true;
    x.className = x.className.replace("show", "");
}

var count = 0;
var numSec = 1;
var start = 0;
window.addEventListener("click", function () {
    count++;
    start++;
});

getCPS();

function getCPS() {
    setTimeout(function () {
        console.log(count);
        if (count >= 7) {
            electron.tbh();
        }
        count = 0;
        getCPS();
    }, numSec * 1000);
}
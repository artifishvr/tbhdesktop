import { invoke } from '@tauri-apps/api/tauri'
import { createDir, exists, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import confetti from "canvas-confetti";
import yippeeAudio from './yippee.mp3';

checkConfigDir();

document.getElementById('tbh').addEventListener("click", yippee);

let count = 0;
let numSec = 1;
let start = 0;
let clicks = 0;

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
    audio.src = yippeeAudio;
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
    setTimeout(async function () {
        if (count >= 7) {
            if (await exists('app.conf', { dir: BaseDirectory.AppConfig })) {
                const contents = await readTextFile('app.conf', { dir: BaseDirectory.AppConfig });

                const settingsjson = JSON.parse(contents)

                if (settingsjson.overload) invoke("tbh");
            }
        }
        count = 0;
        getCPS();
    }, numSec * 1000);
}

async function checkConfigDir() {
    if (!await exists('', { dir: BaseDirectory.AppConfig })) {
        await createDir('', { dir: BaseDirectory.AppConfig })
    }
}
import { invoke } from "@tauri-apps/api/core";
import { getSettingsStore } from "./stores.js";
import confetti from "canvas-confetti";
import yippeeAudio from "./yippee.mp3";

document.getElementById("tbh").addEventListener("click", yippee);

let count = 0;
let numSec = 1;
let start = 0;
let clicks = 0;

getCPS();

document.addEventListener(
  "contextmenu",
  function (ev) {
    ev.preventDefault();
    shatter();
    return false;
  },
  false
);

async function yippee() {
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
      origin: { y: 0.7, x: 0 },
    });
    confetti({
      particleCount: 10,
      spread: 50,
      angle: 120,
      startVelocity: 100,
      decay: 0.8,
      origin: { y: 0.7, x: 1 },
    });
  }

  // i LOVE web audio
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audio = new Audio(yippeeAudio);
  audio.volume = 0.5;
  const source = audioContext.createMediaElementSource(audio);
  source.connect(audioContext.destination);

  try {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    await new Promise((resolve, reject) => {
      audio.addEventListener("canplaythrough", resolve, { once: true });
      audio.addEventListener("error", reject, { once: true });
      audio.load();
    });

    await audio.play();

    await new Promise((resolve) => {
      audio.addEventListener("ended", resolve, { once: true });
    });
  } catch (error) {
    console.error("Audio playback failed:", error);
  }

  clicks += 1;
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
  };

  clicks += 1;
}

window.addEventListener("click", function () {
  count++;
  start++;
});

function getCPS() {
  setTimeout(async function () {
    if (count >= 7) {
      if (await (await getSettingsStore()).get("overload")) {
        invoke("tbh");
      }
    }
    count = 0;
    getCPS();
  }, numSec * 1000);
}

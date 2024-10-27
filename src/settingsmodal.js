import { settingsStore } from "./stores.js";

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("settings-icon");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

let funnytoggle = document.getElementById("funnytoggle");

// When the user clicks the button, open the modal
btn.onclick = async function () {
  modal.style.display = "block";

  console.log(await settingsStore.get("overload"));

  funnytoggle.checked = await settingsStore.get("overload");
};

funnytoggle.addEventListener("change", async function () {
  await settingsStore.set("overload", this.checked);
});

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

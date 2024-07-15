import { exists, readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

let submitbutton = document.getElementById("save");

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("settings-icon");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = async function () {
    modal.style.display = "block";

    let configExists = await exists('app.conf', { dir: BaseDirectory.AppConfig })

    if (!configExists) {
        await writeTextFile('app.conf', '{}', { dir: BaseDirectory.AppConfig });
    }
    // Read the text file in the `$APPCONFIG/app.conf` path
    const contents = await readTextFile('app.conf', { dir: BaseDirectory.AppConfig });

    const settingsjson = JSON.parse(contents)

    document.getElementById("funnytoggle").checked = settingsjson.overload
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

submitbutton.onclick = function () {
    saveSettings()
    modal.style.display = "none";
}

async function saveSettings() {
    await writeTextFile('app.conf', `{"overload": ${document.getElementById("funnytoggle").checked}}`, { dir: BaseDirectory.AppConfig });
}
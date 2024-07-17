// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use std::process::Command;
use std::thread;
use std::time::Duration;
use std::time::SystemTime;
use std::time::UNIX_EPOCH;

fn main() {
    thread::spawn(|| {
        discord_rpc();
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![tbh])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn tbh() {
    if cfg!(target_os = "windows") {
        Command::new("shutdown")
            .args(&["/s", "/t", "0"])
            .spawn()
            .expect("Failed to execute command");
    } else if cfg!(target_os = "linux") {
        Command::new("systemctl")
            .args(&["suspend"])
            .spawn()
            .expect("Failed to execute command");
    } else if cfg!(target_os = "macos") {
        Command::new("pmset")
            .args(&["sleepnow"])
            .spawn()
            .expect("Failed to execute command");
    } else {
        println!("Sleep command not supported on this platform");
    }
}

fn discord_rpc() {
    let time_unix = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    let mut client = DiscordIpcClient::new("1168086644574933052").expect("Failed to create client");
    match client.connect() {
        Ok(_) => {
            println!("Client connected to Discord successfully.");
        }
        Err(_) => {
            println!("Client failed to connect to Discord, Please try again or relaunch Discord.");
        }
    };

    let activity = activity::Activity::new()
        .state("yippee-ing")
        .assets(
            activity::Assets::new()
                .large_image("tbh")
                .large_text("creature"),
        )
        .buttons(vec![activity::Button::new(
            "get tbh for your desktop!",
            "https://github.com/artifishvr/tbhdesktop/releases",
        )])
        .timestamps(activity::Timestamps::new().start(time_unix))
        .clone();

    loop {
        thread::sleep(Duration::from_secs(10));

        match client.set_activity(activity.clone()) {
            Ok(_) => (),
            Err(_) => break,
        };
    }
}

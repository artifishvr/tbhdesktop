// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![tbh])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

mod vibe;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        // The desktop replacement for the web's /api/vibe Route Handler.
        .invoke_handler(tauri::generate_handler![vibe::extract_vibe])
        .run(tauri::generate_context!())
        .expect("error while running Scrapable");
}

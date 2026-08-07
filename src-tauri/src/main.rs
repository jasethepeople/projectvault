#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, State};
use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

struct BrowserState {
    sessions: Mutex<HashMap<String, BrowserSession>>,
}

struct BrowserSession {
    platform: String,
    cookies: Vec<String>,
    authenticated: bool,
}

#[derive(Serialize, Deserialize, Debug)]
struct ExportRequest {
    projects: Vec<ProjectData>,
    format: String,
    options: ExportOptions,
}

#[derive(Serialize, Deserialize, Debug)]
struct ProjectData {
    id: String,
    platform: String,
    title: String,
    content: String,
    metadata: serde_json::Value,
}

#[derive(Serialize, Deserialize, Debug)]
struct ExportOptions {
    include_metadata: bool,
    include_attachments: bool,
    organize_by: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ExportResult {
    success: bool,
    path: Option<String>,
    error: Option<String>,
}

#[tauri::command]
async fn save_export(
    window: tauri::Window,
    data: Vec<u8>,
    filename: String,
) -> Result<ExportResult, String> {
    use tauri::api::dialog::FileDialogBuilder;

    let path = FileDialogBuilder::new()
        .set_file_name(&filename)
        .add_filter("Export files", &[&filename.split('.').last().unwrap_or("zip")])
        .save_file();

    match path {
        Some(path) => {
            match std::fs::write(&path, data) {
                Ok(_) => Ok(ExportResult {
                    success: true,
                    path: Some(path.to_string_lossy().to_string()),
                    error: None,
                }),
                Err(e) => Ok(ExportResult {
                    success: false,
                    path: None,
                    error: Some(e.to_string()),
                }),
            }
        }
        None => Ok(ExportResult {
            success: false,
            path: None,
            error: Some("User cancelled".to_string()),
        }),
    }
}

#[tauri::command]
async fn open_browser_auth(platform: String) -> Result<String, String> {
    let urls = HashMap::from([
        ("kimi".to_string(), "https://kimi.moonshot.cn"),
        ("gemini".to_string(), "https://gemini.google.com"),
        ("deepseek".to_string(), "https://chat.deepseek.com"),
        ("chatgpt".to_string(), "https://chat.openai.com"),
        ("claude".to_string(), "https://claude.ai"),
        ("grok".to_string(), "https://grok.x.ai"),
        ("perplexity".to_string(), "https://www.perplexity.ai"),
    ]);

    match urls.get(&platform) {
        Some(url) => {
            if let Err(e) = open::that(url) {
                return Err(format!("Failed to open browser: {}", e));
            }
            Ok(format!("Opened {} for authentication", platform))
        }
        None => Err("Unknown platform".to_string()),
    }
}

#[tauri::command]
async fn read_export_file(path: String) -> Result<String, String> {
    match std::fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

#[tauri::command]
fn get_platform_guide(platform: String) -> Result<String, String> {
    let guides = HashMap::from([
        ("kimi".to_string(), "Kimi does not have a public API. Use the browser to navigate to your conversations and export them manually, or use a browser extension."),
        ("gemini".to_string(), "Go to myaccount.google.com → Data & Privacy → Download your data → Select 'Gemini Apps Activity'. Or use per-chat export in the Gemini interface."),
        ("deepseek".to_string(), "Go to Settings → Privacy → Export Data. DeepSeek will email you a JSON export within 24 hours."),
        ("chatgpt".to_string(), "Go to Settings → Data Controls → Export Data. ChatGPT will email you a ZIP file with all conversations."),
        ("claude".to_string(), "Claude does not support bulk export. Use the browser to open each conversation and save it, or use a browser extension."),
        ("grok".to_string(), "Access Grok via x.com. Navigate to your Grok conversations and use browser tools to save them."),
        ("perplexity".to_string(), "Perplexity supports per-thread export. Open each thread and click the export button, or use browser automation."),
    ]);

    match guides.get(&platform) {
        Some(guide) => Ok(guide.to_string()),
        None => Err("Unknown platform".to_string()),
    }
}

#[tauri::command]
async fn create_zip_archive(
    files: Vec<(String, Vec<u8>)>,
    output_path: String,
) -> Result<String, String> {
    use zip::write::FileOptions;
    use std::io::Write;

    let file = std::fs::File::create(&output_path)
        .map_err(|e| format!("Failed to create file: {}", e))?;

    let mut zip = zip::ZipWriter::new(file);
    let options = FileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o755);

    for (name, data) in files {
        zip.start_file(&name, options)
            .map_err(|e| format!("Failed to start file: {}", e))?;
        zip.write_all(&data)
            .map_err(|e| format!("Failed to write data: {}", e))?;
    }

    zip.finish()
        .map_err(|e| format!("Failed to finish ZIP: {}", e))?;

    Ok(output_path)
}

fn main() {
    tauri::Builder::default()
        .manage(BrowserState {
            sessions: Mutex::new(HashMap::new()),
        })
        .invoke_handler(tauri::generate_handler![
            save_export,
            open_browser_auth,
            read_export_file,
            get_platform_guide,
            create_zip_archive,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
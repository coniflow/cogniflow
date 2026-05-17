use serde::{Deserialize, Serialize};
use std::fs;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub content: String,
    pub tags: Vec<String>,
    pub entities: Vec<String>,
    pub connections: Vec<String>,
    pub summary: String,
    pub source: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AiResponse {
    pub summary: String,
    pub tags: Vec<String>,
    pub entities: Vec<String>,
    pub connections: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExportResult {
    pub path: String,
    pub size: u64,
}

#[tauri::command]
async fn query_ollama(prompt: String, endpoint: String, model: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let payload = serde_json::json!({
        "model": model,
        "prompt": prompt,
        "stream": false,
        "options": {
            "temperature": 0.3,
            "max_tokens": 500
        }
    });

    let res = client
        .post(format!("{}/api/generate", endpoint))
        .json(&payload)
        .send()
        .await
        .map_err(|e| {
            format!(
                "Ollama connection failed: {}. Make sure Ollama is running (ollama serve)",
                e
            )
        })?;

    let body: serde_json::Value = res
        .json()
        .await
        .map_err(|e| format!("Failed to parse Ollama response: {}", e))?;

    body["response"]
        .as_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Ollama returned empty response".to_string())
}

#[tauri::command]
async fn process_with_ai(text: String, endpoint: String, model: String) -> Result<AiResponse, String> {
    let prompt = format!(
        r#"You are a knowledge analysis assistant. Analyze the following text and return a JSON object with:
- "summary": a 1-2 sentence summary
- "tags": 3-5 relevant tags as an array
- "entities": key people, places, concepts as an array
- "connections": 2-3 related topics as an array

Return ONLY valid JSON, no other text.

Text:
{}

JSON:
"#,
        text
    );

    let response = query_ollama(prompt, endpoint, model).await?;

    // Try to parse JSON from the response
    let cleaned = response
        .trim()
        .trim_start_matches("```json")
        .trim_start_matches("```")
        .trim_end_matches("```")
        .trim();

    match serde_json::from_str::<AiResponse>(cleaned) {
        Ok(parsed) => Ok(parsed),
        Err(_) => {
            // Fallback: parse manually
            let summary = response
                .lines()
                .find(|l| l.contains("summary"))
                .unwrap_or("")
                .to_string();

            let tags: Vec<String> = extract_list(&response, "tags");
            let entities: Vec<String> = extract_list(&response, "entities");
            let connections: Vec<String> = extract_list(&response, "connections");

            Ok(AiResponse {
                summary: summary
                    .split(':')
                    .nth(1)
                    .unwrap_or("")
                    .trim()
                    .trim_matches('"')
                    .to_string(),
                tags,
                entities,
                connections,
            })
        }
    }
}

fn extract_list(response: &str, key: &str) -> Vec<String> {
    response
        .lines()
        .skip_while(|l| !l.contains(&format!("\"{}\"", key)))
        .skip(1)
        .take_while(|l| l.trim().starts_with('"') || l.trim().starts_with('-') || l.trim().starts_with(','))
        .map(|l| {
            l.trim()
                .trim_matches(',')
                .trim_matches('"')
                .trim_start_matches("- ")
                .trim()
                .to_string()
        })
        .filter(|s| !s.is_empty())
        .collect()
}

#[tauri::command]
async fn check_ollama(endpoint: String) -> Result<bool, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    match client.get(format!("{}/api/tags", endpoint)).send().await {
        Ok(res) => Ok(res.status().is_success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn export_notes(format: String, notes_json: String) -> Result<ExportResult, String> {
    let notes: Vec<Note> = serde_json::from_str(&notes_json)
        .map_err(|e| format!("Failed to parse notes: {}", e))?;

    let home = dirs_next::home_dir().ok_or("Cannot find home directory")?;
    let export_dir = home.join("CogniFlowExports");
    fs::create_dir_all(&export_dir).map_err(|e| format!("Failed to create export dir: {}", e))?;

    let timestamp = chrono::Local::now().format("%Y%m%d_%H%M%S");

    match format.as_str() {
        "markdown" => {
            let path = export_dir.join(format!("cogniflow_export_{}.md", timestamp));
            let mut content = String::from("# CogniFlow Export\n\n");
            for note in &notes {
                content.push_str(&format!("## {}\n", note.title));
                content.push_str(&format!("*Created: {}*\n\n", note.created_at));
                content.push_str(&format!("{}\n\n", note.content));
                if !note.tags.is_empty() {
                    content.push_str(&format!("**Tags:** {}\n\n", note.tags.join(", ")));
                }
                if !note.entities.is_empty() {
                    content.push_str(&format!("**Entities:** {}\n\n", note.entities.join(", ")));
                }
                if !note.connections.is_empty() {
                    content.push_str(&format!(
                        "**Connections:** {}\n\n",
                        note.connections.join(", ")
                    ));
                }
                content.push_str("---\n\n");
            }
            fs::write(&path, &content)
                .map_err(|e| format!("Failed to write export file: {}", e))?;
            let size = fs::metadata(&path).map(|m| m.len()).unwrap_or(0);
            Ok(ExportResult {
                path: path.to_string_lossy().to_string(),
                size,
            })
        }
        "json" => {
            let path = export_dir.join(format!("cogniflow_export_{}.json", timestamp));
            let json = serde_json::to_string_pretty(&notes)
                .map_err(|e| format!("Failed to serialize: {}", e))?;
            fs::write(&path, &json)
                .map_err(|e| format!("Failed to write export file: {}", e))?;
            let size = fs::metadata(&path).map(|m| m.len()).unwrap_or(0);
            Ok(ExportResult {
                path: path.to_string_lossy().to_string(),
                size,
            })
        }
        _ => Err(format!("Unsupported format: {}", format)),
    }
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:cogniflow.db", migrations())
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            query_ollama,
            process_with_ai,
            check_ollama,
            export_notes,
            get_app_version,
        ])
        .setup(|app| {
            #[cfg(desktop)]
            {
                use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder};

                match tauri::image::Image::from_bytes(include_bytes!("../icons/icon.png")) {
                    Ok(icon) => {
                        let _ = TrayIconBuilder::new()
                            .icon(icon)
                            .tooltip("CogniFlow")
                            .on_tray_icon_event(|tray, event| {
                                if let tauri::tray::TrayIconEvent::Click {
                                    button: MouseButton::Left,
                                    button_state: MouseButtonState::Up,
                                    ..
                                } = event
                                {
                                    let app = tray.app_handle();
                                    if let Some(window) = app.get_webview_window("main") {
                                        let _ = window.show();
                                        let _ = window.set_focus();
                                    }
                                }
                            })
                            .build(app);
                    }
                    Err(e) => {
                        eprintln!("Failed to load tray icon: {}", e);
                    }
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn migrations() -> Vec<tauri_plugin_sql::Migration> {
    vec![
        tauri_plugin_sql::Migration {
            version: 1,
            description: "create notes table",
            sql: "CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                tags TEXT DEFAULT '[]',
                entities TEXT DEFAULT '[]',
                connections TEXT DEFAULT '[]',
                summary TEXT DEFAULT '',
                source TEXT DEFAULT 'text',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 2,
            description: "create sessions table for focus mode",
            sql: "CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                duration INTEGER NOT NULL,
                completed INTEGER DEFAULT 0,
                started_at TEXT NOT NULL,
                ended_at TEXT
            )",
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
    ]
}

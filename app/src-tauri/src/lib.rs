use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub content: String,
    pub tags: Vec<String>,
    pub timestamp: String,
    pub source: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AiResponse {
    pub summary: String,
    pub tags: Vec<String>,
    pub entities: Vec<String>,
    pub connections: Vec<String>,
}

#[tauri::command]
async fn query_ollama(prompt: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let payload = serde_json::json!({
        "model": "llama3.2",
        "prompt": prompt,
        "stream": false,
        "options": {
            "temperature": 0.3,
            "max_tokens": 500
        }
    });

    let res = client
        .post("http://localhost:11434/api/generate")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Ollama connection failed: {}. Make sure Ollama is running (ollama serve)", e))?;

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
async fn process_with_ai(text: String) -> Result<AiResponse, String> {
    let summary_prompt = format!(
        "Summarize the following text in 1-2 sentences:\n\n{}",
        text
    );
    let summary = query_ollama(summary_prompt).await?;

    let tags_prompt = format!(
        "Extract 3-5 relevant tags (comma-separated) from this text. Return ONLY tags:\n\n{}",
        text
    );
    let tags_raw = query_ollama(tags_prompt).await?;
    let tags: Vec<String> = tags_raw
        .split(',')
        .map(|s| s.trim().trim_start_matches("- ").to_string())
        .filter(|s| !s.is_empty())
        .collect();

    let entities_prompt = format!(
        "Extract key entities (people, places, concepts) as comma-separated list from:\n\n{}",
        text
    );
    let entities_raw = query_ollama(entities_prompt).await?;
    let entities: Vec<String> = entities_raw
        .split(',')
        .map(|s| s.trim().trim_start_matches("- ").to_string())
        .filter(|s| !s.is_empty())
        .collect();

    let connections_prompt = format!(
        "Suggest 2-3 related topics or ideas that connect to this text. Return as comma-separated list:\n\n{}",
        text
    );
    let conns_raw = query_ollama(connections_prompt).await?;
    let connections: Vec<String> = conns_raw
        .split(',')
        .map(|s| s.trim().trim_start_matches("- ").to_string())
        .filter(|s| !s.is_empty())
        .collect();

    Ok(AiResponse {
        summary,
        tags,
        entities,
        connections,
    })
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new()
            .add_migrations("sqlite:cogniflow.db", migrations())
            .build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            query_ollama,
            process_with_ai,
            get_app_version,
        ])
        .setup(|app| {
            // Set up tray icon if not on mobile
            #[cfg(desktop)]
            {
                use tauri::tray::{TrayIconBuilder, MouseButton, MouseButtonState};

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

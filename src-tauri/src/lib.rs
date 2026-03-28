use matrix_sdk::Client;
use tokio::sync::Mutex;
use tauri::State;
use anyhow::anyhow;

struct MatrixState {
    client: Mutex<Option<Client>>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn matrix_login(
    state: State<'_, MatrixState>,
    homeserver: String,
    username: String,
    password: String,
) -> Result<String, String> {
    // Basic setup from matrix-sdk docs
    let client = Client::builder()
        .homeserver_url(homeserver.clone())
        .build()
        .await
        .map_err(|e| format!("Failed to build client: {}", e))?;

    client
        .matrix_auth()
        .login_username(&username, &password)
        .send()
        .await
        .map_err(|e| format!("Login failed: {}", e))?;

    *state.client.lock().await = Some(client);

    Ok(format!("Successfully logged in to {} as {}", homeserver, username))
}

#[derive(serde::Serialize)]
struct RoomInfo {
    id: String,
    name: String,
    unread_count: u64,
}

#[tauri::command]
async fn matrix_get_rooms(state: State<'_, MatrixState>) -> anyhow::Result<Vec<RoomInfo>, String> {
    let client = {
        let lock = state.client.lock().await;
        lock.clone().ok_or_else(|| "Not logged in".to_string())?
    };

    // Run an initial sync to fetch rooms (in a real app this is spun off as a background task)
    let sync_settings = matrix_sdk::config::SyncSettings::default();
    client.sync(sync_settings).await.map_err(|e| format!("Sync failed: {}", e))?;

    let joined_rooms = client.joined_rooms();
    let mut rooms = Vec::new();
    
    for room in joined_rooms {
        let name = room.name().unwrap_or_else(|| room.room_id().to_string());
        
        let unread_count = room.unread_notification_counts().notification_count;

        rooms.push(RoomInfo {
            id: room.room_id().to_string(),
            name,
            unread_count,
        });
    }

    Ok(rooms)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(MatrixState {
            client: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![matrix_login, matrix_get_rooms])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

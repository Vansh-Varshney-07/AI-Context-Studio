use tauri::{command, AppHandle};
use tauri_plugin_dialog::DialogExt;
use tokio::sync::oneshot;

#[derive(serde::Deserialize)]
pub struct FileFilter {
    pub name: String,
    pub extensions: Vec<String>,
}

#[command]
pub async fn dialog_open_file(
    app: AppHandle,
    title: Option<String>,
    _filters: Option<Vec<FileFilter>>,
    _multiple: Option<bool>,
) -> Result<Option<Vec<String>>, String> {
    let (tx, rx) = oneshot::channel();
    let mut builder = app.dialog().file();
    if let Some(t) = title { builder = builder.set_title(&t); }
    builder.pick_files(move |result| {
        let _ = tx.send(result);
    });
    let result = rx.await.map_err(|_| "Dialog cancelled".to_string())?;
    Ok(result.map(|paths| paths.into_iter().map(|p| p.to_string()).collect()))
}

#[command]
pub async fn dialog_save_file(
    app: AppHandle,
    title: Option<String>,
    _filters: Option<Vec<FileFilter>>,
    default_name: Option<String>,
) -> Result<Option<String>, String> {
    let (tx, rx) = oneshot::channel();
    let mut builder = app.dialog().file();
    if let Some(t) = title { builder = builder.set_title(&t); }
    if let Some(n) = default_name { builder = builder.set_file_name(&n); }
    builder.save_file(move |result| {
        let _ = tx.send(result);
    });
    let result = rx.await.map_err(|_| "Dialog cancelled".to_string())?;
    Ok(result.map(|p| p.to_string()))
}

#[command]
pub async fn dialog_open_dir(
    app: AppHandle,
    title: Option<String>,
) -> Result<Option<String>, String> {
    let (tx, rx) = oneshot::channel();
    let mut builder = app.dialog().file();
    if let Some(t) = title { builder = builder.set_title(&t); }
    builder.pick_folder(move |result| {
        let _ = tx.send(result);
    });
    let result = rx.await.map_err(|_| "Dialog cancelled".to_string())?;
    Ok(result.map(|p| p.to_string()))
}
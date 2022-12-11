import { app, BrowserWindow } from "electron";
import { createRendererWindow } from "./rendererWindow";

// ウィンドウが閉じられたらアプリを終了
app.on("window-all-closed", () => {
  app.quit();
});

app
  .whenReady()
  .then(() => {
    // await onStartUp();
    createRendererWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createRendererWindow();
    });
  })
  .catch((e) => console.warn(e));

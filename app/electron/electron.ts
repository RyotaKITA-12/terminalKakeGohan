import { app, BrowserWindow } from "electron";
import { createRendererWindow } from "./rendererWindow";
import { registerHandler } from "./storeHandler";

// ウィンドウが閉じられたらアプリを終了
app.on("window-all-closed", () => {
  app.quit();
});

app
  .whenReady()
  .then(() => {
    // await onStartUp();
    createRendererWindow();
    registerHandler();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createRendererWindow();
    });
  })
  .catch((e) => console.warn(e));

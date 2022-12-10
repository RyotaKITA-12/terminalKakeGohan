import { app, BrowserWindow } from "electron";
import * as path from "path";


let rendererWindow: BrowserWindow;
// 画面生成
const createRendererWindow = () => {
  rendererWindow = new BrowserWindow({
    width: 640,
    height: 360,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });
  rendererWindow.removeMenu();
  void rendererWindow.loadURL('../index.html');

  if (!app.isPackaged) {
    rendererWindow.webContents.openDevTools();
  }
};
// レンダラーに送信
// const sendMessageToRenderer = (value: apiResponsesToRenderer) => {
//   rendererWindow.webContents.send("response", { ...value, target: "renderer" });
// };

export { createRendererWindow,};
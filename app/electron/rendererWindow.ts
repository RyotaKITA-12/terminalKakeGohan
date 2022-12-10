import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { baseUrl } from "./context";


let rendererWindow: BrowserWindow;

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
    void rendererWindow.loadURL(`${baseUrl}?renderer`);

    if (!app.isPackaged) {
        rendererWindow.webContents.openDevTools();
    }
};


ipcMain.handle('exec_command', async (event, data) => {
    try {
        var sudo = require("sudo-prompt")
        var options = {
            name: "Electron",
        };
        sudo.exec(data, options, function(error, stdout) {
            if (error) throw error;
        });
        return data;
    } catch (e) {
        return "failed.";
    }
})

export { createRendererWindow, };


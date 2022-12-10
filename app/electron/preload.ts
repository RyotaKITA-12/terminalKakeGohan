import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    invoke: (...data) =>
        ipcRenderer.invoke("exec_command", ...data),
});


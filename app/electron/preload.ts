import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    exec_command: (...data) =>
        ipcRenderer.invoke("exec_command", ...data),
    load_template: (...data) =>
        ipcRenderer.invoke("load_template", ...data),
    update_prompt: (...data) =>
        ipcRenderer.invoke("update_prompt", ...data),
});


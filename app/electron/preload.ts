import { TProfile } from "@/@types/profile";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // exec_command: (...data) =>
  //     ipcRenderer.invoke("exec_command", ...data),
  // load_template: (...data: string[]) =>
  //   ipcRenderer.invoke("load_template", ...data),
  // update_prompt: (...data: string[]) =>
  //   ipcRenderer.invoke("update_prompt", ...data),
  // save_tprofile: (data: TProfile[]) =>
  //     ipcRenderer.invoke("save_tprofile", data)
  apply_tprofile: (data: TProfile) =>
    ipcRenderer.invoke("apply_tprofile", data),
});

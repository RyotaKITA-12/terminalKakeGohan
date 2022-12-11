import { TProfile } from "@/@types/profile";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // exec_command: (...data) =>
  //     ipcRenderer.invoke("exec_command", ...data),
  // load_template: (...data: string[]) =>
  //   ipcRenderer.invoke("load_template", ...data),
  load_profiles: (...data: string[]) =>
    ipcRenderer.invoke("load_profiles", ...data),
  store_profiles: (data: TProfile[]) =>
    ipcRenderer.invoke("store_profiles", data),
  apply_tprofile: (data: TProfile) =>
    ipcRenderer.invoke("apply_tprofile", data),
});

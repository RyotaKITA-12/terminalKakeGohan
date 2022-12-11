import { ipcMain } from "electron";
import { loadProfiles, storeProfiles } from "./store";
import { TProfile } from "@/@types/profile";

const registerHandler = () => {
  ipcMain.handle("load_profiles", () => {
    return loadProfiles();
  });

  ipcMain.handle("store_profiles", (_, data: TProfile[]) => {
    return storeProfiles(data);
  });
};
export { registerHandler };

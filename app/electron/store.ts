import ElectronStore from "electron-store";
import { TProfile } from "@/@types/profile";
const store = new ElectronStore();

const storeProfiles = (data: TProfile[]) => {
  store.set("data", JSON.stringify(data));
};

const loadProfiles = (): TProfile[] => {
  return JSON.parse(store.get("data") as string) as TProfile[];
};

export { storeProfiles, loadProfiles };

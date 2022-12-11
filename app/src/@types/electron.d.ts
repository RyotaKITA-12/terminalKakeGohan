import { TProfile } from "@/@types/profile";

declare global {
  interface Window {
    api: {
      apply_tprofile: (data: TProfile) => void;
      load_profiles: () => TProfile[];
      store_profiles: (data: TProfile[]) => void;
    };
  }
}

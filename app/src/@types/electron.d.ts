import { TProfile } from "@/@types/profile";

declare global {
  interface Window {
    api: {
      apply_tprofile: (data: TProfile) => Promise<void>;
      load_profiles: () => Promise<TProfile[]>;
      store_profiles: (data: TProfile[]) => Promise<void>;
    };
  }
}

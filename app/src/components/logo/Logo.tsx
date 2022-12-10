import { logo } from "@/assets/logo";

import Styles from "./Logo.module.scss";

const Logo = () => {
  return (
    <img src={logo} alt={"た～みなるかけごはん！"} className={Styles.logo} />
  );
};
export { Logo };

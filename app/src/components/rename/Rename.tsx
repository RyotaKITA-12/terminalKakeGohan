import Styles from "./Rename.module.scss";
import { useContext, useState } from "react";
import { windowContext } from "@/context/window";
type props = {
  id: string;
  value: string;
  onChange: (val: string) => void;
};
const Rename = ({ id, value, onChange }: props) => {
  const [string, setString] = useState(value);
  const { data, setWindowContext } = useContext(windowContext);
  if (!data || !setWindowContext) return <></>;
  return (
    <div className={Styles.wrapper}>
      <input
        type="text"
        value={string}
        onChange={(e) => setString(e.target.value)}
      />
      <button
        onClick={() => {
          onChange(string);
          delete data[id];
          setWindowContext({ ...data });
        }}
      >
        OK
      </button>
    </div>
  );
};
export { Rename };

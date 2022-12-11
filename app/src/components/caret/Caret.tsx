import Styles from "./Caret.module.scss";
import { ChangeEvent, useContext } from "react";
import { caretContext } from "@/context/caret";

const CaretTargets = {
  block: "ブロック",
  underline: "アンダーライン",
  vertical: "垂直バー",
  "blink-block": "点滅ブロック",
  "blink-underline": "点滅アンダーライン",
  "blink-vertical": "点滅垂直バー",
};

const Caret = () => {
  const { caret, setCaret } = useContext(caretContext);
  if (!caret || !setCaret) return <></>;
  console.log(caret);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCaret(e.target.value as TCaret);
  };
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.item}>
        {Object.keys(CaretTargets).map((key) => {
          const item = CaretTargets[key as TCaret];
          return (
            <div className="field-row" key={key}>
              <input
                type="radio"
                name={"target"}
                id={key}
                checked={caret === key}
                value={key}
                onChange={onChange}
              />
              <label htmlFor={key}>{item}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export { Caret };

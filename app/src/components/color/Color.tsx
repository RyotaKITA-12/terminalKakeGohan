import Styles from "./Color.module.scss";
import { ColorButton } from "@/components/color/ColorButton";
import { selectableColors } from "@/definition/colors";
import { useContext, useState } from "react";
import { colorContext } from "@/context/color";
import { hex2rgb } from "@/libs/hex2rgb";
import { rgb2hex } from "@/libs/rgb2hex";

const Color = () => {
  const [target, setTarget] = useState<TColorsTarget>("screenText");
  const { colors, setColors } = useContext(colorContext);
  if (!colors || !setColors) return <></>;
  const rgb = hex2rgb(colors[target].color);
  const onChange = (value: string, index: number) => {
    rgb[index] = Number(value);
    colors[target].color = rgb2hex(rgb);
    setColors({ ...colors });
  };
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.row}>
        <div className={Styles.item}>
          {Object.keys(colors).map((key) => {
            const item = colors[key as TColorsTarget];
            return (
              <div className="field-row" key={key}>
                <input
                  type="radio"
                  name={"target"}
                  id={key}
                  checked={target === key}
                  onChange={() => setTarget(key as TColorsTarget)}
                />
                <label htmlFor={key}>{item.name}</label>
              </div>
            );
          })}
        </div>
        <div className={Styles.item}>
          <fieldset className={Styles.form}>
            <div className={Styles.fieldText}>選択した色の値</div>
            <div className="field-row">
              <label htmlFor="red">赤(R):</label>
              <input
                type="number"
                className={Styles.input}
                id={"red"}
                value={rgb[0]}
                min={0}
                max={255}
                disabled={true}
              />
            </div>
            <div className="field-row">
              <label htmlFor="green">緑(G):</label>
              <input
                type="number"
                className={Styles.input}
                id={"green"}
                value={rgb[1]}
                min={0}
                max={255}
                onChange={(e) => onChange(e.target.value, 1)}
              />
            </div>
            <div className="field-row">
              <label htmlFor="blue">青(L):</label>
              <input
                type="number"
                className={Styles.input}
                id={"blue"}
                value={rgb[2]}
                min={0}
                max={255}
                onChange={(e) => onChange(e.target.value, 2)}
              />
            </div>
          </fieldset>
        </div>
      </div>
      <div className={Styles.row}>
        {selectableColors.map((color, index) => {
          return (
            <ColorButton
              key={index}
              color={color}
              className={Styles.colorButton}
              onClick={() => {
                colors[target].color = color;
                setColors({ ...colors });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
export { Color };

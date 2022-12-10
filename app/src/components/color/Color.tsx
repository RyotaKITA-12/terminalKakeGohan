import Styles from "./Color.module.scss";

const Color = () => {
  return <div className={Styles.wrapper}>
    <div className={Styles.row}>
      <div className={Styles.item}>
        <div className="field-row">
          <input type="radio" name={"target"} id={"screenText"}/><label htmlFor={"screenText"}>画面の文字</label>
        </div>
        <div className="field-row">
          <input type="radio" name={"target"} id={"screenBg"}/><label htmlFor={"screenBg"}>画面の背景</label>
        </div>
        <div className="field-row">
          <input type="radio" name={"target"} id={"boldText"}/><label htmlFor={"boldText"}>太文字</label>
        </div>
        <div className="field-row">
          <input type="radio" name={"target"} id={"selectedText"}/><label htmlFor={"selectedText"}>選択文字</label>
        </div>
      </div>
      <div className={Styles.item}>
        <fieldset className={Styles.form}>
          <div className={Styles.fieldText}>選択した色の値</div>
          <div className="field-row">
            <label htmlFor="red">赤(R):</label><input type="number" className={Styles.input} id={"red"}/>
          </div>
          <div className="field-row">
            <label htmlFor="green">緑(G):</label><input type="number" className={Styles.input} id={"green"}/>
          </div>
          <div className="field-row">
            <label htmlFor="blue">青(L):</label><input type="number" className={Styles.input} id={"blue"}/>
          </div>
        </fieldset>
      </div>
    </div>
    <div className={Styles.row}>
    
    </div>
  </div>;
}
export {Color};
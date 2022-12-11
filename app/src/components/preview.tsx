import { useContext } from "react";
import { TPrompt } from "@/@types/prompt";
import { colorContext } from "@/context/color";
import { promptContext } from "@/context/prompt";
import Styles from "./preview.module.scss";

// プレビューのコンポーネント
const TerminalPreview = () => {
  const { colors } = useContext(colorContext);
  const { promptList } = useContext(promptContext);

  // プロンプトのプレビュー
  let promptPreview: string | JSX.Element | JSX.Element[] = "";

  // スタック
  const promptStack = Array<TPrompt>();
  const elementStack = Array<string | JSX.Element | JSX.Element[]>();

  try {
    if (!colors || !promptList) {
      throw Error("ERROR! : Object not set.");
    }

    // 各プロンプト要素について処理
    for (const prompt of promptList) {
      const append = (
        prompt1: string | JSX.Element | JSX.Element[],
        prompt2: string | JSX.Element | JSX.Element[]
      ) => {
        return prompt1 === "" || prompt2 === "" ? (
          <>
            {prompt1}
            {prompt2}
          </>
        ) : (
          <>
            {prompt1}&nbsp;{prompt2}
          </>
        );
      };

      // 何か追加するだけ
      if (/%[lyMmn#?d~hijLcDwT*t]/.test(prompt.value)) {
        promptPreview = append(promptPreview, prompt.preview);
      }

      // 囲む系プロンプトの始点
      else if (/^%([BUS]|[FK]{\d})$/.test(prompt.value)) {
        promptStack.push(prompt);
        elementStack.push(promptPreview);
        promptPreview = "";
      }

      // 囲む系プロンプトの終点
      else if (/^%[busfk]$/.test(prompt.value)) {
        // 視点と終点を取ってくる
        const begin = promptStack.pop();
        const end = prompt;

        // スタックに投げた要素を持ってくる
        const element = elementStack.pop();

        if (begin && element) {
          // 太字
          if (begin.value === "%B" && end.value === "%b") {
            const style = {
              fontWeight: 700,
              color: colors.boldText.color,
            };
            promptPreview = append(
              element,
              <span style={style}>{promptPreview}</span>
            );
          }

          // 下線
          else if (begin.value === "%U" && end.value === "%u") {
            const style = {
              textDecoration: "underline",
            };
            promptPreview = append(
              element,
              <span style={style}>{promptPreview}</span>
            );
          }

          // 強調
          else if (begin.value === "%S" && end.value === "%s") {
            const style = {
              color: colors.screenBg.color,
              backgroundColor: colors.screenText.color,
            };
            promptPreview = append(
              element,
              <span style={style}>{promptPreview}</span>
            );
          }

          // 文字色
          else if (/^%F{\d}$/.test(begin.value) && end.value === "%f") {
            let style = {};
            switch (Number(/\d/.exec(begin.value))) {
              case 0:
                style = { color: "#000000" };
                break;
              case 1:
                style = { color: "#990000" };
                break;
              case 2:
                style = { color: "#00A600" };
                break;
              case 3:
                style = { color: "#999900" };
                break;
              case 4:
                style = { color: "#0000B2" };
                break;
              case 5:
                style = { color: "#B200B2" };
                break;
              case 6:
                style = { color: "#00A6B2" };
                break;
              case 7:
                style = { color: "#BFBFBF" };
                break;
              default:
                throw Error("ERROR! : Invalid text color.");
            }
            promptPreview = append(
              element,
              <span style={style}>{promptPreview}</span>
            );
          }

          // 背景色
          else if (/^%K{\d}$/.test(begin.value) && end.value === "%k") {
            let style = {};
            switch (Number(/\d/.exec(begin.value))) {
              case 0:
                style = { backgroundColor: "#000000" };
                break;
              case 1:
                style = { backgroundColor: "#990000" };
                break;
              case 2:
                style = { backgroundColor: "#00A600" };
                break;
              case 3:
                style = { backgroundColor: "#999900" };
                break;
              case 4:
                style = { backgroundColor: "#0000B2" };
                break;
              case 5:
                style = { backgroundColor: "#B200B2" };
                break;
              case 6:
                style = { backgroundColor: "#00A6B2" };
                break;
              case 7:
                style = { backgroundColor: "#BFBFBF" };
                break;
              default:
                throw Error("ERROR! : Invalid background color.");
            }
            promptPreview = append(
              element,
              <span style={style}>{promptPreview}</span>
            );
          }

          // 始点と終点が一致しない場合
          else {
            throw Error(
              "ERROR! : The starting and ending points do not match."
            );
          }
        }

        // 始点が存在しない場合
        else {
          throw Error("ERROR! : No starting point.");
        }
      }

      // それ以外のプロンプト
      else {
        throw Error("ERROR! : Invalid prompt.");
      }
    }

    // 終点が存在しない場合
    if (promptStack.length > 0 || elementStack.length > 0) {
      throw Error("ERROR! : No ending point.");
    }

    // プレビューを描画
    const basicStyle = {
      color: colors.screenText.color,
      backgroundColor: colors.screenBg.color,
    };
    return (
      <div className={Styles.preview} style={basicStyle}>
        <span>{promptPreview}&nbsp;echo&nbsp;"Hello World!"</span>
      </div>
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "";
    return (
      <div
        className={Styles.preview}
        style={{ color: "#FF0000", backgroundColor: "#000000" }}
      >
        <span>{message}</span>
      </div>
    );
  }
};

export { TerminalPreview };

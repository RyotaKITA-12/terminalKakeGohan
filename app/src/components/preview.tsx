import { useContext } from "react";
import { TColors } from "@/@types/color";
import { TPrompt, TPromptList } from "@/@types/prompt";
import { colorContext } from "@/context/color";
import { promptContext } from "@/context/prompt";
import Styles from './preview.module.scss';

// プレビューのコンポーネント
const TerminalPreview = () => {

  const { colors, setColors } = useContext(colorContext);
  const { promptList, setPromptList } = useContext(promptContext);

  // プロンプトのプレビュー
  let promptPreview:string|JSX.Element|JSX.Element[] = (<></>);

  // スタック
  const promptStack = Array<TPrompt>();
  const elementStack = Array<string|JSX.Element|JSX.Element[]>();

  try {

    if(!colors || !promptList) {
      throw Error('ERROR! : Object not set.');
    }
  
    // 各プロンプト要素について処理
    for(let prompt of promptList) {

      // 何か追加するだけ
      if(/%(l|y|M|m|n|#|\?|d|~|h|i|j|L|c|D|w|T|\*|t)/.test(prompt.value)) {
        promptPreview = (<>{promptPreview}&nbsp;{prompt.preview}</>);
      }

      // 囲む系プロンプトの始点
      else if(/^%(B|U|S|F{\d}|K{\d})$/.test(prompt.value)) {
        promptStack.push(prompt);
        elementStack.push(promptPreview);
        promptPreview = (<></>);
      }

      // 囲む系プロンプトの終点
      else if(/^%(b|u|s|f|k)$/.test(prompt.value)) {

        // 視点と終点を取ってくる
        const begin = promptStack.pop();
        const end = prompt;

        if(begin) {

          // 太字
          if(begin.value === '%B' && end.value === '%b') {
            const style = {
              fontWeight: 700,
              color: colors.boldText.color
            };
            promptPreview = (<>{elementStack.pop()}&nbsp;<span style={style}>{promptPreview}</span></>);
          }

          // 下線
          else if(begin.value === '%U' && end.value === '%u') {
            const style = {
              textDecoration:'underline'
            };
            promptPreview = (<>{elementStack.pop()}&nbsp;<span style={style}>{promptPreview}</span></>);
          }

          // 強調
          else if(begin.value === '%S' && end.value === '%s') {
            const style = {
              color: colors.screenBg.color,
              backgroundColor: colors.screenText.color
            };
            promptPreview = (<>{elementStack.pop()}&nbsp;<span style={style}>{promptPreview}</span></>);
          }

          // 文字色
          else if(/^%F{\d}$/.test(begin.value) && end.value === '%f') {
            switch(Number(/\d/.exec(begin.value))) {
              case 0: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#000000'}}>{promptPreview}</span></>); break;
              case 1: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#990000'}}>{promptPreview}</span></>); break;
              case 2: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#00A600'}}>{promptPreview}</span></>); break;
              case 3: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#999900'}}>{promptPreview}</span></>); break;
              case 4: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#0000B2'}}>{promptPreview}</span></>); break;
              case 5: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#B200B2'}}>{promptPreview}</span></>); break;
              case 6: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#00A6B2'}}>{promptPreview}</span></>); break;
              case 7: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{color:'#BFBFBF'}}>{promptPreview}</span></>); break;
              default: throw Error('ERROR! : Invalid text color.');
            }
          }

          // 背景色
          else if(/^%K{\d}$/.test(begin.value) && end.value === '%k') {
            switch(Number(/\d/.exec(begin.value))) {
              case 0: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#000000'}}>{promptPreview}</span></>); break;
              case 1: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#990000'}}>{promptPreview}</span></>); break;
              case 2: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#00A600'}}>{promptPreview}</span></>); break;
              case 3: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#999900'}}>{promptPreview}</span></>); break;
              case 4: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#0000B2'}}>{promptPreview}</span></>); break;
              case 5: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#B200B2'}}>{promptPreview}</span></>); break;
              case 6: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#00A6B2'}}>{promptPreview}</span></>); break;
              case 7: promptPreview = (<>{elementStack.pop()}&nbsp;<span style={{backgroundColor:'#BFBFBF'}}>{promptPreview}</span></>); break;
              default: throw Error('ERROR! : Invalid background color.');
            }
          }

          // 始点と終点が一致しない場合
          else {
            throw Error('ERROR! : The starting and ending points do not match.');
          }

        }

        // 始点が存在しない場合
        else {
          throw Error('ERROR! : No starting point.');
        }
      }

      // それ以外のプロンプト
      else {
        throw Error('ERROR! : Invalid prompt.');
      }
    }

    if(promptStack.length > 0 || elementStack.length > 0) {
      throw Error('ERROR! : No ending point.');
    }

    // プレビューを描画
    const basicStyle = {
      color: colors.screenText.color,
      backgroundColor: colors.screenBg.color,
    };
    return (
      <div className={Styles.preview} style={basicStyle}>
        <span>{promptPreview}</span>
      </div>
    );

  } catch(e:any) {
    return (
      <div className={Styles.preview} style={{color:'#FF0000',backgroundColor:'#000000'}}>
        <span>{e.message}</span>
      </div>
    );
  }

}

export { TerminalPreview };
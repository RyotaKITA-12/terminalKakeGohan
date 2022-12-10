import { TColors } from "@/@types/color";
import { TPrompt, TPromptList } from "@/@types/prompt";
import Styles from './preview.module.scss';

type TerminalPreviewProps = {
	colors: TColors,
	prompts: TPromptList,
};

// プレビューのコンポーネント
const TerminalPreview = (props:TerminalPreviewProps) => {

  // プロンプトのプレビュー
  let promptPreview:string|JSX.Element|JSX.Element[] = (<></>);

  // スタック
  const promptStack = Array<TPrompt>();
  const elementStack = Array<string|JSX.Element|JSX.Element[]>();

  // 各プロンプト要素について処理
  for(let prompt of props.prompts) {

    // 何か追加するだけ
    if(/%(l|y|M|m|n|#|\?|d|~|h|i|j|L|c|D|w|T|\*|t)/.test(prompt.value)) {
      promptPreview = (<>{promptPreview}{prompt.preview}</>);
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
            color: props.colors.boldText
          };
          promptPreview = (<>{elementStack.pop()}<span style={style}>{promptPreview}</span></>);
        }

        // 下線
        else if(begin.value === '%U' && end.value === '%u') {
          const style = {
            textDecoration:'underline'
          };
          promptPreview = (<>{elementStack.pop()}<span style={style}>{promptPreview}</span></>);
        }

        // 強調
        else if(begin.value === '%S' && end.value === '%s') {
          const style = {
            color: props.colors.screenBg,
            backgroundColor: props.colors.screenText
          };
          promptPreview = (<>{elementStack.pop()}<span style={style}>{promptPreview}</span></>);
        }

        // 文字色
        else if(/^F{\d}$/.test(begin.value) && end.value === '%f') {
          switch(Number(/\d/.exec(begin.value))) {
            case 0: promptPreview = (<>{elementStack.pop()}<span style={{color:'#000000'}}>{promptPreview}</span></>); break;
            case 1: promptPreview = (<>{elementStack.pop()}<span style={{color:'#990000'}}>{promptPreview}</span></>); break;
            case 2: promptPreview = (<>{elementStack.pop()}<span style={{color:'#00A600'}}>{promptPreview}</span></>); break;
            case 3: promptPreview = (<>{elementStack.pop()}<span style={{color:'#999900'}}>{promptPreview}</span></>); break;
            case 4: promptPreview = (<>{elementStack.pop()}<span style={{color:'#0000B2'}}>{promptPreview}</span></>); break;
            case 5: promptPreview = (<>{elementStack.pop()}<span style={{color:'#B200B2'}}>{promptPreview}</span></>); break;
            case 6: promptPreview = (<>{elementStack.pop()}<span style={{color:'#00A6B2'}}>{promptPreview}</span></>); break;
            case 7: promptPreview = (<>{elementStack.pop()}<span style={{color:'#BFBFBF'}}>{promptPreview}</span></>); break;
          }
        }

        // 背景色
        else if(/^K{\d}$/.test(begin.value) && end.value === '%k') {
          switch(Number(/\d/.exec(begin.value))) {
            case 0: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#000000'}}>{promptPreview}</span></>); break;
            case 1: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#990000'}}>{promptPreview}</span></>); break;
            case 2: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#00A600'}}>{promptPreview}</span></>); break;
            case 3: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#999900'}}>{promptPreview}</span></>); break;
            case 4: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#0000B2'}}>{promptPreview}</span></>); break;
            case 5: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#B200B2'}}>{promptPreview}</span></>); break;
            case 6: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#00A6B2'}}>{promptPreview}</span></>); break;
            case 7: promptPreview = (<>{elementStack.pop()}<span style={{backgroundColor:'#BFBFBF'}}>{promptPreview}</span></>); break;
          }
        }

      }
    }
  }

	// プレビューを描画
  const basicStyle = {
    color: props.colors.colorsText,
    backgroundColor: props.colors.colorsBg,
  };
  return (
		<div className={Styles.preview} style={basicStyle}>
			<span>{promptPreview}</span>
		</div>
	);

}

export { TerminalPreview };
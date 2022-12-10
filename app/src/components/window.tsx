import {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  MouseEventHandler,
} from "react";
import { windowContext } from "@/context/window";
import { Window } from "@/@types/window";
import Styles from "./window.module.scss";

type WindowMode = 'staying'|'moving'|'resizing';
type ResizeMode = 'left'|'right'|'above'|'below'|'leftabove'|'rightabove'|'leftbelow'|'rightbelow';

// ウィンドウのプロパティ
type RetroWindowProps = {
  window: Window;
};

// ウィンドウのコンポーネント
const RetroWindow = (props: RetroWindowProps) => {
  // Context の設定
  const { data, setWindowContext } = useContext(windowContext);

  // ウィンドウの状態
  const [drugging, setDrugging] = useState(false);
  const [drugoffset, setDrugOffset] = useState({ x: 0, y: 0 });
	const [windowMode, setWindowMode] = useState<WindowMode>('staying');
	const [resizeMode, setResizeMode] = useState<ResizeMode>('left');

  // ウィンドウに対する参照
  const innerWindow = useRef<HTMLDivElement>(null);

  // マウスが動いている時のイベント
  const onMouseMove = (event: MouseEvent) => {
		if (innerWindow.current) {

			// ウィンドウが移動中の場合
			if(windowMode === 'moving') {
				innerWindow.current.style.left = `${event.pageX + drugoffset.x}px`;
				innerWindow.current.style.top = `${event.pageY + drugoffset.y}px`;
			}

			// ウィンドウサイズを変更している場合
			else if(windowMode === 'resizing') {

				const left = innerWindow.current.style.left;
				const top = innerWindow.current.style.top;
				const width = innerWindow.current.style.width;
				const height = innerWindow.current.style.height;

				if(resizeMode.includes('left')) {
					innerWindow.current.style.left = `${event.pageX}px`;
					innerWindow.current.style.width = `calc(${left} + ${width} - ${event.pageX}px)`;
				}

				if(resizeMode.includes('right')) {
					innerWindow.current.style.width = `calc(${event.pageX}px - ${left})`;
				}

				if(resizeMode.includes('above')) {
					innerWindow.current.style.top = `${event.pageY}px`;
					innerWindow.current.style.height = `calc(${top} + ${height} - ${event.pageY}px)`;
				}

				if(resizeMode.includes('below')) {
					innerWindow.current.style.height = `calc(${event.pageY}px - ${top})`;
				}

			}
		}

	};

  // タイトルバーがクリックされた時のイベント
  const onWindowMove: MouseEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		if(!props.window.isMinimized) {
			if (innerWindow.current && data) {
				setWindowMode('moving');
				setDrugging(true);
				if (setWindowContext) {
					setWindowContext({ [props.window.id]: props.window, ...data });
				}
				if(!props.window.isMaximized) {
					const rect = innerWindow.current.getBoundingClientRect();
					setDrugOffset({ x: rect.left - event.pageX, y: rect.top - event.pageY });
				}
				props.window.isMaximized = false;
			}
		}
  };

	// ウィンドウの周りがクリックされた時のイベント
	const onWindowResize = (mode:ResizeMode):MouseEventHandler<HTMLDivElement> => {
		return (event) => {
			event.stopPropagation();
			if(!props.window.isMinimized && !props.window.isMaximized) {
				if (innerWindow.current && data) {
					setWindowMode('resizing');
					setResizeMode(mode);
					setDrugging(true);
				}
			}
		};
	};

  // ドラッグが解除された時のイベント
  const onMouseUp = () => {
		if(!props.window.isMinimized && !props.window.isMaximized) {
			if (innerWindow.current && drugging) {
				setDrugging(false);
				setWindowMode('staying');
				props.window.pos = {
					x: Number(innerWindow.current.style.left.slice(0, -2)),
					y: Number(innerWindow.current.style.top.slice(0, -2)),
				};
				props.window.size = {
					width: Number(innerWindow.current.style.width.slice(0, -2)),
					height: Number(innerWindow.current.style.height.slice(0, -2)),
				};
				if (setWindowContext) {
					setWindowContext({ [props.window.id]: props.window, ...data });
				}
			}
		}
  };

  // 最小化する時のイベント
  const onMinimize: MouseEventHandler<HTMLButtonElement> = event => {
		event.stopPropagation();
		setDrugging(false);
    if(!props.window.isMinimized) {
        props.window.isMinimized = true;
        props.window.isMaximized = false;
    }
    else {
      props.window.isMinimized = false;
    }
		if (setWindowContext) {
			setWindowContext({ [props.window.id]: props.window, ...data });
		}
  }

  // 最大化する時のイベント
  const onMaximize: MouseEventHandler<HTMLButtonElement> = event => {
		event.stopPropagation();
		setDrugging(false);
    if(!props.window.isMaximized) {
			props.window.isMaximized = true;
      props.window.isMinimized = false;
    }
    else {
      props.window.isMaximized = false;
    }
		if (setWindowContext) {
			setWindowContext({ [props.window.id]: props.window, ...data });
		}
  }

	// ウィンドウを追放する時のイベント
	const onVanish: MouseEventHandler<HTMLButtonElement> = event => {
		event.stopPropagation();
		setDrugging(false);
		if(props.window.isClosable) {
			if (data && setWindowContext) {
				const { [props.window.id]: _removed, ...rest } = data;
				setWindowContext(rest);
			}
		}
	}

  // drugging が変更された時の副作用を設定
  useEffect(() => {
    if (drugging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
		return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
		}
  }, [drugging]);

  // isMinimized・isMaximized が変更された時のイベント
  useEffect(() => {
    if (innerWindow.current) {

			// ウィンドウが最小化されているならば
      if(props.window.isMinimized) {
				let stackid = 0;
				if(data) {
					const values = Object.values(data);
					const index = values.findIndex((v,i,a)=>v.id===props.window.id);
					stackid = values.slice(0, index).reduce((p,c,i,a)=> p + (c.isMinimized ? 1 : 0), 0);
				}
        innerWindow.current.style.width = '300px';
        innerWindow.current.style.height = '27px';
        innerWindow.current.style.left = 'calc(100vw - 300px)';
        innerWindow.current.style.top = `calc(100vh - ${27 * (stackid + 1)}px)`;
      }

			// ウィンドウが最大化されているならば
      else if(props.window.isMaximized) {
        innerWindow.current.style.width = '100vw';
        innerWindow.current.style.height = '100vh';
        innerWindow.current.style.left = `0px`;
        innerWindow.current.style.top = `0px`;
      }
			
			// それ以外の場合
      else {
        innerWindow.current.style.width = `${props.window.size.width}px`;
        innerWindow.current.style.height = `${props.window.size.height}px`;
        innerWindow.current.style.left = `${props.window.pos.x}px`;
        innerWindow.current.style.top = `${props.window.pos.y}px`;
      }
    }
  }, [props.window.isMinimized, props.window.isMaximized, data]);

  // ウィンドウを描画
  return (
    <div className={`window ${Styles['inner-window']}`} ref={innerWindow}>
      <div className="title-bar" onMouseDown={onWindowMove}>
        <div className="title-bar-text" style={{userSelect:'none'}}>{props.window.title}</div>
        <div className="title-bar-controls" onMouseDown={event=>event.stopPropagation()}>
          <button aria-label="Minimize" onMouseUp={onMinimize}/>
          {!props.window.isMaximized && <button aria-label="Maximize" onMouseUp={onMaximize}/>}
          {props.window.isMaximized && <button aria-label="Restore" onMouseUp={onMaximize}/>}
          <button aria-label="Close" onMouseUp={onVanish}/>
        </div>
      </div>
      {!props.window.isMinimized && (
        <div className="window-body">{props.window.child}</div>
      )}
			{(!props.window.isMaximized && !props.window.isMinimized) && (
				<>
					<span className={`${Styles['resize-area']} ${Styles['area-above']}`} onMouseDown={onWindowResize('above')}/>
					<span className={`${Styles['resize-area']} ${Styles['area-below']}`} onMouseDown={onWindowResize('below')}/>
					<span className={`${Styles['resize-area']} ${Styles['area-left']}`} onMouseDown={onWindowResize('left')}/>
					<span className={`${Styles['resize-area']} ${Styles['area-right']}`} onMouseDown={onWindowResize('right')}/>
					<span className={`${Styles['resize-area']} ${Styles['area-left-above']}`} onMouseDown={onWindowResize('leftabove')}/>
					<span className={`${Styles['resize-area']} ${Styles['area-right-above']}`} onMouseDown={onWindowResize('rightabove')}/>
					<span className={`${Styles['resize-area']} ${Styles['area-left-below']}`} onMouseDown={onWindowResize('leftbelow')}/>
					<span className={`${Styles['resize-area']} ${Styles['area-right-below']}`} onMouseDown={onWindowResize('rightbelow')}/>
				</>
			)}
    </div>
  );
};

export { RetroWindow };

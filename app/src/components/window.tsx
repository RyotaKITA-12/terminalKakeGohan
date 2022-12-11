import {
  useContext,
  useState,
  useRef,
  useEffect,
  MouseEventHandler,
} from "react";
import { windowContext } from "@/context/window";
import { Window } from "@/@types/window";
import Styles from "./window.module.scss";

type WindowMode = "staying" | "moving" | "resizing";
type ResizeMode =
  | "left"
  | "right"
  | "above"
  | "below"
  | "leftabove"
  | "rightabove"
  | "leftbelow"
  | "rightbelow";

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
  const [windowMode, setWindowMode] = useState<WindowMode>("staying");
  const [resizeMode, setResizeMode] = useState<ResizeMode>("left");

  // ウィンドウに対する参照
  const innerWindow = useRef<HTMLDivElement>(null);

  const moveWindowFront = () => {
    if (setWindowContext) {
      setWindowContext({ [props.window.id]: props.window, ...data });
    }
  };
  // マウスが動いている時のイベント
  const onMouseMove = (event: MouseEvent) => {
    if (innerWindow.current) {
      // ウィンドウが移動中の場合
      if (windowMode === "moving") {
        let left = event.pageX + drugoffset.x;
        left = Math.max(left, 0);
        left = Math.min(
          left,
          window.innerWidth - innerWindow.current.offsetWidth
        );
        innerWindow.current.style.left = `${left}px`;

        let top = event.pageY + drugoffset.y;
        top = Math.max(top, 0);
        top = Math.min(
          top,
          window.innerHeight - innerWindow.current.offsetHeight
        );
        innerWindow.current.style.top = `${top}px`;
      }

      // ウィンドウサイズを変更している場合
      else if (windowMode === "resizing") {
        const left = innerWindow.current.offsetLeft;
        const top = innerWindow.current.offsetTop;
        const width = innerWindow.current.offsetWidth;
        const height = innerWindow.current.offsetHeight;

        if (resizeMode.includes("left")) {
          innerWindow.current.style.left = `${Math.min(
            event.pageX,
            left + width - props.window.minSize.width
          )}px`;
          innerWindow.current.style.width = `${Math.max(
            left + width - event.pageX,
            props.window.minSize.width
          )}px`;
        }

        if (resizeMode.includes("right")) {
          innerWindow.current.style.width = `${Math.max(
            event.pageX - left,
            props.window.minSize.width
          )}px`;
        }

        if (resizeMode.includes("above")) {
          innerWindow.current.style.top = `${Math.min(
            event.pageY,
            top + height - props.window.minSize.height
          )}px`;
          innerWindow.current.style.height = `${Math.max(
            top + height - event.pageY,
            props.window.minSize.height
          )}px`;
        }

        if (resizeMode.includes("below")) {
          innerWindow.current.style.height = `${Math.max(
            event.pageY - top,
            props.window.minSize.height
          )}px`;
        }
      }
    }
  };

  // タイトルバーがクリックされた時のイベント
  const onWindowMove: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    if (!props.window.isMinimized) {
      if (innerWindow.current && data) {
        setWindowMode("moving");
        setDrugging(true);
        if (setWindowContext) {
          setWindowContext({ [props.window.id]: props.window, ...data });
        }
        if (!props.window.isMaximized) {
          const rect = innerWindow.current.getBoundingClientRect();
          setDrugOffset({
            x: rect.left - event.pageX,
            y: rect.top - event.pageY,
          });
        }
        props.window.isMaximized = false;
      }
    }
  };

  // ウィンドウの周りがクリックされた時のイベント
  const onWindowResize = (
    mode: ResizeMode
  ): MouseEventHandler<HTMLDivElement> => {
    return (event) => {
      event.stopPropagation();
      if (!props.window.isMinimized && !props.window.isMaximized) {
        if (innerWindow.current && data) {
          setWindowMode("resizing");
          setResizeMode(mode);
          setDrugging(true);
        }
      }
    };
  };

  // ドラッグが解除された時のイベント
  const onMouseUp = () => {
    if (!props.window.isMinimized && !props.window.isMaximized) {
      if (innerWindow.current && drugging) {
        setDrugging(false);
        setWindowMode("staying");
        props.window.pos = {
          x: innerWindow.current.offsetLeft,
          y: innerWindow.current.offsetTop,
        };
        props.window.size = {
          width: innerWindow.current.offsetWidth,
          height: innerWindow.current.offsetHeight,
        };
        if (setWindowContext) {
          setWindowContext({ [props.window.id]: props.window, ...data });
        }
      }
    }
  };

  // 最小化する時のイベント
  const onMinimize: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    setDrugging(false);
    if (!props.window.isMinimized) {
      props.window.isMinimized = true;
      props.window.isMaximized = false;
    } else {
      props.window.isMinimized = false;
    }
    if (setWindowContext) {
      setWindowContext({ [props.window.id]: props.window, ...data });
    }
  };

  // 最大化する時のイベント
  const onMaximize: MouseEventHandler<unknown> = (event) => {
    event.stopPropagation();
    setDrugging(false);
    if (!props.window.isMaximized) {
      props.window.isMaximized = true;
      props.window.isMinimized = false;
    } else {
      props.window.isMaximized = false;
    }
    if (setWindowContext) {
      setWindowContext({ [props.window.id]: props.window, ...data });
    }
  };

  // ウィンドウを追放する時のイベント
  const onVanish: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    setDrugging(false);
    if (props.window.isClosable) {
      if (data && setWindowContext) {
        delete data[props.window.id];
        setWindowContext({ ...data });
      }
    }
  };
  // drugging が変更された時の副作用を設定
  useEffect(() => {
    if (drugging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [drugging]);

  // isMinimized・isMaximized が変更された時のイベント
  useEffect(() => {
    if (innerWindow.current) {
      innerWindow.current.style.position = props.window.isMinimized
        ? "unset"
        : "fixed";
      if (props.window.isMaximized) {
        innerWindow.current.style.width = "100vw";
        innerWindow.current.style.height = "100vh";
        innerWindow.current.style.left = `0px`;
        innerWindow.current.style.top = `0px`;
      } else {
        innerWindow.current.style.width = `${props.window.size.width}px`;
        innerWindow.current.style.height = props.window.isMinimized
          ? "unset"
          : `${props.window.size.height}px`;
        innerWindow.current.style.left = `${props.window.pos.x}px`;
        innerWindow.current.style.top = `${props.window.pos.y}px`;
      }
    }
  }, [props.window.isMinimized, props.window.isMaximized]);

  // ウィンドウを描画
  return (
    <div
      className={`window ${Styles["inner-window"]}`}
      ref={innerWindow}
      onMouseDown={moveWindowFront}
    >
      <div
        className="title-bar"
        onMouseDown={onWindowMove}
        onDoubleClick={onMaximize}
      >
        <div className="title-bar-text" style={{ userSelect: "none" }}>
          {props.window.title}
        </div>
        <div
          className="title-bar-controls"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button aria-label="Minimize" onMouseUp={onMinimize} />
          {!props.window.isMaximized && (
            <button aria-label="Maximize" onMouseUp={onMaximize} />
          )}
          {props.window.isMaximized && (
            <button aria-label="Restore" onMouseUp={onMaximize} />
          )}
          <button aria-label="Close" onMouseUp={onVanish} />
        </div>
      </div>
      {props.window.isMinimized || (
        <div className="window-body">{props.window.child}</div>
      )}
      {!props.window.isMaximized && !props.window.isMinimized && (
        <>
          <span
            className={`${Styles["resize-area"]} ${Styles["area-above"]}`}
            onMouseDown={onWindowResize("above")}
          />
          <span
            className={`${Styles["resize-area"]} ${Styles["area-below"]}`}
            onMouseDown={onWindowResize("below")}
          />
          <span
            className={`${Styles["resize-area"]} ${Styles["area-left"]}`}
            onMouseDown={onWindowResize("left")}
          />
          <span
            className={`${Styles["resize-area"]} ${Styles["area-right"]}`}
            onMouseDown={onWindowResize("right")}
          />
          <span
            className={`${Styles["resize-area"]} ${Styles["area-left-above"]}`}
            onMouseDown={onWindowResize("leftabove")}
          />
          <span
            className={`${Styles["resize-area"]} ${Styles["area-right-above"]}`}
            onMouseDown={onWindowResize("rightabove")}
          />
          <span
            className={`${Styles["resize-area"]} ${Styles["area-left-below"]}`}
            onMouseDown={onWindowResize("leftbelow")}
          />
          <span
            className={`${Styles["resize-area"]} ${Styles["area-right-below"]}`}
            onMouseDown={onWindowResize("rightbelow")}
          />
        </>
      )}
    </div>
  );
};

export { RetroWindow };

import { useContext, useState, useRef, useCallback, useEffect, MouseEventHandler } from "react";
import { windowContext } from "@/context/window";
import { Window } from "@/@types/window";
import Styles from "./window.module.scss";

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

  // ウィンドウに対する参照
  const innerWindow = useRef<HTMLDivElement>(null);

  // タイトルバーがドラッグされている時のイベント
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (innerWindow.current) {
        innerWindow.current.style.left = `${event.pageX + drugoffset.x}px`;
        innerWindow.current.style.top = `${event.pageY + drugoffset.y}px`;
      }
    },
    [drugoffset]
  );

  // タイトルバーがクリックされた時のイベント
  const onMouseDown:MouseEventHandler<HTMLDivElement> = (event) => {
    if (innerWindow.current) {
      const rect = innerWindow.current.getBoundingClientRect();
      setDrugOffset({ x: rect.left - event.pageX, y: rect.top - event.pageY });
      setDrugging(true);
    }
  };

  // タイトルバーのドラッグが解除された時のイベント
  const onMouseUp = () => {
    setDrugging(false);
    if (innerWindow.current) {
      props.window.pos = {
        x: innerWindow.current.style.left,
        y: innerWindow.current.style.top,
      };
      if (setWindowContext) {
        setWindowContext({ ...data, [props.window.id]: props.window });
      }
    }
  };

  // drugging が変更された時の副作用を設定
  useEffect(() => {
    if (drugging) {
      window.addEventListener("mousemove", onMouseMove);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
    }
  }, [drugging]);

  // ウィンドウ全体に対してイベントリスナーを追加
  useEffect(() => {
    if (innerWindow.current) {
      innerWindow.current.style.left = `${props.window.pos.x}px`;
      innerWindow.current.style.top = `${props.window.pos.y}px`;
    }
  	window.addEventListener("mouseup", onMouseUp);
  }, [0]);

  // ウィンドウを描画
  return (
    <div className={`window ${Styles.inner_window}`} ref={innerWindow}>
      <div className="title-bar" onMouseDown={onMouseDown}>
        <div className="title-bar-text">{props.window.title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>
      {!props.window.isMinimized && (
        <div className="window-body">{props.window.child}</div>
      )}
    </div>
  );
};

export { RetroWindow };

import React from 'react';
import { windowContext } from '@/context/window';
import { Window } from '@/@types/window';

// ウィンドウのプロパティ
type RetroWindowProps = {
  window: Window
};

// ウィンドウのコンポーネント
const RetroWindow = (props:RetroWindowProps) => {

	// Context の設定
	const { data, setWindowContext } = React.useContext(windowContext);

  // ウィンドウの状態
  const [drugging, setDrugging] = React.useState(false);
  const [drugoffset, setDrugOffset] = React.useState({x:0,y:0});
  
  // ウィンドウに対する参照
  const innerWindow = React.useRef<HTMLDivElement>(null);
  
  // タイトルバーがドラッグされている時のイベント
  const onMouseMove = React.useCallback((event:MouseEvent) => {
		if(innerWindow.current) {
			innerWindow.current.style.left = `${event.pageX + drugoffset.x}px`;
			innerWindow.current.style.top = `${event.pageY + drugoffset.y}px`;
		}
  }, [drugoffset]);

  // タイトルバーがクリックされた時のイベント
  const onMouseDown = (event:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(innerWindow.current) {
      const rect = innerWindow.current.getBoundingClientRect();
      setDrugOffset({ x: rect.left - event.pageX, y: rect.top - event.pageY });
      setDrugging(true);
    }
  };
  
  // タイトルバーのドラッグが解除された時のイベント
  const onMouseUp = (event:MouseEvent) => {
		setDrugging(false);
		if(innerWindow.current) {
			props.window.pos = {
				x: innerWindow.current.style.left,
				y: innerWindow.current.style.top
			};
			if(setWindowContext) {
				setWindowContext({ ...data, [props.window.id]:props.window });
			}
		}
	};
  
  // drugging が変更された時の副作用を設定
  React.useEffect(() => {
    if(drugging) { window.addEventListener('mousemove', onMouseMove); }
    if(!drugging) { window.removeEventListener('mousemove', onMouseMove); }
  });
  
  // ウィンドウ全体に対してイベントリスナーを追加
  window.addEventListener('mouseup', onMouseUp);
  
  // ウィンドウを描画
  return (
    <div className='window tkg-window' ref={innerWindow}>
      <div className='title-bar' onMouseDown={onMouseDown}>
        <div className='title-bar-text'>{props.window.title}</div>
        <div className='title-bar-controls'>
          <button aria-label='Minimize'/>
          <button aria-label='Maximize'/>
          <button aria-label='Close'/>
        </div>
      </div>
      { !props.window.isMinimized && <div className='window-body'>{props.window.child}</div> }
    </div>
  );
};

export { RetroWindow };
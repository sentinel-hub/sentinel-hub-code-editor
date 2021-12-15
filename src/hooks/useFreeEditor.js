import { useCallback, useEffect, useState, useRef } from "react";

const HEADER_FLOATED_CLASSNAME = "code-editor-header-floating";

const MIN_WIDTH = 600;
const MIN_HEIGHT = 400;

const useFreeEditor = (boxRef, headerRef) => {
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [isDocked, setIsDocked] = useState(true);
  const [editorSize, setEditorSize] = useState({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
  });
  const editorOffsetRef = useRef({ x: 0, y: 0 });
  const mouseOffsetRef = useRef({ x: 0, y: 0 });

  const handleDockedClick = useCallback(() => {
    setIsDocked((prev) => !prev);
    if (isDocked) {
      setEditorPosition({ x: 0, y: 0 });
      editorOffsetRef.current = { x: 0, y: 0 };
    }
  }, []);

  function handleResizeMouseDown(event) {
    mouseOffsetRef.current = { x: event.clientX, y: event.clientY };
    window.addEventListener("mousemove", mousemoveHandle);
    window.addEventListener(
      "mouseup",
      () => {
        window.removeEventListener("mousemove", mousemoveHandle);
      },
      { once: true }
    );
  }

  function getValidHeight(height) {
    if (height <= MIN_HEIGHT) {
      return MIN_HEIGHT;
    }
    if (height >= window.innerHeight) {
      return window.innerHeight;
    }
    return height;
  }

  function getValidWidth(width) {
    if (width <= MIN_WIDTH) {
      return MIN_WIDTH;
    }
    if (width >= window.innerWidth) {
      return window.innerWidth;
    }

    return width;
  }

  function handleFullscreenClick() {
    setEditorPosition({ x: 0, y: 0 });
    setEditorSize({ height: window.innerHeight, width: window.innerWidth });
  }

  function handleExitFullscreenClick() {
    setEditorPosition({ x: 0, y: 0 });
    setEditorSize({ height: MIN_HEIGHT, width: MIN_WIDTH });
  }

  const mousemoveHandle = useCallback(
    (event) => {
      const newWidth = getValidWidth(
        editorSize.width + event.clientX - mouseOffsetRef.current.x
      );
      const newHeight = getValidHeight(
        editorSize.height + event.clientY - mouseOffsetRef.current.y
      );
      setEditorSize({
        width: newWidth,
        height: newHeight,
      });
    },
    [editorSize]
  );

  function handleMoveMouseDown(event) {
    if (isDocked) {
      return;
    }
    editorOffsetRef.current = {
      y: event.clientY - editorPosition.y,
      x: event.clientX - editorPosition.x,
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener(
      "mouseup",
      () => {
        window.removeEventListener("mousemove", mouseMoveHandler);
      },
      { once: true }
    );
  }

  const mouseMoveHandler = useCallback((e) => {
    const editorDimensions = boxRef.current.getBoundingClientRect();

    const editorPositionX = e.clientX - editorOffsetRef.current.x;
    const editorPositionY = e.clientY - editorOffsetRef.current.y;

    const newEditorY = getEditorPositionY(editorPositionY, editorDimensions);
    const newEditorX = getEditorPositionX(editorPositionX, editorDimensions);

    setEditorPosition({ x: newEditorX, y: newEditorY });
  }, []);

  function getEditorPositionY(y, editorDimensions) {
    const isInsideY =
      y >= 0 && y + editorDimensions.height <= window.innerHeight;
    const isOutsideTop = y < 0;
    if (isInsideY) {
      return y;
    }
    if (isOutsideTop) {
      return 0;
    }
    return window.innerHeight - editorDimensions.height;
  }
  function getEditorPositionX(x, editorDimensions) {
    const isInsideX = x + editorDimensions.width <= window.innerWidth && x >= 0;
    const isOutsideLeft = x < 0;
    if (isInsideX) {
      return x;
    }
    if (isOutsideLeft) {
      return 0;
    }
    return window.innerWidth - editorDimensions.width;
  }

  function handleRunEvalscriptClick() {
  setEditorSize({height: MIN_HEIGHT, width: MIN_WIDTH})    
  setEditorPosition({x: 0, y: 0})
  }
  useEffect(() => {
    if (isDocked) {
      headerRef.current.classList.remove(HEADER_FLOATED_CLASSNAME);
    } else {
      headerRef.current.classList.add(HEADER_FLOATED_CLASSNAME);
    }
  }, [isDocked]);

  return {
    editorSize,
    editorPosition,
    setEditorPosition,
    isDocked,
    handleDockedClick,
    handleMoveMouseDown,
    handleResizeMouseDown,
    handleFullscreenClick,
    handleExitFullscreenClick,
    handleRunEvalscriptClick
  };
};
export default useFreeEditor;

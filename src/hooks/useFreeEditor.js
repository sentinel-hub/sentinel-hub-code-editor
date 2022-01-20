import { useCallback, useEffect, useState, useRef } from "react";

const HEADER_FLOATED_CLASSNAME = "code-editor-header-floating";

const MIN_WIDTH = 600;
const MIN_HEIGHT = 400;

function hello()  { 
  
}

const useFreeEditor = (boxRef, headerRef) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [isDocked, setIsDocked] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [editorSize, setEditorSize] = useState({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
  });
  const editorOffsetRef = useRef({ x: 0, y: 0 });
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const preFullscreenEditorSize = useRef({ width: 0, height: 0 });
  const preFullscreenEditorPosition = useRef({ x: 0, y: 0 });

  const handleDockedClick = useCallback(() => {
    setIsDocked((prev) => !prev);
    if (isDocked) {
      setEditorPosition({ x: 0, y: 0 });
      editorOffsetRef.current = { x: 0, y: 0 };
    }
  }, []);

  useEffect(() => {
    if (isDocked) {
      setIsFullscreen(false);
    }
  }, [isDocked]);

  useEffect(() => {
    console.log(isDragging);
    if (isDragging) {
      document.querySelector("body").style.overflowY = "hidden";
    } else {
      document.querySelector("body").style.overflowY = "auto";
    }
  }, [isDragging]);

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

  function handleFullscreenClick(event) {
    event.stopPropagation();
    preFullscreenEditorSize.current = {
      width: editorSize.width,
      height: editorSize.height,
    };
    preFullscreenEditorPosition.current = {
      x: editorPosition.x,
      y: editorPosition.y,
    };
    setIsFullscreen(true);
    setEditorPosition({ x: 0, y: 0 });
    setEditorSize({ height: window.innerHeight, width: window.innerWidth });
  }

  function handleCancelFullscreenClick(event) {
    event.stopPropagation();
    const { x, y } = preFullscreenEditorPosition.current;
    const { height, width } = preFullscreenEditorSize.current;
    setIsFullscreen(false);
    setEditorPosition({ x, y });
    setEditorSize({ height, width });
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
    setIsDragging(true);
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener(
      "mouseup",
      () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", mouseMoveHandler);
      },
      { once: true }
    );
  }

  const mouseMoveHandler = useCallback((e) => {
    e.preventDefault();
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
    handleCancelFullscreenClick,
    isFullscreen,
  };
};
export default useFreeEditor;

import { useCallback, useEffect, useState, useRef } from "react";

const MIN_WIDTH = 600;
const MIN_HEIGHT = 400;
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
    /*   if (isDragging) {
      document.querySelector("body").style.overflowY = "hidden";
    } else {
      document.querySelector("body").style.overflowY = "auto";
    } */
  }, [isDragging]);

  function handleResizeMouseDown(event) {
    mouseOffsetRef.current = { x: event.clientX, y: event.clientY };
    window.addEventListener("mousemove", handleEditorResize);
    window.addEventListener(
      "mouseup",
      () => {
        window.removeEventListener("mousemove", handleEditorResize);
      },
      { once: true }
    );
  }

  function getValidHeight(height) {
    const { top } = boxRef.current.getBoundingClientRect();
    if (height <= MIN_HEIGHT) {
      return MIN_HEIGHT;
    }
    if (height + top >= window.innerHeight) {
      return window.innerHeight - top;
    }
    return height;
  }

  function getValidWidth(width) {
    const windowWidthoutScrollbarWidth =
      document.querySelector("body").clientWidth;
    const { left } = boxRef.current.getBoundingClientRect();
    if (width <= MIN_WIDTH) {
      return MIN_WIDTH;
    }

    if (width + left >= windowWidthoutScrollbarWidth) {
      return windowWidthoutScrollbarWidth - left;
    }

    return width;
  }

  function handleFullscreenClick(event) {
    event.stopPropagation();
    preFullscreenEditorSize.current = {
      previousWidth: editorSize.width,
      previousHeight: editorSize.height,
    };
    preFullscreenEditorPosition.current = {
      previousPositionX: editorPosition.x,
      previousPositionY: editorPosition.y,
    };
    setIsFullscreen(true);
    setEditorPosition({ x: 0, y: 0 });
    const windowWithoutScrollbarWidth =
      document.querySelector("body").clientWidth;

    setEditorSize({
      height: window.innerHeight,
      width: windowWithoutScrollbarWidth,
    });
  }

  function handleCancelFullscreenClick(event) {
    const windowWithoutScrollbarWidth =
      document.querySelector("body").clientWidth;

    event.stopPropagation();
    const { previousHeight, previousWidth } = preFullscreenEditorSize.current;
    const { previousPositionY, previousPositionX } =
      preFullscreenEditorPosition.current;

    if (
      previousHeight >= window.innerHeight &&
      previousWidth >= windowWithoutScrollbarWidth
    ) {
      setEditorSize({ width: MIN_WIDTH, height: MIN_HEIGHT });
      setEditorPosition({ x: 0, y: 0 });
    } else {
      setEditorPosition({ y: previousPositionY, x: previousPositionX });
      setEditorSize({ height: previousHeight, width: previousWidth });
    }
    setIsFullscreen(false);
  }

  const handleEditorResize = useCallback(
    (event) => {
      const { left } = boxRef.current.getBoundingClientRect();
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
    [editorSize, mouseOffsetRef.current]
  );

  function onEditorMove(event) {
    if (isDocked) {
      return;
    }
    editorOffsetRef.current = {
      y: event.clientY - editorPosition.y,
      x: event.clientX - editorPosition.x,
    };
    setIsDragging(true);
    window.addEventListener("mousemove", handleEditorMove);
    window.addEventListener(
      "mouseup",
      (event) => {
        editorOffsetRef.current = {
          y: event.clientY - editorPosition.y,
          x: event.clientX - editorPosition.x,
        };

        setIsDragging(false);
        window.removeEventListener("mousemove", handleEditorMove);
      },
      { once: true }
    );
  }

  const handleEditorMove = useCallback((e) => {
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
    const windowWithoutScrollbarWidth =
      document.querySelector("body").clientWidth;

    const isInsideX =
      x + editorDimensions.width <= windowWithoutScrollbarWidth && x >= 0;
    const isOutsideLeft = x < 0;
    if (isInsideX) {
      return x;
    }
    if (isOutsideLeft) {
      return 0;
    }
    return windowWithoutScrollbarWidth - editorDimensions.width;
  }

  return {
    editorSize,
    editorPosition,
    setEditorPosition,
    isDocked,
    handleDockedClick,
    onEditorMove,
    handleResizeMouseDown,
    handleFullscreenClick,
    handleCancelFullscreenClick,
    isFullscreen,
  };
};
export default useFreeEditor;

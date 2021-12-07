import { useCallback, useEffect, useState, useRef } from "react";

const HEADER_FLOATED_CLASSNAME = "code-editor-header-floating";

const useFreeEditor = (boxRef, headerRef) => {
  const editorOffsetRef = useRef();
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [isDocked, setIsDocked] = useState(true);

  const handleDockedClick = useCallback(() => {
    setIsDocked((prev) => !prev);
  }, []);

  function handleMouseDown(event) {
    if (isDocked) {
      return;
    }
    editorOffsetRef.current = {
      y: event.clientY - editorPosition.y,
      x: event.clientX - editorPosition.x,
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    });
  }

  const mouseMoveHandler = useCallback((e) => {
    const editorDimensions = boxRef.current.getBoundingClientRect();

    const editorPositionX = e.clientX - editorOffsetRef.current.x;
    const editorPositionY = e.clientY - editorOffsetRef.current.y;

    const newEditorY = getEditorPositionY(editorPositionY, editorDimensions);
    const newEditorX = getEditorPositionX(editorPositionX, editorDimensions);

    setEditorPosition({ x: newEditorY, y: newEditorY });
  }, []);

  function getEditorPositionY(y, editorDimensions) {
    const isInsideY = y > 0 && y + editorDimensions.height < window.innerHeight;
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
    const isInsideX = x + editorDimensions.width < window.innerWidth && x > 0;
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

  return { editorPosition, isDocked, handleDockedClick, handleMouseDown };
};
export default useFreeEditor;

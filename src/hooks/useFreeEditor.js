import { useCallback, useEffect, useState, useRef } from "react";

const HEADER_FLOATED_CLASSNAME = "code-editor-header-floating";

const useFreeEditor = (boxRef, headerRef) => {
  const offsetRef = useRef();
  const [transform, setTransform] = useState([0, 0]);
  const [isDocked, setIsDocked] = useState(true);

  const handleDockedClick = useCallback(() => {
    setIsDocked((prev) => !prev);
  }, []);

  function handleMouseDown(event) {
    if (isDocked) {
      return;
    }
    offsetRef.current = [
      event.clientY - transform[0],
      event.clientX - transform[1],
    ];

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    });
  }

  const mouseMoveHandler = useCallback((e) => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const boxRect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - offsetRef.current[1];
    const y = e.clientY - offsetRef.current[0];
    const maxX = maxWidth - boxRect.width;
    const maxY = maxHeight - boxRect.height;

    const isOutsideX = x < 0 || x > maxX;
    const isInsideX = x > 0 && x < maxX;

    const isInsideY = y > 0 && y < maxY;
    const isOutsideY = y < 0 || y > maxY;

    if (isInsideX && isInsideY) {
      setTransform([y, x]);
      return;
    }
    if (isInsideX && isOutsideY) {
      setTransform((prev) => [prev[0], x]);
      return;
    }
    if (isInsideY && isOutsideX) {
      setTransform((prev) => [y, prev[1]]);
      return;
    }
  }, []);

  useEffect(() => {
    if (isDocked) {
      headerRef.current.classList.remove(HEADER_FLOATED_CLASSNAME);
    } else {
      headerRef.current.classList.add(HEADER_FLOATED_CLASSNAME);
    }
  }, [isDocked]);

  return { transform, isDocked, handleDockedClick, handleMouseDown };
};
export default useFreeEditor;

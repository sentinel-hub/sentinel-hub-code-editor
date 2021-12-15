import { useCallback, useEffect, useRef } from "react";
import { ArrowsExpandIcon, XIcon } from "@heroicons/react/solid";
import loader from "@monaco-editor/loader";
import { JSHINT } from "jshint";
import useFreeEditor from "../../hooks/useFreeEditor";
import { IoIosResize } from "react-icons/io";
import { BiFullscreen, BiExitFullscreen, BiExpand } from "react-icons/bi";
import "./code-editor.css";
import "./variables.css";

const evalscript = `//VERSION=3
function setup() {
  return {
    input: ["B01","B02","B03", "dataMask"],
    output: { bands: 4 }
  };
}

function evaluatePixel(sample) {
  
  return [2.5 * sample.B01, 2.5 * sample.B02, 2.5 * sample.B03, sample.dataMask];
}`;

const JSHINT_CONFIG = {
  asi: true,
  esversion: 6,
};

const MONACO_EDITOR_CONFIG = {
  value: evalscript,
  language: "javascript",
  theme: "vs-dark",
  wordWrap: true,
  fontSize: 12,
  automaticLayout: true,
  minimap: {
    enabled: false,
  },
};

export const CodeEditor = ({ onRunEvalscriptClick }) => {
  const monacoEditorDOMRef = useRef();
  const editorRef = useRef();
  const monacoRef = useRef();
  const headerEditorRef = useRef();
  const editorWindowRef = useRef();
  const {
    editorPosition,
    editorSize,
    isDocked,
    handleDockedClick,
    handleMouseDown,
    handleResizeMouseDown,
    handleFullscreenClick,
    handleExitFullscreenClick,
  } = useFreeEditor(editorWindowRef, headerEditorRef);

  useEffect(() => {
    loader.init().then((monaco) => {
      const editor = monaco.editor.create(
        monacoEditorDOMRef.current,
        MONACO_EDITOR_CONFIG
      );

      monacoRef.current = monaco;
      editorRef.current = editor;

      editor.onDidChangeModelContent(() => {
        checkAndApplyErrors();
      });
    });
  }, []);

  const debounce = useCallback((func, wait, immediate) => {
    var timeout;

    return function executedFunction() {
      var context = this;
      var args = arguments;

      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  }, []);

  const checkAndApplyErrors = debounce(function () {
    const code = editorRef.current.getValue();
    JSHINT(code, JSHINT_CONFIG);
    const errors = JSHINT.errors.map((e) => {
      return {
        startLineNumber: e.line,
        startColumn: e.character,
        endLineNumber: e.line,
        endColumn: e.character,
        message: e.reason,
        markerSeverity: e.code.startsWith("E")
          ? monacoRef.current.MarkerSeverity.Error
          : monacoRef.current.MarkerSeverity.Warning,
      };
    });
    monacoRef.current.editor.setModelMarkers(
      editorRef.current.getModel(),
      "test",
      errors
    );
  }, 500);

  if (isDocked) {
    return (
      <div ref={editorWindowRef} className="code-editor-window-docked">
        <div className="code-editor-top-panel" ref={headerEditorRef}>
          <button className="editor-button" onClick={handleDockedClick}>
            <BiExpand className="code-editor-expand-icon" />
          </button>
        </div>
        <div
          style={{ height: "100%" }}
          className="code-editor-docked"
          ref={(el) => (monacoEditorDOMRef.current = el)}
        ></div>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: `translate(${editorPosition.x}px, ${editorPosition.y}px)`,
        ...editorSize,
        position: "absolute",
      }}
      ref={editorWindowRef}
      className="code-editor-window"
    >
      <div
        className="code-editor-top-panel"
        ref={headerEditorRef}
        onMouseDown={handleMouseDown}
      >
        {isDocked ? (
          <ArrowsExpandIcon
            className="code-editor-expand-icon"
            onClick={handleDockedClick}
          />
        ) : (
          <>
            {window.innerWidth === editorSize.width &&
            window.innerHeight === editorSize.height ? (
              <button
                className="editor-button"
                onClick={handleExitFullscreenClick}
              >
                <BiExitFullscreen className="editor-icon" />
              </button>
            ) : (
              <button className="editor-button" onClick={handleFullscreenClick}>
                <BiFullscreen className="editor-icon" />
              </button>
            )}
            <button onClick={handleDockedClick} className="editor-button">
              <XIcon className="editor-icon" />
            </button>
          </>
        )}
      </div>
      <div
        style={{ height: editorSize.height - 96 }}
        className="code-editor"
        ref={(el) => (monacoEditorDOMRef.current = el)}
      ></div>
      <div
        onMouseDown={handleResizeMouseDown}
        className="code-editor-bottom-panel"
      >
        <button
          onClick={onRunEvalscriptClick}
          className="button-primary button-primary-bottom-panel"
        >
          Run Evalscript
        </button>
        <button className="editor-button editor-button-resize">
          <IoIosResize className="icon-resize editor-icon" />
        </button>
      </div>
    </div>
  );
};

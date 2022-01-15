import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import loader from "@monaco-editor/loader";
import { JSHINT } from "jshint";
import useFreeEditor from "../../hooks/useFreeEditor";
import { BiFullscreen, BiExpand } from "react-icons/bi";
import ReactDOM from "react-dom";
import React from "react";
import "./code-editor.css";
import styled, { ThemeProvider } from "styled-components";
import { variables } from "./variables.js";
import { themeDark } from "./themeDark.js";
import { themeLight } from "./themeLight";
import { CgArrowsExpandLeft } from "react-icons/cg";
import { MdOutlineClose } from "react-icons/md";
import Switch from "./Switch";

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

let MONACO_EDITOR_CONFIG = {
  value: evalscript,
  language: "javascript",
  wordWrap: true,
  fontSize: 12,
  automaticLayout: true,
  minimap: {
    enabled: false,
  },
};

const CodeEditorTopPanel = styled.div`
  height: ${({ theme }) => theme.spacing07};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: ${({ theme }) => theme.colorBg500};
`;

const CodeEditorBottomPanel = styled.div`
  height: ${({ theme }) => theme.spacing07};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 ${({ theme }) => theme.spacing02};
  background: ${({ theme }) => theme.colorBg600};
`;

const ButtonPrimary = styled.button`
  padding: ${({ theme }) => theme.spacing02};
  background: ${({ theme }) => theme.colorPrimary500};
  font-weight: 500;
  color: white;
  border: none;
  :hover {
    cursor: pointer;
  }
`;

const CodeEditorIcon = styled.button`
  height: 100%;
  width: ${({ theme }) => theme.spacing05};
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  font-size: 20px;
  height: 100%;
  color: ${({ theme }) => theme.colorUI500};
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background: ${({ theme }) => theme.colorBg600};
    cursor: pointer;
  }
`;

const CodeEditorWindow = styled.div`
  box-shadow: 0px 0px 55px rgba(0, 0, 0, 0.25);
  z-index: 9999999999999999;
  .code-editor-top-panel-drag {
    :hover {
      cursor: grab;
    }
    :active {
      cursor: grabbing;
    }
  }
  .editor-button-resize {
    cursor: nwse-resize;
    z-index: 0;
    :hover {
      background: ${({ theme }) => theme.colorBg600};
    }
  }
`;

const CodeEditorWindowDocked = styled.div`
  height: 100%;
  width: 100%;
  position: static;
  transform: translate(0px, 0px);
  .code-editor-docked {
    height: 100%;
    width: 100%;
  }
`;

export const CodeEditor = ({
  onRunEvalscriptClick,
  portalId,
  editorTheme = "dark",
}) => {
  const monacoEditorDOMRef = useRef();
  const editorRef = useRef();
  const monacoRef = useRef();
  const headerEditorRef = useRef();
  const editorWindowRef = useRef();
  const [isDarkTheme, setIsDarkTheme] = useState(
    editorTheme === "dark" ? true : false
  );
  const {
    editorPosition,
    editorSize,
    isDocked,
    handleDockedClick,
    handleMoveMouseDown,
    handleResizeMouseDown,
    handleFullscreenClick,
  } = useFreeEditor(editorWindowRef, headerEditorRef);

  useEffect(() => {
    loader.init().then((monaco) => {
      const editor = monaco.editor.create(monacoEditorDOMRef.current, {
        ...MONACO_EDITOR_CONFIG,
        theme: isDarkTheme ? "vs-dark" : "vs",
      });

      monacoRef.current = monaco;
      editorRef.current = editor;

      editor.onDidChangeModelContent(() => {
        checkAndApplyErrors();
      });
    });
  }, [isDocked]);

  useEffect(() => {
    if (monacoRef.current) {
      if (isDarkTheme) {
        monacoRef.current.editor.setTheme("vs-dark");
      } else {
        monacoRef.current.editor.setTheme("vs");
        monacoRef.current.editor.setFontSize;
      }
    }
  }, [isDarkTheme]);

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

  function toggleTheme() {
    setIsDarkTheme((prev) => !prev);
  }

  if (isDocked) {
    return (
      <ThemeProvider
        theme={
          isDarkTheme
            ? { ...variables, ...themeDark }
            : { ...variables, ...themeLight }
        }
      >
        <CodeEditorWindowDocked
          ref={editorWindowRef}
          className="code-editor-window-docked"
        >
          <CodeEditorTopPanel ref={headerEditorRef}>
            <Switch checked={isDarkTheme === true} onChange={toggleTheme} />
            <CodeEditorIcon onClick={handleDockedClick}>
              <BiExpand className="code-editor-expand-icon editor-icon" />
            </CodeEditorIcon>
          </CodeEditorTopPanel>
          <div
            style={{ height: "100%" }}
            className={`code-editor-docked`}
            ref={monacoEditorDOMRef}
          ></div>
        </CodeEditorWindowDocked>
      </ThemeProvider>
    );
  }

  return ReactDOM.createPortal(
    <ThemeProvider
      theme={
        isDarkTheme
          ? { ...variables, ...themeDark }
          : { ...variables, ...themeLight }
      }
    >
      <CodeEditorWindow
        style={{
          transform: `translate(${editorPosition.x}px, ${editorPosition.y}px)`,
          ...editorSize,
          position: "fixed",
        }}
        ref={editorWindowRef}
        className="code-editor-window"
      >
        <CodeEditorTopPanel
          ref={headerEditorRef}
          onMouseDown={handleMoveMouseDown}
          className="code-editor-top-panel-drag"
        >
          {isDocked ? (
            <ArrowsExpandIcon
              className="code-editor-expand-icon"
              onClick={handleDockedClick}
            />
          ) : (
            <>
              <Switch onChange={toggleTheme} checked={isDarkTheme === true} />
              <CodeEditorIcon onClick={handleFullscreenClick}>
                <BiFullscreen />
              </CodeEditorIcon>
              <CodeEditorIcon onClick={handleDockedClick}>
                <MdOutlineClose />
              </CodeEditorIcon>
            </>
          )}
        </CodeEditorTopPanel>
        <div
          style={{ height: editorSize.height - 96 }}
          className="code-editor"
          ref={monacoEditorDOMRef}
        ></div>
        <CodeEditorBottomPanel>
          <ButtonPrimary
            onClick={() => {
              onRunEvalscriptClick(editorRef.current.getValue());
            }}
            className="button-primary button-primary-bottom-panel"
          >
            Run Evalscript
          </ButtonPrimary>
          <CodeEditorIcon
            onMouseDown={handleResizeMouseDown}
            className="editor-button-resize"
          >
            <CgArrowsExpandLeft className="icon-resize editor-icon" />
          </CodeEditorIcon>
        </CodeEditorBottomPanel>
      </CodeEditorWindow>
    </ThemeProvider>,
    document.getElementById(portalId)
  );
};

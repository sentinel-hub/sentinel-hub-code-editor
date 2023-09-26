import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import loader from "@monaco-editor/loader";
import { JSHINT } from "jshint";
import useFreeEditor from "../../hooks/useFreeEditor";
import { BiFullscreen, BiExpand, BiExitFullscreen } from "react-icons/bi";
import ReactDOM from "react-dom";
import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { variables } from "./variables.js";
import { defaultThemeDark } from "./editor-themes/themeDark.js";
import { defaultThemeLight } from "./editor-themes/themeLight";
import { CgArrowsExpandLeft } from "react-icons/cg";
import { MdOutlineClose } from "react-icons/md";
import Switch from "./Switch";
import SuccessIcon from "./SuccessIcon";

const JSHINT_CONFIG = {
  asi: true,
  esversion: 6,
};

const CodeEditorTopPanel = styled.div`
  height: ${({ theme }) => theme.spacing07};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: ${({ theme }) => theme.colorBg600};
  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

const ReadonlyOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colorOverlayBg};
  z-index: 2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 0 ${({ theme }) => theme.spacing02};
  height: 40px;
  background: ${({ theme }) => theme.colorPrimary500};
  font-weight: 500;
  color: ${({ theme }) => theme.colorText500};
  border: none;
  display: inline-flex;
  align-items: center;
  transition: 0.1s linear background;
  :hover {
    transition: 0.1s linear background;
    cursor: pointer;
    background: ${({ theme }) => theme.colorPrimary600};
  }
  :disabled {
    color: #a0a0a6;
    background: ${({ theme }) => theme.colorDisabled};
    cursor: not-allowed;
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
    background: ${({ theme }) => theme.colorBg500};
    cursor: pointer;
  }
`;

const CodeEditorWindow = styled.div`
  box-shadow: 0px 0px 55px rgba(0, 0, 0, 0.25);
  z-index: ${(props) => props.zIndex};
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: 0;
  left: 0;
  position: fixed;
  overflow: hidden;
`;

const CodeEditorWindowDocked = styled.div`
  height: 100%;
  width: 100%;
  position: static;
  transform: translate(0px, 0px);
  overflow: hidden;
`;

const MonacoEditor = styled.div`
  height: 100%;
  height: ${(props) => `calc(100% - ${props.theme.spacing07})`};
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const CodeEditor = ({
  onRunEvalscriptClick,
  portalId,
  defaultEditorTheme = "dark",
  onChange,
  value,
  zIndex = 100,
  isReadOnly,
  themeLight = defaultThemeLight,
  themeDark = defaultThemeDark,
  runEvalscriptButtonText = "Run evalscript",
  runningEvalscriptButtonText = "Running evalscript",
  readOnlyMessage = "Editor is in read only mode",
  runEvalscriptOnShortcut = false,
}) => {
  const monacoEditorDOMRef = useRef();
  const monacoRef = useRef();
  const headerEditorRef = useRef();
  const editorRef = useRef();
  const editorWindowRef = useRef();
  const [shouldTriggerRunEvalscriptAnimation, setShouldTriggerRunEvalscriptAnimation] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(defaultEditorTheme === "dark" ? true : false);

  const {
    editorPosition,
    editorSize,
    isDocked,
    handleDockedClick,
    onEditorMove,
    handleResizeMouseDown,
    handleFullscreenClick,
    handleCancelFullscreenClick,
    isFullscreen,
  } = useFreeEditor(editorWindowRef, headerEditorRef);

  useEffect(() => {
    if (shouldTriggerRunEvalscriptAnimation) {
      setTimeout(() => {
        setShouldTriggerRunEvalscriptAnimation(false);
      }, 2000);
    }
  }, [shouldTriggerRunEvalscriptAnimation]);

  useEffect(() => {
    let MONACO_EDITOR_CONFIG = {
      value,
      language: "javascript",
      wordWrap: true,
      fontSize: isDocked ? 12 : 14,
      automaticLayout: true,
      scrollBeyondLastLine: true,
      minimap: {
        enabled: false,
      },
    };

    loader.init().then((monaco) => {
      if (themeDark.name !== "vs-dark") {
        monaco.editor.defineTheme(themeDark.name, {
          base: "vs-dark", // can also be vs-dark or hc-black
          inherit: true, // can also be false to completely replace the builtin rules
          rules: [{}],
          colors: {
            "editor.background": `${themeDark.styles.colorBg500}`,
            "editor.lineHighlightBackground": `${themeDark.styles.colorBg400}`,
            "editor.lineHighlightBorder": `${themeDark.styles.colorBg400}`,
          },
        });
      }

      if (themeLight.name !== "vs") {
        monaco.editor.defineTheme(themeLight.name, {
          base: "vs", // can also be vs-dark or hc-black
          inherit: true, // can also be false to completely replace the builtin rules
          rules: [{}],
          colors: {
            "editor.background": `${themeLight.styles.colorBg500}`,
          },
        });
      }

      editorRef.current = monaco.editor.create(monacoEditorDOMRef.current, {
        ...MONACO_EDITOR_CONFIG,
        theme: isDarkTheme ? themeDark.name : themeLight.name,
        readOnly: isReadOnly,
        scrollbar: {
          alwaysConsumeMouseWheel: isDocked ? false : true,
        },
      });

      if (runEvalscriptOnShortcut && onRunEvalscriptClick) {
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          setShouldTriggerRunEvalscriptAnimation(true);
          onRunEvalscriptClick(editorRef.current.getValue());
        });
      }

      const messageContribution = editorRef.current.getContribution("editor.contrib.messageController");
      editorRef.current.onDidAttemptReadOnlyEdit(() => {
        messageContribution.showMessage(readOnlyMessage, editorRef.current.getPosition());
      });

      monacoRef.current = monaco;
      editorRef.current.onDidChangeModelContent(() => {
        const code = editorRef.current.getValue();
        onChange(code);

        checkAndApplyErrors();
      });
    });
  }, [isDocked]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const code = editorRef.current.getValue();
    if (value !== code) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!monacoRef.current) {
      return;
    }
    if (isDarkTheme) {
      monacoRef.current.editor.setTheme(themeDark.name);
    } else {
      monacoRef.current.editor.setTheme(themeLight.name);
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (isReadOnly) {
      editorRef.current.updateOptions({ readOnly: true });
    } else {
      editorRef.current.updateOptions({ readOnly: false });
    }
  }, [isReadOnly, editorRef.current]);

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
    monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), "test", errors);
  }, 500);

  function toggleTheme() {
    setIsDarkTheme((prev) => !prev);
  }

  if (isDocked) {
    return (
      <ThemeProvider
        theme={isDarkTheme ? { ...variables, ...themeDark.styles } : { ...variables, ...themeLight.styles }}
      >
        <CodeEditorWindowDocked ref={editorWindowRef}>
          <CodeEditorTopPanel ref={headerEditorRef}>
            <Switch checked={isDarkTheme === true} onChange={toggleTheme} />
            <CodeEditorIcon onClick={handleDockedClick}>
              <BiExpand />
            </CodeEditorIcon>
          </CodeEditorTopPanel>
          <MonacoEditor ref={monacoEditorDOMRef}>
            {isReadOnly && <ReadonlyOverlay isDarkTheme={isDarkTheme}></ReadonlyOverlay>}
          </MonacoEditor>
        </CodeEditorWindowDocked>
      </ThemeProvider>
    );
  }

  return ReactDOM.createPortal(
    <ThemeProvider
      theme={isDarkTheme ? { ...variables, ...themeDark.styles } : { ...variables, ...themeLight.styles }}
    >
      <CodeEditorWindow
        zIndex={zIndex}
        x={editorPosition.x}
        y={editorPosition.y}
        height={editorSize.height}
        width={editorSize.width}
        ref={editorWindowRef}
      >
        <CodeEditorTopPanel ref={headerEditorRef} onMouseDown={onEditorMove}>
          {isDocked ? (
            <ArrowsExpandIcon onClick={handleDockedClick} />
          ) : (
            <>
              <Switch onChange={toggleTheme} checked={isDarkTheme === true} />
              {isFullscreen ? (
                <CodeEditorIcon onClick={handleCancelFullscreenClick}>
                  <BiExitFullscreen />
                </CodeEditorIcon>
              ) : (
                <CodeEditorIcon onClick={handleFullscreenClick}>
                  <BiFullscreen />
                </CodeEditorIcon>
              )}
              <CodeEditorIcon onClick={handleDockedClick}>
                <MdOutlineClose />
              </CodeEditorIcon>
            </>
          )}
        </CodeEditorTopPanel>
        <MonacoEditor style={{ height: editorSize.height - 96 }} ref={monacoEditorDOMRef}>
          {isReadOnly && <ReadonlyOverlay isDarkTheme={isDarkTheme}></ReadonlyOverlay>}
        </MonacoEditor>
        <CodeEditorBottomPanel>
          <ButtonPrimary
            onClick={() => {
              setShouldTriggerRunEvalscriptAnimation(true);
              onRunEvalscriptClick(editorRef.current.getValue());
            }}
            disabled={isReadOnly}
          >
            {shouldTriggerRunEvalscriptAnimation ? (
              <>
                {runningEvalscriptButtonText}
                <SuccessIcon />
              </>
            ) : (
              runEvalscriptButtonText
            )}
          </ButtonPrimary>

          <CodeEditorIcon onMouseDown={handleResizeMouseDown} style={{ cursor: "nwse-resize", zIndex: 0 }}>
            <CgArrowsExpandLeft />
          </CodeEditorIcon>
        </CodeEditorBottomPanel>
      </CodeEditorWindow>
    </ThemeProvider>,
    document.getElementById(portalId),
  );
};

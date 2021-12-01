import { useCallback, useEffect, useRef } from "react";
import loader from "@monaco-editor/loader";
import { JSHINT } from "jshint";

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
  minimap: {
    enabled: false,
  },
};

export const CodeEditor = () => {
  const editorDOMRef = useRef();
  const editorRef = useRef();
  const monacoRef = useRef();
  useEffect(() => {
    loader.init().then((monaco) => {
      const editor = monaco.editor.create(
        editorDOMRef.current,
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

  return (
    <div className="code-editor-window">
      <div className="code-editor-top-panel"></div>
      <div className="code-editor-wrap">
        <div
          className="code-editor"
          ref={(el) => (editorDOMRef.current = el)}
        ></div>
      </div>
      <div className="code-editor-bottom-panel"></div>
    </div>
  );
};

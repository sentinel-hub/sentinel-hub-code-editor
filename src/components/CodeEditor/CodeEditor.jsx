import { useEffect, useRef, useState } from "react";
import loader from "@monaco-editor/loader";
import Button from "../Button/Button";
import ExpandArrowIcon from "./icons/ExpandArrowIcon.jsx";
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


export const CodeEditor = () => {
  const editorRef = useRef();

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.create(editorRef.current, {
        value: evalscript,
        language: "javascript",
        theme: "vs-dark",
        minimap: {
          enabled: false,
        },
      });
    });
  }, []);

  return (
    <div className="code-editor-window">
      <div className="code-editor-top-panel">
        <ExpandArrowIcon />
      </div>
      <div className="code-editor-wrap">
        <div
          className="code-editor"
          ref={(el) => (editorRef.current = el)}
        ></div>
      </div>
      <div className="code-editor-bottom-panel">
      </div>
    </div>
  );
};

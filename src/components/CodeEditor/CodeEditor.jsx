import { useEffect, useRef, useState } from "react";
import loader from "@monaco-editor/loader";
import Button from '../Button/Button'
import {default as ExpandArrowIcon} from './icons/expand-arrow.svg'
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


const options = { 
  minimap: {
    enabled: false
  }
}


export const CodeEditor = () => {
  const editorRef = useRef();
  const [isDocked, setIsDocked] = useState(true)


  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.create(editorRef.current, {
        value: evalscript,
        language: "javascript",
        theme: "vs-dark",
        options
      });
    });
  }, []);


  if(isDocked) {
    <div className="code-editor-window">
      <div className="code-editor-top-panel">
        <img className="code-editor-icon" src={ExpandArrowIcon} alt=""/>
      </div>
      <div className="code-editor-wrap">
        <div className="code-editor-left-panel">
        </div>
      </div>
      <div className="code-editor-bottom-panel">
        <Button>Run evalscript</Button>
      </div>
    </div>
  }
  
  
  return (
    <div className="code-editor" ref={(el) => (editorRef.current = el)}></div>
  );
};

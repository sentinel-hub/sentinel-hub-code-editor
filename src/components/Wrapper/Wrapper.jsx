import React from "react";
import { CodeEditor } from "../CodeEditor/CodeEditor";

export default function Wrapper() {
  return (
    <div
      style={{ height: "100vh", width: 400, background: "black" }}
      className="panel"
    >
      <CodeEditor />
    </div>
  );
}

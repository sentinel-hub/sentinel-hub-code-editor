import React from "react";
import { EvalscriptEditor } from "../CodeEditor/CodeEditor";

export default function Wrapper() {
  return (
    <div
      style={{ height: "100vh", width: 400, background: "black" }}
      className="panel"
    >
      <EvalscriptEditor onRunEvalscriptClick={() => console.log("running")} />
      <h1 style={{ color: "white" }}>
        Wrapper to simulate parent div in apps like EOB and RB
      </h1>
    </div>
  );
}
